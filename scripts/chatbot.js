(() => {
  const room = document.getElementById("vision-chat-room");
  if (!room) return;

  const chatLogEl = document.getElementById("vision-chat-log");
  const chatFormEl = document.getElementById("vision-chat-form");
  const chatInputEl = document.getElementById("vision-chat-input");
  const sendButtonEl = document.getElementById("vision-chat-send");
  const lessonPopupEl = document.getElementById("vision-lesson-popup");
  const lessonPopupCloseEl = document.getElementById("vision-lesson-popup-close");
  const lessonTextEl = document.getElementById("vision-lesson-text");
  const challengesHelperEl = document.getElementById("vision-chat-challenges-helper");
  const selectedImageCopyEl = document.getElementById("vision-selected-image-copy");
  const doodleStatusEl = document.getElementById("vision-doodle-status");
  const openDrawEl = document.getElementById("vision-open-draw");
  const doodleModalEl = document.getElementById("vision-doodle-modal");
  const closeDoodleEl = document.getElementById("vision-close-doodle");
  const saveDoodleEl = document.getElementById("vision-save-doodle");
  const resetDoodleEl = document.getElementById("vision-reset-doodle");
  const undoDoodleEl = document.getElementById("vision-undo-doodle");
  const redoDoodleEl = document.getElementById("vision-redo-doodle");
  const drawCanvas = document.getElementById("vision-draw-canvas");
  const drawCtx = drawCanvas.getContext("2d");
  const previewCanvas = document.getElementById("vision-preview-canvas");
  const previewCtx = previewCanvas.getContext("2d");
  const savedCanvas = document.getElementById("vision-selected-canvas");
  const savedCtx = savedCanvas.getContext("2d");
  const comparisonCardEl = document.getElementById("vision-comparison-card");
  const challengesCardEl = document.getElementById("vision-challenges-card");
  const challengeGridEl = document.getElementById("vision-challenge-grid");
  const VISION_CHAT_PROXY_URL = "https://ai-toolbox.justanoakleaf.workers.dev/";
  const PROXY_CONFIG = window.VISION_CHAT_PROXY_CONFIG || {
    enabled: true,
    url: VISION_CHAT_PROXY_URL
  };

  const DRAW_LINE_WIDTH = 7.5;
  const TEMPLATE_VECTOR_SIZE = 64;
  const MAX_HISTORY = 20;

  const images = [
    {
      id: "house",
      labelKey: "visionChatImageHouse",
      confidence: 0.92,
      descriptionKey: "visionChatDescHouse",
      reasoningKey: "visionChatReasonHouse",
      counterKey: "visionChatCounterHouse",
      genericKey: "visionChatGenericHouse",
      source: { kind: "menu", name: "house", index: 0 }
    },
    {
      id: "fish",
      labelKey: "visionChatImageFish",
      confidence: 0.84,
      descriptionKey: "visionChatDescFish",
      reasoningKey: "visionChatReasonFish",
      counterKey: "visionChatCounterFish",
      genericKey: "visionChatGenericFish",
      source: { kind: "menu", name: "fish", index: 0 }
    },
    {
      id: "sun",
      labelKey: "visionChatImageSun",
      confidence: 0.79,
      descriptionKey: "visionChatDescSun",
      reasoningKey: "visionChatReasonSun",
      counterKey: "visionChatCounterSun",
      genericKey: "visionChatGenericSun",
      source: { kind: "binary", path: "./images/full_binary_sun.bin", index: 2 }
    },
    {
      id: "ambiguous",
      labelKey: "visionChatImageAmbiguous",
      confidence: 0.58,
      descriptionKey: "visionChatDescAmbiguous",
      reasoningKey: "visionChatReasonAmbiguous",
      counterKey: "visionChatCounterAmbiguous",
      genericKey: "visionChatGenericAmbiguous",
      source: { kind: "menu", name: "hockey_stick", index: 0 }
    }
  ];

  const challenges = [
    {
      id: "description",
      titleKey: "visionChatChallengeDescriptionTitle",
      copyKey: "visionChatChallengeDescriptionCopy",
      promptKey: "visionChatPromptSee",
      lessonKey: "visionChatLessonDescription"
    },
    {
      id: "reasoning",
      titleKey: "visionChatChallengeReasoningTitle",
      copyKey: "visionChatChallengeReasoningCopy",
      promptKey: "visionChatPromptExplain",
      lessonKey: "visionChatLessonReasoning"
    },
    {
      id: "confidence",
      titleKey: "visionChatChallengeConfidenceTitle",
      copyKey: "visionChatChallengeConfidenceCopy",
      promptKey: "visionChatPromptSure",
      lessonKey: "visionChatLessonConfidence"
    },
    {
      id: "counterexample",
      titleKey: "visionChatChallengeCounterTitle",
      copyKey: "visionChatChallengeCounterCopy",
      promptKey: "visionChatPromptElse",
      lessonKey: "visionChatLessonCounter"
    },
    {
      id: "generalization",
      titleKey: "visionChatChallengeGeneralizationTitle",
      copyKey: "visionChatChallengeGeneralizationCopy",
      promptKey: "visionChatPromptGeneralization",
      lessonKey: "visionChatLessonGeneralization"
    }
  ];

  const state = {
    savedImageId: null,
    messages: [],
    firstAnswerGiven: false,
    activeChallengeId: null,
    completedChallenges: new Set(),
    drawingByImageId: new Map(),
    templateVectorByImageId: new Map(),
    failedImageIds: new Set(),
    loadingPromise: null,
    requestInFlight: false,
    drawing: false,
    strokeMoved: false,
    activePointerId: null,
    hasDraftDrawing: false,
    hasSavedDrawing: false,
    drawingDirty: false,
    savedDraftImage: null,
    draftHistory: [],
    draftRedoHistory: [],
    draftPlaceholderImage: null,
    openLessonMessageIndex: null
  };

  function updateDocumentLanguage() {
    document.documentElement.lang = currentLang === "da" ? "da" : "en";
    document.title = t("pageTitleChatbot");
    chatLogEl.dataset.emptyMessage = t("visionChatEmptyState");
    chatInputEl.placeholder = t("visionChatInputPlaceholder");
    drawCanvas.setAttribute("aria-label", t("visionChatDrawHere"));
    openDrawEl.setAttribute("aria-label", t("visionChatOpenDraw"));
    openDrawEl.setAttribute("title", t("visionChatOpenDraw"));
    closeDoodleEl.setAttribute("aria-label", t("visionChatCloseCanvas"));
    resetDoodleEl.setAttribute("aria-label", t("imageClassifierReset"));
    undoDoodleEl.setAttribute("aria-label", t("imageClassifierUndo"));
    redoDoodleEl.setAttribute("aria-label", t("imageClassifierRedo"));
    previewCanvas.setAttribute("aria-label", t("visionChatCurrentDoodleTitle"));
  }

  function formatMessage(key, values = {}) {
    return Object.entries(values).reduce((message, [name, value]) => (
      message.replace(`{${name}}`, value)
    ), t(key));
  }

  function getSavedImage() {
    return images.find((image) => image.id === state.savedImageId) || null;
  }

  function getCanvasPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  function isSameImageData(a, b) {
    if (!a || !b || a.data.length !== b.data.length) return false;
    for (let index = 0; index < a.data.length; index += 1) {
      if (a.data[index] !== b.data[index]) return false;
    }
    return true;
  }

  function storeDraftHistory() {
    const imageData = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    state.draftHistory.push(imageData);
    if (state.draftHistory.length > MAX_HISTORY) state.draftHistory.shift();
    state.draftRedoHistory = [];
  }

  function paintDraftPlaceholder() {
    drawCtx.fillStyle = "#ffffff";
    drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
    drawCtx.fillStyle = "#7b7b7b";
    drawCtx.textAlign = "center";
    drawCtx.textBaseline = "middle";
    drawCtx.font = '2rem Caroni, sans-serif';
    drawCtx.fillText(t(drawCanvas.dataset.placeholderKey || "visionChatDrawHere"), drawCanvas.width / 2, drawCanvas.height / 2);
  }

  function resetDraftCanvas() {
    paintDraftPlaceholder();
    state.draftPlaceholderImage = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    state.draftHistory = [state.draftPlaceholderImage];
    state.draftRedoHistory = [];
    state.hasDraftDrawing = false;
    state.drawing = false;
    state.strokeMoved = false;
    state.activePointerId = null;
    updateActionState();
  }

  function openDoodleModal() {
    doodleModalEl.hidden = false;
    document.body.classList.add("vision-doodle-modal-open");
    drawCanvas.focus();
  }

  function closeDoodleModal() {
    doodleModalEl.hidden = true;
    document.body.classList.remove("vision-doodle-modal-open");
    openDrawEl.focus();
  }

  function clearSavedCanvas() {
    savedCtx.fillStyle = "#ffffff";
    savedCtx.fillRect(0, 0, savedCanvas.width, savedCanvas.height);
  }

  function clearPreviewCanvas() {
    previewCtx.fillStyle = "#ffffff";
    previewCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
  }

  function syncPreviewCanvas() {
    clearPreviewCanvas();
    if (!state.hasSavedDrawing) return;
    previewCtx.drawImage(savedCanvas, 0, 0, previewCanvas.width, previewCanvas.height);
  }

  function syncDraftDirtyState() {
    if (!state.hasSavedDrawing || !state.savedDraftImage) {
      state.drawingDirty = state.hasDraftDrawing;
      return;
    }

    const currentImage = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    state.drawingDirty = !isSameImageData(currentImage, state.savedDraftImage);
  }

  function startDraftDrawing(event) {
    event.preventDefault();
    if (!state.hasDraftDrawing) {
      drawCtx.fillStyle = "#ffffff";
      drawCtx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
      state.hasDraftDrawing = true;
    }

    state.drawing = true;
    state.strokeMoved = false;
    state.activePointerId = typeof event.pointerId === "number" ? event.pointerId : null;
    if (typeof event.pointerId === "number" && drawCanvas.setPointerCapture) {
      drawCanvas.setPointerCapture(event.pointerId);
    }

    const { x, y } = getCanvasPoint(drawCanvas, event);
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
  }

  function continueDraftDrawing(event) {
    if (!state.drawing) return;
    if (state.activePointerId !== null && typeof event.pointerId === "number" && event.pointerId !== state.activePointerId) {
      return;
    }

    event.preventDefault();
    const { x, y } = getCanvasPoint(drawCanvas, event);

    drawCtx.lineWidth = DRAW_LINE_WIDTH;
    drawCtx.lineCap = "round";
    drawCtx.lineJoin = "round";
    drawCtx.strokeStyle = "#1b2631";

    state.strokeMoved = true;
    drawCtx.lineTo(x, y);
    drawCtx.stroke();
    drawCtx.beginPath();
    drawCtx.moveTo(x, y);
  }

  function endDraftDrawing(event) {
    if (!state.drawing) return;
    if (state.activePointerId !== null && typeof event?.pointerId === "number" && event.pointerId !== state.activePointerId) {
      return;
    }

    if (event) {
      event.preventDefault();
    }

    let strokeCommitted = state.strokeMoved;
    if (!state.strokeMoved && event) {
      const { x, y } = getCanvasPoint(drawCanvas, event);
      drawCtx.fillStyle = "#1b2631";
      drawCtx.beginPath();
      drawCtx.arc(x, y, DRAW_LINE_WIDTH / 2, 0, Math.PI * 2);
      drawCtx.fill();
      state.hasDraftDrawing = true;
      strokeCommitted = true;
    }

    if (strokeCommitted) {
      storeDraftHistory();
      syncDraftDirtyState();
    }

    state.drawing = false;
    if (typeof event?.pointerId === "number" && drawCanvas.hasPointerCapture?.(event.pointerId)) {
      drawCanvas.releasePointerCapture(event.pointerId);
    }
    state.activePointerId = null;
    drawCtx.beginPath();
    renderSavedDrawingState();
    updateActionState();
  }

  function resetConversationState() {
    state.messages = [];
    state.firstAnswerGiven = false;
    state.activeChallengeId = null;
    state.completedChallenges.clear();
    state.openLessonMessageIndex = null;
    if (lessonPopupEl) lessonPopupEl.hidden = true;
    comparisonCardEl.hidden = true;
    chatInputEl.value = "";
  }

  function closeLessonPopup() {
    state.openLessonMessageIndex = null;
    if (lessonPopupEl) lessonPopupEl.hidden = true;
  }

  function openLessonPopup(messageIndex) {
    const message = state.messages[messageIndex];
    if (!message?.lessonKey || !lessonPopupEl || !lessonTextEl) return;
    state.openLessonMessageIndex = messageIndex;
    lessonTextEl.textContent = t(message.lessonKey);
    lessonPopupEl.hidden = false;
  }

  function renderSavedDrawingState() {
    if (!state.hasSavedDrawing) {
      selectedImageCopyEl.textContent = t("visionChatDrawPrompt");
      doodleStatusEl.textContent = state.hasDraftDrawing ? t("visionChatUnsavedChanges") : t("visionChatSaveHint");
      syncPreviewCanvas();
      return;
    }

    const image = getSavedImage();
    selectedImageCopyEl.textContent = image
      ? formatMessage("visionChatSavedDrawing", { image: t(image.labelKey) })
      : t("visionChatSaveHint");

    doodleStatusEl.textContent = state.drawingDirty
      ? t("visionChatUnsavedChanges")
      : t("visionChatSavedHint");
    syncPreviewCanvas();
  }

  function getEmptyStateMessage() {
    if (!state.hasSavedDrawing) {
      return t("visionChatInitialCopy");
    }
    if (state.drawingDirty) {
      return t("visionChatUnsavedChanges");
    }
    return t("visionChatOnboardingAskCopy");
  }

  function renderMessages() {
    if (!state.messages.length) {
      chatLogEl.innerHTML = `
        <div class="vision-chat-message ai vision-chat-message-helper">
          <div class="vision-chat-bubble vision-chat-bubble-helper">
            <span class="vision-chat-bubble-role">${t("visionChatAiLabel")}</span>
            <div>${escapeHtml(getEmptyStateMessage())}</div>
          </div>
        </div>
      `;
      return;
    }

    chatLogEl.innerHTML = state.messages.map((message) => {
      const roleLabel = message.role === "user" ? t("visionChatUserLabel") : t("visionChatAiLabel");
      const lessonButton = message.role === "ai" && message.lessonKey
        ? `<button class="vision-chat-lesson-trigger" type="button" data-lesson-message-index="${state.messages.indexOf(message)}" aria-label="${t("visionChatLessonKicker")}" title="${t("visionChatLessonKicker")}">?</button>`
        : "";
      return `
        <div class="vision-chat-message ${message.role}">
          <div class="vision-chat-bubble">
            <div class="vision-chat-bubble-topline">
              <span class="vision-chat-bubble-role">${roleLabel}</span>
              ${lessonButton}
            </div>
            <div>${resolveMessageText(message)}</div>
          </div>
        </div>
      `;
    }).join("");

    chatLogEl.querySelectorAll("[data-lesson-message-index]").forEach((button) => {
      button.addEventListener("click", () => {
        const index = Number(button.getAttribute("data-lesson-message-index"));
        if (Number.isFinite(index)) {
          openLessonPopup(index);
        }
      });
    });

    chatLogEl.scrollTop = chatLogEl.scrollHeight;
  }

  function resolveMessageText(message) {
    if (message.role === "user") {
      if (message.promptKey) return escapeHtml(t(message.promptKey));
      return escapeHtml(message.text);
    }

    if (typeof message.text === "string") {
      return escapeHtml(message.text);
    }

    return escapeHtml(buildAiResponse(message.imageId, message.intent));
  }

  function buildAiResponse(imageId, intent) {
    const image = images.find((entry) => entry.id === imageId) || images[0];
    const confidencePercent = Math.round(image.confidence * 100);

    if (intent === "description") return t(image.descriptionKey);
    if (intent === "reasoning") return t(image.reasoningKey);
    if (intent === "confidence") {
      return formatMessage("visionChatConfidenceTemplate", {
        confidence: confidencePercent,
        detail: t(image.id === "ambiguous" ? "visionChatConfidenceAmbiguousDetail" : "visionChatConfidenceClearDetail")
      });
    }
    if (intent === "counterexample") return t(image.counterKey);
    if (intent === "generalization") return t("visionChatGeneralizationReply");
    return t(image.genericKey);
  }

  function getNextChallenge() {
    return challenges.find((challenge) => !state.completedChallenges.has(challenge.id)) || null;
  }

  function getChallengeStatus(challengeId) {
    if (state.completedChallenges.has(challengeId)) return "complete";

    const nextChallenge = getNextChallenge();
    if (!nextChallenge) return "complete";
    if (nextChallenge.id === challengeId) return "active";
    return "locked";
  }

  function renderChallenges() {
    challengesCardEl.classList.toggle("is-locked", !state.firstAnswerGiven);
    challengeGridEl.innerHTML = challenges.map((challenge) => {
      const status = getChallengeStatus(challenge.id);

      return `
        <button class="vision-challenge-card is-${status}" type="button" data-challenge-id="${challenge.id}" data-challenge-status="${status}" role="listitem">
          <span class="vision-challenge-card-row">
            <span class="vision-challenge-card-marker" aria-hidden="true">${status === "complete" ? "✓" : "○"}</span>
            <span class="vision-challenge-card-copy-wrap">
              <span class="vision-challenge-card-copy">${t(challenge.copyKey)}</span>
            </span>
          </span>
        </button>
      `;
    }).join("");

    challengeGridEl.querySelectorAll("[data-challenge-id]").forEach((button) => {
      button.addEventListener("click", () => {
        if (button.dataset.challengeStatus !== "active") return;
        const challenge = challenges.find((entry) => entry.id === button.dataset.challengeId);
        if (!challenge) return;
        void submitPrompt(challenge.promptKey, { challengeId: challenge.id });
      });
    });

    if (!state.firstAnswerGiven) {
      challengesHelperEl.textContent = "";
    } else {
      challengesHelperEl.textContent = "";
    }
  }

  function updateProgressiveFlow() {
    challengesCardEl.hidden = false;
    chatFormEl.hidden = false;
  }

  function updateActionState() {
    saveDoodleEl.disabled = !state.hasDraftDrawing || state.requestInFlight;
    resetDoodleEl.disabled = !state.hasDraftDrawing;
    undoDoodleEl.disabled = state.draftHistory.length <= 1;
    redoDoodleEl.disabled = state.draftRedoHistory.length === 0;
    openDrawEl.disabled = state.requestInFlight;
  }

  function updateInputState() {
    const enabled = state.hasSavedDrawing && !state.requestInFlight;
    chatInputEl.disabled = !enabled;
    sendButtonEl.disabled = !enabled;
    challengeGridEl.querySelectorAll("button").forEach((button) => {
      button.disabled = !enabled || button.dataset.challengeStatus !== "active";
    });
  }

  function maybeRevealComparison() {
    comparisonCardEl.hidden = state.completedChallenges.size < challenges.length;
  }

  function inferIntent(text, challengeId = null) {
    if (challengeId) return challengeId;

    const normalized = (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    if (
      normalized.includes("likes animals") ||
      normalized.includes("who drew") ||
      normalized.includes("person who drew") ||
      normalized.includes("what kind of person") ||
      normalized.includes("how old") ||
      normalized.includes("their personality") ||
      normalized.includes("tegnede") ||
      normalized.includes("kan du se om personen")
    ) {
      return "generalization";
    }

    if (
      normalized.includes("how sure") ||
      normalized.includes("certain") ||
      normalized.includes("confidence") ||
      normalized.includes("sure are you") ||
      normalized.includes("hvor sikker")
    ) {
      return "confidence";
    }

    if (
      normalized.includes("something else") ||
      normalized.includes("could it be") ||
      normalized.includes("another") ||
      normalized.includes("noget andet") ||
      normalized.includes("kunne det vaere")
    ) {
      return "counterexample";
    }

    if (
      normalized.includes("why") ||
      normalized.includes("explain") ||
      normalized.includes("change your mind") ||
      normalized.includes("what would make you") ||
      normalized.includes("hvorfor") ||
      normalized.includes("forklar")
    ) {
      return "reasoning";
    }

    if (
      normalized.includes("what do you see") ||
      normalized.includes("visible") ||
      normalized.includes("describe") ||
      normalized.includes("in this image") ||
      normalized.includes("hvad ser du")
    ) {
      return "description";
    }

    return "generic";
  }

  function getChallengeById(challengeId) {
    return challenges.find((challenge) => challenge.id === challengeId) || null;
  }

  function getChallengeIdForIntent(intent) {
    return getChallengeById(intent)?.id || null;
  }

  async function ensureVisionDrawingsLoaded() {
    if (state.loadingPromise) {
      await state.loadingPromise;
      return;
    }

    state.loadingPromise = (async () => {
      const loaded = await Promise.all(images.map(async (image) => {
        try {
          const drawing = await loadDrawingFromSource(image.source);
          return { id: image.id, drawing, ok: true };
        } catch (error) {
          console.error(`Could not load vision doodle "${image.id}"`, error);
          return { id: image.id, drawing: null, ok: false };
        }
      }));

      loaded.forEach(({ id, drawing, ok }) => {
        if (drawing?.length) {
          state.drawingByImageId.set(id, drawing);
          state.templateVectorByImageId.set(id, vectorizeDrawingTemplate(drawing));
          state.failedImageIds.delete(id);
          return;
        }

        if (!ok) {
          state.failedImageIds.add(id);
        }
      });
    })();

    try {
      await state.loadingPromise;
    } finally {
      state.loadingPromise = null;
    }
  }

  async function loadDrawingFromSource(source) {
    if (source.kind === "menu") {
      const response = await fetch(`./images/menu-doodles/${source.name}.json`);
      if (!response.ok) {
        throw new Error(`Could not load doodle file: ${source.name}`);
      }
      const payload = await response.json();
      const entry = payload?.drawings?.[source.index];
      return convertTimedStrokeDrawing(entry?.drawing);
    }

    if (source.kind === "binary") {
      const response = await fetch(source.path);
      if (!response.ok) {
        throw new Error(`Could not load doodle dataset: ${source.path}`);
      }
      const buffer = await response.arrayBuffer();
      const drawings = parseQuickDrawBinaryLocal(buffer, source.index + 1);
      return drawings[source.index] || null;
    }

    return null;
  }

  function convertTimedStrokeDrawing(drawing) {
    if (!Array.isArray(drawing)) return [];

    return drawing
      .map((stroke) => {
        if (!Array.isArray(stroke) || stroke.length < 2) return null;
        const [xs, ys] = stroke;
        if (!Array.isArray(xs) || !Array.isArray(ys) || !xs.length || !ys.length) return null;
        return { xs, ys };
      })
      .filter(Boolean);
  }

  function parseQuickDrawBinaryLocal(buffer, limit) {
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

      for (let strokeIndex = 0; strokeIndex < strokeCount; strokeIndex += 1) {
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

        for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
          xs.push(view.getUint8(offset + pointIndex));
        }
        offset += pointCount;

        for (let pointIndex = 0; pointIndex < pointCount; pointIndex += 1) {
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

  function drawDoodleToCanvas(canvas, drawing, options = {}) {
    if (typeof drawQuickDrawToCanvas === "function") {
      try {
        drawQuickDrawToCanvas(canvas, drawing, {
          background: "#ffffff",
          strokeStyle: "#1b2631",
          ...options
        });
        return;
      } catch (error) {
        console.error("Falling back to local doodle renderer.", error);
      }
    }

    const ctx = canvas.getContext("2d");
    const {
      background = "#ffffff",
      strokeStyle = "#1b2631",
      lineWidth = 5,
      padding = 18
    } = options;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = strokeStyle;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;

    const points = [];
    drawing.forEach((stroke) => {
      for (let index = 0; index < stroke.xs.length; index += 1) {
        points.push({ x: stroke.xs[index], y: stroke.ys[index] });
      }
    });

    if (!points.length) return;

    const minX = Math.min(...points.map((point) => point.x));
    const maxX = Math.max(...points.map((point) => point.x));
    const minY = Math.min(...points.map((point) => point.y));
    const maxY = Math.max(...points.map((point) => point.y));
    const boxWidth = Math.max(1, maxX - minX);
    const boxHeight = Math.max(1, maxY - minY);
    const drawableWidth = canvas.width - padding * 2;
    const drawableHeight = canvas.height - padding * 2;
    const scale = Math.min(drawableWidth / boxWidth, drawableHeight / boxHeight);
    const offsetX = (canvas.width - boxWidth * scale) / 2;
    const offsetY = (canvas.height - boxHeight * scale) / 2;

    drawing.forEach((stroke) => {
      if (!stroke.xs.length) return;

      ctx.beginPath();
      ctx.moveTo(
        offsetX + (stroke.xs[0] - minX) * scale,
        offsetY + (stroke.ys[0] - minY) * scale
      );

      for (let index = 1; index < stroke.xs.length; index += 1) {
        ctx.lineTo(
          offsetX + (stroke.xs[index] - minX) * scale,
          offsetY + (stroke.ys[index] - minY) * scale
        );
      }

      ctx.stroke();
    });
  }

  function vectorizeCanvas(canvas, size = TEMPLATE_VECTOR_SIZE) {
    const offscreen = document.createElement("canvas");
    offscreen.width = size;
    offscreen.height = size;
    const ctx = offscreen.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);
    ctx.drawImage(canvas, 0, 0, size, size);

    const { data } = ctx.getImageData(0, 0, size, size);
    const vector = new Array(size * size);

    for (let index = 0; index < vector.length; index += 1) {
      const pixelIndex = index * 4;
      const average = (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
      vector[index] = 1 - average / 255;
    }

    return vector;
  }

  function vectorizeDrawingTemplate(drawing) {
    const canvas = document.createElement("canvas");
    canvas.width = TEMPLATE_VECTOR_SIZE;
    canvas.height = TEMPLATE_VECTOR_SIZE;
    drawDoodleToCanvas(canvas, drawing, { lineWidth: 4, padding: 6 });
    return vectorizeCanvas(canvas);
  }

  function classifySavedDrawing() {
    const draftVector = vectorizeCanvas(savedCanvas);
    let bestId = "ambiguous";
    let bestDistance = Number.POSITIVE_INFINITY;

    state.templateVectorByImageId.forEach((templateVector, imageId) => {
      let distance = 0;
      for (let index = 0; index < draftVector.length; index += 1) {
        const difference = draftVector[index] - templateVector[index];
        distance += difference * difference;
      }

      if (distance < bestDistance) {
        bestDistance = distance;
        bestId = imageId;
      }
    });

    return bestId;
  }

  async function saveDoodle() {
    if (!state.hasDraftDrawing) return;

    await ensureVisionDrawingsLoaded();
    clearSavedCanvas();
    savedCtx.drawImage(drawCanvas, 0, 0, savedCanvas.width, savedCanvas.height);
    state.savedImageId = classifySavedDrawing();
    state.hasSavedDrawing = true;
    state.savedDraftImage = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    state.drawingDirty = false;
    resetConversationState();
    renderSavedDrawingState();
    renderMessages();
    renderChallenges();
    updateProgressiveFlow();
    maybeRevealComparison();
    updateInputState();
    updateActionState();
  }

  function handleResetDoodle() {
    resetDraftCanvas();
    syncDraftDirtyState();
    renderSavedDrawingState();
    renderMessages();
  }

  function handleUndoDoodle() {
    if (state.draftHistory.length <= 1) return;

    const currentState = state.draftHistory.pop();
    state.draftRedoHistory.push(currentState);

    const previousState = state.draftHistory[state.draftHistory.length - 1];
    drawCtx.putImageData(previousState, 0, 0);
    state.hasDraftDrawing = !isSameImageData(previousState, state.draftPlaceholderImage);
    syncDraftDirtyState();
    renderSavedDrawingState();
    updateActionState();
  }

  function handleRedoDoodle() {
    if (!state.draftRedoHistory.length) return;

    const redoneState = state.draftRedoHistory.pop();
    state.draftHistory.push(redoneState);
    drawCtx.putImageData(redoneState, 0, 0);
    state.hasDraftDrawing = !isSameImageData(redoneState, state.draftPlaceholderImage);
    syncDraftDirtyState();
    renderSavedDrawingState();
    updateActionState();
  }

  async function submitPrompt(promptOrKey, options = {}) {
    const image = getSavedImage();
    if (!image || state.requestInFlight) return;

    const promptKey = promptOrKey.startsWith("visionChatPrompt") ? promptOrKey : null;
    const rawText = promptKey ? null : promptOrKey.trim();
    const userText = promptKey ? t(promptKey) : rawText;
    if (!userText) return;

    await ensureVisionDrawingsLoaded();

    const intent = inferIntent(promptKey ? t(promptKey) : rawText, options.challengeId);
    const matchedChallengeId = options.challengeId || getChallengeIdForIntent(intent);
    state.requestInFlight = true;
    state.messages.push({
      role: "user",
      text: rawText,
      promptKey
    });
    const aiMessage = {
      role: "ai",
      imageId: image.id,
      intent,
      text: t("visionChatThinking")
    };

    const firstAnswerThisTurn = !state.firstAnswerGiven;
    state.firstAnswerGiven = true;
    state.activeChallengeId = matchedChallengeId;
    const newlyCompletedChallengeId = matchedChallengeId && !state.completedChallenges.has(matchedChallengeId)
      ? matchedChallengeId
      : null;
    const lesson = newlyCompletedChallengeId ? getChallengeById(newlyCompletedChallengeId) : null;
    aiMessage.lessonKey = lesson?.lessonKey || (firstAnswerThisTurn ? "visionChatLessonFirstAnswer" : null);
    state.messages.push(aiMessage);

    if (newlyCompletedChallengeId) {
      state.completedChallenges.add(newlyCompletedChallengeId);
    }

    updateProgressiveFlow();
    renderMessages();
    renderChallenges();
    maybeRevealComparison();
    updateInputState();
    updateActionState();

    try {
      if (shouldUseHuggingFace()) {
        aiMessage.text = await requestHuggingFaceReply(userText, intent);
      } else {
        aiMessage.text = t("visionChatHfStatusSimulated");
      }
    } catch (error) {
      aiMessage.text = formatMessage("visionChatHfErrorFallback", {
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      state.requestInFlight = false;
      updateProgressiveFlow();
      renderMessages();
      renderChallenges();
      maybeRevealComparison();
      updateInputState();
      updateActionState();
    }
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  }

  function shouldUseHuggingFace() {
    return Boolean(PROXY_CONFIG.enabled && PROXY_CONFIG.url);
  }

  function extractProxyText(payload) {
    const chatCompletionContent = payload?.choices?.[0]?.message?.content;
    if (typeof chatCompletionContent === "string" && chatCompletionContent.trim()) {
      return chatCompletionContent.trim();
    }

    if (Array.isArray(chatCompletionContent)) {
      const joined = chatCompletionContent
        .map((item) => {
          if (typeof item === "string") return item;
          if (item?.type === "text" && typeof item.text === "string") return item.text;
          if (typeof item?.text?.value === "string") return item.text.value;
          return "";
        })
        .filter(Boolean)
        .join("\n")
        .trim();
      if (joined) return joined;
    }

    if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
      return payload.output_text.trim();
    }

    if (Array.isArray(payload?.output)) {
      const joined = payload.output
        .flatMap((item) => Array.isArray(item?.content) ? item.content : [])
        .map((item) => {
          if (typeof item?.text === "string") return item.text;
          if (typeof item?.text?.value === "string") return item.text.value;
          return "";
        })
        .filter(Boolean)
        .join("\n")
        .trim();
      if (joined) return joined;
    }

    if (typeof payload?.response === "string" && payload.response.trim()) {
      return payload.response.trim();
    }

    if (typeof payload?.message === "string" && payload.message.trim()) {
      return payload.message.trim();
    }

    return "";
  }

  async function requestHuggingFaceReply(promptText, intent) {
    const proxyUrl = PROXY_CONFIG.url || VISION_CHAT_PROXY_URL;
    if (!proxyUrl) {
      throw new Error(t("visionChatHfNoToken"));
    }

    const imageDataUrl = savedCanvas.toDataURL("image/png");
    const response = await fetch(proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: buildSystemPrompt(intent)
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: promptText
              },
              {
                type: "image_url",
                image_url: {
                  url: imageDataUrl
                }
              }
            ]
          }
        ]
      })
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload?.error?.message || payload?.error || payload?.message || `${response.status} ${response.statusText}`;
      throw new Error(message);
    }

    const content = extractProxyText(payload);
    if (content) {
      return content;
    }

    throw new Error(t("visionChatHfEmptyResponse"));
  }

  function buildSystemPrompt(intent) {
    return [
      t("visionChatHfSystemBase"),
      intent === "generalization" ? t("visionChatHfSystemGeneralization") : "",
      intent === "confidence" ? t("visionChatHfSystemConfidence") : "",
      intent === "reasoning" ? t("visionChatHfSystemReasoning") : ""
    ].filter(Boolean).join(" ");
  }

  chatFormEl.addEventListener("submit", (event) => {
    event.preventDefault();
    void submitPrompt(chatInputEl.value);
    chatInputEl.value = "";
  });

  drawCanvas.addEventListener("pointerdown", startDraftDrawing);
  drawCanvas.addEventListener("pointermove", continueDraftDrawing);
  drawCanvas.addEventListener("pointerup", endDraftDrawing);
  drawCanvas.addEventListener("pointerleave", endDraftDrawing);
  drawCanvas.addEventListener("pointercancel", endDraftDrawing);
  openDrawEl.addEventListener("click", openDoodleModal);
  closeDoodleEl.addEventListener("click", closeDoodleModal);
  doodleModalEl.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof Element && target.closest("[data-close-doodle='true']")) {
      closeDoodleModal();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !doodleModalEl.hidden) {
      closeDoodleModal();
    }
  });
  saveDoodleEl.addEventListener("click", async () => {
    await saveDoodle();
    closeDoodleModal();
  });
  resetDoodleEl.addEventListener("click", handleResetDoodle);
  undoDoodleEl.addEventListener("click", handleUndoDoodle);
  redoDoodleEl.addEventListener("click", handleRedoDoodle);
  if (lessonPopupCloseEl) {
    lessonPopupCloseEl.addEventListener("click", closeLessonPopup);
  }
  if (lessonPopupEl) {
    lessonPopupEl.addEventListener("click", (event) => {
      if (event.target === lessonPopupEl) {
        closeLessonPopup();
      }
    });
  }
  window.applyVisionChatTranslations = function applyVisionChatTranslations() {
    updateDocumentLanguage();
    if (!state.hasDraftDrawing) {
      resetDraftCanvas();
    }
    if (state.openLessonMessageIndex !== null) {
      openLessonPopup(state.openLessonMessageIndex);
    }
    renderSavedDrawingState();
    renderChallenges();
    renderMessages();
    updateProgressiveFlow();
    maybeRevealComparison();
    updateInputState();
    updateActionState();
  };

  updateDocumentLanguage();
  clearSavedCanvas();
  clearPreviewCanvas();
  resetDraftCanvas();
  renderSavedDrawingState();
  renderChallenges();
  renderMessages();
  updateProgressiveFlow();
  maybeRevealComparison();
  updateInputState();
  updateActionState();
  void ensureVisionDrawingsLoaded();
})();
