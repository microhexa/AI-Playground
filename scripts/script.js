const enBtn = document.getElementById("lang-en");
const daBtn = document.getElementById("lang-da");
const HOME_SCREEN_KEY = "homeScreen";
const CREDITS_MENU_MODE = "credits";
const SESSION_MENU_MODE = "session";
const LEVEL_MENU_MODE = "levels";
const PROGRESS_KEYS = ["imageClassifierUnlocked", "chatbotUnlocked"];
const LANGUAGE_STORAGE_KEY = "lang";
const IMAGE_CLASSIFIER_UNLOCK_KEY = "imageClassifierUnlocked";
const CHATBOT_UNLOCK_KEY = "chatbotUnlocked";
const PENDING_NEW_SESSION_RESET_KEY = "pendingNewSessionReset";
const SKIP_HOME_TRANSITION_KEY = "skipHomeTransition";
const LEVEL_INTRO_TYPED_PAGE_STORAGE_PREFIX = "levelIntroTypedPage";
const HOME_SCREEN_TRANSITION_MS = 420;
const LEVEL_INTRO_FADE_MS = 220;
const LEVEL_INTRO_TYPE_DELAY_MS = 180;
const LEVEL_INTRO_TYPE_SPEED_MS = 32;
const LEVEL_INTRO_COMPUTER_ANIMATION_NAME = "intro_computer";
const LEVEL_INTRO_COMPUTER_PAGE_INDEX = 2;
const HOME_QUIZ_DATASET = "./images/full_binary_house.bin";
const HOME_QUIZ_DRAWING_INDEXES = [2, 61];
const HOME_QUIZ_CORRECT_ANSWER = "house";
const MENU_DOODLE_BASE_PATH = "./images/menu-doodles";
const MENU_DOODLE_MIN_DURATION = 1400;
const MENU_DOODLE_PAUSE = 650;

const currentPath = window.location.pathname;
const isHomePage = currentPath.endsWith("index.html") || currentPath.endsWith("/");

const aboutMenu = document.getElementById("menu-about");
const homeMenu = document.getElementById("menu-home");
const curiousMenu = document.getElementById("menu-curious");
const continueMenu = document.getElementById("menu-continue");
const continueMenuSubtitle = document.getElementById("menu-continue-subtitle");
const newSessionMenu = document.getElementById("menu-new-session");
const languageMenu = document.getElementById("menu-language-option");
const languageMenuSubtitle = document.getElementById("menu-language-subtitle");
const creditsMenu = document.getElementById("menu-credits");
const creditsBackButton = document.getElementById("credits-back-button");
const levelBackButton = document.getElementById("level-back-button");
const levelIntro = document.getElementById("level-intro");
const levelIntroButton = document.getElementById("level-intro-button");
const levelIntroButtonActions = levelIntroButton?.closest(".level-intro-page-actions") || null;
const levelIntroPrevButton = document.getElementById("level-intro-prev");
const levelIntroNextButton = document.getElementById("level-intro-next");
const levelIntroPages = Array.from(document.querySelectorAll(".level-intro-page"));
const levelIntroProgressDots = Array.from(document.querySelectorAll(".level-intro-progress-dot"));
const levelIntroTypingPageIndexes = new Set([0, 1, 2, 3, 4, 5, 6]);
const LEVEL_INTRO_FINAL_PAGE_INDEX = 6;
const levelIntroComputerDoodle = document.getElementById("level-intro-computer-doodle");
const levelMenu = document.getElementById("level-menu");
const homeScreens = document.getElementById("home-screens");
const homeFocus = document.querySelector(".home-focus");
const startRuleBasedBtn = document.getElementById("start-rule-based");
const startImageClassifierBtn = document.getElementById("start-image-classifier");
const startChatbotBtn = document.getElementById("start-chatbot");
const returnBtn = document.getElementById("return-btn");
const ruleCard = document.getElementById("slot-left");
const classifierCard = document.getElementById("slot-center");
const chatbotCard = document.getElementById("slot-right");
const introLead = document.querySelector(".intro-lead");
const quizContainer = document.getElementById("micro-quiz");
const quizQuestion = document.getElementById("micro-quiz-question");
const quizCanvas = document.getElementById("micro-quiz-canvas");
const quizFeedback = document.getElementById("micro-quiz-feedback");
const quizOptionButtons = Array.from(document.querySelectorAll(".micro-quiz-option"));
const menuDoodleCanvases = Array.from(document.querySelectorAll(".menu-doodle-canvas"));

let homeMenuMode = sessionStorage.getItem(HOME_SCREEN_KEY) || SESSION_MENU_MODE;
let homeQuizStep = 0;
let homeQuizDrawings = [];
let homeQuizLoaded = false;
let homeQuizLoadingPromise = null;
let menuDoodleAnimationFrame = null;
let levelIntroTimer = null;
let levelIntroHideTimer = null;
let levelIntroPageIndex = 0;
let levelIntroTypingTimer = null;
let levelIntroTypingPageIndex = null;
let levelIntroComputerDoodleAnimationFrame = null;
let levelIntroComputerDoodleData = null;
let levelIntroComputerDoodlePlayed = false;
let shouldHighlightRuleCardAfterIntro = false;
const menuDoodleState = [];
const menuDoodleCache = new Map();
const shouldSkipInitialHomeTransition = sessionStorage.getItem(SKIP_HOME_TRANSITION_KEY) === "true";

if (shouldSkipInitialHomeTransition) {
    sessionStorage.removeItem(SKIP_HOME_TRANSITION_KEY);
}

function updateLanguageButtons() {
    if (enBtn) enBtn.classList.toggle("active", currentLang === "en");
    if (daBtn) daBtn.classList.toggle("active", currentLang === "da");
}

function setRuleCardHighlight(active) {
    if (!ruleCard) return;
    ruleCard.classList.toggle("journey-node-highlighted", active);
}

function setStoredHomeScreen(mode) {
    homeMenuMode = mode;
    sessionStorage.setItem(HOME_SCREEN_KEY, mode);
}

function hasSavedProgress() {
    return PROGRESS_KEYS.some(key => localStorage.getItem(key) === "true");
}

function hasPendingNewSessionReset() {
    return sessionStorage.getItem(PENDING_NEW_SESSION_RESET_KEY) === "true";
}

function clearLevelIntroTimers() {
    if (levelIntroTimer) {
        window.clearTimeout(levelIntroTimer);
        levelIntroTimer = null;
    }
    if (levelIntroHideTimer) {
        window.clearTimeout(levelIntroHideTimer);
        levelIntroHideTimer = null;
    }
}

function clearLevelIntroTyping(restoreFullText = false) {
    if (levelIntroTypingTimer) {
        window.clearTimeout(levelIntroTypingTimer);
        levelIntroTypingTimer = null;
    }

    levelIntroTypingPageIndex = null;

    levelIntroPages.forEach(page => {
        const textElement = page.querySelector(".level-intro-page-text");
        if (!textElement) return;
        const liveSpan = textElement.querySelector(".level-intro-page-text-live");

        if (restoreFullText) {
            getLevelIntroTypingTargets(Number(page.dataset.pageIndex)).forEach(target => {
                if (target.element && target.fullText !== undefined) {
                    target.element.textContent = target.fullText;
                }
            });
        }

        liveSpan?.remove();
        textElement.classList.remove("is-typing");
        textElement.classList.remove("is-typing-visible");
    });

    if (levelIntroComputerDoodle) {
        levelIntroComputerDoodle.classList.remove("is-hidden");
        delete levelIntroComputerDoodle.dataset.animationStartedAt;
    }

    updateLevelIntroButtonVisibility();
}

function getLevelIntroTypingStorageKey(pageIndex) {
    return `${LEVEL_INTRO_TYPED_PAGE_STORAGE_PREFIX}${pageIndex}`;
}

function resetLevelIntroTypingState() {
    levelIntroTypingPageIndexes.forEach(pageIndex => {
        sessionStorage.removeItem(getLevelIntroTypingStorageKey(pageIndex));
    });
    levelIntroComputerDoodlePlayed = false;
    stopLevelIntroComputerDoodleAnimation();
    if (levelIntroComputerDoodle) {
        const ctx = levelIntroComputerDoodle.getContext("2d");
        ctx?.clearRect(0, 0, levelIntroComputerDoodle.width, levelIntroComputerDoodle.height);
        levelIntroComputerDoodle.classList.add("is-hidden");
        delete levelIntroComputerDoodle.dataset.animationStartedAt;
    }
}

function getLevelIntroPageTextElement(pageIndex) {
    return levelIntroPages[pageIndex]?.querySelector(".level-intro-page-text") || null;
}

function stopLevelIntroComputerDoodleAnimation() {
    if (levelIntroComputerDoodleAnimationFrame) {
        window.cancelAnimationFrame(levelIntroComputerDoodleAnimationFrame);
        levelIntroComputerDoodleAnimationFrame = null;
    }
}

function getLevelIntroTypingTargets(pageIndex) {
    if (pageIndex === LEVEL_INTRO_COMPUTER_PAGE_INDEX) {
        const line1 = levelIntroPages[pageIndex]?.querySelector('[data-i18n="levelIntroPage4Line1"]');
        const line2 = levelIntroPages[pageIndex]?.querySelector('[data-i18n="levelIntroPage4Line2Prefix"]');
        const line3 = levelIntroPages[pageIndex]?.querySelector('[data-i18n="levelIntroPage4Line3"]');

        return [
            {
                element: line1,
                fullText: line1?.dataset.i18n ? t(line1.dataset.i18n) : line1?.textContent || "",
            },
            {
                element: line2,
                fullText: line2?.dataset.i18n ? t(line2.dataset.i18n) : line2?.textContent || "",
            },
            {
                element: line3,
                fullText: line3?.dataset.i18n ? t(line3.dataset.i18n) : line3?.textContent || "",
            },
        ].filter(target => target.element);
    }

    const textElement = getLevelIntroPageTextElement(pageIndex);
    if (!textElement) return [];

    return [{
        element: textElement,
        fullText: textElement.dataset.i18n ? t(textElement.dataset.i18n) : textElement.textContent || "",
    }];
}

function ensureLevelIntroTypingLiveSpan(textElement) {
    let liveSpan = textElement.querySelector(".level-intro-page-text-live");
    if (!liveSpan) {
        liveSpan = document.createElement("span");
        liveSpan.className = "level-intro-page-text-live";
        textElement.appendChild(liveSpan);
    }
    return liveSpan;
}

function escapeHtml(value) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}

function setTypingTargetProgress(targetElement, fullText, visibleCount) {
    const safeVisibleCount = Math.max(0, Math.min(fullText.length, visibleCount));
    const visibleText = escapeHtml(fullText.slice(0, safeVisibleCount)).replaceAll("\n", "<br>");
    const hiddenText = escapeHtml(fullText.slice(safeVisibleCount)).replaceAll("\n", "<br>");

    if (!hiddenText) {
        targetElement.textContent = fullText;
        return;
    }

    targetElement.innerHTML = `${visibleText}<span class="level-intro-page-text-hidden-tail">${hiddenText}</span>`;
}

function isLevelIntroTypingActive(pageIndex = levelIntroPageIndex) {
    const textElement = getLevelIntroPageTextElement(pageIndex);
    return Boolean(textElement && textElement.classList.contains("is-typing"));
}

function updateLevelIntroButtonVisibility() {
    if (!levelIntroButtonActions) return;

    const shouldHide = levelIntroPageIndex === LEVEL_INTRO_FINAL_PAGE_INDEX && isLevelIntroTypingActive(LEVEL_INTRO_FINAL_PAGE_INDEX);
    levelIntroButtonActions.classList.toggle("is-hidden", shouldHide);
}

function finishLevelIntroTypingInstantly(pageIndex = levelIntroPageIndex) {
    const textElement = getLevelIntroPageTextElement(pageIndex);
    if (!textElement || !isLevelIntroTypingActive(pageIndex)) return false;

    if (levelIntroTypingTimer) {
        window.clearTimeout(levelIntroTypingTimer);
        levelIntroTypingTimer = null;
    }

    const fullText = syncLevelIntroPageText(pageIndex);
    getLevelIntroTypingTargets(pageIndex).forEach(target => {
        if (pageIndex === LEVEL_INTRO_COMPUTER_PAGE_INDEX) {
            target.element.textContent = target.fullText;
        }
    });
    if (pageIndex !== LEVEL_INTRO_COMPUTER_PAGE_INDEX) {
        textElement.textContent = fullText;
    }
    textElement.classList.remove("is-typing");
    textElement.classList.remove("is-typing-visible");
    levelIntroTypingPageIndex = null;
    sessionStorage.setItem(getLevelIntroTypingStorageKey(pageIndex), "true");
    updateLevelIntroButtonVisibility();
    if (pageIndex === LEVEL_INTRO_COMPUTER_PAGE_INDEX && levelIntroComputerDoodle) {
        void startLevelIntroComputerDoodleAnimation();
    }
    return true;
}

function syncLevelIntroPageText(pageIndex) {
    const textElement = getLevelIntroPageTextElement(pageIndex);
    if (!textElement) return "";

    const targets = getLevelIntroTypingTargets(pageIndex);
    const fullText = targets.map(target => target.fullText).join("\n");
    textElement.dataset.fullText = fullText;
    return fullText;
}

async function ensureLevelIntroComputerDoodleData() {
    if (levelIntroComputerDoodleData) return levelIntroComputerDoodleData;

    const drawings = await loadMenuDoodleSet(LEVEL_INTRO_COMPUTER_ANIMATION_NAME);
    const drawing = drawings[0]?.drawing;
    if (!drawing) {
        throw new Error("Intro computer doodle data is missing.");
    }

    levelIntroComputerDoodleData = drawing;
    return drawing;
}

async function startLevelIntroComputerDoodleAnimation() {
    if (
        !levelIntroComputerDoodle ||
        levelIntroComputerDoodlePlayed ||
        levelIntroPageIndex !== LEVEL_INTRO_COMPUTER_PAGE_INDEX ||
        !levelIntro?.classList.contains("is-visible")
    ) {
        return;
    }

    levelIntroComputerDoodlePlayed = true;
    levelIntroComputerDoodle.classList.remove("is-hidden");

    try {
        const drawing = await ensureLevelIntroComputerDoodleData();
        const { maxTimestamp, playbackDuration } = getMenuDoodleDuration(drawing);
        stopLevelIntroComputerDoodleAnimation();

        const render = now => {
            if (levelIntroPageIndex !== LEVEL_INTRO_COMPUTER_PAGE_INDEX || !levelIntro?.classList.contains("is-visible")) {
                stopLevelIntroComputerDoodleAnimation();
                return;
            }

            if (!levelIntroComputerDoodle.dataset.animationStartedAt) {
                levelIntroComputerDoodle.dataset.animationStartedAt = String(now);
            }

            const startedAt = Number(levelIntroComputerDoodle.dataset.animationStartedAt);
            const cycleElapsed = Math.max(0, now - startedAt);
            const acceleratedElapsed = cycleElapsed * 4;
            const effectiveElapsed = maxTimestamp === 0
                ? 0
                : (Math.min(acceleratedElapsed, playbackDuration) / playbackDuration) * maxTimestamp;

            drawMenuDoodleFrame(levelIntroComputerDoodle, drawing, effectiveElapsed, {
                padding: 3,
                lineWidth: 2.2,
                strokeStyle: "rgba(27, 38, 49, 0.95)",
            });

            if (acceleratedElapsed >= playbackDuration) {
                delete levelIntroComputerDoodle.dataset.animationStartedAt;
                stopLevelIntroComputerDoodleAnimation();
                return;
            }

            levelIntroComputerDoodleAnimationFrame = window.requestAnimationFrame(render);
        };

        delete levelIntroComputerDoodle.dataset.animationStartedAt;
        levelIntroComputerDoodleAnimationFrame = window.requestAnimationFrame(render);
    } catch (error) {
        console.warn("Unable to animate intro computer doodle", error);
    }
}

function playLevelIntroTyping() {
    if (!levelIntro?.classList.contains("is-visible")) {
        clearLevelIntroTyping(true);
        return;
    }

    const activePageIndex = levelIntroPageIndex;
    const textElement = getLevelIntroPageTextElement(activePageIndex);

    if (!textElement || !levelIntroTypingPageIndexes.has(activePageIndex) || !levelIntroPages[activePageIndex]?.classList.contains("is-current")) {
        clearLevelIntroTyping(true);
        return;
    }

    const fullText = syncLevelIntroPageText(activePageIndex);

    if (sessionStorage.getItem(getLevelIntroTypingStorageKey(activePageIndex)) === "true") {
        clearLevelIntroTyping(true);
        return;
    }

    clearLevelIntroTyping();
    const targets = getLevelIntroTypingTargets(activePageIndex);
    let liveSpan = null;
    if (activePageIndex === LEVEL_INTRO_COMPUTER_PAGE_INDEX) {
        targets.forEach(target => {
            setTypingTargetProgress(target.element, target.fullText, 0);
        });
    } else {
        textElement.dataset.fullText = fullText;
        textElement.textContent = "";
        liveSpan = ensureLevelIntroTypingLiveSpan(textElement);
        setTypingTargetProgress(liveSpan, fullText, 0);
        targets[0].element = liveSpan;
    }
    textElement.classList.add("is-typing");
    levelIntroTypingPageIndex = activePageIndex;
    updateLevelIntroButtonVisibility();

    if (activePageIndex === LEVEL_INTRO_COMPUTER_PAGE_INDEX && levelIntroComputerDoodle) {
        levelIntroComputerDoodle.classList.add("is-hidden");
        const ctx = levelIntroComputerDoodle.getContext("2d");
        ctx?.clearRect(0, 0, levelIntroComputerDoodle.width, levelIntroComputerDoodle.height);
        delete levelIntroComputerDoodle.dataset.animationStartedAt;
    }

    window.requestAnimationFrame(() => {
        if (textElement) {
            textElement.classList.add("is-typing-visible");
        }
    });

    let targetIndex = 0;
    let characterIndex = 0;

    const typeNextCharacter = () => {
        if (!textElement) return;

        if (!levelIntroPages[activePageIndex]?.classList.contains("is-current") || !levelIntro?.classList.contains("is-visible")) {
            clearLevelIntroTyping(true);
            return;
        }

        const activeTarget = targets[targetIndex];
        if (!activeTarget) {
            levelIntroTypingTimer = null;
            levelIntroTypingPageIndex = null;
            sessionStorage.setItem(getLevelIntroTypingStorageKey(activePageIndex), "true");
            if (activePageIndex !== LEVEL_INTRO_COMPUTER_PAGE_INDEX) {
                textElement.textContent = fullText;
            }
            textElement.classList.remove("is-typing");
            textElement.classList.remove("is-typing-visible");
            updateLevelIntroButtonVisibility();
            if (activePageIndex === LEVEL_INTRO_COMPUTER_PAGE_INDEX && levelIntroComputerDoodle) {
                void startLevelIntroComputerDoodleAnimation();
            }
            return;
        }

        characterIndex += 1;
        setTypingTargetProgress(activeTarget.element, activeTarget.fullText, characterIndex);

        if (characterIndex < activeTarget.fullText.length) {
            levelIntroTypingTimer = window.setTimeout(typeNextCharacter, LEVEL_INTRO_TYPE_SPEED_MS);
            return;
        }

        targetIndex += 1;
        characterIndex = 0;
        levelIntroTypingTimer = window.setTimeout(typeNextCharacter, LEVEL_INTRO_TYPE_SPEED_MS);
    };

    levelIntroTypingTimer = window.setTimeout(typeNextCharacter, LEVEL_INTRO_TYPE_DELAY_MS);
}

function hideLevelIntro(immediate = false) {
    clearLevelIntroTimers();
    clearLevelIntroTyping(true);
    stopLevelIntroComputerDoodleAnimation();

    if (levelMenu) {
        levelMenu.setAttribute("aria-hidden", "false");
    }

    if (!levelIntro) return;

    levelIntro.classList.remove("is-visible");

    if (immediate) {
        levelIntro.hidden = true;
        return;
    }

    levelIntroHideTimer = window.setTimeout(() => {
        levelIntro.hidden = true;
        levelIntroHideTimer = null;
    }, LEVEL_INTRO_FADE_MS);
}

function setLevelIntroPage(nextIndex) {
    if (!levelIntroPages.length) return;

    const clampedIndex = Math.max(0, Math.min(levelIntroPages.length - 1, nextIndex));
    levelIntroPageIndex = clampedIndex;

    levelIntroPages.forEach((page, index) => {
        const isCurrent = index === clampedIndex;
        page.hidden = !isCurrent;
        page.classList.toggle("is-current", isCurrent);
    });

    levelIntroProgressDots.forEach((dot, index) => {
        dot.classList.toggle("is-current", index === clampedIndex);
        dot.classList.toggle("is-complete", index < clampedIndex);
    });

    if (levelIntroPrevButton) {
        levelIntroPrevButton.disabled = clampedIndex === 0;
    }

    if (levelIntroNextButton) {
        levelIntroNextButton.disabled = clampedIndex === levelIntroPages.length - 1;
    }

    if (levelIntroTypingPageIndexes.has(clampedIndex)) {
        playLevelIntroTyping();
    } else {
        clearLevelIntroTyping(true);
    }

    updateLevelIntroButtonVisibility();
}

function resetLevelIntroPages() {
    setLevelIntroPage(0);
}

function revealLevelIntro() {
    if (!levelIntro || homeMenuMode !== LEVEL_MENU_MODE) return;

    clearLevelIntroTimers();
    resetLevelIntroPages();
    levelIntro.hidden = false;

    if (levelMenu) {
        levelMenu.setAttribute("aria-hidden", "true");
    }

    window.requestAnimationFrame(() => {
        levelIntro.classList.add("is-visible");
        playLevelIntroTyping();
    });
}

function queueLevelIntroReveal() {
    hideLevelIntro(true);
    levelIntroTimer = window.setTimeout(() => {
        levelIntroTimer = null;
        revealLevelIntro();
    }, HOME_SCREEN_TRANSITION_MS);
}

function updateLanguageMenuLabel() {
    if (!languageMenuSubtitle) return;
    languageMenuSubtitle.textContent = t(currentLang === "da" ? "menuLanguageDanish" : "menuLanguageEnglish");
}

function updateContinueState() {
    if (!continueMenu) return;

    const canContinue = hasSavedProgress();
    continueMenu.classList.toggle("disabled", !canContinue);
    continueMenu.setAttribute("aria-disabled", canContinue ? "false" : "true");
    continueMenu.tabIndex = canContinue ? 0 : -1;
    if (continueMenuSubtitle) {
        continueMenuSubtitle.textContent = t(canContinue ? "menuContinueReady" : "menuContinueEmpty");
    }
}

function applyHomeQuizTranslations() {
    if (!quizQuestion) return;

    if (homeQuizStep >= 2) {
        if (introLead) introLead.textContent = t("intro2");
        quizQuestion.textContent = t("homeQuizFinal");
        if (quizFeedback) quizFeedback.textContent = "";
        return;
    }

    quizQuestion.textContent = t(homeQuizStep === 0 ? "homeQuizQuestion1" : "homeQuizQuestion2");
    if (introLead) introLead.textContent = t("intro2");
    updateContinueState();
    updateLanguageMenuLabel();
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

function drawQuickDrawToCanvas(canvas, drawing, options = {}) {
    if (!canvas || !drawing) return;

    const ctx = canvas.getContext("2d");
    const {
        background = "#f6f6f6",
        strokeStyle = "#1b2631",
        lineWidth = 5,
        padding = 18,
    } = options;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.strokeStyle = strokeStyle;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;

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
    const drawableWidth = canvas.width - padding * 2;
    const drawableHeight = canvas.height - padding * 2;
    const scale = Math.min(drawableWidth / boxWidth, drawableHeight / boxHeight);
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

function getMenuDoodleDuration(drawing) {
    let maxTimestamp = 0;

    drawing.forEach(stroke => {
        const timestamps = stroke[2] || [];
        const lastPointTimestamp = timestamps[timestamps.length - 1] || 0;
        if (lastPointTimestamp > maxTimestamp) {
            maxTimestamp = lastPointTimestamp;
        }
    });

    return {
        maxTimestamp,
        playbackDuration: Math.max(maxTimestamp, MENU_DOODLE_MIN_DURATION),
    };
}

function drawMenuDoodleFrame(canvas, drawing, elapsed, options = {}) {
    if (!canvas || !drawing) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const {
        strokeStyle = "rgba(27, 38, 49, 0.88)",
        lineWidth = 4,
        padding = 24,
    } = options;

    const points = [];
    drawing.forEach(stroke => {
        const xs = stroke[0] || [];
        const ys = stroke[1] || [];
        for (let index = 0; index < xs.length; index++) {
            points.push({ x: xs[index], y: ys[index] });
        }
    });

    if (!points.length) return;

    const minX = Math.min(...points.map(point => point.x));
    const maxX = Math.max(...points.map(point => point.x));
    const minY = Math.min(...points.map(point => point.y));
    const maxY = Math.max(...points.map(point => point.y));
    const boxWidth = Math.max(1, maxX - minX);
    const boxHeight = Math.max(1, maxY - minY);
    const drawableWidth = canvas.width - padding * 2;
    const drawableHeight = canvas.height - padding * 2;
    const scale = Math.min(drawableWidth / boxWidth, drawableHeight / boxHeight);
    const offsetX = (canvas.width - boxWidth * scale) / 2;
    const offsetY = (canvas.height - boxHeight * scale) / 2;

    ctx.strokeStyle = strokeStyle;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = lineWidth;

    drawing.forEach(stroke => {
        const xs = stroke[0] || [];
        const ys = stroke[1] || [];
        const timestamps = stroke[2] || [];

        if (!xs.length || !ys.length) return;

        let lastVisibleIndex = 0;
        while (
            lastVisibleIndex + 1 < xs.length &&
            (timestamps[lastVisibleIndex + 1] || 0) <= elapsed
        ) {
            lastVisibleIndex += 1;
        }

        if ((timestamps[0] || 0) > elapsed) return;

        ctx.beginPath();
        ctx.moveTo(
            offsetX + (xs[0] - minX) * scale,
            offsetY + (ys[0] - minY) * scale
        );

        for (let index = 1; index <= lastVisibleIndex; index++) {
            ctx.lineTo(
                offsetX + (xs[index] - minX) * scale,
                offsetY + (ys[index] - minY) * scale
            );
        }

        if (lastVisibleIndex < xs.length - 1) {
            const segmentStartTime = timestamps[lastVisibleIndex] || 0;
            const segmentEndTime = timestamps[lastVisibleIndex + 1] || segmentStartTime;
            const segmentDuration = Math.max(1, segmentEndTime - segmentStartTime);
            const segmentProgress = Math.max(
                0,
                Math.min(1, (elapsed - segmentStartTime) / segmentDuration)
            );
            const currentX = xs[lastVisibleIndex] + (xs[lastVisibleIndex + 1] - xs[lastVisibleIndex]) * segmentProgress;
            const currentY = ys[lastVisibleIndex] + (ys[lastVisibleIndex + 1] - ys[lastVisibleIndex]) * segmentProgress;

            ctx.lineTo(
                offsetX + (currentX - minX) * scale,
                offsetY + (currentY - minY) * scale
            );
        }

        ctx.stroke();
    });
}

async function loadMenuDoodleSet(name) {
    if (menuDoodleCache.has(name)) {
        return menuDoodleCache.get(name);
    }

    const response = await fetch(`${MENU_DOODLE_BASE_PATH}/${name}.json`);
    if (!response.ok) {
        throw new Error(`Could not load doodle set: ${name}`);
    }

    const payload = await response.json();
    const drawings = Array.isArray(payload.drawings) ? payload.drawings : [];
    menuDoodleCache.set(name, drawings);
    return drawings;
}

function startMenuDoodleAnimation() {
    if (!menuDoodleState.length || menuDoodleAnimationFrame) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = now => {
        menuDoodleState.forEach(state => {
            const drawingEntry = state.drawings[state.index];
            if (!drawingEntry) return;

            const drawing = drawingEntry.drawing;
            const { maxTimestamp, playbackDuration } = getMenuDoodleDuration(drawing);

            if (state.startedAt === null) {
                state.startedAt = now;
            }

            const cycleElapsed = now - state.startedAt;
            const effectiveElapsed = prefersReducedMotion
                ? maxTimestamp
                : Math.min(
                    maxTimestamp,
                    (Math.min(cycleElapsed, playbackDuration) / playbackDuration) * maxTimestamp
                );

            drawMenuDoodleFrame(state.canvas, drawing, effectiveElapsed);

            if (cycleElapsed >= playbackDuration + MENU_DOODLE_PAUSE) {
                state.index = (state.index + 1) % state.drawings.length;
                state.startedAt = now;
            }
        });

        menuDoodleAnimationFrame = window.requestAnimationFrame(render);
    };

    menuDoodleAnimationFrame = window.requestAnimationFrame(render);
}

async function initializeMenuDoodles() {
    if (!isHomePage || !menuDoodleCanvases.length) return;

    let doodleSets = [];

    try {
        doodleSets = await Promise.all(
            menuDoodleCanvases.map(async (canvas, index) => {
                const source = canvas.dataset.source;
                if (!source) return null;

                const drawings = await loadMenuDoodleSet(source);
                if (!drawings.length) return null;

                return {
                    canvas,
                    drawings,
                    index: index % drawings.length,
                    startedAt: null,
                };
            })
        );
    } catch (error) {
        console.error(error);
        return;
    }

    doodleSets.filter(Boolean).forEach(state => {
        menuDoodleState.push(state);
    });

    startMenuDoodleAnimation();
}

function renderHomeQuizStep() {
    if (!quizCanvas) return;

    if (homeQuizStep >= 2) {
        quizOptionButtons.forEach(button => {
            button.hidden = true;
        });
        if (ruleCard) {
            ruleCard.classList.add("journey-node-highlighted");
        }
        applyHomeQuizTranslations();
        return;
    }

    quizOptionButtons.forEach(button => {
        button.hidden = false;
        button.classList.remove("is-correct");
    });
    drawQuickDrawToCanvas(quizCanvas, homeQuizDrawings[homeQuizStep]);
    applyHomeQuizTranslations();
}

function resetHomeQuizState() {
    homeQuizStep = 0;
    if (quizFeedback) quizFeedback.textContent = "";
    quizOptionButtons.forEach(button => {
        button.hidden = false;
        button.classList.remove("is-correct");
    });
    setRuleCardHighlight(false);
}

async function ensureHomeQuizLoaded() {
    if (!quizCanvas || !quizQuestion || !quizOptionButtons.length) return;
    if (homeQuizLoaded) return;
    if (homeQuizLoadingPromise) {
        await homeQuizLoadingPromise;
        return;
    }

    homeQuizLoadingPromise = (async () => {
        applyHomeQuizTranslations();

        const response = await fetch(HOME_QUIZ_DATASET);
        if (!response.ok) throw new Error("Could not load quiz doodles.");
        const buffer = await response.arrayBuffer();
        const drawings = parseQuickDrawBinary(buffer, HOME_QUIZ_DRAWING_INDEXES[1] + 1);
        homeQuizDrawings = HOME_QUIZ_DRAWING_INDEXES.map(index => drawings[index]).filter(Boolean);
        homeQuizLoaded = true;
    })();

    try {
        await homeQuizLoadingPromise;
    } catch (error) {
        if (quizFeedback) quizFeedback.textContent = error.message;
    } finally {
        homeQuizLoadingPromise = null;
    }
}

function updateLevelIntroVisibility() {
    if (quizContainer) {
        quizContainer.hidden = true;
    }

    if (homeFocus) {
        homeFocus.classList.toggle("quiz-hidden", true);
    }

    if (homeMenuMode !== LEVEL_MENU_MODE) {
        hideLevelIntro(true);
        return;
    }

    if (levelMenu) {
        levelMenu.setAttribute("aria-hidden", "false");
    }
}

function updateLevelCardState() {
    if (hasPendingNewSessionReset()) {
        if (classifierCard) {
            classifierCard.classList.add("locked", "card-step-locked");
            classifierCard.classList.remove("card-step-next");
            if (startImageClassifierBtn) startImageClassifierBtn.hidden = true;
        }

        if (chatbotCard) {
            chatbotCard.classList.add("locked", "card-step-locked");
            if (startChatbotBtn) startChatbotBtn.hidden = true;
        }

        return;
    }

    if (classifierCard) {
        const isUnlocked = localStorage.getItem(IMAGE_CLASSIFIER_UNLOCK_KEY) === "true";
        classifierCard.classList.toggle("locked", !isUnlocked);
        classifierCard.classList.toggle("card-step-locked", !isUnlocked);
        classifierCard.classList.toggle("card-step-next", isUnlocked);
        if (startImageClassifierBtn) startImageClassifierBtn.hidden = !isUnlocked;
    }

    if (chatbotCard) {
        const isUnlocked = localStorage.getItem(CHATBOT_UNLOCK_KEY) === "true";
        chatbotCard.classList.toggle("locked", !isUnlocked);
        chatbotCard.classList.toggle("card-step-locked", !isUnlocked);
        if (startChatbotBtn) startChatbotBtn.hidden = !isUnlocked;
    }
}

function showHomeMenu(mode) {
    if (mode !== LEVEL_MENU_MODE) {
        shouldHighlightRuleCardAfterIntro = false;
        setRuleCardHighlight(false);
    } else if (!shouldHighlightRuleCardAfterIntro) {
        setRuleCardHighlight(false);
    }

    setStoredHomeScreen(mode);

    if (homeScreens) {
        homeScreens.classList.remove("is-credits", "is-session", "is-levels");
        if (mode === CREDITS_MENU_MODE) {
            homeScreens.classList.add("is-credits");
        } else if (mode === LEVEL_MENU_MODE) {
            homeScreens.classList.add("is-levels");
        } else {
            homeScreens.classList.add("is-session");
        }
    }

    updateContinueState();
    updateLanguageMenuLabel();

    if (mode === LEVEL_MENU_MODE) {
        updateLevelCardState();
    }

    updateLevelIntroVisibility();
}

function startNewSession() {
    resetHomeQuizState();
    resetLevelIntroTypingState();
    shouldHighlightRuleCardAfterIntro = false;
    sessionStorage.setItem(PENDING_NEW_SESSION_RESET_KEY, "true");
    showHomeMenu(LEVEL_MENU_MODE);
    queueLevelIntroReveal();
}

function clearProgressForNewSession() {
    if (!hasPendingNewSessionReset()) return;
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    localStorage.clear();
    if (savedLanguage) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, savedLanguage);
    }
    sessionStorage.removeItem(PENDING_NEW_SESSION_RESET_KEY);
}

function handleHomeQuizAnswer(answer) {
    if (homeQuizStep >= 2) return;

    if (answer !== HOME_QUIZ_CORRECT_ANSWER) {
        if (quizFeedback) quizFeedback.textContent = t("homeQuizWrong");
        return;
    }

    if (quizFeedback) quizFeedback.textContent = t("homeQuizCorrect");
    quizOptionButtons.forEach(button => {
        button.classList.toggle("is-correct", button.dataset.answer === answer);
    });

    homeQuizStep += 1;

    window.setTimeout(() => {
        if (quizFeedback) quizFeedback.textContent = "";
        renderHomeQuizStep();
    }, 500);
}

function updatePageMeta() {
    document.documentElement.lang = currentLang === "da" ? "da" : "en";

    if (currentPath.endsWith("image-classifier.html")) return;

    if (currentPath.endsWith("other-resources.html")) {
        document.title = t("pageTitleCurious");
    } else if (currentPath.endsWith("rule-based-ai.html")) {
        document.title = t("pageTitleRuleBased");
    } else if (currentPath.endsWith("chatbot.html")) {
        document.title = t("pageTitleChatbot");
    } else {
        document.title = t("pageTitleHome");
    }
}

function attachCardNavigation(card, button) {
    if (!card || !button) return;

    const trigger = () => {
        if (card.classList.contains("locked") || button.hidden) return;
        button.click();
    };

    card.addEventListener("click", trigger);
    card.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            trigger();
        }
    });
}

function attachMenuAction(menu, handler) {
    if (!menu) return;

    const trigger = () => {
        if (menu.classList.contains("disabled")) return;
        handler();
    };

    menu.addEventListener("click", trigger);
    menu.addEventListener("keydown", event => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            trigger();
        }
    });
}

if (enBtn) {
    enBtn.onclick = () => {
        setLanguage("en");
        updatePageMeta();
        updateLanguageButtons();
        applyTranslations();
        applyHomeQuizTranslations();
        playLevelIntroTyping();
    };
}

if (daBtn) {
    daBtn.onclick = () => {
        setLanguage("da");
        updatePageMeta();
        updateLanguageButtons();
        applyTranslations();
        applyHomeQuizTranslations();
        playLevelIntroTyping();
    };
}

quizOptionButtons.forEach(button => {
    button.addEventListener("click", () => handleHomeQuizAnswer(button.dataset.answer));
});

if (aboutMenu) {
    aboutMenu.onclick = () => {
        sessionStorage.setItem(HOME_SCREEN_KEY, CREDITS_MENU_MODE);
        window.location.href = "index.html";
    };
}

if (curiousMenu) {
    curiousMenu.onclick = () => {
        if (currentPath.endsWith("other-resources.html")) return;
        window.location.href = "other-resources.html";
    };
}

if (homeMenu) {
    homeMenu.onclick = () => {
        if (currentPath.endsWith("index.html") || currentPath.endsWith("/")) return;
        sessionStorage.setItem(HOME_SCREEN_KEY, SESSION_MENU_MODE);
        window.location.href = "index.html";
    };
}

if (startRuleBasedBtn) {
    startRuleBasedBtn.onclick = () => {
        shouldHighlightRuleCardAfterIntro = false;
        setRuleCardHighlight(false);
        clearProgressForNewSession();
        sessionStorage.setItem(HOME_SCREEN_KEY, LEVEL_MENU_MODE);
        hideLevelIntro(true);
        window.location.href = "rule-based-ai.html";
    };
}

if (startImageClassifierBtn) {
    startImageClassifierBtn.onclick = () => {
        shouldHighlightRuleCardAfterIntro = false;
        setRuleCardHighlight(false);
        clearProgressForNewSession();
        sessionStorage.setItem(HOME_SCREEN_KEY, LEVEL_MENU_MODE);
        hideLevelIntro(true);
        window.location.href = "image-classifier.html";
    };
}

if (startChatbotBtn) {
    startChatbotBtn.onclick = () => {
        shouldHighlightRuleCardAfterIntro = false;
        setRuleCardHighlight(false);
        clearProgressForNewSession();
        sessionStorage.setItem(HOME_SCREEN_KEY, LEVEL_MENU_MODE);
        hideLevelIntro(true);
        window.location.href = "chatbot.html";
    };
}

attachCardNavigation(ruleCard, startRuleBasedBtn);
attachCardNavigation(classifierCard, startImageClassifierBtn);
attachCardNavigation(chatbotCard, startChatbotBtn);

attachMenuAction(continueMenu, () => {
    if (!hasSavedProgress()) return;
    hideLevelIntro(true);
    sessionStorage.removeItem(PENDING_NEW_SESSION_RESET_KEY);
    showHomeMenu(LEVEL_MENU_MODE);
});

attachMenuAction(newSessionMenu, startNewSession);

attachMenuAction(languageMenu, () => {
    setLanguage(currentLang === "en" ? "da" : "en");
    updatePageMeta();
    updateLanguageButtons();
    applyTranslations();
    applyHomeQuizTranslations();
    playLevelIntroTyping();
});

attachMenuAction(creditsMenu, () => {
    showHomeMenu(CREDITS_MENU_MODE);
});

if (creditsBackButton) {
    creditsBackButton.onclick = () => {
        showHomeMenu(SESSION_MENU_MODE);
    };
}

if (levelBackButton) {
    levelBackButton.onclick = () => {
        shouldHighlightRuleCardAfterIntro = false;
        setRuleCardHighlight(false);
        hideLevelIntro(true);
        sessionStorage.removeItem(PENDING_NEW_SESSION_RESET_KEY);
        showHomeMenu(SESSION_MENU_MODE);
    };
}

if (levelIntroButton) {
    levelIntroButton.onclick = () => {
        shouldHighlightRuleCardAfterIntro = true;
        hideLevelIntro();
        setRuleCardHighlight(true);
    };
}

if (levelIntroPrevButton) {
    levelIntroPrevButton.onclick = () => {
        setLevelIntroPage(levelIntroPageIndex - 1);
    };
}

if (levelIntroNextButton) {
    levelIntroNextButton.onclick = () => {
        if (finishLevelIntroTypingInstantly()) {
            return;
        }

        setLevelIntroPage(levelIntroPageIndex + 1);
    };
}

if (returnBtn) {
    returnBtn.onclick = () => {
        if (currentPath.endsWith("rule-based-ai.html")) {
            localStorage.setItem(IMAGE_CLASSIFIER_UNLOCK_KEY, "true");
            sessionStorage.setItem(HOME_SCREEN_KEY, LEVEL_MENU_MODE);
            sessionStorage.setItem(SKIP_HOME_TRANSITION_KEY, "true");
            window.location.href = "index.html";
            return;
        }

        if (currentPath.endsWith("image-classifier.html")) {
            localStorage.setItem(CHATBOT_UNLOCK_KEY, "true");
            sessionStorage.setItem(HOME_SCREEN_KEY, LEVEL_MENU_MODE);
            sessionStorage.setItem(SKIP_HOME_TRANSITION_KEY, "true");
            window.location.href = "index.html";
            return;
        }

        sessionStorage.setItem(HOME_SCREEN_KEY, SESSION_MENU_MODE);
        window.location.href = "index.html";
    };
}

updatePageMeta();
updateLanguageButtons();
applyTranslations();
levelIntroTypingPageIndexes.forEach(pageIndex => {
    syncLevelIntroPageText(pageIndex);
});
hideLevelIntro(true);
resetLevelIntroPages();
void initializeMenuDoodles();

if (isHomePage) {
    if (homeScreens && shouldSkipInitialHomeTransition) {
        homeScreens.classList.add("no-transition");
    }
    if (![CREDITS_MENU_MODE, SESSION_MENU_MODE, LEVEL_MENU_MODE].includes(homeMenuMode)) {
        homeMenuMode = SESSION_MENU_MODE;
    }
    showHomeMenu(homeMenuMode);
    hideLevelIntro(true);
    if (homeScreens && shouldSkipInitialHomeTransition) {
        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                homeScreens.classList.remove("no-transition");
            });
        });
    }
} else {
    updateContinueState();
    updateLanguageMenuLabel();
}
