// Rules popup logic

const rulesBtn = document.getElementById("rules-btn");
const rulesPopup = document.getElementById("rules-popup");
const closeRulesBtn = document.getElementById("close-rules-btn");
const rulesList = document.getElementById("rules-list");

rulesBtn.addEventListener("click", () => {
  rulesPopup.classList.remove("hidden");
});

closeRulesBtn.addEventListener("click", () => {
  rulesPopup.classList.add("hidden");
});

function renderRules() {
  if (!rulesList) return;

  rulesList.innerHTML = "";

  for (const rule of window.ruleDefinitions) {
    const card = document.createElement("div");
    card.className = "rule-card";

    card.innerHTML = `
      <div class="rule-header">
        <span class="rule-name">${rule.name}</span>
        ${rule.locked ? '<span class="rule-lock">🔒</span>' : ""}
      </div>
      <div class="rule-body">
        <div><strong>Label:</strong> ${rule.label}</div>
        <div><strong>Reasons:</strong></div>
        <ul>
          ${rule.reasons.map(reason => `<li>${reason}</li>`).join("")}
        </ul>
      </div>
    `;

    rulesList.appendChild(card);
  }
}

// Rule definitions

window.ruleDefinitions = [
  {
    id: "fish",
    name: "Fish",
    label: "labelFish",
    locked: true,
    reasons: [
      "reasonFishWidth",
      "reasonFishMiddle",
      "reasonFishTopBottomLow",
      "reasonFishImbalance",
      "reasonFishBodyTail"
    ],
    matches: (f) =>
      f.aspectRatio > 1.2 &&
      f.middleHRatio > 0.45 &&
      f.topRatio < 0.35 &&
      f.bottomRatio < 0.35 &&
      f.verticalSymmetry < 0.9 &&
      f.colVariation < 0.3 &&
      Math.abs(f.leftRatio - f.rightRatio) > 0.08
  },
  {
    id: "house",
    name: "House",
    label: "labelHouse",
    locked: true,
    reasons: [
      "reasonHouseMidBottom",
      "reasonHouseSymmetric",
      "reasonHouseProportions"
    ],
    matches: (f) =>
      f.bottomRatio > 0.30 &&
      f.middleHRatio > 0.30 &&
      f.verticalSymmetry > 0.75 &&
      f.aspectRatio > 0.7 &&
      f.aspectRatio < 1.4
  },
  {
    id: "sun",
    name: "Sun",
    label: "labelSun",
    locked: true,
    reasons: [
      "reasonSunBalanced",
      "reasonSunSparse",
      "reasonSunSymmetry"
    ],
    matches: (f) =>
      f.aspectRatio > 0.85 &&
      f.aspectRatio < 1.3 &&
      f.density < 0.18 &&
      f.verticalSymmetry > 0.75 &&
      f.horizontalSymmetry > 0.75
  }
];

function classifyByRules(f) {
  if (f.empty) {
    return { label: "labelNothing", reasons: ["reasonNoInk"] };
  }

  const rules = window.ruleDefinitions || [];

  for (const rule of rules) {
    if (rule.matches(f)) {
      return {
        label: rule.label,
        reasons: rule.reasons
      };
    }
  }

  return {
    label: "labelUnknown",
    reasons: ["reasonDefaultNoMatch", "reasonDefaultFallback"]
  };
}