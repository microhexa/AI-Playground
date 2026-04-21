(() => {
const ruleQuizCanvas = document.getElementById("quiz-doodle");

if (ruleQuizCanvas) {
  const quizCtx = ruleQuizCanvas.getContext("2d");
  const answerButtons = Array.from(document.querySelectorAll(".answer-option[data-answer]"));
  const finalAnswerButtons = Array.from(document.querySelectorAll(".final-answer-option"));
  const ruleProgressEl = document.getElementById("rule-progress");
  const ruleQuestionEl = document.getElementById("answer-panel-title");
  const ruleHelperEl = document.getElementById("rule-helper");
  const playerStatusEl = document.getElementById("player-status");
  const aiAnswerSpoilerEl = document.getElementById("ai-answer-spoiler");
  const playerAnswerValueEl = document.getElementById("player-answer-value");
  const rulesAppliedListEl = document.getElementById("rules-applied-list");
  const rulesRevealChipEl = document.getElementById("rules-reveal-chip");
  const rulesRevealPanelEl = document.getElementById("rules-reveal-panel");
  const nextRoundBtn = document.getElementById("next-round-btn");
  const revealSection = document.getElementById("rule-reveal");
  const finalQuestionSection = document.getElementById("rule-final-question");
  const finalFeedbackEl = document.getElementById("rule-final-feedback");

  const DATASET_LIMIT = 24;
  const TOTAL_ROUNDS = 10;
  const FINAL_CORRECT_ANSWER = "shapes";
  const EMBEDDED_SAMPLES = Array.isArray(window.ruleBasedAiSamples) ? window.ruleBasedAiSamples : [];
  const JSON_SAMPLE_FILES = [
    "./images/menu-doodles/bee.json",
    "./images/menu-doodles/crocodile.json",
    "./images/menu-doodles/hockey_stick.json",
    "./images/menu-doodles/the_mona_lisa.json"
  ];
  const DATASETS = [
    { labelKey: "labelSun", path: "./images/full_binary_sun.bin" },
    { labelKey: "labelHouse", path: "./images/full_binary_house.bin" },
    { labelKey: "labelFish", path: "./images/full_binary_fish.bin" }
  ];

  const builtInRules = [
    {
      label: "labelCrocodile",
      explanationKeys: [
        "rulesExplainCrocodileWide",
        "rulesExplainCrocodileDense",
        "rulesExplainCrocodileMiddle"
      ],
      conditions: [
        { feature: "aspectRatio", op: ">", value: 2.4 },
        { feature: "density", op: ">", value: 0.3 },
        { feature: "middleHRatio", op: ">", value: 0.5 }
      ]
    },
    {
      label: "labelHockeyStick",
      explanationKeys: [
        "rulesExplainHockeyStickWide",
        "rulesExplainHockeyStickSparse",
        "rulesExplainHockeyStickLeft"
      ],
      conditions: [
        { feature: "aspectRatio", op: ">", value: 1.25 },
        { feature: "density", op: "<", value: 0.19 },
        { feature: "leftRatio", op: ">", value: 0.38 }
      ]
    },
    {
      label: "labelBee",
      explanationKeys: [
        "rulesExplainBeeRound",
        "rulesExplainBeeDense",
        "rulesExplainBeeMiddle"
      ],
      conditions: [
        { feature: "aspectRatio", op: ">", value: 0.95 },
        { feature: "aspectRatio", op: "<", value: 1.25 },
        { feature: "density", op: ">", value: 0.29 },
        { feature: "middleHRatio", op: ">", value: 0.45 }
      ]
    },
    {
      label: "labelMonaLisa",
      explanationKeys: [
        "rulesExplainMonaLisaTall",
        "rulesExplainMonaLisaTop",
        "rulesExplainMonaLisaDense"
      ],
      conditions: [
        { feature: "aspectRatio", op: "<", value: 1.0 },
        { feature: "topRatio", op: ">", value: 0.3 },
        { feature: "density", op: ">", value: 0.24 }
      ]
    },
    {
      label: "labelFish",
      explanationKeys: [
        "rulesExplainFishWide",
        "rulesExplainFishMiddle",
        "rulesExplainFishAsymmetry"
      ],
      conditions: [
        { feature: "aspectRatio", op: ">", value: 1.2 },
        { feature: "middleHRatio", op: ">", value: 0.45 },
        { feature: "verticalSymmetry", op: "<", value: 0.9 }
      ]
    },
    {
      label: "labelHouse",
      explanationKeys: [
        "rulesExplainHouseBottom",
        "rulesExplainHouseSymmetry",
        "rulesExplainHouseTall",
        "rulesExplainHouseDense"
      ],
      conditions: [
        { feature: "bottomRatio", op: ">", value: 0.30 },
        { feature: "verticalSymmetry", op: ">", value: 0.75 },
        { feature: "aspectRatio", op: "<", value: 0.95 },
        { feature: "density", op: ">", value: 0.16 }
      ]
    },
    {
      label: "labelSun",
      explanationKeys: [
        "rulesExplainSunRound",
        "rulesExplainSunSymmetry",
        "rulesExplainSunSparse"
      ],
      conditions: [
        { feature: "aspectRatio", op: ">", value: 0.85 },
        { feature: "aspectRatio", op: "<", value: 1.3 },
        { feature: "verticalSymmetry", op: ">", value: 0.75 },
        { feature: "density", op: "<", value: 0.18 }
      ]
    }
  ];
  const supportedLabels = new Set(builtInRules.map(rule => rule.label));

  let samplePool = [];
  let roundQueue = [];
  let currentRound = null;
  let completedRounds = 0;
  let inFinalQuestion = false;
  let finalAnswerChoice = null;
  let openRevealPanel = null;
  let answerChoicePool = ["labelSun", "labelHouse", "labelFish"];

  function drawCanvasMessage(message) {
    quizCtx.fillStyle = "#f6f6f6";
    quizCtx.fillRect(0, 0, ruleQuizCanvas.width, ruleQuizCanvas.height);
    quizCtx.fillStyle = "#4a4e69";
    quizCtx.textAlign = "center";
    quizCtx.textBaseline = "middle";
    quizCtx.font = "1.4rem Gloria Hallelujah, sans-serif";
    quizCtx.fillText(message, ruleQuizCanvas.width / 2, ruleQuizCanvas.height / 2);
  }

  function updateDocumentLanguage() {
    document.documentElement.lang = currentLang === "da" ? "da" : "en";
    document.title = t("pageTitleRuleBased");
  }

  window.applyRulesTranslations = function applyRulesTranslations() {
    updateDocumentLanguage();

    if (inFinalQuestion) {
      ruleQuestionEl.textContent = t("rulesFinalQuestion");
      ruleHelperEl.textContent = t("rulesFinalHelper");
      if (finalAnswerChoice) {
        finalFeedbackEl.textContent = finalAnswerChoice === FINAL_CORRECT_ANSWER
          ? t("rulesFinalCorrect")
          : t("rulesFinalIncorrect");
      }
    } else {
      ruleQuestionEl.textContent = t("rulesPredictionQuestion");
      ruleHelperEl.textContent = t("rulesPredictionHelper");
    }

    if (!currentRound) return;

    if (currentRound.answered) {
      playerAnswerValueEl.textContent = t(currentRound.playerAnswer);
      if (aiAnswerSpoilerEl) {
        aiAnswerSpoilerEl.textContent = t(currentRound.aiAnswer);
        aiAnswerSpoilerEl.classList.remove("is-concealed");
      }
      playerStatusEl.textContent = currentRound.playerAnswer === currentRound.aiAnswer
        ? t("rulesPlayerMatched")
        : t("rulesPlayerDiffered");
      renderAppliedRules(currentRound.rule);
      updateRevealChipLabels();
    }
  };

  function parseQuickDrawBinary(buffer, limit) {
    const view = new DataView(buffer);
    const drawings = [];
    let offset = 0;

    while (offset < view.byteLength && drawings.length < limit) {
      if (offset + 15 > view.byteLength) break;

      offset += 8;
      offset += 2;
      offset += 1;
      offset += 4;

      const strokeCount = view.getUint16(offset, true);
      offset += 2;

      const drawing = [];
      let valid = true;

      for (let strokeIndex = 0; strokeIndex < strokeCount; strokeIndex++) {
        if (offset + 2 > view.byteLength) {
          valid = false;
          break;
        }

        const pointCount = view.getUint16(offset, true);
        offset += 2;

        if (offset + pointCount * 2 > view.byteLength) {
          valid = false;
          break;
        }

        const xs = [];
        const ys = [];

        for (let pointIndex = 0; pointIndex < pointCount; pointIndex++) {
          xs.push(view.getUint8(offset + pointIndex));
        }
        offset += pointCount;

        for (let pointIndex = 0; pointIndex < pointCount; pointIndex++) {
          ys.push(view.getUint8(offset + pointIndex));
        }
        offset += pointCount;

        drawing.push({ xs, ys });
      }

      if (!valid) break;
      drawings.push(drawing);
    }

    return drawings;
  }

  function drawQuickDrawOnContext(ctx, canvas, drawing) {
    ctx.fillStyle = "#f6f6f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#1b2631";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = Math.max(4, Math.round(canvas.width * 0.03125));

    const points = [];
    drawing.forEach(stroke => {
      for (let index = 0; index < stroke.xs.length; index++) {
        points.push({ x: stroke.xs[index], y: stroke.ys[index] });
      }
    });

    if (!points.length) return;

    const minX = Math.min(...points.map(point => point.x));
    const maxX = Math.max(...points.map(point => point.x));
    const minY = Math.min(...points.map(point => point.y));
    const maxY = Math.max(...points.map(point => point.y));
    const boxWidth = Math.max(1, maxX - minX);
    const boxHeight = Math.max(1, maxY - minY);
    const padding = Math.round(canvas.width * 0.10625);
    const scale = Math.min(
      (canvas.width - padding * 2) / boxWidth,
      (canvas.height - padding * 2) / boxHeight
    );
    const offsetX = (canvas.width - boxWidth * scale) / 2;
    const offsetY = (canvas.height - boxHeight * scale) / 2;

    drawing.forEach(stroke => {
      if (!stroke.xs.length) return;

      ctx.beginPath();
      ctx.moveTo(
        offsetX + (stroke.xs[0] - minX) * scale,
        offsetY + (stroke.ys[0] - minY) * scale
      );

      for (let index = 1; index < stroke.xs.length; index++) {
        ctx.lineTo(
          offsetX + (stroke.xs[index] - minX) * scale,
          offsetY + (stroke.ys[index] - minY) * scale
        );
      }

      ctx.stroke();
    });
  }

  function drawQuickDraw(drawing) {
    drawQuickDrawOnContext(quizCtx, ruleQuizCanvas, drawing);
  }

  function normalizeCanvas(sourceCtx, width, height, targetSize = 64) {
    const image = sourceCtx.getImageData(0, 0, width, height);
    const data = image.data;

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;
    let foundInk = false;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const isInk = average < 220;

        if (isInk) {
          foundInk = true;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    const normalizedCanvas = document.createElement("canvas");
    normalizedCanvas.width = targetSize;
    normalizedCanvas.height = targetSize;
    const normalizedCtx = normalizedCanvas.getContext("2d");
    normalizedCtx.fillStyle = "white";
    normalizedCtx.fillRect(0, 0, targetSize, targetSize);

    if (!foundInk) {
      return normalizedCanvas;
    }

    const boxWidth = maxX - minX + 1;
    const boxHeight = maxY - minY + 1;
    const padding = 4;
    const availableSize = targetSize - 2 * padding;
    const scale = Math.min(availableSize / boxWidth, availableSize / boxHeight);
    const newWidth = Math.max(1, Math.round(boxWidth * scale));
    const newHeight = Math.max(1, Math.round(boxHeight * scale));
    const offsetX = Math.floor((targetSize - newWidth) / 2);
    const offsetY = Math.floor((targetSize - newHeight) / 2);

    normalizedCtx.drawImage(
      sourceCtx.canvas,
      minX, minY, boxWidth, boxHeight,
      offsetX, offsetY, newWidth, newHeight
    );

    return normalizedCanvas;
  }

  function extractFeatures(ctx, width, height) {
    const image = ctx.getImageData(0, 0, width, height);
    const data = image.data;
    const inkPixels = [];

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (average < 200) inkPixels.push({ x, y });
      }
    }

    if (!inkPixels.length) return { empty: true };

    const xs = inkPixels.map(point => point.x);
    const ys = inkPixels.map(point => point.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const boxWidth = maxX - minX + 1;
    const boxHeight = maxY - minY + 1;

    let middleH = 0;
    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;

    for (const point of inkPixels) {
      if (point.y < height / 3) top++;
      else if (point.y < 2 * height / 3) middleH++;
      else bottom++;

      if (point.x < width / 3) left++;
      else if (point.x >= 2 * width / 3) right++;
    }

    const binary = Array.from({ length: height }, () => Array(width).fill(0));
    for (const point of inkPixels) {
      binary[point.y][point.x] = 1;
    }

    let verticalMatches = 0;
    let verticalChecks = 0;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < Math.floor(width / 2); x++) {
        if (binary[y][x] === binary[y][width - 1 - x]) verticalMatches++;
        verticalChecks++;
      }
    }

    return {
      empty: false,
      minX,
      maxX,
      minY,
      maxY,
      boxWidth,
      boxHeight,
      aspectRatio: boxWidth / boxHeight,
      density: inkPixels.length / (boxWidth * boxHeight),
      topRatio: top / inkPixels.length,
      middleHRatio: middleH / inkPixels.length,
      bottomRatio: bottom / inkPixels.length,
      leftRatio: left / inkPixels.length,
      rightRatio: right / inkPixels.length,
      verticalSymmetry: verticalMatches / verticalChecks
    };
  }

  function evaluateCondition(features, condition) {
    const value = features[condition.feature];
    if (condition.op === ">") return value > condition.value;
    if (condition.op === "<") return value < condition.value;
    return false;
  }

  function classifyByRules(features) {
    if (features.empty) {
      return { label: "labelNothing", rule: null };
    }

    for (const rule of builtInRules) {
      if (rule.conditions.every(condition => evaluateCondition(features, condition))) {
        return { label: rule.label, rule };
      }
    }

    return { label: "labelUnknown", rule: null };
  }

  function convertTimedStrokeDrawing(drawing) {
    if (!Array.isArray(drawing)) return [];

    return drawing
      .map(stroke => {
        if (!Array.isArray(stroke) || stroke.length < 2) return null;
        const [xs, ys] = stroke;
        if (!Array.isArray(xs) || !Array.isArray(ys) || !xs.length || !ys.length) return null;
        return { xs, ys };
      })
      .filter(Boolean);
  }

  function computeAiAnswer(drawing) {
    drawQuickDraw(drawing);
    const normalizedCanvas = normalizeCanvas(quizCtx, ruleQuizCanvas.width, ruleQuizCanvas.height, 64);
    const normalizedCtx = normalizedCanvas.getContext("2d");
    return classifyByRules(extractFeatures(normalizedCtx, 64, 64));
  }

  function buildConditionText(condition) {
    if (condition.feature === "aspectRatio" && condition.op === "<") {
      return t("ruleOptionTall");
    }

    if (condition.feature === "aspectRatio" && condition.op === ">") {
      return condition.value > 1.5 ? t("ruleOptionWide") : t("ruleOptionRound");
    }

    if (condition.feature === "middleHRatio") {
      return t("ruleOptionMiddle");
    }

    if (condition.feature === "topRatio") {
      return t("ruleOptionTop");
    }

    if (condition.feature === "bottomRatio") {
      return t("ruleOptionBottom");
    }

    if (condition.feature === "leftRatio") {
      return t("ruleOptionLeft");
    }

    if (condition.feature === "rightRatio") {
      return t("ruleOptionRight");
    }

    if (condition.feature === "verticalSymmetry") {
      return condition.op === ">" ? t("ruleOptionSame") : t("ruleOptionDifferent");
    }

    if (condition.feature === "density") {
      return condition.op === ">" ? t("ruleOptionFilled") : t("ruleOptionSparse");
    }

    return "";
  }

  function createRulePreviewData(drawing, previewSize = 112, featureSize = 64) {
    const sourceCanvas = document.createElement("canvas");
    sourceCanvas.width = previewSize;
    sourceCanvas.height = previewSize;
    const sourceCtx = sourceCanvas.getContext("2d");
    drawQuickDrawOnContext(sourceCtx, sourceCanvas, drawing);

    const normalizedCanvas = normalizeCanvas(sourceCtx, previewSize, previewSize, featureSize);
    const normalizedCtx = normalizedCanvas.getContext("2d");
    const features = extractFeatures(normalizedCtx, featureSize, featureSize);

    return {
      normalizedCanvas,
      features,
      featureSize
    };
  }

  function createRuleVisualizationCanvas(condition, previewData) {
    const canvas = document.createElement("canvas");
    canvas.width = 112;
    canvas.height = 112;
    canvas.className = "rule-condition-canvas";

    const ctx = canvas.getContext("2d");
    const { normalizedCanvas, features, featureSize } = previewData;
    const scale = canvas.width / featureSize;
    const bboxX = features.minX * scale;
    const bboxY = features.minY * scale;
    const bboxWidth = Math.max(1, features.boxWidth * scale);
    const bboxHeight = Math.max(1, features.boxHeight * scale);

    ctx.fillStyle = "#f6f6f6";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(normalizedCanvas, 0, 0, canvas.width, canvas.height);

    const highlight = "rgba(249, 199, 79, 0.26)";
    const outline = "#f3722c";
    const inkOutline = "#4a4e69";

    if (condition.feature === "topRatio") {
      ctx.fillStyle = highlight;
      ctx.fillRect(0, 0, canvas.width, canvas.height / 3);
    } else if (condition.feature === "middleHRatio") {
      ctx.fillStyle = highlight;
      ctx.fillRect(0, canvas.height / 3, canvas.width, canvas.height / 3);
    } else if (condition.feature === "bottomRatio") {
      ctx.fillStyle = highlight;
      ctx.fillRect(0, (canvas.height / 3) * 2, canvas.width, canvas.height / 3);
    } else if (condition.feature === "leftRatio") {
      ctx.fillStyle = highlight;
      ctx.fillRect(0, 0, canvas.width / 3, canvas.height);
    } else if (condition.feature === "rightRatio") {
      ctx.fillStyle = highlight;
      ctx.fillRect((canvas.width / 3) * 2, 0, canvas.width / 3, canvas.height);
    } else if (condition.feature === "verticalSymmetry") {
      ctx.strokeStyle = outline;
      ctx.setLineDash([7, 6]);
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 10);
      ctx.lineTo(canvas.width / 2, canvas.height - 10);
      ctx.stroke();
      ctx.setLineDash([]);
    } else if (condition.feature === "density") {
      ctx.fillStyle = condition.op === ">" ? "rgba(249, 175, 175, 0.24)" : "rgba(249, 199, 79, 0.18)";
      ctx.fillRect(bboxX, bboxY, bboxWidth, bboxHeight);
    } else if (condition.feature === "aspectRatio") {
      const squareSide = Math.min(bboxHeight, bboxWidth, canvas.width * 0.72);
      const squareX = bboxX + (bboxWidth - squareSide) / 2;
      const squareY = bboxY + (bboxHeight - squareSide) / 2;
      ctx.fillStyle = "rgba(249, 199, 79, 0.18)";
      ctx.fillRect(squareX, squareY, squareSide, squareSide);
      ctx.strokeStyle = outline;
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 5]);
      ctx.strokeRect(squareX, squareY, squareSide, squareSide);
      ctx.setLineDash([]);
    }

    ctx.strokeStyle = inkOutline;
    ctx.lineWidth = 2;
    ctx.strokeRect(bboxX, bboxY, bboxWidth, bboxHeight);

    return canvas;
  }

  function renderAppliedRules(rule) {
    if (!rulesAppliedListEl) return;

    rulesAppliedListEl.innerHTML = "";

    if (!rule) {
      const fallbackItem = document.createElement("li");
      fallbackItem.textContent = t("rulesExplainFallback");
      rulesAppliedListEl.appendChild(fallbackItem);
      return;
    }

    const previewData = currentRound?.sample?.drawing
      ? createRulePreviewData(currentRound.sample.drawing)
      : null;

    rule.conditions.forEach((condition, index) => {
      const item = document.createElement("li");
      item.className = "rule-condition-item";

      const visualization = previewData
        ? createRuleVisualizationCanvas(condition, previewData)
        : null;

      const body = document.createElement("div");
      body.className = "rule-condition-body";

      const text = document.createElement("p");
      text.className = "rule-condition-text";
      text.textContent = rule.explanationKeys[index]
        ? t(rule.explanationKeys[index])
        : buildConditionText(condition);

      const helper = document.createElement("p");
      helper.className = "rule-condition-helper";
      helper.textContent = buildConditionText(condition);

      if (visualization) {
        item.appendChild(visualization);
      }

      body.appendChild(text);
      if (helper.textContent) {
        body.appendChild(helper);
      }
      item.appendChild(body);
      rulesAppliedListEl.appendChild(item);
    });
  }

  function updateRevealChipLabels() {
    if (rulesRevealChipEl) {
      const ruleCount = currentRound?.rule?.explanationKeys?.length || 0;
      const countLabel = ruleCount === 1 ? t("rulesRevealRuleUsedSingular") : t("rulesRevealRuleUsedPlural");
      rulesRevealChipEl.textContent = `${ruleCount} ${countLabel}`;
    }
  }

  function updateRevealPanels() {
    const showRulesPanel = openRevealPanel === "rules";

    if (rulesRevealPanelEl) rulesRevealPanelEl.hidden = !showRulesPanel;
    if (rulesRevealChipEl) rulesRevealChipEl.classList.toggle("is-open", showRulesPanel);
  }

  function toggleRevealPanel(panel) {
    openRevealPanel = openRevealPanel === panel ? null : panel;
    updateRevealPanels();
  }

  function updateProgress() {
    if (!ruleProgressEl) return;
    ruleProgressEl.textContent = `${Math.min(completedRounds + 1, TOTAL_ROUNDS)} / ${TOTAL_ROUNDS}`;
  }

  function setRoundAnswerChoices(correctAnswer) {
    const distractors = shuffle(answerChoicePool.filter(choice => choice !== correctAnswer));
    const selectedChoices = shuffle([correctAnswer, ...distractors.slice(0, Math.max(0, answerButtons.length - 1))]);

    answerButtons.forEach((button, index) => {
      const answerKey = selectedChoices[index];
      if (!answerKey) {
        button.hidden = true;
        button.disabled = true;
        button.removeAttribute("data-answer");
        button.removeAttribute("data-i18n");
        button.textContent = "";
        return;
      }

      button.hidden = false;
      button.disabled = false;
      button.dataset.answer = answerKey;
      button.dataset.i18n = answerKey;
      button.textContent = t(answerKey);
    });
  }

  function resetRoundUi() {
    answerButtons.forEach(button => {
      button.disabled = false;
      button.hidden = false;
      button.classList.remove("selected", "correct", "incorrect");
    });

    if (revealSection) revealSection.hidden = true;
    if (finalQuestionSection) finalQuestionSection.hidden = true;
    if (nextRoundBtn) nextRoundBtn.hidden = true;
    if (rulesAppliedListEl) rulesAppliedListEl.innerHTML = "";
    if (playerStatusEl) playerStatusEl.textContent = "";
    if (playerAnswerValueEl) playerAnswerValueEl.textContent = "-";
    if (aiAnswerSpoilerEl) {
      aiAnswerSpoilerEl.textContent = t("rulesAiHidden");
      aiAnswerSpoilerEl.classList.add("is-concealed");
    }
    if (rulesRevealChipEl) rulesRevealChipEl.textContent = `0 ${t("rulesRevealRuleUsedPlural")}`;
    openRevealPanel = null;
    updateRevealPanels();
  }

  function setAnswerButtonsEnabled(enabled) {
    answerButtons.forEach(button => {
      button.disabled = !enabled;
    });
  }

  function shuffle(array) {
    const copy = [...array];
    for (let index = copy.length - 1; index > 0; index--) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function buildRoundQueue() {
    const grouped = new Map();
    samplePool.forEach(sample => {
      if (!grouped.has(sample.labelKey)) grouped.set(sample.labelKey, []);
      grouped.get(sample.labelKey).push(sample);
    });

    const queue = [];
    const labelKeys = shuffle([...grouped.keys()]);

    labelKeys.forEach(labelKey => {
      const samples = shuffle(grouped.get(labelKey) || []);
      if (samples.length) queue.push(samples[0]);
    });

    const leftovers = shuffle(samplePool.filter(sample => !queue.includes(sample)));
    while (queue.length < TOTAL_ROUNDS && leftovers.length) {
      queue.push(leftovers.shift());
    }

    return queue.slice(0, TOTAL_ROUNDS);
  }

  function beginRound() {
    if (!roundQueue.length) {
      showFinalQuestion();
      return;
    }

    inFinalQuestion = false;
    updateProgress();
    resetRoundUi();
    currentRound = {
      sample: roundQueue.shift(),
      aiAnswer: null,
      rule: null,
      playerAnswer: null,
      answered: false
    };
    currentRound.aiAnswer = currentRound.sample.aiAnswer;
    currentRound.rule = currentRound.sample.rule;

    setRoundAnswerChoices(currentRound.aiAnswer);
    setAnswerButtonsEnabled(true);
    drawQuickDraw(currentRound.sample.drawing);
  }

  function revealRound(playerAnswer) {
    if (!currentRound || currentRound.answered) return;

    currentRound.playerAnswer = playerAnswer;
    currentRound.answered = true;

    answerButtons.forEach(button => {
      button.disabled = true;
      const answerKey = button.dataset.answer;
      button.classList.toggle("selected", answerKey === playerAnswer);
      button.classList.toggle("correct", answerKey === currentRound.aiAnswer);
      button.classList.toggle("incorrect", answerKey === playerAnswer && playerAnswer !== currentRound.aiAnswer);
    });

    playerAnswerValueEl.textContent = t(playerAnswer);
    if (aiAnswerSpoilerEl) {
      aiAnswerSpoilerEl.textContent = t(currentRound.aiAnswer);
      aiAnswerSpoilerEl.classList.remove("is-concealed");
    }
    playerStatusEl.textContent = playerAnswer === currentRound.aiAnswer
      ? t("rulesPlayerMatched")
      : t("rulesPlayerDiffered");
    renderAppliedRules(currentRound.rule);
    updateRevealChipLabels();
    revealSection.hidden = false;
    completedRounds += 1;
    nextRoundBtn.hidden = false;
    nextRoundBtn.textContent = completedRounds >= TOTAL_ROUNDS ? t("rulesToFinalQuestion") : t("rulesNextRound");
  }

  function showFinalQuestion() {
    inFinalQuestion = true;
    currentRound = null;
    if (ruleProgressEl) ruleProgressEl.textContent = `${TOTAL_ROUNDS} / ${TOTAL_ROUNDS}`;
    if (ruleQuestionEl) ruleQuestionEl.textContent = t("rulesFinalQuestion");
    if (ruleHelperEl) ruleHelperEl.textContent = t("rulesFinalHelper");
    answerButtons.forEach(button => {
      button.hidden = true;
    });
    revealSection.hidden = true;
    finalQuestionSection.hidden = false;
    finalAnswerChoice = null;
    finalFeedbackEl.textContent = "";
    finalAnswerButtons.forEach(button => {
      button.disabled = false;
      button.classList.remove("selected", "correct", "incorrect");
    });
  }

  function handleFinalAnswer(answer) {
    finalAnswerChoice = answer;
    finalAnswerButtons.forEach(button => {
      button.disabled = true;
      const isChosen = button.dataset.finalAnswer === answer;
      const isCorrect = button.dataset.finalAnswer === FINAL_CORRECT_ANSWER;
      button.classList.toggle("selected", isChosen);
      button.classList.toggle("correct", isCorrect);
      button.classList.toggle("incorrect", isChosen && !isCorrect);
    });

    finalFeedbackEl.textContent = answer === FINAL_CORRECT_ANSWER
      ? t("rulesFinalCorrect")
      : t("rulesFinalIncorrect");
  }

  async function loadJsonSamples() {
    const loaded = await Promise.all(JSON_SAMPLE_FILES.map(async path => {
      try {
        const response = await fetch(path);
        if (!response.ok) return [];

        const payload = await response.json();
        const drawings = Array.isArray(payload?.drawings) ? payload.drawings : [];

        return drawings.map(entry => {
          const drawing = convertTimedStrokeDrawing(entry.drawing);
          if (!drawing.length) return null;

          const result = computeAiAnswer(drawing);
          return {
            labelKey: result.label,
            drawing,
            aiAnswer: result.label,
            rule: result.rule,
            sourceWord: entry.word || payload.source_file || path
          };
        }).filter(Boolean);
      } catch {
        return [];
      }
    }));

    return loaded
      .flat()
      .filter(sample => supportedLabels.has(sample.aiAnswer));
  }

  async function loadSamples() {
    const embeddedSamples = EMBEDDED_SAMPLES.map(sample => {
        const result = computeAiAnswer(sample.drawing);
        return {
          labelKey: result.label,
          drawing: sample.drawing,
          aiAnswer: result.label,
          rule: result.rule
        };
      }).filter(sample => supportedLabels.has(sample.aiAnswer));

    const jsonSamples = await loadJsonSamples();
    samplePool = [...embeddedSamples, ...jsonSamples];
    answerChoicePool = [...new Set(samplePool.map(sample => sample.aiAnswer).filter(Boolean))];

    if (samplePool.length) {
      return;
    }

    const loaded = await Promise.all(DATASETS.map(async dataset => {
      const response = await fetch(dataset.path);
      if (!response.ok) return [];

      const buffer = await response.arrayBuffer();
      const drawings = parseQuickDrawBinary(buffer, DATASET_LIMIT);

      return drawings.map(drawing => {
        const result = computeAiAnswer(drawing);
        return {
          labelKey: dataset.labelKey,
          drawing,
          aiAnswer: result.label,
          rule: result.rule
        };
      });
    }));

    samplePool = loaded
      .flat()
      .filter(sample => supportedLabels.has(sample.aiAnswer));
    answerChoicePool = [...new Set(samplePool.map(sample => sample.aiAnswer).filter(Boolean))];
  }

  answerButtons.forEach(button => {
    button.addEventListener("click", () => revealRound(button.dataset.answer));
  });

  finalAnswerButtons.forEach(button => {
    button.addEventListener("click", () => handleFinalAnswer(button.dataset.finalAnswer));
  });

  if (rulesRevealChipEl) {
    rulesRevealChipEl.addEventListener("click", () => toggleRevealPanel("rules"));
  }

  nextRoundBtn.addEventListener("click", () => {
    if (completedRounds >= TOTAL_ROUNDS) {
      showFinalQuestion();
      return;
    }
    beginRound();
  });

  updateDocumentLanguage();
  applyTranslations();
  setAnswerButtonsEnabled(false);
  drawCanvasMessage("Loading...");

  loadSamples()
    .then(() => {
      if (!samplePool.length) {
        if (ruleHelperEl) ruleHelperEl.textContent = "Could not load drawings.";
        drawCanvasMessage("No drawings");
        return;
      }

      roundQueue = buildRoundQueue();
      beginRound();
    })
    .catch(() => {
      if (ruleHelperEl) ruleHelperEl.textContent = "Could not load drawings.";
      drawCanvasMessage("Load failed");
    });
}
})();
