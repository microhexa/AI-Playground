    const doodleSections = [
      {
        id: "sun",
        labelKey: "imageClassifierClassSun",
        datasetPath: "./images/full_binary_sun.bin",
        samples: Array.from({ length: 40 }, (_, index) => ({
          id: `sun-${index + 1}`,
          preview: `SUN\nDOODLE ${index + 1}`
        }))
      },
      {
        id: "fish",
        labelKey: "imageClassifierClassFish",
        datasetPath: "./images/full_binary_fish.bin",
        samples: Array.from({ length: 40 }, (_, index) => ({
          id: `fish-${index + 1}`,
          preview: `FISH\nDOODLE ${index + 1}`
        }))
      },
      {
        id: "house",
        labelKey: "imageClassifierClassHouse",
        datasetPath: "./images/full_binary_house.bin",
        samples: Array.from({ length: 40 }, (_, index) => ({
          id: `house-${index + 1}`,
          preview: `HOUSE\nDOODLE ${index + 1}`
        }))
      },
      {
        id: "hockey-stick",
        labelKey: "imageClassifierClassAnimalMigration",
        datasetPath: "./images/full_binary_hockey stick.bin",
        skippedSampleIndexes: [30],
        samples: Array.from({ length: 40 }, (_, index) => ({
          id: `hockey-stick-${index + 1}`,
          preview: `HOCKEY\nSTICK ${index + 1}`
        }))
      },
      {
        id: "mona-lisa",
        labelKey: "imageClassifierClassMonaLisa",
        datasetPath: "./images/full_binary_The Mona Lisa.bin",
        samples: Array.from({ length: 40 }, (_, index) => ({
          id: `mona-lisa-${index + 1}`,
          preview: `MONA\nLISA ${index + 1}`
        }))
      }
    ];

    const doodleSamples = [];

    const classPicker = document.getElementById("class-picker");
    const doodleBrowser = document.getElementById("doodle-browser");
    const classStepEl = document.getElementById("classifier-class-step");
    const doodleStepEl = document.getElementById("classifier-doodle-step");
    const selectionCountEl = document.getElementById("selection-count");
    const selectionHintEl = document.getElementById("selection-hint");
    const doodleRoundSummaryEl = document.getElementById("doodle-round-summary");
    const trainingChecklistItems = Array.from(document.querySelectorAll("[data-training-check]"));
    const prevDoodleRoundBtn = document.getElementById("prev-doodle-round-btn");
    const nextDoodleRoundBtn = document.getElementById("next-doodle-round-btn");
    const trainingReviewCountEl = document.getElementById("training-review-count");
    const trainingReviewHintEl = document.getElementById("training-review-hint");
    const trainingReviewTagsEl = document.getElementById("training-review-tags");
    const trainModelBtn = document.getElementById("train-model-btn");
    const toDoodlesBtn = document.getElementById("to-doodles-btn");
    const backToClassesBtn = document.getElementById("back-to-classes-btn");
    const backToDoodlesBtn = document.getElementById("back-to-doodles-btn");
    const trainingPopup = document.getElementById("training-popup");
    const addDoodlePopup = document.getElementById("add-doodle-popup");
    const addDoodleCanvas = document.getElementById("add-doodle-canvas");
    const addDoodleCtx = addDoodleCanvas.getContext("2d");
    const addDoodlePopupCopyEl = document.getElementById("add-doodle-popup-copy");
    const cancelAddDoodleBtn = document.getElementById("cancel-add-doodle-btn");
    const confirmAddDoodleBtn = document.getElementById("confirm-add-doodle-btn");
    const customClassPopup = document.getElementById("custom-class-popup");
    const customClassNameInput = document.getElementById("custom-class-name-input");
    const cancelCustomClassBtn = document.getElementById("cancel-custom-class-btn");
    const confirmCustomClassBtn = document.getElementById("confirm-custom-class-btn");
    const trainingProgressEl = document.getElementById("training-progress");
    const trainingStatusEl = document.getElementById("training-status");
    const trainingPercentEl = document.getElementById("training-percent");
    const trainingClassesEl = document.getElementById("training-classes");
    const trainingSamplesEl = document.getElementById("training-samples");
    const trainingBackendNoteEl = document.getElementById("training-backend-note");
    const trainingPopupContinueBtn = document.getElementById("training-popup-continue-btn");
    const resetBtn = document.getElementById("reset-btn");
    const undoBtn = document.getElementById("undo-btn");
    const redoBtn = document.getElementById("redo-btn");
    const canvasCard = document.getElementById("canvas-card");
    const testingSuggestionClassEl = document.getElementById("testing-suggestion-class");
    const selectedTagsEl = document.getElementById("selected-tags");
    const testingSelectedTagsEl = document.getElementById("testing-selected-tags");
    const modelStateEl = document.getElementById("model-state");
    const modelBackendEl = document.getElementById("model-backend");
    const modelTrainedAtEl = document.getElementById("model-trained-at");
    const testingModelStateEl = document.getElementById("testing-model-state");
    const testingModelBackendEl = document.getElementById("testing-model-backend");
    const testingModelTrainedAtEl = document.getElementById("testing-model-trained-at");
    const predictionLabelEl = document.getElementById("prediction-label");
    const predictionConfidenceEl = document.getElementById("prediction-confidence");
    const predictionOtherHeadingEl = document.getElementById("prediction-other-heading");
    const predictionRankedListEl = document.getElementById("prediction-ranked-list");
    const predictionHelpBtn = document.getElementById("prediction-help-btn");
    const predictionHelpPopup = document.getElementById("prediction-help-popup");
    const predictionHelpPopupCopyEl = document.getElementById("prediction-help-popup-copy");
    const predictionHelpPopupExtraEl = document.getElementById("prediction-help-popup-extra");
    const predictionHelpVisualEl = document.getElementById("prediction-help-visual");
    const predictionHelpStackedBarEl = document.getElementById("prediction-help-stacked-bar");
    const closePredictionHelpBtn = document.getElementById("close-prediction-help-btn");
    const classifierReflectionPopup = document.getElementById("classifier-reflection-popup");
    const classifierReflectionIntroEl = document.getElementById("classifier-reflection-intro");
    const classifierReflectionProgressEl = document.getElementById("classifier-reflection-progress");
    const classifierReflectionQuestionEl = document.getElementById("classifier-reflection-question");
    const classifierReflectionStemEl = document.getElementById("classifier-reflection-stem");
    const classifierReflectionChoicesEl = document.getElementById("classifier-reflection-choices");
    const classifierReflectionSummaryEl = document.getElementById("classifier-reflection-summary");
    const classifierReflectionSummaryListEl = document.getElementById("classifier-reflection-summary-list");
    const classifierReflectionContinueBtn = document.getElementById("classifier-reflection-continue-btn");
    const classifierReflectionStartBtn = document.getElementById("classifier-reflection-start-btn");
    const classifierJourney = document.getElementById("classifier-journey");
    const classifierJourneySteps = Array.from(document.querySelectorAll("[data-step-target]"));
    const classifierJourneyTrack = document.querySelector(".classifier-journey-steps");
    const classifierStepTrack = document.getElementById("classifier-step-track");
    const classifierScreens = Array.from(document.querySelectorAll(".classifier-screen"));

    const canvas = document.getElementById("draw");
    const ctx = canvas.getContext("2d");

    let selectedClasses = new Set();
    let selectedClassOrder = [];
    let selectedDoodles = new Set();
    let history = [];
    let redoHistory = [];
    let placeholderImage = null;
    let drawing = false;
    let strokeMoved = false;
    let activeCanvasPointerId = null;
    let hasDrawn = false;
    let trainingInterval = null;
    let trainingInProgress = false;
    let modelReady = false;
    let trainedBrowserModel = null;
    let trainingStatusKey = "imageClassifierPreparingData";
    let predictionPlaceholderKey = "imageClassifierTrainAndDraw";
    let currentStepIndex = 0;
    let currentDoodleRoundIndex = 0;
    let customDoodleCounter = 0;
    let customClassCounter = 0;
    let addDoodleTargetClassId = null;
    let addDoodleIsDrawing = false;
    let addDoodleStrokeMoved = false;
    let addDoodleHasDrawn = false;
    let classifierReflectionIndex = 0;
    let classifierReflectionCompleted = false;
    let classifierReflectionOpen = false;
    let classifierReflectionStarted = false;
    let classifierReflectionAvailable = false;
    let classifierHasPredictionResult = false;
    let classifierReflectionEliminated = {};
    let testingSuggestionClassId = "";
    let testingSuggestionClassSignature = "";
    const classifierImageSize = 64;
    const doodlePanelScrollTopByClass = new Map();
    const deleteDoodleIconMarkup = `<span class="doodle-delete-mark" aria-hidden="true">x</span>`;
    const predictionHelpChartColors = [
      "#f9c74f",
      "#f9844a",
      "#90be6d",
      "#6fa8dc",
      "#c5a3ff",
      "#f7a8b8"
    ];
    const classifierReflectionQuestions = [
      {
        key: "difference",
        questionKey: "imageClassifierReflectionDifferenceQuestion",
        correct: "examples",
        summaryKey: "imageClassifierReflectionSummaryDifference",
        options: [
          { value: "examples", labelKey: "imageClassifierReflectionDifferenceOptionExamples" },
          { value: "rules", labelKey: "imageClassifierReflectionDifferenceOptionRules" },
          { value: "shapes", labelKey: "imageClassifierReflectionDifferenceOptionShapes" }
        ]
      },
      {
        key: "helps",
        questionKey: "imageClassifierReflectionHelpsQuestion",
        correct: "clear",
        summaryKey: "imageClassifierReflectionSummaryHelps",
        options: [
          { value: "clear", labelKey: "imageClassifierReflectionHelpsOptionClear" },
          { value: "rules", labelKey: "imageClassifierReflectionHelpsOptionRules" },
          { value: "chat", labelKey: "imageClassifierReflectionHelpsOptionChat" }
        ]
      },
      {
        key: "confuse",
        questionKey: "imageClassifierReflectionConfuseQuestion",
        correct: "messy",
        summaryKey: "imageClassifierReflectionSummaryConfuse",
        options: [
          { value: "messy", labelKey: "imageClassifierReflectionConfuseOptionMessy" },
          { value: "rule", labelKey: "imageClassifierReflectionConfuseOptionRule" },
          { value: "sentences", labelKey: "imageClassifierReflectionConfuseOptionSentences" }
        ]
      }
    ];

    function getSectionLabel(section) {
      return section.customLabel || t(section.labelKey);
    }

    function formatMessage(key, values = {}) {
      return Object.entries(values).reduce((message, [name, value]) => (
        message.replace(`{${name}}`, value)
      ), t(key));
    }

    function shuffleArray(items) {
      const copy = [...items];
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1));
        [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
      }
      return copy;
    }

    function updateDocumentLanguage() {
      document.documentElement.lang = currentLang === "da" ? "da" : "en";
      document.title = t("pageTitleImageClassifier");
    }

    window.applyImageClassifierTranslations = function applyImageClassifierTranslations() {
      updateDocumentLanguage();
      classifierJourney.setAttribute("aria-label", t("imageClassifierAriaSteps"));
      resetBtn.setAttribute("aria-label", t("imageClassifierReset"));
      undoBtn.setAttribute("aria-label", t("imageClassifierUndo"));
      redoBtn.setAttribute("aria-label", t("imageClassifierRedo"));
      predictionHelpBtn.setAttribute("aria-label", t("imageClassifierPredictionHelpAria"));
      renderClassOptions();
      renderDoodleTiles();
      updateSelectionUI();
      trainingStatusEl.textContent = t(trainingStatusKey);
      updateTestingSuggestions();
      if (predictionLabelEl.textContent === t("imageClassifierNothingDetected") || predictionLabelEl.textContent === "Nothing detected") {
        predictionLabelEl.textContent = t("imageClassifierNothingDetected");
      }
      if (predictionLabelEl.textContent === "-") {
        predictionConfidenceEl.textContent = t(predictionPlaceholderKey);
      }
      if (!hasDrawn) {
        resetCanvas();
      }
      updateClassifierReflectionTrigger();
      if (classifierReflectionOpen) {
        renderClassifierReflection();
      }
    };

    function updateTestingSuggestions() {
      if (!testingSuggestionClassEl) return;

      const selectedIds = getSelectedClassIds();
      const signature = selectedIds.join("|");

      if (!selectedIds.length) {
        testingSuggestionClassId = "";
        testingSuggestionClassSignature = "";
        testingSuggestionClassEl.textContent = t("imageClassifierTryDrawingFallbackClass");
        return;
      }

      const shouldPickNewClass =
        signature !== testingSuggestionClassSignature ||
        !selectedIds.includes(testingSuggestionClassId);

      if (shouldPickNewClass) {
        testingSuggestionClassSignature = signature;
        testingSuggestionClassId = selectedIds[Math.floor(Math.random() * selectedIds.length)] || "";
      }

      const section = doodleSections.find((item) => item.id === testingSuggestionClassId);
      const label = section ? getSectionLabel(section) : "";
      testingSuggestionClassEl.textContent = label
        ? formatMessage("imageClassifierTryDrawingClass", { label })
        : t("imageClassifierTryDrawingFallbackClass");
    }

    function updateClassifierReflectionTrigger() {
      if (!classifierReflectionStartBtn) return;
      const shouldShow = classifierReflectionAvailable && classifierHasPredictionResult && !classifierReflectionCompleted && !classifierReflectionOpen;
      classifierReflectionStartBtn.classList.toggle("hidden", !shouldShow);
      classifierReflectionStartBtn.hidden = !shouldShow;
    }

    function resetClassifierReflectionState() {
      classifierReflectionIndex = 0;
      classifierReflectionEliminated = {};
      classifierReflectionQuestions.forEach((question) => {
        classifierReflectionEliminated[question.key] = new Set();
      });
    }

    function updateClassifierReflectionProgress() {
      if (!classifierReflectionProgressEl) return;
      const total = classifierReflectionQuestions.length;
      classifierReflectionProgressEl.textContent = `${Math.min(classifierReflectionIndex + 1, total)} / ${total}`;
    }

    function renderClassifierReflectionQuestion() {
      const question = classifierReflectionQuestions[classifierReflectionIndex];
      if (!question || !classifierReflectionStemEl || !classifierReflectionChoicesEl) return;

      classifierReflectionStemEl.textContent = t(question.questionKey);
      classifierReflectionChoicesEl.innerHTML = "";

      shuffleArray(question.options.map((option) => ({ ...option }))).forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "classifier-reflection-choice";
        button.dataset.questionKey = question.key;
        button.dataset.optionValue = option.value;
        button.textContent = t(option.labelKey);

        if (classifierReflectionEliminated[question.key]?.has(option.value)) {
          button.disabled = true;
          button.classList.add("is-eliminated");
          button.setAttribute("aria-disabled", "true");
        }

        button.addEventListener("click", () => handleClassifierReflectionChoice(question, option.value, button));
        classifierReflectionChoicesEl.appendChild(button);
      });
    }

    function renderClassifierReflectionSummary() {
      if (!classifierReflectionSummaryListEl) return;
      classifierReflectionSummaryListEl.innerHTML = classifierReflectionQuestions
        .map((question) => `<li class="classifier-reflection-summary-line">${t(question.summaryKey)}</li>`)
        .join("");
    }

    function renderClassifierReflection() {
      if (!classifierReflectionPopup) return;

      if (classifierReflectionIntroEl) classifierReflectionIntroEl.hidden = classifierReflectionCompleted;
      if (classifierReflectionProgressEl) classifierReflectionProgressEl.hidden = classifierReflectionCompleted;
      if (classifierReflectionQuestionEl) classifierReflectionQuestionEl.hidden = classifierReflectionCompleted;
      if (classifierReflectionSummaryEl) classifierReflectionSummaryEl.hidden = !classifierReflectionCompleted;
      if (classifierReflectionContinueBtn) classifierReflectionContinueBtn.hidden = !classifierReflectionCompleted;

      if (classifierReflectionCompleted) {
        renderClassifierReflectionSummary();
        return;
      }

      updateClassifierReflectionProgress();
      renderClassifierReflectionQuestion();
    }

    function openClassifierReflectionPopup() {
      if (!classifierReflectionPopup || classifierReflectionCompleted || classifierReflectionOpen) return;
      classifierReflectionStarted = true;
      classifierReflectionOpen = true;
      updateClassifierReflectionTrigger();
      resetClassifierReflectionState();
      renderClassifierReflection();
      classifierReflectionPopup.classList.remove("hidden");
      classifierReflectionPopup.setAttribute("aria-hidden", "false");
      window.requestAnimationFrame(() => {
        const firstChoice = classifierReflectionChoicesEl?.querySelector(".classifier-reflection-choice");
        firstChoice?.focus();
      });
    }

    function closeClassifierReflectionPopup() {
      if (!classifierReflectionPopup) return;
      classifierReflectionOpen = false;
      classifierReflectionPopup.classList.add("hidden");
      classifierReflectionPopup.setAttribute("aria-hidden", "true");
      updateClassifierReflectionTrigger();
      document.getElementById("classify-btn")?.focus();
    }

    function handleClassifierReflectionChoice(question, selectedValue, button) {
      if (classifierReflectionCompleted) return;

      if (selectedValue === question.correct) {
        classifierReflectionIndex += 1;
        if (classifierReflectionIndex >= classifierReflectionQuestions.length) {
          classifierReflectionCompleted = true;
          classifierReflectionAvailable = false;
          classifierHasPredictionResult = false;
          updateClassifierReflectionTrigger();
        }
        renderClassifierReflection();
        window.requestAnimationFrame(() => {
          if (classifierReflectionCompleted) {
            classifierReflectionContinueBtn?.focus();
            return;
          }
          const firstChoice = classifierReflectionChoicesEl?.querySelector(".classifier-reflection-choice");
          firstChoice?.focus();
        });
        return;
      }

      classifierReflectionEliminated[question.key]?.add(selectedValue);
      button.disabled = true;
      button.classList.add("is-eliminated");
      button.setAttribute("aria-disabled", "true");
    }

    renderClassOptions();
    renderDoodleTiles();
    loadDatasetDoodles();
    updateSelectionUI();
    updateModelStatus(t("imageClassifierWaitingForTraining"), t("imageClassifierNotConnected"), "-");
    resetCanvas();
    setPredictionPlaceholder();
    setCanvasAvailability(false);
    goToStep(0, { force: true });
    applyTranslations();

    canvas.addEventListener("pointerdown", startDrawing);
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerup", endDrawing);
    canvas.addEventListener("pointerleave", endDrawing);
    canvas.addEventListener("pointercancel", endDrawing);
    document.getElementById("reset-btn").addEventListener("click", handleResetCanvas);
    document.getElementById("undo-btn").addEventListener("click", handleUndo);
    document.getElementById("redo-btn").addEventListener("click", handleRedo);
    document.getElementById("classify-btn").addEventListener("click", classifyDrawing);
    trainModelBtn.addEventListener("click", trainModel);
    toDoodlesBtn.addEventListener("click", () => goToStep(1));
    backToClassesBtn.addEventListener("click", () => goToStep(0, { force: true }));
    backToDoodlesBtn.addEventListener("click", () => goToStep(1, { force: true }));
    prevDoodleRoundBtn.addEventListener("click", () => goToDoodleRound(currentDoodleRoundIndex - 1));
    nextDoodleRoundBtn.addEventListener("click", handleNextDoodleRoundAction);
    cancelAddDoodleBtn.addEventListener("click", closeAddDoodlePopup);
    confirmAddDoodleBtn.addEventListener("click", commitCustomDoodle);
    classifierReflectionContinueBtn?.addEventListener("click", closeClassifierReflectionPopup);
    classifierReflectionStartBtn?.addEventListener("click", openClassifierReflectionPopup);
    cancelCustomClassBtn.addEventListener("click", closeCustomClassPopup);
    confirmCustomClassBtn.addEventListener("click", commitCustomClassName);
    trainingPopupContinueBtn.addEventListener("click", continueFromTrainingPopup);
    predictionHelpBtn.addEventListener("click", openPredictionHelpPopup);
    closePredictionHelpBtn.addEventListener("click", closePredictionHelpPopup);
    addDoodlePopup.addEventListener("click", (event) => {
      if (event.target === addDoodlePopup) {
        closeAddDoodlePopup();
      }
    });
    customClassPopup.addEventListener("click", (event) => {
      if (event.target === customClassPopup) {
        closeCustomClassPopup();
      }
    });
    predictionHelpPopup.addEventListener("click", (event) => {
      if (event.target === predictionHelpPopup) {
        closePredictionHelpPopup();
      }
    });
    document.addEventListener("keydown", handleAddDoodlePopupKeydown);
    classifierJourneySteps.forEach((button) => {
      button.addEventListener("click", () => goToStep(Number(button.dataset.stepTarget)));
    });
    setupAddDoodleCanvas();

    function renderClassOptions() {
      const addTileMarkup = `
        <div class="class-option-shell">
          <button class="class-option class-option-custom class-option-add" type="button" data-add-class="true" aria-label="${t("imageClassifierCustomClassTitle")}">
            <span class="class-option-add-mark" aria-hidden="true">${t("imageClassifierClassCustom")}</span>
          </button>
        </div>
      `;

      classPicker.innerHTML = doodleSections.map((section) => {
        const active = selectedClasses.has(section.id) ? " active" : "";
        const customClass = section.isCustomClass ? " class-option-custom" : "";
        return `
          <div class="class-option-shell">
            <button class="class-option${active}${customClass}" type="button" data-class-id="${section.id}" aria-pressed="${selectedClasses.has(section.id) ? "true" : "false"}">
              <span class="class-option-check" aria-hidden="true"></span>
              ${getSectionLabel(section)}
            </button>
            ${section.isCustomClass ? `
              <button class="class-option-delete-btn" type="button" data-delete-class-id="${section.id}" aria-label="${t("imageClassifierDeleteCustomClass")}">
                <span class="class-option-delete-mark" aria-hidden="true">x</span>
              </button>
            ` : ""}
          </div>
        `;
      }).join("") + addTileMarkup;

      classPicker.querySelectorAll("[data-class-id]").forEach((button) => {
        button.addEventListener("click", () => toggleClassSelection(button.dataset.classId));
      });
      classPicker.querySelectorAll("[data-add-class]").forEach((button) => {
        button.addEventListener("click", openCustomClassPopup);
      });
      classPicker.querySelectorAll("[data-delete-class-id]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          removeCustomClass(button.dataset.deleteClassId);
        });
      });
    }

    function renderDoodleTiles() {
      const visibleSections = getSelectedSectionsInOrder();
      clampCurrentDoodleRound(visibleSections.length);

      if (!visibleSections.length) {
        doodleBrowser.innerHTML = `<div class="empty-browser">${t("imageClassifierChooseClassesAbove")}</div>`;
        updateDoodleRoundUI(visibleSections);
        return;
      }

      doodleBrowser.innerHTML = `
        <div class="doodle-round-viewport">
          <div class="doodle-round-track" style="transform: translateX(-${currentDoodleRoundIndex * 100}%);">
            ${visibleSections.map((section, index) => `
              <section class="doodle-section doodle-round-panel" aria-labelledby="section-${section.id}" aria-hidden="${index === currentDoodleRoundIndex ? "false" : "true"}">
                <div class="doodle-section-header">
                  <h3 id="section-${section.id}" class="doodle-section-title">
                    <span class="doodle-section-label">${getSectionLabel(section).toLowerCase()}</span>
                    <span class="doodle-round-tools">
                      <button class="classifier-secondary-btn doodle-tool-btn" type="button" data-doodle-tool="select-all" data-i18n="imageClassifierSelectAllForClass">${t("imageClassifierSelectAllForClass")}</button>
                      <button class="classifier-secondary-btn doodle-tool-btn" type="button" data-doodle-tool="clear-class" data-i18n="imageClassifierClearClass">${t("imageClassifierClearClass")}</button>
                    </span>
                  </h3>
                </div>
                <div class="doodle-round-scroll-shell">
                  <div class="doodle-round-panel-inner" data-scroll-class="${section.id}">
                    <div class="doodle-grid">
                      ${section.samples.map((sample) => {
                        const selected = selectedDoodles.has(sample.id) ? " selected" : "";
                        return `
                          <div class="doodle-tile-shell${sample.isCustom ? " has-delete" : ""}">
                            <button class="doodle-tile${selected}" type="button" data-doodle-id="${sample.id}" aria-pressed="${selected ? "true" : "false"}">
                              <span class="doodle-check" aria-hidden="true"></span>
                              <div class="doodle-preview">${getDoodlePreviewMarkup(sample)}</div>
                            </button>
                            ${sample.isCustom ? `
                              <button class="doodle-delete-btn" type="button" data-delete-doodle-id="${sample.id}" aria-label="${t("imageClassifierDeleteCustomDoodle")}">
                                ${deleteDoodleIconMarkup}
                              </button>
                            ` : ""}
                          </div>
                        `;
                      }).join("")}
                      <button class="doodle-tile doodle-add-tile" type="button" data-add-doodle-for="${section.id}" aria-label="${t("imageClassifierAddDoodleAria")}">
                        <div class="doodle-add-mark" aria-hidden="true">+</div>
                      </button>
                    </div>
                  </div>
                  <div class="doodle-scrollbar" aria-hidden="true">
                    <div class="doodle-scrollbar-thumb"></div>
                  </div>
                </div>
              </section>
            `).join("")}
          </div>
        </div>
      `;

      doodleBrowser.querySelectorAll("[data-doodle-id]").forEach((tile) => {
        tile.addEventListener("click", () => toggleDoodle(tile.dataset.doodleId));
      });
      doodleBrowser.querySelectorAll("[data-add-doodle-for]").forEach((button) => {
        button.addEventListener("click", () => openAddDoodlePopup(button.dataset.addDoodleFor));
      });
      doodleBrowser.querySelectorAll("[data-delete-doodle-id]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          removeCustomDoodle(button.dataset.deleteDoodleId);
        });
      });
      doodleBrowser.querySelectorAll('[data-doodle-tool="select-all"]').forEach((button) => {
        button.addEventListener("click", selectAllForCurrentClass);
      });
      doodleBrowser.querySelectorAll('[data-doodle-tool="clear-class"]').forEach((button) => {
        button.addEventListener("click", clearCurrentClassSelections);
      });

      setupDoodleScrollbars();
      syncDoodleRoundTrack();
      updateDoodleRoundUI(visibleSections);
    }

    function toggleClassSelection(classId) {
      invalidateTrainedModel();

      if (selectedClasses.has(classId)) {
        selectedClasses.delete(classId);
        selectedClassOrder = selectedClassOrder.filter((id) => id !== classId);
        if (addDoodleTargetClassId === classId) {
          closeAddDoodlePopup();
        }
        [...selectedDoodles].forEach((sampleId) => {
          const sample = findSampleById(sampleId);
          if (sample && sample.labelId === classId) {
            selectedDoodles.delete(sampleId);
          }
        });
      } else {
        selectedClasses.add(classId);
        selectedClassOrder.push(classId);
      }

      clampCurrentDoodleRound(selectedClassOrder.length);
      renderClassOptions();
      renderDoodleTiles();
      updateSelectionUI();
    }

    async function loadDatasetDoodles() {
      const loadableSections = doodleSections.filter((section) => section.datasetPath);

      await Promise.all(loadableSections.map(async (section) => {
        try {
          const response = await fetch(section.datasetPath);
          if (!response.ok) {
            throw new Error("Failed to load " + section.datasetPath);
          }

          const extraSamplesToLoad = Array.isArray(section.skippedSampleIndexes)
            ? section.skippedSampleIndexes.length
            : 0;
          const drawings = section.datasetType === "json"
            ? parseQuickDrawJson(await response.json(), section.samples.length + extraSamplesToLoad)
            : parseQuickDrawBinary(await response.arrayBuffer(), section.samples.length + extraSamplesToLoad);
          const skippedIndexes = new Set(section.skippedSampleIndexes || []);

          section.samples = section.samples.map((sample, index) => {
            const sourceIndex = index + [...skippedIndexes].filter((skippedIndex) => skippedIndex <= index).length;
            const drawing = drawings[sourceIndex];
            if (!drawing) return sample;

            return {
              ...sample,
              previewImage: renderQuickDrawPreview(drawing)
            };
          });
        } catch (error) {
          // Keep text placeholders when the local file cannot be fetched.
        }
      }));

      renderDoodleTiles();
    }

    function getDoodlePreviewMarkup(sample) {
      if (sample.previewImage) {
        return `<img src="${sample.previewImage}" alt="" />`;
      }

      return sample.preview;
    }

    function openAddDoodlePopup(classId) {
      if (trainingInProgress) return;

      const section = doodleSections.find((item) => item.id === classId);
      if (!section) return;

      addDoodleTargetClassId = classId;
      addDoodlePopupCopyEl.textContent = formatMessage("imageClassifierAddDoodlePrompt", {
        label: getSectionLabel(section)
      });
      resetAddDoodleCanvas();
      addDoodlePopup.classList.remove("hidden");
      addDoodlePopup.setAttribute("aria-hidden", "false");
    }

    function openCustomClassPopup() {
      customClassNameInput.value = "";
      customClassPopup.classList.remove("hidden");
      customClassPopup.setAttribute("aria-hidden", "false");
      window.setTimeout(() => customClassNameInput.focus(), 0);
    }

    function closeCustomClassPopup() {
      customClassPopup.classList.add("hidden");
      customClassPopup.setAttribute("aria-hidden", "true");
      customClassNameInput.value = "";
    }

    function closeAddDoodlePopup() {
      addDoodleTargetClassId = null;
      addDoodlePopup.classList.add("hidden");
      addDoodlePopup.setAttribute("aria-hidden", "true");
      addDoodleIsDrawing = false;
    }

    function openPredictionHelpPopup() {
      const helpState = getPredictionHelpState();
      predictionHelpPopupCopyEl.textContent = helpState.message;
      predictionHelpPopupExtraEl.classList.toggle("hidden", helpState.type !== "balance");
      renderPredictionHelpVisual(helpState);
      predictionHelpPopup.classList.remove("hidden");
      predictionHelpPopup.setAttribute("aria-hidden", "false");
      window.setTimeout(() => closePredictionHelpBtn.focus(), 0);
    }

    function closePredictionHelpPopup() {
      predictionHelpPopup.classList.add("hidden");
      predictionHelpPopup.setAttribute("aria-hidden", "true");
    }

    function getPredictionHelpState() {
      const labelGroups = getSelectedLabelGroups();
      if (labelGroups.length >= 2) {
        const sortedGroups = [...labelGroups].sort((a, b) => {
          if (a.count === b.count) {
            return doodleSections.findIndex((section) => section.id === a.labelId)
              - doodleSections.findIndex((section) => section.id === b.labelId);
          }
          return a.count - b.count;
        });
        const smallestGroup = sortedGroups[0];
        const largestGroup = sortedGroups[sortedGroups.length - 1];

        if (largestGroup.count > 0 && (smallestGroup.count / largestGroup.count) < (2 / 3)) {
          const targetCount = Math.ceil(largestGroup.count * (2 / 3));
          const exactMissingCount = Math.max(1, targetCount - smallestGroup.count);
          const suggestedCount = exactMissingCount <= 2
            ? exactMissingCount
            : Math.ceil(exactMissingCount / 5) * 5;
          const messageKey = suggestedCount === 1
            ? "imageClassifierPredictionHelpBalanceOne"
            : "imageClassifierPredictionHelpBalanceMany";

          return {
            type: "balance",
            message: formatMessage(messageKey, {
              count: suggestedCount,
              label: smallestGroup.label
            }),
            groups: labelGroups,
            focusLabelId: smallestGroup.labelId
          };
        }
      }

      return {
        type: "clarity",
        message: t("imageClassifierPredictionHelpClarity"),
        groups: []
      };
    }

    function renderPredictionHelpVisual(helpState) {
      if (helpState.type !== "balance" || !helpState.groups.length) {
        predictionHelpVisualEl.classList.add("hidden");
        predictionHelpVisualEl.setAttribute("aria-hidden", "true");
        predictionHelpStackedBarEl.innerHTML = "";
        return;
      }

      const chartGroups = [...helpState.groups].sort((a, b) => {
        return doodleSections.findIndex((section) => section.id === a.labelId)
          - doodleSections.findIndex((section) => section.id === b.labelId);
      });
      const totalCount = chartGroups.reduce((sum, group) => sum + group.count, 0);
      const insideLabelThreshold = 22;
      let currentOffset = 0;
      const segmentMarkup = [];
      const calloutMarkup = [];

      chartGroups.forEach((group, index) => {
        const color = predictionHelpChartColors[index % predictionHelpChartColors.length];
        const widthPercent = totalCount > 0 ? (group.count / totalCount) * 100 : 0;
        const centerPercent = currentOffset + (widthPercent / 2);
        const labelClass = widthPercent >= insideLabelThreshold
          ? "prediction-help-stacked-label is-inside"
          : "prediction-help-stacked-label is-callout";

        segmentMarkup.push(`
          <div class="prediction-help-stacked-segment" style="width:${widthPercent.toFixed(2)}%; background:${color};">
            ${widthPercent >= insideLabelThreshold ? `<span class="${labelClass}">${group.label}</span>` : ""}
          </div>
        `);

        if (widthPercent < insideLabelThreshold) {
          calloutMarkup.push(`
            <div class="${labelClass}" style="left:${centerPercent.toFixed(2)}%;">
              <span class="prediction-help-callout-text">${group.label}</span>
              <span class="prediction-help-callout-line" aria-hidden="true"></span>
            </div>
          `);
        }

        currentOffset += widthPercent;
      });

      predictionHelpStackedBarEl.innerHTML = `
        <div class="prediction-help-stacked-callouts" aria-hidden="true">
          ${calloutMarkup.join("")}
        </div>
        <div class="prediction-help-stacked-track" aria-hidden="true">
          ${segmentMarkup.join("")}
        </div>
      `;
      predictionHelpVisualEl.classList.remove("hidden");
      predictionHelpVisualEl.setAttribute("aria-hidden", "false");
    }

    function handleAddDoodlePopupKeydown(event) {
      if (event.key === "Escape") {
        if (!addDoodlePopup.classList.contains("hidden")) {
          closeAddDoodlePopup();
        }
        if (!customClassPopup.classList.contains("hidden")) {
          closeCustomClassPopup();
        }
        if (!predictionHelpPopup.classList.contains("hidden")) {
          closePredictionHelpPopup();
        }
      }

      if (event.key === "Enter" && !customClassPopup.classList.contains("hidden") && document.activeElement === customClassNameInput) {
        event.preventDefault();
        commitCustomClassName();
      }
    }

    function commitCustomClassName() {
      const trimmedName = customClassNameInput.value.trim();
      if (!trimmedName) return;

      invalidateTrainedModel();
      const customClassId = `custom-${++customClassCounter}`;
      doodleSections.push({
        id: customClassId,
        labelKey: "imageClassifierClassCustom",
        customLabel: trimmedName,
        isCustomClass: true,
        samples: []
      });
      selectedClasses.add(customClassId);
      selectedClassOrder.push(customClassId);
      closeCustomClassPopup();
      renderClassOptions();
      renderDoodleTiles();
      updateSelectionUI();
    }

    function removeCustomClass(classId) {
      invalidateTrainedModel();
      selectedClasses.delete(classId);
      selectedClassOrder = selectedClassOrder.filter((id) => id !== classId);
      [...selectedDoodles].forEach((sampleId) => {
        const sample = findSampleById(sampleId);
        if (sample && sample.labelId === classId) {
          selectedDoodles.delete(sampleId);
        }
      });
      const customSectionIndex = doodleSections.findIndex((section) => section.id === classId);
      if (customSectionIndex !== -1) {
        doodleSections.splice(customSectionIndex, 1);
      }
      if (addDoodleTargetClassId === classId) {
        closeAddDoodlePopup();
      }
      closeCustomClassPopup();
      renderClassOptions();
      renderDoodleTiles();
      updateSelectionUI();
    }

    function resetAddDoodleCanvas() {
      addDoodleCtx.fillStyle = "white";
      addDoodleCtx.fillRect(0, 0, addDoodleCanvas.width, addDoodleCanvas.height);
      addDoodleCtx.strokeStyle = "#111111";
      addDoodleCtx.fillStyle = "#111111";
      addDoodleCtx.lineCap = "round";
      addDoodleCtx.lineJoin = "round";
      addDoodleCtx.lineWidth = 9;
      addDoodleHasDrawn = false;
      addDoodleStrokeMoved = false;
      confirmAddDoodleBtn.disabled = true;
    }

    function setupAddDoodleCanvas() {
      addDoodleCanvas.addEventListener("pointerdown", startAddDoodleStroke);
      addDoodleCanvas.addEventListener("pointermove", moveAddDoodleStroke);
      addDoodleCanvas.addEventListener("pointerup", endAddDoodleStroke);
      addDoodleCanvas.addEventListener("pointerleave", endAddDoodleStroke);
      addDoodleCanvas.addEventListener("pointercancel", endAddDoodleStroke);
    }

    function startAddDoodleStroke(event) {
      if (addDoodlePopup.classList.contains("hidden")) return;

      addDoodleIsDrawing = true;
      addDoodleStrokeMoved = false;
      addDoodleCanvas.setPointerCapture(event.pointerId);
      const { x, y } = getAddDoodleCanvasPoint(event);
      addDoodleCtx.beginPath();
      addDoodleCtx.moveTo(x, y);
    }

    function moveAddDoodleStroke(event) {
      if (!addDoodleIsDrawing) return;

      addDoodleStrokeMoved = true;
      const { x, y } = getAddDoodleCanvasPoint(event);
      addDoodleCtx.lineTo(x, y);
      addDoodleCtx.stroke();
      addDoodleHasDrawn = true;
      confirmAddDoodleBtn.disabled = false;
    }

    function endAddDoodleStroke(event) {
      if (!addDoodleIsDrawing) return;

      if (!addDoodleStrokeMoved) {
        const { x, y } = getAddDoodleCanvasPoint(event);
        addDoodleCtx.beginPath();
        addDoodleCtx.arc(x, y, addDoodleCtx.lineWidth * 0.38, 0, Math.PI * 2);
        addDoodleCtx.fill();
        addDoodleHasDrawn = true;
        confirmAddDoodleBtn.disabled = false;
      }

      addDoodleIsDrawing = false;
      addDoodleCtx.beginPath();

      if (typeof event.pointerId === "number" && addDoodleCanvas.hasPointerCapture(event.pointerId)) {
        addDoodleCanvas.releasePointerCapture(event.pointerId);
      }
    }

    function getAddDoodleCanvasPoint(event) {
      const rect = addDoodleCanvas.getBoundingClientRect();
      const scaleX = addDoodleCanvas.width / rect.width;
      const scaleY = addDoodleCanvas.height / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    }

    function commitCustomDoodle() {
      if (!addDoodleTargetClassId || !addDoodleHasDrawn) return;

      const section = doodleSections.find((item) => item.id === addDoodleTargetClassId);
      if (!section) return;

      invalidateTrainedModel();
      const previewImage = addDoodleCanvas.toDataURL("image/png");
      const sample = {
        id: `${addDoodleTargetClassId}-custom-${Date.now()}-${customDoodleCounter++}`,
        preview: "CUSTOM",
        previewImage,
        isCustom: true
      };

      section.samples.push(sample);
      closeAddDoodlePopup();
      renderDoodleTiles();
      updateSelectionUI();
    }

    function removeCustomDoodle(sampleId) {
      const section = doodleSections.find((item) => item.samples.some((sample) => sample.id === sampleId && sample.isCustom));
      if (!section) return;

      invalidateTrainedModel();
      section.samples = section.samples.filter((sample) => sample.id !== sampleId);
      selectedDoodles.delete(sampleId);
      renderDoodleTiles();
      updateSelectionUI();
    }

    function toggleDoodle(id) {
      invalidateTrainedModel();

      if (selectedDoodles.has(id)) {
        selectedDoodles.delete(id);
      } else {
        selectedDoodles.add(id);
      }

      renderDoodleTiles();
      updateSelectionUI();
    }

    function clearSelection() {
      invalidateTrainedModel();
      selectedClasses.clear();
      selectedClassOrder = [];
      selectedDoodles.clear();
      for (let index = doodleSections.length - 1; index >= 0; index -= 1) {
        if (doodleSections[index].isCustomClass) {
          doodleSections.splice(index, 1);
        } else {
          doodleSections[index].samples = doodleSections[index].samples.filter((sample) => !sample.isCustom);
        }
      }
      closeAddDoodlePopup();
      closeCustomClassPopup();
      currentDoodleRoundIndex = 0;
      renderClassOptions();
      renderDoodleTiles();
      updateSelectionUI();
    }

    function updateSelectionUI() {
      const {
        classCount,
        doodleCount,
        hasEnoughClasses,
        hasSamplesForEachClass
      } = getSelectionState();
      const hintText = !hasEnoughClasses
        ? t("imageClassifierPickAtLeastTwo")
        : hasSamplesForEachClass
          ? ""
          : t("imageClassifierPickDoodlesForEach");

      selectionCountEl.textContent = "";
      selectionHintEl.textContent = "";
      const selectedTagsMarkup = getSelectedClassLabels()
        .map((label) => `<span class="model-tag">${label}</span>`)
        .join("");

      if (trainingReviewTagsEl) {
        trainingReviewTagsEl.innerHTML = selectedTagsMarkup;
      }
      if (trainingReviewCountEl) {
        trainingReviewCountEl.textContent = formatMessage("imageClassifierDoodlesReadyForTraining", {
          doodles: doodleCount
        });
      }
      if (trainingReviewHintEl) {
        trainingReviewHintEl.textContent = hintText;
      }

      trainModelBtn.disabled = !hasEnoughClasses || !hasSamplesForEachClass || trainingInProgress;
      toDoodlesBtn.disabled = classCount < 2 || trainingInProgress;
      if (classStepEl) {
        classStepEl.classList.add("classifier-step-active");
      }
      if (doodleStepEl) {
        const doodlesUnlocked = classCount > 0;
        doodleStepEl.classList.toggle("classifier-step-locked", !doodlesUnlocked);
        doodleStepEl.classList.toggle("classifier-step-active", doodlesUnlocked);
      }
      updateDoodleRoundUI(getSelectedSectionsInOrder());

      if (selectedTagsEl) {
        selectedTagsEl.innerHTML = selectedTagsMarkup;
      }
      if (testingSelectedTagsEl) {
        testingSelectedTagsEl.innerHTML = selectedTagsMarkup;
      }
      updateTestingSuggestions();
      updateTrainingChecklist({ hasEnoughClasses, hasSamplesForEachClass });
      if (addDoodleTargetClassId) {
        const section = doodleSections.find((item) => item.id === addDoodleTargetClassId);
        if (section) {
          addDoodlePopupCopyEl.textContent = formatMessage("imageClassifierAddDoodlePrompt", {
            label: getSectionLabel(section)
          });
        }
      }
      syncClassifierJourney();
    }

    function getSelectionState() {
      const classCount = selectedClasses.size;
      const doodleCount = selectedDoodles.size;
      const labelGroups = getSelectedLabelGroups();
      const hasEnoughClasses = classCount >= 2;
      const hasSamplesForEachClass = classCount > 0 && labelGroups.length === classCount;

      return {
        classCount,
        doodleCount,
        labelGroups,
        hasEnoughClasses,
        hasSamplesForEachClass
      };
    }

    function getMaxUnlockedStep() {
      const { classCount, hasEnoughClasses, hasSamplesForEachClass } = getSelectionState();

      if (modelReady) return 3;
      if (hasEnoughClasses && hasSamplesForEachClass) return 2;
      if (hasEnoughClasses) return 1;
      return 0;
    }

    function goToStep(stepIndex, { force = false } = {}) {
      const clamped = Math.max(0, Math.min(classifierScreens.length - 1, stepIndex));
      currentStepIndex = force ? clamped : Math.min(clamped, getMaxUnlockedStep());
      syncClassifierJourney();
    }

    function syncClassifierJourney() {
      const maxUnlockedStep = getMaxUnlockedStep();
      currentStepIndex = Math.min(currentStepIndex, maxUnlockedStep);
      classifierStepTrack.style.transform = `translateX(-${currentStepIndex * 100}%)`;

      classifierScreens.forEach((screen, index) => {
        screen.setAttribute("aria-hidden", String(index !== currentStepIndex));
        screen.inert = index !== currentStepIndex;
      });

      classifierJourneySteps.forEach((button, index) => {
        const isLocked = index > maxUnlockedStep;
        button.disabled = isLocked;
        button.classList.toggle("is-current", index === currentStepIndex);
        button.classList.toggle("is-complete", index < currentStepIndex);
        button.classList.toggle("is-locked", isLocked);
        if (index === currentStepIndex) {
          button.setAttribute("aria-current", "step");
        } else {
          button.removeAttribute("aria-current");
        }
      });

      if (classifierJourneyTrack) {
        const progressRatio = classifierJourneySteps.length > 1
          ? (currentStepIndex / (classifierJourneySteps.length - 1))
          : 0;
        const progressPercent = progressRatio * 75;
        const progressPx = progressRatio * 16;
        classifierJourneyTrack.style.setProperty(
          "--classifier-journey-progress",
          `calc(${progressPercent}% + ${progressPx}px)`
        );
      }
    }

    function invalidateTrainedModel() {
      if (!modelReady && !trainedBrowserModel) {
        return;
      }

      if (trainedBrowserModel?.model && typeof trainedBrowserModel.model.dispose === "function") {
        trainedBrowserModel.model.dispose();
      }
      modelReady = false;
      trainedBrowserModel = null;
      trainingInProgress = false;
      updateModelStatus(
        t("imageClassifierWaitingForTraining"),
        t("imageClassifierNotConnected"),
        "-"
      );
      setCanvasAvailability(false);
      handleResetCanvas();
      setPredictionPlaceholder("imageClassifierTrainAndDraw");
    }

    function goToDoodleRound(index) {
      const visibleSections = getSelectedSectionsInOrder();
      if (!visibleSections.length) return;

      const nextIndex = Math.max(0, Math.min(visibleSections.length - 1, index));
      if (nextIndex === currentDoodleRoundIndex) return;

      currentDoodleRoundIndex = nextIndex;
      syncDoodleRoundTrack();
      updateDoodleRoundUI(visibleSections);
    }

    function handleNextDoodleRoundAction() {
      const visibleSections = getSelectedSectionsInOrder();
      if (!visibleSections.length) return;
      const activeSection = visibleSections[currentDoodleRoundIndex];
      if (!activeSection || getSelectedCountForClass(activeSection.id) === 0) return;

      const isLastRound = currentDoodleRoundIndex >= visibleSections.length - 1;
      if (isLastRound) {
        const { hasEnoughClasses, hasSamplesForEachClass } = getSelectionState();
        if (hasEnoughClasses && hasSamplesForEachClass && !trainingInProgress) {
          goToStep(2);
        }
        return;
      }

      goToDoodleRound(currentDoodleRoundIndex + 1);
    }

    function selectAllForCurrentClass() {
      const visibleSections = getSelectedSectionsInOrder();
      const activeSection = visibleSections[currentDoodleRoundIndex];
      if (!activeSection || trainingInProgress) return;

      invalidateTrainedModel();
      activeSection.samples.forEach((sample) => {
        selectedDoodles.add(sample.id);
      });
      renderDoodleTiles();
      updateSelectionUI();
    }

    function clearCurrentClassSelections() {
      const visibleSections = getSelectedSectionsInOrder();
      const activeSection = visibleSections[currentDoodleRoundIndex];
      if (!activeSection || trainingInProgress) return;

      invalidateTrainedModel();
      activeSection.samples.forEach((sample) => {
        selectedDoodles.delete(sample.id);
      });
      renderDoodleTiles();
      updateSelectionUI();
    }

    function clampCurrentDoodleRound(totalRounds) {
      if (!totalRounds) {
        currentDoodleRoundIndex = 0;
        return;
      }

      currentDoodleRoundIndex = Math.max(0, Math.min(currentDoodleRoundIndex, totalRounds - 1));
    }

    function updateDoodleRoundUI(visibleSections = getSelectedSectionsInOrder()) {
      const totalRounds = visibleSections.length;
      const hasRounds = totalRounds > 0;
      const activeSection = hasRounds ? visibleSections[currentDoodleRoundIndex] : null;
      const activeCount = activeSection ? getSelectedCountForClass(activeSection.id) : 0;
      const isLastRound = hasRounds && currentDoodleRoundIndex >= totalRounds - 1;
      const { classCount, doodleCount, hasEnoughClasses, hasSamplesForEachClass } = getSelectionState();

      if (selectionCountEl) {
        selectionCountEl.textContent = "";
      }
      doodleRoundSummaryEl.textContent = "";

      doodleBrowser.querySelectorAll('[data-doodle-tool="select-all"]').forEach((button) => {
        button.disabled = !hasRounds || trainingInProgress || activeCount >= (activeSection?.samples.length || 0);
      });
      doodleBrowser.querySelectorAll('[data-doodle-tool="clear-class"]').forEach((button) => {
        button.disabled = !hasRounds || trainingInProgress || activeCount === 0;
      });
      prevDoodleRoundBtn.hidden = !hasRounds;
      nextDoodleRoundBtn.hidden = !hasRounds;
      prevDoodleRoundBtn.disabled = !hasRounds || currentDoodleRoundIndex === 0 || trainingInProgress;
      nextDoodleRoundBtn.disabled = !hasRounds || trainingInProgress || activeCount === 0 || (isLastRound && (!hasEnoughClasses || !hasSamplesForEachClass));
      nextDoodleRoundBtn.textContent = isLastRound
        ? t("imageClassifierContinueToTraining")
        : t("imageClassifierDoneWithClass");
    }

    function updateTrainingChecklist({
      hasEnoughClasses = getSelectionState().hasEnoughClasses,
      hasSamplesForEachClass = getSelectionState().hasSamplesForEachClass
    } = {}) {
      const completedSteps = {
        classes: hasEnoughClasses,
        doodles: hasSamplesForEachClass,
        train: modelReady
      };
      const currentStep = !completedSteps.classes
        ? "classes"
        : !completedSteps.doodles
          ? "doodles"
          : !completedSteps.train
            ? "train"
            : null;

      trainingChecklistItems.forEach((item) => {
        const checkKey = item.dataset.trainingCheck;
        const isComplete = Boolean(completedSteps[checkKey]);
        item.classList.toggle("is-complete", isComplete);
        item.classList.toggle("is-active", !isComplete && checkKey === currentStep);
      });
    }

    function syncDoodleRoundTrack() {
      const roundTrack = doodleBrowser.querySelector(".doodle-round-track");
      if (!roundTrack) return;

      roundTrack.style.transform = `translateX(-${currentDoodleRoundIndex * 100}%)`;

      roundTrack.querySelectorAll(".doodle-round-panel").forEach((panel, index) => {
        panel.setAttribute("aria-hidden", String(index !== currentDoodleRoundIndex));
      });
    }

    function setupDoodleScrollbars() {
      doodleBrowser.querySelectorAll(".doodle-round-scroll-shell").forEach((shell) => {
        const scrollArea = shell.querySelector(".doodle-round-panel-inner");
        const rail = shell.querySelector(".doodle-scrollbar");
        const thumb = shell.querySelector(".doodle-scrollbar-thumb");
        if (!scrollArea || !rail || !thumb) return;

        const classId = scrollArea.dataset.scrollClass;
        if (classId && doodlePanelScrollTopByClass.has(classId)) {
          scrollArea.scrollTop = doodlePanelScrollTopByClass.get(classId);
        }

        const syncThumb = () => {
          const maxScroll = Math.max(1, scrollArea.scrollHeight - scrollArea.clientHeight);
          const trackHeight = rail.clientHeight || scrollArea.clientHeight;
          const thumbHeight = Math.max(72, (scrollArea.clientHeight / Math.max(scrollArea.scrollHeight, 1)) * trackHeight);
          const travel = Math.max(0, trackHeight - thumbHeight);
          const top = maxScroll > 0 ? (scrollArea.scrollTop / maxScroll) * travel : 0;

          thumb.style.height = `${thumbHeight}px`;
          thumb.style.transform = `translateY(${top}px)`;
          shell.classList.toggle("is-scrollable", scrollArea.scrollHeight > scrollArea.clientHeight + 1);
        };

        scrollArea.addEventListener("scroll", () => {
          if (classId) {
            doodlePanelScrollTopByClass.set(classId, scrollArea.scrollTop);
          }
          syncThumb();
        });

        thumb.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          const maxScroll = Math.max(0, scrollArea.scrollHeight - scrollArea.clientHeight);
          if (maxScroll <= 0) {
            return;
          }

          const trackHeight = rail.clientHeight || scrollArea.clientHeight;
          const thumbHeight = thumb.getBoundingClientRect().height;
          const travel = Math.max(1, trackHeight - thumbHeight);
          const startY = event.clientY;
          const startScrollTop = scrollArea.scrollTop;

          const handlePointerMove = (moveEvent) => {
            const deltaY = moveEvent.clientY - startY;
            const scrollDelta = (deltaY / travel) * maxScroll;
            scrollArea.scrollTop = Math.max(0, Math.min(maxScroll, startScrollTop + scrollDelta));
          };

          const handlePointerUp = () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("pointerup", handlePointerUp);
            window.removeEventListener("pointercancel", handlePointerUp);
          };

          window.addEventListener("pointermove", handlePointerMove);
          window.addEventListener("pointerup", handlePointerUp);
          window.addEventListener("pointercancel", handlePointerUp);
        });

        rail.addEventListener("pointerdown", (event) => {
          if (event.target === thumb) {
            return;
          }

          const rect = rail.getBoundingClientRect();
          const clickY = event.clientY - rect.top;
          const maxScroll = Math.max(0, scrollArea.scrollHeight - scrollArea.clientHeight);
          const thumbHeight = thumb.getBoundingClientRect().height;
          const travel = Math.max(1, rail.clientHeight - thumbHeight);
          const targetTop = Math.max(0, Math.min(travel, clickY - (thumbHeight / 2)));
          const targetScroll = (targetTop / travel) * maxScroll;

          scrollArea.scrollTop = targetScroll;
        });

        syncThumb();
      });
    }

    async function trainModel() {
      const { hasEnoughClasses, hasSamplesForEachClass, labelGroups } = getSelectionState();
      if (!hasEnoughClasses || !hasSamplesForEachClass || trainingInProgress) return;

      trainingInProgress = true;
      modelReady = false;
      if (trainedBrowserModel?.model && typeof trainedBrowserModel.model.dispose === "function") {
        trainedBrowserModel.model.dispose();
      }
      trainedBrowserModel = null;
      const selectedSamples = getSelectedSamples();
      const payloadSamples = getTrainingPayloadSamples();

      updateSelectionUI();
      setCanvasAvailability(false);
      setPredictionPlaceholder("imageClassifierTrainingInProgress");
      if (modelStateEl) {
        modelStateEl.textContent = t("imageClassifierTraining");
      }
      if (modelBackendEl) {
        modelBackendEl.textContent = t("imageClassifierConnecting");
      }
      trainingClassesEl.textContent = String(labelGroups.length);
      trainingSamplesEl.textContent = String(selectedSamples.length);
      trainingBackendNoteEl.textContent = "";
      trainingPopupContinueBtn.disabled = true;

      showTrainingPopup();
      setTrainingProgress(0, "imageClassifierPreparingData");

      const payload = {
        labels: getSelectedClassIds(),
        samples: payloadSamples
      };

      try {
        ensureTensorFlowAvailable();
        if (payloadSamples.length !== selectedSamples.length) {
          throw new Error("Not all selected doodles have preview images available for training.");
        }
        
        await wait(180);
        setTrainingProgress(18, "imageClassifierEncodingDoodles");

        const processedSamples = [];
        for (let index = 0; index < payload.samples.length; index++) {
          const sample = payload.samples[index];
          const pixels = await vectorizeImageDataUrl(sample.image);
          processedSamples.push({
            id: sample.id,
            label: sample.label,
            pixels
          });

          const progress = 18 + ((index + 1) / payload.samples.length) * 44;
          setTrainingProgress(progress, "imageClassifierEncodingDoodles");
        }

        await wait(120);
        setTrainingProgress(72, "imageClassifierTrainingClassifier");
        trainedBrowserModel = await buildBrowserModel(processedSamples, payload.labels, (progress) => {
          setTrainingProgress(72 + (progress * 18), "imageClassifierTrainingClassifier");
        });

        await wait(120);

        finishTraining({
          backend: t("imageClassifierBackendConnected"),
          classes: labelGroups.length,
          samples: selectedSamples.length,
          note: ""
        });
      } catch (error) {
        handleTrainingFailure(error, {
          classes: labelGroups.length,
          samples: selectedSamples.length
        });
      }
    }

    function finishTraining(details) {
      setTrainingProgress(100, "imageClassifierModelReady");
      trainingClassesEl.textContent = String(details.classes);
      trainingSamplesEl.textContent = String(details.samples);
      trainingBackendNoteEl.textContent = details.note;

      trainingInProgress = false;
      modelReady = true;
      const trainedAt = new Date().toLocaleTimeString(currentLang === "da" ? "da-DK" : "en-US", {
        hour: "2-digit",
        minute: "2-digit"
      });
      updateModelStatus(t("imageClassifierReady"), details.backend, trainedAt);
      setCanvasAvailability(true);
      handleResetCanvas();
      setPredictionPlaceholder("imageClassifierDrawThenTest");
      updateSelectionUI();
      trainingPopupContinueBtn.disabled = false;
      trainingPopupContinueBtn.focus();
    }

    function handleTrainingFailure(error, details) {
      trainingInProgress = false;
      modelReady = false;
      if (trainedBrowserModel?.model && typeof trainedBrowserModel.model.dispose === "function") {
        trainedBrowserModel.model.dispose();
      }
      setCanvasAvailability(false);
      setPredictionPlaceholder("imageClassifierTrainAndDraw");
      trainingProgressEl.style.width = "0%";
      trainingPercentEl.textContent = "0%";
      trainingStatusKey = "imageClassifierTrainingFailed";
      trainingStatusEl.textContent = t(trainingStatusKey);
      updateModelStatus(
        t("imageClassifierWaitingForTraining"),
        t("imageClassifierNotConnected"),
        "-"
      );
      trainedBrowserModel = null;
      trainingClassesEl.textContent = String(details.classes);
      trainingSamplesEl.textContent = String(details.samples);
      trainingBackendNoteEl.textContent = getTrainingErrorMessage(error);
      trainingPopupContinueBtn.disabled = true;
      updateSelectionUI();
    }

    function getTrainingErrorMessage(error) {
      if (error && typeof error.message === "string" && error.message.trim()) {
        return error.message;
      }

      return "Training failed. Make sure the selected doodles are loaded before training.";
    }

    function showTrainingPopup() {
      trainingPopup.classList.remove("hidden");
      trainingPopup.setAttribute("aria-hidden", "false");
    }

    function hideTrainingPopup() {
      trainingPopup.classList.add("hidden");
      trainingPopup.setAttribute("aria-hidden", "true");
    }

    function continueFromTrainingPopup() {
      if (trainingPopupContinueBtn.disabled || !modelReady || trainingInProgress) return;
      hideTrainingPopup();
      goToStep(3, { force: true });
      document.getElementById("classify-btn")?.focus();
    }

    function startTrainingAnimation() {}

    function stopTrainingAnimation() {}

    function setTrainingProgress(value, label) {
      const clamped = Math.max(0, Math.min(100, value));
      trainingProgressEl.style.width = clamped + "%";
      trainingPercentEl.textContent = Math.round(clamped) + "%";
      trainingStatusKey = label;
      trainingStatusEl.textContent = t(label);
    }

    function updateModelStatus(state, backend, trainedAt) {
      if (modelStateEl) {
        modelStateEl.textContent = state;
      }
      if (modelBackendEl) {
        modelBackendEl.textContent = backend;
      }
      if (modelTrainedAtEl) {
        modelTrainedAtEl.textContent = trainedAt;
      }
      if (testingModelStateEl) {
        testingModelStateEl.textContent = state;
      }
      if (testingModelBackendEl) {
        testingModelBackendEl.textContent = backend;
      }
      if (testingModelTrainedAtEl) {
        testingModelTrainedAtEl.textContent = trainedAt;
      }
    }

    function setCanvasAvailability(enabled) {
      canvasCard.classList.toggle("locked", !enabled);
      document.querySelectorAll("#reset-btn, #undo-btn, #redo-btn, #classify-btn").forEach((button) => {
        button.disabled = !enabled;
      });
      undoBtn.disabled = !enabled || history.length <= 1;
      redoBtn.disabled = !enabled || redoHistory.length === 0;
    }

    function handleResetCanvas() {
      hasDrawn = false;
      resetCanvas();
    }

    function resetCanvas() {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#7b7b7b";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "2rem Caroni, sans-serif";
      ctx.fillText(modelReady ? t("imageClassifierDrawHere") : t("imageClassifierTrainFirst"), canvas.width / 2, canvas.height / 2);

      const initialState = ctx.getImageData(0, 0, canvas.width, canvas.height);
      placeholderImage = initialState;
      history = [initialState];
      redoHistory = [];
      ctx.beginPath();
      undoBtn.disabled = !modelReady || history.length <= 1;
      redoBtn.disabled = !modelReady || redoHistory.length === 0;
    }

    function startDrawing(event) {
      if (!modelReady) return;
      event.preventDefault();

      if (!hasDrawn) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        hasDrawn = true;
      }

      drawing = true;
      strokeMoved = false;
      activeCanvasPointerId = typeof event.pointerId === "number" ? event.pointerId : null;
      if (typeof event.pointerId === "number" && canvas.setPointerCapture) {
        canvas.setPointerCapture(event.pointerId);
      }

      const { x, y } = getCanvasPoint(event);

      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function draw(event) {
      if (!drawing || !modelReady) return;
      if (activeCanvasPointerId !== null && typeof event.pointerId === "number" && event.pointerId !== activeCanvasPointerId) {
        return;
      }
      event.preventDefault();

      const { x, y } = getCanvasPoint(event);

      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "black";

      strokeMoved = true;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    function endDrawing(event) {
      if (!drawing) return;
      if (activeCanvasPointerId !== null && typeof event?.pointerId === "number" && event.pointerId !== activeCanvasPointerId) {
        return;
      }
      if (event) {
        event.preventDefault();
      }

      let strokeCommitted = strokeMoved;
      if (!strokeMoved && modelReady && event) {
        const { x, y } = getCanvasPoint(event);
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        hasDrawn = true;
        strokeCommitted = true;
      }

      if (strokeCommitted) {
        history.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (history.length > 20) history.shift();
        redoHistory = [];
      }

      drawing = false;
      if (typeof event?.pointerId === "number" && canvas.hasPointerCapture?.(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }
      activeCanvasPointerId = null;
      ctx.beginPath();
      undoBtn.disabled = !modelReady || history.length <= 1;
      redoBtn.disabled = !modelReady || redoHistory.length === 0;
    }

    function handleUndo() {
      if (!modelReady || history.length <= 1) return;

      const currentState = history.pop();
      redoHistory.push(currentState);

      const previousState = history[history.length - 1];
      ctx.putImageData(previousState, 0, 0);
      hasDrawn = !isSameImageData(previousState, placeholderImage);
      undoBtn.disabled = !modelReady || history.length <= 1;
      redoBtn.disabled = !modelReady || redoHistory.length === 0;
    }

    function handleRedo() {
      if (!modelReady || redoHistory.length === 0) return;

      const redoneState = redoHistory.pop();
      history.push(redoneState);
      ctx.putImageData(redoneState, 0, 0);
      hasDrawn = !isSameImageData(redoneState, placeholderImage);
      undoBtn.disabled = !modelReady || history.length <= 1;
      redoBtn.disabled = !modelReady || redoHistory.length === 0;
    }

    async function classifyDrawing() {
      if (!modelReady || !trainedBrowserModel) return;

      if (!hasDrawn) {
        setPredictionPlaceholder("imageClassifierDrawSomethingFirst");
        return;
      }

      predictionLabelEl.textContent = t("imageClassifierTestingProgress");
      predictionConfidenceEl.textContent = "";
      if (predictionOtherHeadingEl) {
        predictionOtherHeadingEl.hidden = true;
      }
      if (predictionRankedListEl) {
        predictionRankedListEl.innerHTML = "";
      }

      try {
        await wait(120);
        const result = await predictWithBrowserModel(vectorizeCanvasElement(canvas));
        showPrediction({
          label: formatLabel(result.label || "unknown"),
          confidence: typeof result.confidence === "number" ? result.confidence : null,
          rankedProbabilities: Array.isArray(result.probabilities)
            ? result.probabilities.map((item) => ({
                label: formatLabel(item.label || "unknown"),
                probability: item.probability
              }))
            : []
        });
      } catch (error) {
        predictionLabelEl.textContent = "-";
        predictionConfidenceEl.textContent = error.message || t("imageClassifierPredictionFallback");
        if (predictionOtherHeadingEl) {
          predictionOtherHeadingEl.hidden = true;
        }
        if (predictionRankedListEl) {
          predictionRankedListEl.innerHTML = "";
        }
      }
    }

    function showPrediction(result) {
      predictionLabelEl.textContent = result.label;
      if (typeof result.confidence === "number") {
        predictionConfidenceEl.textContent = Math.round(result.confidence * 100) + "%";
      } else {
        predictionConfidenceEl.textContent = "";
      }

      if (predictionRankedListEl) {
        const otherPredictions = (result.rankedProbabilities || []).filter((item) => item.label !== result.label);
        if (predictionOtherHeadingEl) {
          predictionOtherHeadingEl.hidden = otherPredictions.length === 0;
        }
        predictionRankedListEl.innerHTML = otherPredictions
          .map((item) => `
            <div class="prediction-ranked-item">
              <span class="prediction-ranked-label">${item.label}</span>
              <span class="prediction-ranked-value">${Math.round(item.probability * 100)}%</span>
            </div>
          `)
          .join("");
      }

      if (!classifierReflectionStarted && !classifierReflectionCompleted) {
        classifierHasPredictionResult = true;
        classifierReflectionAvailable = true;
        updateClassifierReflectionTrigger();
      }
    }

    function setPredictionPlaceholder(messageKey = "imageClassifierTrainAndDraw") {
      predictionPlaceholderKey = messageKey;
      classifierHasPredictionResult = false;
      if (!classifierReflectionOpen && !classifierReflectionCompleted) {
        classifierReflectionAvailable = false;
        updateClassifierReflectionTrigger();
      }
      predictionLabelEl.textContent = "-";
      predictionConfidenceEl.textContent = "";
      if (predictionOtherHeadingEl) {
        predictionOtherHeadingEl.hidden = true;
      }
      if (predictionRankedListEl) {
        predictionRankedListEl.innerHTML = messageKey === "imageClassifierDrawThenTest"
          ? ""
          : `<div class="prediction-placeholder-text">${t(messageKey)}</div>`;
      }
    }

    function getCanvasPoint(event) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY
      };
    }

    function formatLabel(value) {
      const section = doodleSections.find((item) => item.id === value);
      if (section) return getSectionLabel(section);
      return value.charAt(0).toUpperCase() + value.slice(1);
    }

    function getSelectedSamples() {
      return [...selectedDoodles]
        .map((id) => findSampleById(id))
        .filter(Boolean);
    }

    function findSampleById(id) {
      for (const section of doodleSections) {
        const sample = section.samples.find((item) => item.id === id);
        if (sample) {
          return {
            ...sample,
            labelId: section.id,
            label: getSectionLabel(section)
          };
        }
      }

      return doodleSamples.find((sample) => sample.id === id) || null;
    }

    function getTrainingPayloadSamples() {
      return getSelectedSamples()
        .filter((sample) => sample.previewImage)
        .map((sample) => ({
          id: sample.id,
          label: sample.labelId,
          image: sample.previewImage
        }));
    }

    async function vectorizeImageDataUrl(dataUrl) {
      const image = await loadImage(dataUrl);
      const offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      const offscreenCtx = offscreenCanvas.getContext("2d");
      offscreenCtx.fillStyle = "white";
      offscreenCtx.fillRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);
      offscreenCtx.drawImage(image, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      const normalizedCanvas = normalizeCanvasForClassifier(
        offscreenCtx,
        offscreenCanvas.width,
        offscreenCanvas.height,
        classifierImageSize
      );
      return extractVectorFromContext(
        normalizedCanvas.getContext("2d"),
        classifierImageSize,
        classifierImageSize
      );
    }

    function vectorizeCanvasElement(sourceCanvas) {
      const sourceCtx = sourceCanvas.getContext("2d");
      const normalizedCanvas = normalizeCanvasForClassifier(
        sourceCtx,
        sourceCanvas.width,
        sourceCanvas.height,
        classifierImageSize
      );
      return extractVectorFromContext(
        normalizedCanvas.getContext("2d"),
        classifierImageSize,
        classifierImageSize
      );
    }

    function normalizeCanvasForClassifier(sourceCtx, width, height, targetSize = 64) {
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
          const isInk = average < 200;

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

    function extractVectorFromContext(sourceCtx, width, height) {
      const image = sourceCtx.getImageData(0, 0, width, height);
      const vector = new Float32Array(width * height);

      for (let i = 0; i < width * height; i++) {
        const pixelOffset = i * 4;
        const average = (
          image.data[pixelOffset] +
          image.data[pixelOffset + 1] +
          image.data[pixelOffset + 2]
        ) / 3;
        vector[i] = 1 - (average / 255);
      }

      return Array.from(vector);
    }

    async function buildBrowserModel(samples, labels, onEpochProgress = () => {}) {
      const labelToIndex = new Map(labels.map((label, index) => [label, index]));
      const xs = tf.tensor4d(
        samples.flatMap((sample) => sample.pixels),
        [samples.length, classifierImageSize, classifierImageSize, 1]
      );
      const labelTensor = tf.tensor1d(samples.map((sample) => labelToIndex.get(sample.label)), "int32");
      const ys = tf.oneHot(labelTensor, labels.length);

      const model = createClassifierModel(labels.length);
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: "categoricalCrossentropy",
        metrics: ["accuracy"]
      });

      try {
        await model.fit(xs, ys, {
          epochs: 8,
          batchSize: Math.min(8, samples.length),
          shuffle: true,
          callbacks: {
            onEpochEnd: async (epoch) => {
              onEpochProgress((epoch + 1) / 8);
              await tf.nextFrame();
            }
          }
        });
      } catch (error) {
        model.dispose();
        throw error;
      } finally {
        xs.dispose();
        ys.dispose();
        labelTensor.dispose();
      }

      return {
        labels: [...labels],
        model
      };
    }

    async function predictWithBrowserModel(vector) {
      if (!trainedBrowserModel?.model) {
        throw new Error("No in-browser model is available yet.");
      }

      const inputTensor = tf.tensor4d(vector, [1, classifierImageSize, classifierImageSize, 1]);
      const prediction = trainedBrowserModel.model.predict(inputTensor);
      const probabilities = await prediction.data();
      const bestIndex = probabilities.reduce((best, value, index, all) => (
        value > all[best] ? index : best
      ), 0);
      const confidence = probabilities[bestIndex] ?? 0.5;

      inputTensor.dispose();
      prediction.dispose();

      return {
        label: trainedBrowserModel.labels[bestIndex] || trainedBrowserModel.labels[0],
        confidence: Math.max(0.35, Math.min(0.99, confidence)),
        probabilities: trainedBrowserModel.labels
          .map((label, index) => ({
            label,
            probability: probabilities[index] ?? 0
          }))
          .sort((a, b) => b.probability - a.probability)
      };
    }

    function createClassifierModel(classCount) {
      return tf.sequential({
        layers: [
          tf.layers.conv2d({
            inputShape: [classifierImageSize, classifierImageSize, 1],
            filters: 8,
            kernelSize: 3,
            activation: "relu",
            padding: "same"
          }),
          tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }),
          tf.layers.conv2d({
            filters: 16,
            kernelSize: 3,
            activation: "relu",
            padding: "same"
          }),
          tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }),
          tf.layers.flatten(),
          tf.layers.dense({ units: 32, activation: "relu" }),
          tf.layers.dense({ units: classCount, activation: "softmax" })
        ]
      });
    }

    function ensureTensorFlowAvailable() {
      if (typeof window.tf === "undefined") {
        throw new Error("TensorFlow.js could not be loaded, so the CNN trainer is unavailable.");
      }
    }

    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error("Could not read one of the doodle images for training."));
        image.src = src;
      });
    }

    function wait(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    }

    function getSelectedLabelGroups() {
      const groups = new Map();

      getSelectedSamples().forEach((sample) => {
        const existing = groups.get(sample.labelId);
        if (existing) {
          existing.count += 1;
        } else {
          groups.set(sample.labelId, {
            labelId: sample.labelId,
            label: sample.label,
            count: 1
          });
        }
      });

      return [...groups.values()];
    }

    function getSelectedLabels() {
      return getSelectedLabelGroups().map((group) => group.label);
    }

    function getSelectedClassIds() {
      return getSelectedSectionsInOrder().map((section) => section.id);
    }

    function getSelectedClassLabels() {
      return getSelectedSectionsInOrder().map((section) => getSectionLabel(section));
    }

    function getSelectedSectionsInOrder() {
      return doodleSections.filter((section) => selectedClasses.has(section.id));
    }

    function getSelectedCountForClass(classId) {
      const section = doodleSections.find((item) => item.id === classId);
      if (!section) return 0;

      return section.samples.filter((sample) => selectedDoodles.has(sample.id)).length;
    }

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

        for (let s = 0; s < strokeCount; s++) {
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

          for (let i = 0; i < pointCount; i++) {
            xs.push(view.getUint8(offset + i));
          }
          offset += pointCount;

          for (let i = 0; i < pointCount; i++) {
            ys.push(view.getUint8(offset + i));
          }
          offset += pointCount;

          drawing.push({ xs, ys });
        }

        if (!valid) break;
        drawings.push(drawing);
      }

      return drawings;
    }

    function parseQuickDrawJson(payload, limit) {
      const drawings = [];
      const sourceDrawings = Array.isArray(payload?.drawings) ? payload.drawings : [];

      for (const entry of sourceDrawings) {
        if (drawings.length >= limit) break;
        const drawing = convertTimedStrokeDrawing(entry?.drawing);
        if (drawing.length) {
          drawings.push(drawing);
        }
      }

      return drawings;
    }

    function convertTimedStrokeDrawing(drawing) {
      if (!Array.isArray(drawing)) {
        return [];
      }

      return drawing
        .map((stroke) => {
          if (!Array.isArray(stroke) || stroke.length < 2) {
            return null;
          }

          const [xs, ys] = stroke;
          if (!Array.isArray(xs) || !Array.isArray(ys) || !xs.length || !ys.length) {
            return null;
          }

          return { xs, ys };
        })
        .filter(Boolean);
    }

    function renderQuickDrawPreview(drawing, size = 112) {
      const previewCanvas = document.createElement("canvas");
      previewCanvas.width = size;
      previewCanvas.height = size;
      const previewCtx = previewCanvas.getContext("2d");

      previewCtx.fillStyle = "white";
      previewCtx.fillRect(0, 0, size, size);
      previewCtx.strokeStyle = "#111111";
      previewCtx.lineCap = "round";
      previewCtx.lineJoin = "round";
      previewCtx.lineWidth = 3;

      const points = [];
      drawing.forEach((stroke) => {
        for (let i = 0; i < stroke.xs.length; i++) {
          points.push({ x: stroke.xs[i], y: stroke.ys[i] });
        }
      });

      if (!points.length) {
        return previewCanvas.toDataURL("image/png");
      }

      const minX = Math.min(...points.map((point) => point.x));
      const maxX = Math.max(...points.map((point) => point.x));
      const minY = Math.min(...points.map((point) => point.y));
      const maxY = Math.max(...points.map((point) => point.y));

      const boxWidth = Math.max(1, maxX - minX);
      const boxHeight = Math.max(1, maxY - minY);
      const padding = 12;
      const drawableWidth = size - padding * 2;
      const drawableHeight = size - padding * 2;
      const scale = Math.min(drawableWidth / boxWidth, drawableHeight / boxHeight);
      const offsetX = (size - boxWidth * scale) / 2;
      const offsetY = (size - boxHeight * scale) / 2;

      drawing.forEach((stroke) => {
        if (!stroke.xs.length) return;

        previewCtx.beginPath();
        previewCtx.moveTo(
          offsetX + (stroke.xs[0] - minX) * scale,
          offsetY + (stroke.ys[0] - minY) * scale
        );

        for (let i = 1; i < stroke.xs.length; i++) {
          previewCtx.lineTo(
            offsetX + (stroke.xs[i] - minX) * scale,
            offsetY + (stroke.ys[i] - minY) * scale
          );
        }

        previewCtx.stroke();
      });

      return previewCanvas.toDataURL("image/png");
    }

    function isSameImageData(img1, img2) {
      if (!img1 || !img2 || img1.data.length !== img2.data.length) return false;

      for (let i = 0; i < img1.data.length; i++) {
        if (img1.data[i] !== img2.data[i]) return false;
      }

      return true;
    }

    function mockPredictFromCanvas() {
      const features = extractFeatures();
      const labels = getSelectedClassIds();

      if (features.empty) {
        return {
          label: t("imageClassifierNothingDetected"),
          confidence: 0.12
        };
      }

      let candidate = labels[0];

      if (features.circularity > 0.58 && labels.includes("sun")) candidate = "sun";
      else if (features.aspectRatio > 1.2 && labels.includes("fish")) candidate = "fish";
      else if (features.aspectRatio > 0.75 && features.aspectRatio < 1.25 && labels.includes("house")) candidate = "house";
      else if (features.spread > 0.68 && labels.includes("star")) candidate = "star";
      else if (features.centerBias > 0.58 && labels.includes("flower")) candidate = "flower";
      else if (features.aspectRatio > 1.4 && labels.includes("car")) candidate = "car";

      return {
        label: formatLabel(candidate),
        confidence: Math.max(0.52, Math.min(0.94, 0.55 + features.inkDensity * 0.55))
      };
    }

    function extractFeatures() {
      const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = image.data;
      const inkPixels = [];

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const i = (y * canvas.width + x) * 4;
          const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
          if (average < 220) inkPixels.push({ x, y });
        }
      }

      if (inkPixels.length === 0) {
        return { empty: true };
      }

      const xs = inkPixels.map((p) => p.x);
      const ys = inkPixels.map((p) => p.y);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      const width = maxX - minX + 1;
      const height = maxY - minY + 1;
      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const spread = inkPixels.length / (width * height);

      let centerHits = 0;
      for (const pixel of inkPixels) {
        const dx = Math.abs(pixel.x - centerX) / Math.max(1, width / 2);
        const dy = Math.abs(pixel.y - centerY) / Math.max(1, height / 2);
        if (dx + dy < 0.85) centerHits++;
      }

      return {
        empty: false,
        aspectRatio: width / Math.max(1, height),
        spread,
        inkDensity: inkPixels.length / (canvas.width * canvas.height),
        centerBias: centerHits / inkPixels.length,
        circularity: 1 - Math.abs(width - height) / Math.max(width, height)
      };
    }
  

