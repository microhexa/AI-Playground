(() => {
  const room = document.getElementById("vision-chat-room");
  if (!room) return;

  const chatLogEl = document.getElementById("vision-chat-log");
  const chatFormEl = document.getElementById("vision-chat-form");
  const chatInputEl = document.getElementById("vision-chat-input");
  const sendButtonEl = document.getElementById("vision-chat-send");
  const visionReflectionPopup = document.getElementById("vision-reflection-popup");
  const visionConfettiLayerEl = document.getElementById("vision-confetti-layer");
  const visionReflectionIntroEl = document.getElementById("vision-reflection-intro");
  const visionReflectionProgressEl = document.getElementById("vision-reflection-progress");
  const visionReflectionQuestionEl = document.getElementById("vision-reflection-question");
  const visionReflectionStemEl = document.getElementById("vision-reflection-stem");
  const visionReflectionChoicesEl = document.getElementById("vision-reflection-choices");
  const visionReflectionSummaryEl = document.getElementById("vision-reflection-summary");
  const visionReflectionSummaryListEl = document.getElementById("vision-reflection-summary-list");
  const visionReflectionContinueBtn = document.getElementById("vision-reflection-continue-btn");
  const visionReflectionExitBtn = document.getElementById("vision-reflection-exit-btn");
  const visionReflectionCloseBtn = document.getElementById("vision-reflection-close");
  const visionReflectionStartBtn = document.getElementById("vision-reflection-start-btn");
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
  const challengesCardEl = document.getElementById("vision-challenges-card");
  const challengeGridEl = document.getElementById("vision-challenge-grid");
  const VISION_CHAT_PROXY_URL = "https://ai-toolbox.justanoakleaf.workers.dev/";
  const DEFAULT_HF_ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
  const DEFAULT_HF_MODEL = "google/gemma-3-27b-it";
  const PROXY_CONFIG = window.VISION_CHAT_PROXY_CONFIG || {
    enabled: true,
    url: VISION_CHAT_PROXY_URL,
    model: DEFAULT_HF_MODEL,
    token: ""
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
      id: "counterexample",
      titleKey: "visionChatChallengeDisagreeTitle",
      copyKey: "visionChatChallengeDisagreeCopy",
      promptKey: "visionChatPromptDisagree",
      lessonKey: "visionChatLessonCounter"
    },
    {
      id: "confidence",
      titleKey: "visionChatChallengeConfidenceTitle",
      copyKey: "visionChatChallengeConfidenceCopy",
      promptKey: "visionChatPromptSure",
      lessonKey: "visionChatLessonConfidence"
    },
    {
      id: "generalization",
      titleKey: "visionChatChallengeGeneralizationTitle",
      copyKey: "visionChatChallengeGeneralizationCopy",
      promptKey: "visionChatPromptGeneralization",
      lessonKey: "visionChatLessonGeneralization"
    }
  ];

  const visionReflectionQuestions = [
    {
      key: "limits",
      questionKey: "visionChatReflectionLimitsQuestion",
      correct: "visible",
      summaryKey: "visionChatReflectionSummaryLimits",
      options: [
        { value: "visible", labelKey: "visionChatReflectionLimitsOptionVisible" },
        { value: "personality", labelKey: "visionChatReflectionLimitsOptionPersonality" },
        { value: "future", labelKey: "visionChatReflectionLimitsOptionFuture" }
      ]
    },
    {
      key: "sound",
      questionKey: "visionChatReflectionSoundQuestion",
      correct: "fluent",
      summaryKey: "visionChatReflectionSummarySound",
      options: [
        { value: "fluent", labelKey: "visionChatReflectionSoundOptionFluent" },
        { value: "truth", labelKey: "visionChatReflectionSoundOptionTruth" },
        { value: "rules", labelKey: "visionChatReflectionSoundOptionRules" }
      ]
    },
    {
      key: "best",
      questionKey: "visionChatReflectionBestQuestion",
      correct: "grounded",
      summaryKey: "visionChatReflectionSummaryBest",
      options: [
        { value: "grounded", labelKey: "visionChatReflectionBestOptionGrounded" },
        { value: "invent", labelKey: "visionChatReflectionBestOptionInvent" },
        { value: "guess", labelKey: "visionChatReflectionBestOptionGuess" }
      ]
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
    openLessonMessageIndex: null,
    reflectionIndex: 0,
    reflectionCompleted: false,
    reflectionOpen: false,
    reflectionAvailable: false,
    reflectionEliminated: {},
    hfLastError: "",
    confettiCleanupTimeoutId: null
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

  function usesBackendProxy() {
    return Boolean(PROXY_CONFIG.enabled && PROXY_CONFIG.url);
  }

  function shuffleArray(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
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
    state.reflectionAvailable = false;
    state.reflectionCompleted = false;
    closeVisionReflectionPopup({ restoreFocus: false });
    resetVisionReflectionState();
    chatInputEl.value = "";
  }

  function renderSavedDrawingState() {
    if (!state.hasSavedDrawing) {
      selectedImageCopyEl.textContent = t("visionChatDrawPrompt");
      doodleStatusEl.textContent = state.hasDraftDrawing ? t("visionChatUnsavedChanges") : t("visionChatSaveHint");
      syncPreviewCanvas();
      return;
    }

    selectedImageCopyEl.textContent = t("visionChatSavedHint");

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
      return `
        <div class="vision-chat-message ${message.role}">
          <div class="vision-chat-bubble">
            <div class="vision-chat-bubble-topline">
              <span class="vision-chat-bubble-role">${roleLabel}</span>
            </div>
            <div>${resolveMessageText(message)}</div>
          </div>
        </div>
      `;
    }).join("");
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

  function resetVisionReflectionState() {
    state.reflectionIndex = 0;
    state.reflectionEliminated = {};
    visionReflectionQuestions.forEach((question) => {
      state.reflectionEliminated[question.key] = new Set();
    });
  }

  function updateVisionReflectionProgress() {
    if (!visionReflectionProgressEl) return;
    const total = visionReflectionQuestions.length;
    visionReflectionProgressEl.textContent = `${Math.min(state.reflectionIndex + 1, total)} / ${total}`;
  }

  function renderVisionReflectionQuestion() {
    const question = visionReflectionQuestions[state.reflectionIndex];
    if (!question || !visionReflectionStemEl || !visionReflectionChoicesEl) return;

    visionReflectionStemEl.textContent = t(question.questionKey);
    visionReflectionChoicesEl.innerHTML = "";

    shuffleArray(question.options.map((option) => ({ ...option }))).forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "classifier-reflection-choice";
      button.dataset.questionKey = question.key;
      button.dataset.optionValue = option.value;
      button.textContent = t(option.labelKey);

      if (state.reflectionEliminated[question.key]?.has(option.value)) {
        button.disabled = true;
        button.classList.add("is-eliminated");
        button.setAttribute("aria-disabled", "true");
      }

      button.addEventListener("click", () => handleVisionReflectionChoice(question, option.value, button));
      visionReflectionChoicesEl.appendChild(button);
    });
  }

  function renderVisionReflectionSummary() {
    if (!visionReflectionSummaryListEl) return;
    visionReflectionSummaryListEl.innerHTML = visionReflectionQuestions
      .map((question) => `<li class="classifier-reflection-summary-line">${t(question.summaryKey)}</li>`)
      .join("");
  }

  function renderVisionReflection() {
    if (!visionReflectionPopup) return;

    if (visionReflectionIntroEl) visionReflectionIntroEl.hidden = state.reflectionCompleted;
    if (visionReflectionProgressEl) visionReflectionProgressEl.hidden = state.reflectionCompleted;
    if (visionReflectionQuestionEl) visionReflectionQuestionEl.hidden = state.reflectionCompleted;
    if (visionReflectionSummaryEl) visionReflectionSummaryEl.hidden = !state.reflectionCompleted;
    if (visionReflectionContinueBtn) visionReflectionContinueBtn.hidden = !state.reflectionCompleted;
    if (visionReflectionExitBtn) visionReflectionExitBtn.hidden = !state.reflectionCompleted;

    if (state.reflectionCompleted) {
      renderVisionReflectionSummary();
      return;
    }

    updateVisionReflectionProgress();
    renderVisionReflectionQuestion();
  }

  function updateVisionReflectionTrigger() {
    if (!visionReflectionStartBtn) return;
    const shouldShow = state.hasSavedDrawing && !state.reflectionCompleted && !state.reflectionOpen;
    const isEnabled = state.firstAnswerGiven && state.reflectionAvailable && !state.requestInFlight;
    visionReflectionStartBtn.classList.toggle("hidden", !shouldShow);
    visionReflectionStartBtn.hidden = !shouldShow;
    visionReflectionStartBtn.disabled = !isEnabled;
    visionReflectionStartBtn.setAttribute("aria-disabled", isEnabled ? "false" : "true");
  }

  function openVisionReflectionPopup() {
    if (!visionReflectionPopup || !state.reflectionAvailable || state.reflectionCompleted || state.reflectionOpen) return;
    state.reflectionOpen = true;
    resetVisionReflectionState();
    renderMessages();
    updateVisionReflectionTrigger();
    renderVisionReflection();
    visionReflectionPopup.classList.remove("hidden");
    visionReflectionPopup.setAttribute("aria-hidden", "false");
    window.requestAnimationFrame(() => {
      const firstChoice = visionReflectionChoicesEl?.querySelector(".classifier-reflection-choice");
      firstChoice?.focus();
    });
  }

  function closeVisionReflectionPopup({ restoreFocus = true } = {}) {
    if (!visionReflectionPopup) return;
    state.reflectionOpen = false;
    visionReflectionPopup.classList.add("hidden");
    visionReflectionPopup.setAttribute("aria-hidden", "true");
    renderMessages();
    updateVisionReflectionTrigger();
    if (restoreFocus) {
      visionReflectionStartBtn?.focus();
    }
  }

  function clearVisionConfettiBurst() {
    if (state.confettiCleanupTimeoutId !== null) {
      window.clearTimeout(state.confettiCleanupTimeoutId);
      state.confettiCleanupTimeoutId = null;
    }
    if (visionConfettiLayerEl) {
      visionConfettiLayerEl.innerHTML = "";
    }
  }

  function launchVisionConfettiBurst() {
    if (!visionConfettiLayerEl) return;

    clearVisionConfettiBurst();

    const colors = ["#f9c74f", "#f3722c", "#f94144", "#90be6d", "#577590", "#f9844a"];
    const pieceCount = 42;

    for (let index = 0; index < pieceCount; index += 1) {
      const piece = document.createElement("span");
      piece.className = "classifier-confetti-piece";
      piece.style.left = `${42 + Math.random() * 16}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 140}ms`;
      piece.style.animationDuration = `${1200 + Math.random() * 420}ms`;
      piece.style.setProperty("--confetti-x", `${(Math.random() - 0.5) * 520}px`);
      piece.style.setProperty("--confetti-rotate", `${360 + Math.random() * 720}deg`);
      piece.style.width = `${9 + Math.random() * 7}px`;
      piece.style.height = `${14 + Math.random() * 12}px`;
      visionConfettiLayerEl.appendChild(piece);
    }

    state.confettiCleanupTimeoutId = window.setTimeout(() => {
      clearVisionConfettiBurst();
    }, 1900);
  }

  function handleVisionReflectionChoice(question, selectedValue, button) {
    if (state.reflectionCompleted) return;

    if (selectedValue === question.correct) {
      launchVisionConfettiBurst();
      state.reflectionIndex += 1;
      if (state.reflectionIndex >= visionReflectionQuestions.length) {
        state.reflectionCompleted = true;
        state.reflectionAvailable = false;
        renderMessages();
      }
      updateVisionReflectionTrigger();
      renderVisionReflection();
      window.requestAnimationFrame(() => {
        if (state.reflectionCompleted) {
          visionReflectionContinueBtn?.focus();
          return;
        }
        const firstChoice = visionReflectionChoicesEl?.querySelector(".classifier-reflection-choice");
        firstChoice?.focus();
      });
      return;
    }

    state.reflectionEliminated[question.key]?.add(selectedValue);
    button.disabled = true;
    button.classList.add("is-eliminated");
    button.setAttribute("aria-disabled", "true");
  }

  function getChallengeStatus(challengeId) {
    if (!state.firstAnswerGiven) {
      return challenges[0]?.id === challengeId ? "active" : "locked";
    }
    if (state.completedChallenges.has(challengeId)) return "complete";
    return getNextChallenge()?.id === challengeId ? "active" : "locked";
  }

  function renderChallenges() {
    challengesCardEl.classList.toggle("is-locked", !state.firstAnswerGiven);
    challengeGridEl.innerHTML = challenges.map((challenge) => {
      const status = getChallengeStatus(challenge.id);

      return `
        <div class="vision-challenge-card is-${status}" data-challenge-id="${challenge.id}" data-challenge-status="${status}" role="listitem">
          <span class="vision-challenge-card-row">
            <span class="vision-challenge-card-marker" aria-hidden="true">${status === "complete" ? "✓" : "○"}</span>
            <span class="vision-challenge-card-copy-wrap">
              <span class="vision-challenge-card-copy">${t(challenge.copyKey)}</span>
            </span>
          </span>
        </div>
      `;
    }).join("");

    if (!state.firstAnswerGiven) {
      challengesHelperEl.textContent = "";
    } else {
      challengesHelperEl.textContent = "";
    }
  }

  function renderChallenges() {
    challengeGridEl.innerHTML = challenges.map((challenge) => {
      return `
        <div class="vision-challenge-card" data-challenge-id="${challenge.id}" role="listitem">
          <span class="vision-challenge-card-row">
            <span class="vision-challenge-card-marker" aria-hidden="true">•</span>
            <span class="vision-challenge-card-copy-wrap">
              <span class="vision-challenge-card-copy">${t(challenge.copyKey)}</span>
            </span>
          </span>
        </div>
      `;
    }).join("");

    if (challengesHelperEl) {
      challengesHelperEl.textContent = "";
    }
    updateVisionReflectionTrigger();
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
  }

  function inferIntent(text, challengeId = null) {
    if (challengeId) return challengeId;

    const normalized = (text || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const generalizationPhrases = [
      "likes animals",
      "who drew",
      "person who drew",
      "what kind of person",
      "how old",
      "their personality",
      "what is their personality",
      "are they",
      "do they like",
      "what do they like",
      "is this person",
      "what is the person like",
      "what happened before",
      "what happens next",
      "what will happen",
      "where is this",
      "where are they",
      "what country",
      "what city",
      "what room",
      "what time of day",
      "what season",
      "what does it sound like",
      "what can you hear",
      "what does it smell like",
      "what are they thinking",
      "what are they feeling",
      "how do they feel",
      "what job",
      "what is their name",
      "is it a boy",
      "is it a girl",
      "is the artist",
      "tegnede",
      "kan du se om personen",
      "hvor gammel",
      "hvad for en person",
      "hvad kan man hore",
      "hvordan har personen det",
      "hvad sker der bagefter",
      "hvad skete der for",
      "hvor er de",
      "hvilket land",
      "hvilken by"
    ];

    const generalizationKeywords = [
      "artist",
      "drawer",
      "personality",
      "personlighed",
      "preferences",
      "prefer",
      "hobby",
      "hobbies",
      "age",
      "gender",
      "boyfriend",
      "girlfriend",
      "family",
      "rich",
      "poor",
      "smart",
      "kind",
      "mean",
      "future",
      "past",
      "before",
      "after",
      "next",
      "yesterday",
      "tomorrow",
      "sound",
      "hear",
      "smell",
      "taste",
      "feel",
      "thinking",
      "job",
      "name"
    ];

    if (
      generalizationPhrases.some((phrase) => normalized.includes(phrase)) ||
      (
        (normalized.includes("person") || normalized.includes("they") || normalized.includes("someone") || normalized.includes("artist"))
        && generalizationKeywords.some((keyword) => normalized.includes(keyword))
      )
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
      normalized.startsWith("it's ") ||
      normalized.startsWith("it is ") ||
      normalized.startsWith("no, it's ") ||
      normalized.startsWith("no it's ") ||
      normalized.startsWith("thats ") ||
      normalized.startsWith("that's ") ||
      normalized.startsWith("you are wrong") ||
      normalized.startsWith("you're wrong") ||
      normalized.includes("noget andet") ||
      normalized.includes("kunne det vaere") ||
      normalized.startsWith("det er ") ||
      normalized.startsWith("nej, det er ") ||
      normalized.startsWith("nej det er ")
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
      normalized.includes("hvad ser du") ||
      normalized.includes("hvad kan du se")
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

    clearSavedCanvas();
    savedCtx.drawImage(drawCanvas, 0, 0, savedCanvas.width, savedCanvas.height);
    state.savedImageId = null;
    state.hasSavedDrawing = true;
    state.savedDraftImage = drawCtx.getImageData(0, 0, drawCanvas.width, drawCanvas.height);
    state.drawingDirty = false;
    resetConversationState();
    renderSavedDrawingState();
    renderMessages();
    renderChallenges();
    updateProgressiveFlow();
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
    if (!state.hasSavedDrawing || state.requestInFlight) return;

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
      imageId: null,
      intent,
      text: t("visionChatThinking")
    };

    const firstAnswerThisTurn = !state.firstAnswerGiven;
    state.firstAnswerGiven = true;
    state.activeChallengeId = matchedChallengeId;
    const lesson = matchedChallengeId ? getChallengeById(matchedChallengeId) : null;
    aiMessage.lessonKey = lesson?.lessonKey || (firstAnswerThisTurn ? "visionChatLessonFirstAnswer" : null);
    state.messages.push(aiMessage);

    updateProgressiveFlow();
    renderMessages();
    renderChallenges();
    updateInputState();
    updateActionState();

    try {
      if (shouldUseHuggingFace()) {
        state.hfLastError = "";
        aiMessage.text = await requestHuggingFaceReply(userText, intent);
      } else {
        aiMessage.text = t("visionChatHfLiveDisabled");
      }
    } catch (error) {
      state.hfLastError = error instanceof Error ? error.message : String(error);
      aiMessage.text = formatMessage("visionChatHfRequestFailed", {
        error: state.hfLastError
      });
    } finally {
      state.requestInFlight = false;
      if (state.firstAnswerGiven && !state.reflectionCompleted) {
        state.reflectionAvailable = true;
      }
      updateProgressiveFlow();
      renderMessages();
      renderChallenges();
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
    return usesBackendProxy();
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

  function getMessagePlainText(message) {
    if (!message) return "";
    if (message.role === "user") {
      return message.promptKey ? t(message.promptKey) : String(message.text || "").trim();
    }

    if (typeof message.text === "string") {
      return message.text.trim();
    }

    return buildAiResponse(message.imageId, message.intent).trim();
  }

  function toApiRole(role) {
    if (role === "ai") return "assistant";
    if (role === "user") return "user";
    return role;
  }

  function formatHistoryTextForApi(message, text) {
    const trimmed = String(text || "").trim();
    if (!trimmed) return "";
    return trimmed;
  }

  function formatLatestUserTextForApi(text, intent) {
    const trimmed = String(text || "").trim();
    if (!trimmed) return "";
    return trimmed;
  }

  function buildConversationMessages(intent) {
    const imageDataUrl = savedCanvas.toDataURL("image/png");
    const conversation = [
      {
        role: "system",
        content: buildSystemPrompt(intent)
      }
    ];

    const latestUserIndex = (() => {
      for (let index = state.messages.length - 1; index >= 0; index -= 1) {
        if (state.messages[index]?.role === "user") return index;
      }
      return -1;
    })();

    state.messages.forEach((message, index) => {
      if (message.role === "ai" && message.text === t("visionChatThinking")) {
        return;
      }

      const text = getMessagePlainText(message);
      if (!text) return;

      if (message.role === "user" && index === latestUserIndex) {
        conversation.push({
          role: "user",
          content: [
            {
              type: "text",
              text: formatLatestUserTextForApi(text, intent)
            },
            {
              type: "image_url",
              image_url: {
                url: imageDataUrl
              }
            }
          ]
        });
        return;
      }

      conversation.push({
        role: toApiRole(message.role),
        content: formatHistoryTextForApi(message, text)
      });
    });

    return conversation;
  }

  async function requestHuggingFaceReply(promptText, intent) {
    const endpoint = PROXY_CONFIG.url;
    if (!endpoint) {
      throw new Error(t("visionChatHfNoToken"));
    }

    const headers = {
      "Content-Type": "application/json"
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: PROXY_CONFIG.model || DEFAULT_HF_MODEL,
        messages: buildConversationMessages(intent)
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
    const intentPromptKey = ({
      description: "visionChatHfSystemDescription",
      counterexample: "visionChatHfSystemCounterexample",
      confidence: "visionChatHfSystemConfidence",
      generalization: "visionChatHfSystemGeneralization"
    })[intent];

    return [
      t("visionChatHfSystemBase"),
      intentPromptKey ? t(intentPromptKey) : ""
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
  if (visionReflectionContinueBtn) {
    visionReflectionContinueBtn.addEventListener("click", () => closeVisionReflectionPopup());
  }
  if (visionReflectionStartBtn) {
    visionReflectionStartBtn.addEventListener("click", openVisionReflectionPopup);
  }
  if (visionReflectionCloseBtn) {
    visionReflectionCloseBtn.addEventListener("click", () => closeVisionReflectionPopup());
  }

  if (visionReflectionExitBtn) {
    visionReflectionExitBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  if (visionReflectionPopup) {
    visionReflectionPopup.addEventListener("click", (event) => {
      if (event.target === visionReflectionPopup) {
        closeVisionReflectionPopup();
      }
    });
  }
  window.applyVisionChatTranslations = function applyVisionChatTranslations() {
    updateDocumentLanguage();
    if (!state.hasDraftDrawing) {
      resetDraftCanvas();
    }
    renderSavedDrawingState();
    renderVisionReflection();
    renderChallenges();
    renderMessages();
    updateProgressiveFlow();
    updateInputState();
    updateActionState();
  };

  updateDocumentLanguage();
  clearSavedCanvas();
  clearPreviewCanvas();
  resetDraftCanvas();
  resetVisionReflectionState();
  renderSavedDrawingState();
  renderChallenges();
  renderMessages();
  updateProgressiveFlow();
  updateInputState();
  updateActionState();
  void ensureVisionDrawingsLoaded();
})();
