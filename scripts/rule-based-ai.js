(() => {
const ruleQuizCanvas = document.getElementById("quiz-doodle");

if (ruleQuizCanvas) {
  const rulePageEl = document.querySelector(".rule-quiz-page");
  const confettiLayerEl = document.getElementById("rule-confetti-layer");
  const quizCtx = ruleQuizCanvas.getContext("2d");
  const answerButtons = Array.from(document.querySelectorAll(".answer-option[data-answer]"));
  const finalAnswerButtons = Array.from(document.querySelectorAll(".final-answer-option"));
  const ruleProgressEl = document.getElementById("rule-progress");
  const ruleQuestionEl = document.getElementById("answer-panel-title");
  const rulePlayAreaEl = document.querySelector(".rule-play-area");
  const ruleCanvasOverlayEl = document.getElementById("quiz-doodle-overlay");
  const ruleSequenceCalloutEl = document.getElementById("rule-sequence-callout");
  const ruleSequenceStepCountEl = document.getElementById("rule-sequence-step-count");
  const ruleSequenceStepTextEl = document.getElementById("rule-sequence-step-text");
  const ruleSequenceSkipBtn = document.getElementById("rule-sequence-skip-btn");
  const ruleHelperEl = document.getElementById("rule-helper");
  const playerStatusEl = document.getElementById("player-status");
  const playerAnswerValueEl = document.getElementById("player-answer-value");
  const rulesAppliedListEl = document.getElementById("rules-applied-list");
  const rulesRevealChipEl = document.getElementById("rules-reveal-chip");
  const rulesRevealPanelEl = document.getElementById("rules-reveal-panel");
  const revealSection = document.getElementById("rule-reveal");
  const finalQuestionSection = document.getElementById("rule-final-question");
  const moduleTransitionSection = document.getElementById("rule-module-transition");
  const moduleTransitionButton = document.getElementById("rule-transition-button");
  const transitionChoiceButtons = Array.from(document.querySelectorAll(".rule-transition-choice"));
  const transitionSummaryItems = Array.from(document.querySelectorAll(".rule-transition-summary-item"));
  const transitionSummaryInnerEl = document.getElementById("rule-transition-summary-inner");
  const transitionSummaryIntroEl = document.getElementById("rule-transition-summary-intro");
  const transitionSummaryProgressEl = document.getElementById("rule-transition-summary-progress");
  const transitionSummaryFinalEl = document.getElementById("rule-transition-summary-final");
  const feedbackOverlayEl = document.getElementById("rule-feedback-overlay");
  const feedbackCardEl = document.getElementById("rule-feedback-card");
  const feedbackResultEl = document.getElementById("rule-feedback-result");
  const feedbackPlayerEl = document.getElementById("rule-feedback-player");
  const feedbackAiEl = document.getElementById("rule-feedback-ai");
  const feedbackAhaEl = document.getElementById("rule-feedback-aha");
  const feedbackAhaTextEl = document.getElementById("rule-feedback-aha-text");
  const feedbackHintEl = document.getElementById("rule-feedback-hint");
  const feedbackReviewBtn = document.getElementById("rule-feedback-review-btn");
  const feedbackNextBtn = document.getElementById("rule-feedback-next-btn");

  const DATASET_LIMIT = 24;
  const TOTAL_ROUNDS = 10;
  const FINAL_CORRECT_ANSWER = "shapes";
  const AUTO_ADVANCE_DELAY = 2800;
  const FINAL_AUTO_ADVANCE_DELAY = 3600;
  const RULE_CHECK_STEP_DELAY = 2200;
  const RULE_CHECK_FINISH_DELAY = 2600;
  const FIXED_OPENING_SAMPLE_KEYS = [
    { source: "full_raw_bee.ndjson", index: 26226, tier: "easy" },
    { source: "full_raw_crocodile.ndjson", index: 116015, tier: "easy" },
    { source: "full_raw_fish.ndjson", index: 89166, tier: "easy" },
    { source: "full_raw_hockey stick.ndjson", index: 14989, tier: "medium" },
    { source: "full_raw_house.ndjson", index: 58499, tier: "medium" },
    { source: "full_raw_fish.ndjson", index: 9123, tier: "medium" },
    { source: "full_raw_hockey stick.ndjson", index: 33830, tier: "medium" }
  ];
  const ROUND8_REPLACEMENT_KEY = { source: "full_raw_house.ndjson", index: 128514 };
  const ROUND9_REPLACEMENT_KEY = { source: "./images/full_binary_sun.bin", index: 84652 };
  const DIFFICULTY_DISTRIBUTION = {
    easy: 3,
    medium: 4,
    hard: 3
  };
  const FEATURE_MARGIN_SCALES = {
    aspectRatio: 0.35,
    density: 0.06,
    topRatio: 0.08,
    middleHRatio: 0.08,
    bottomRatio: 0.08,
    leftRatio: 0.08,
    rightRatio: 0.08,
    verticalSymmetry: 0.08
  };
  const EMBEDDED_SAMPLES = Array.isArray(window.ruleBasedAiSamples) ? window.ruleBasedAiSamples : [];
  const FIXED_OPENING_SAMPLES = [
    {
      source: "full_raw_bee.ndjson",
      index: 26226,
      drawing: [
        { xs: [350,345,340,332,321,309,297,286,277,269,263,257,253,250,249,249,249,251,259,267,278,291,305,319,335,349,365,378,389,397,404,409,412,413,414,414,413,409,406,403,398,392,388,387,387,387,387,391,398,407,416,425,435,444,453,461,469,475,481,484,486,486,486,482,475,467,458,448,438,430,424,420,420], ys: [329,328,329,334,343,353,363,373,384,395,407,419,432,443,456,469,480,490,499,504,508,509,509,507,501,492,480,466,452,438,424,412,400,389,378,367,357,349,343,338,332,329,322,317,311,304,296,286,275,264,253,245,238,234,233,233,235,240,247,255,265,275,286,297,307,317,325,333,338,341,342,329,329] },
        { xs: [472,469,467,467,475,480,485,490,495,503,505,507,507,507,503,497,491,485,480,480], ys: [233,227,215,208,201,198,197,197,198,205,212,218,225,232,237,242,245,247,248,248] },
        { xs: [398,398,398,397,393,387,378,368,357,346,334,321,307,293,279,265,251,240,232,226,223,223,227,237,249,263,279,294,310,325,341,355,367,378,385,390,395,388,377,363,349,331,313,293,272,250,228,208,190,177,169,165,165,169,179,193,212,235,258,285,310,332,352,367,377,383,385], ys: [291,285,280,274,263,250,236,222,210,201,194,188,184,183,183,185,191,198,205,214,222,232,241,250,259,267,276,284,292,299,304,307,308,308,308,308,308,305,304,303,301,298,296,293,292,292,292,298,307,316,327,336,346,356,366,374,380,383,383,380,372,364,354,346,339,336,335] },
        { xs: [399,396,396,396,396,397,399,402,405,408,412,418,426,437,450,463,476,486,494,499,499,498,490,479,468,456,445,435,428,422,430,440,452,465,481,498,516,536,555,570,584,594,597,597,591,577,560,539,519,494,472,451,431,415,404,396,396], ys: [325,334,343,355,368,383,400,418,436,455,470,481,490,496,498,499,496,490,480,468,453,436,418,401,385,372,360,348,338,332,343,355,368,380,390,398,403,406,407,406,399,389,379,366,354,341,329,317,308,297,288,281,277,275,275,275,275] },
        { xs: [317,326,343,351,360,367,373,376], ys: [378,383,400,410,420,428,434,437] },
        { xs: [278,285,293,314,325,335,341,346,348], ys: [415,414,419,436,447,457,465,470,473] },
        { xs: [266,273,280,288,297,304,311,316,316], ys: [453,461,467,475,485,492,497,500,500] },
        { xs: [486,483,483,472,463,453,443,434,424,416,409,404,403,404,404], ys: [214,206,184,157,145,137,132,130,130,134,144,157,171,183,183] },
        { xs: [493,490,498,515,524,532,541,549,559,570,579,588,594,596,596,592,583,579], ys: [208,203,179,150,141,135,133,133,133,138,145,152,159,164,170,177,184,188] }
      ]
    },
    {
      source: "full_raw_crocodile.ndjson",
      index: 116015,
      drawing: [
        { xs: [667,673,678,684,689,694,699,705,711,717,725,735,740,746,751,757,762,767,775,780,786,792,800,807,818,833,842,847,852,857,866,873,878,887,894,906,918,924,929,933,937,940,941,940], ys: [318,314,312,309,305,300,297,294,292,289,286,282,281,279,278,277,276,276,276,276,277,277,278,277,277,276,276,276,276,276,276,276,276,275,273,270,267,265,260,254,249,244,239,239] },
        { xs: [689,695,701,706,712,717,724,733,741,752,761,769,776,782,789,794,799,808,814,821,828,834,842,847,855,862,867,872,877,887,894,900,907,912,918,925,931,936,939,940,941,941,941,941], ys: [347,347,347,347,347,347,347,346,345,342,340,338,336,334,331,329,327,324,322,321,319,318,317,316,314,312,311,309,307,304,302,300,298,295,291,287,283,279,274,269,264,259,254,254] },
        { xs: [673,664,654,642,633,627,617,608,602,597,588,576,562,553,546,539,530,518,507,499,492,486,477,470,463,458,452,447,438,431,425,420,414,408,403,402,400,397,390,381,376,371,365,360,354,348,342,336,327,320,313,308,303,298,293,288,281,272,267,261,256,251,252,259,264,269,276,282,288,294,303,314,320,325,330,335,341,346,352,357,362,357,352,347,341,335,329,324,319,314,307,301,295,288,283,278,273,267,262,257,252,258,270,277,284,291,301,309,317,322,328,333,339,345,350,355,360,365,370,377,383,393,399,407,416,423,431,447,453,468,474,482,488,497,504,509,514,524,534,543,548,555,561,568,577,584,589,594,601,608,615,620,626,631,637,644,650,655,661,671,681,690,697,702,705], ys: [308,304,300,294,289,286,282,281,280,280,281,282,283,282,282,281,280,280,280,279,278,278,277,278,278,278,278,278,280,281,281,282,282,283,283,277,272,267,264,263,263,263,263,263,264,265,266,268,271,274,277,279,282,284,287,288,291,293,295,296,297,300,305,306,306,307,307,306,306,306,305,303,302,302,302,302,302,301,301,300,300,303,304,305,306,307,307,307,308,308,309,311,312,314,314,315,316,318,319,321,323,327,328,328,328,327,326,325,324,323,323,323,323,323,322,322,321,321,320,319,318,318,318,318,318,318,317,314,318,327,330,335,339,342,343,345,346,348,350,352,353,355,355,356,357,358,359,360,361,362,362,363,363,364,364,364,364,365,366,366,365,364,363,361,360] },
        { xs: [473,473,473,473,473,473,473,473,473], ys: [345,351,356,361,366,371,376,381,381] },
        { xs: [528,529,530,532,535,537,538,540,541,540], ys: [349,354,360,366,371,376,381,386,391,390] }
      ]
    },
    {
      source: "full_raw_fish.ndjson",
      index: 89166,
      drawing: [
        { xs: [450,455,462,468,473,479,485,491,496,501,506,511,517,524,530,537,543,550,556,561,568,575,581,588,594,599,606,613,619,624,629,634,640,646,651,657,662,667,673,679,684,689,694,699,704,709,715,720,725,730,736,742,748,753,758,763,770,776,782,787,792,799,807,814,821,827,832,837,842,847,853,858,859], ys: [251,246,243,240,237,234,233,230,228,227,226,225,225,225,225,225,225,226,231,233,237,240,244,248,251,253,257,262,265,269,272,274,278,281,283,288,291,294,297,300,302,303,304,307,309,311,314,315,315,313,310,307,304,300,297,293,290,286,283,279,277,272,268,264,260,257,254,252,249,248,246,246,246] },
        { xs: [865,868,867,864,862,860,858,856,854,853,852,851,851,851,851,851,851,853,855,857,858,861,866,869,872,873,875,877,877,878,878,878,878,878,877,877,871,865,859,853,848,843,836,830,825,820,814,809,803,797,790,783,777,772,766,763,758,753,748,741,735,729,722,716,710,704,698,691,683,676,670,662,657,652,645,639,631,625,618,613,608,603,598,592,585,578,573,567,562,557,550,544,538,532,525,517,512,505,498,491,486,480,473,464,456,451,446,441,436,433,430,427,424,421,420,417,417,417,417,416,416,417,419,422,426,431,436,440,446,451,456,461,464], ys: [245,251,257,262,268,274,279,284,289,295,300,305,310,315,320,325,330,335,340,345,350,355,359,364,369,374,379,384,389,395,401,407,412,417,423,428,430,432,434,434,434,434,434,434,434,434,432,430,427,423,419,415,409,406,401,396,393,389,387,387,389,391,394,397,399,402,404,406,409,411,413,415,418,420,421,423,425,426,429,431,431,432,434,436,438,440,441,442,443,443,443,443,441,439,437,435,432,430,428,424,421,418,414,408,403,399,396,392,389,383,378,371,363,353,348,338,330,325,317,312,305,299,292,286,281,278,274,269,265,262,259,257,255] },
        { xs: [458,453,448,442,439,435,431,429,427,427,425,424], ys: [240,242,246,250,256,261,266,271,276,281,286,287] },
        { xs: [437,441,447,452,457,462,468,474,480,485,491,496,496,496], ys: [337,342,347,349,352,354,356,356,355,353,348,344,339,339] },
        { xs: [452,457,462,467,469,466,461,456,461,466,462], ys: [289,288,286,287,292,297,298,294,291,290,292] },
        { xs: [550,555,560,567,573,579,582,583,587,591,593,597,601,603,604,604,604,604,604,604,599,595,592,596,596,597,597,594,589,584,582], ys: [391,393,395,396,392,388,383,378,373,366,361,355,349,343,338,333,328,323,318,313,308,303,298,292,287,281,275,270,268,267,267] }
      ]
    },
    {
      source: "full_raw_hockey stick.ndjson",
      index: 14989,
      drawing: [
        { xs: [610,607,605,604,603,602,601,600,598,594,593,592,592,591,589,589,587,587,587,586,586,586,589,597,602,617,622,631,640,645,648], ys: [142,148,155,168,173,179,187,195,204,228,245,253,262,287,298,307,314,319,324,329,334,339,347,356,360,371,372,376,381,385,388] },
        { xs: [645,647,647,647,647,647,643,638,633,623,617,611,606,598,593,583,577,571,566,560,548,542,536,532,532,531,530,529,529,529,530,531,531,534,536,538,540,542,545,546,547,548,548,548,548,549,550,551,552,553,556,559,561,566,569,574,579,586,591,596,599,600,600,600,601,602,604,605,605], ys: [384,389,394,400,405,410,415,416,418,419,419,419,419,415,411,404,401,398,395,392,381,372,366,361,356,350,345,334,327,322,317,312,306,299,290,280,268,256,228,222,216,210,203,198,175,166,156,146,141,136,131,125,120,111,106,104,104,104,104,104,110,115,121,127,132,137,143,148,149] },
        { xs: [605,602,592,589,586,582,580,579], ys: [351,358,372,378,383,390,395,398] },
        { xs: [620,614,610,609,606,606], ys: [368,376,383,388,393,394] },
        { xs: [604,600,595,594], ys: [395,400,405,408] },
        { xs: [601,592,586,581,571,565,560,556], ys: [154,151,149,148,145,145,145,145] },
        { xs: [598,591,582,554,545,545], ys: [135,130,126,119,117,117] }
      ]
    },
    {
      source: "full_raw_house.ndjson",
      index: 58499,
      drawing: [
        { xs: [169.177001953125,165.97999572753906,160.7030029296875,153.8040008544922,144.69900512695312,133.82200622558594,123.61199951171875,114.28600311279297,106.87999725341797,100.98300170898438,98.1709976196289], ys: [75.53300476074219,80.86300659179688,88.49800109863281,98.18499755859375,112.99299621582031,131.45599365234375,147.70199584960938,160.94900512695312,169.70098876953125,175.31201171875,176.49798583984375] },
        { xs: [175.83700561523438,184.093994140625,192.66099548339844,202.5,212.7010040283203,222.552001953125,231.33299255371094,238.66299438476562,245.32899475097656,245.32899475097656], ys: [91.52400207519531,94.09100341796875,97.21099853515625,102.86399841308594,109.90400695800781,117.02200317382812,124.35899353027344,131.6280059814453,138.38900756835938,138.38900756835938] },
        { xs: [122.88600158691406,122.88600158691406,122.50700378417969,122.5530014038086,122.5530014038086,122.5530014038086,122.5530014038086,122.5530014038086,122.5530014038086,122.5530014038086,128.56100463867188,134.34100341796875,141.0070037841797,150.45899963378906,162.822998046875,176.0709991455078,191.06399536132812,204.32899475097656,217.21299743652344,228.6649932861328,237.25,244.48800659179688,251.25599670410156,256.4630126953125,260.94500732421875,254.61599731445312,249.0749969482422,245.38999938964844,244.41000366210938,243.28399658203125,242.1739959716797,241.0449981689453,239.92599487304688,238.80099487304688,237.6719970703125,236.84300231933594,236.30599975585938,236.447998046875,236.447998046875,236.447998046875,236.447998046875,236.447998046875,236.781005859375], ys: [164.15301513671875,170.0150146484375,177.78900146484375,189.78201293945312,207.1199951171875,222.4530029296875,234.78799438476562,243.72000122070312,250.24301147460938,256.0140075683594,261.1059875488281,261.7690124511719,262.2239990234375,262.7829895019531,264.1700134277344,266.30499267578125,268.8800048828125,270.8609924316406,272.5419921875,272.09698486328125,272.09698486328125,272.09698486328125,272.09698486328125,272.09698486328125,272.09698486328125,271.86700439453125,268.4100036621094,261.5409851074219,255.60598754882812,246.11700439453125,233.697998046875,217.54598999023438,203.83499145507812,192.9849853515625,185.10501098632812,178.82998657226562,172.92599487304688,166.63800048828125,160.48599243164062,154.27301025390625,148.94400024414062,143.97000122070312,140.49899291992188] },
        { xs: [173.83900451660156,167.26400756835938,162.71099853515625,156.08700561523438,154.88900756835938,154.5240020751953,155.8679962158203,164.70599365234375,170.63800048828125,175.57899475097656,180.14300537109375,184.58599853515625,189.69500732421875,194.24000549316406,198.3070068359375,200.56399536132812,200.81399536132812,199.36500549316406,195.95899963378906,191.656005859375,186.36500549316406,181.10499572753906,180.83299255371094], ys: [139.49899291992188,139.83200073242188,141.73399353027344,149.8560028076172,155.010009765625,159.30899047851562,166.84600830078125,174.64801025390625,178.22299194335938,180.17001342773438,180.47799682617188,179.45599365234375,176.9219970703125,173.66598510742188,168.614990234375,162.739013671875,156.55599975585938,151.4739990234375,146.968994140625,143.6219940185547,143.4969940185547,146.9499969482422,147.16200256347656] },
        { xs: [149.5279998779297,150.10000610351562,151.08599853515625,152.5570068359375,154.4720001220703,156.67799377441406,157.18800354003906], ys: [228.7860107421875,236.40798950195312,242.80099487304688,251.94100952148438,261.4649963378906,270.38800048828125,273.09600830078125] },
        { xs: [155.8560028076172,156.802001953125], ys: [228.1199951171875,222.10000610351562] }
      ]
    },
    {
      source: "full_raw_fish.ndjson",
      index: 9123,
      drawing: [
        { xs: [573,572,572,572,572,572,573,573,574,574,574,574,574,574,574,574,574,573,572,572,572,573,575,577,580,584,591,599,604,612,617,621,622,624,623], ys: [418,413,406,397,389,381,372,364,356,349,342,330,324,317,308,298,289,281,275,268,274,279,285,290,296,307,320,335,344,356,360,367,372,377,374] },
        { xs: [576,579,589,600,611,621,630,643,648,648,645], ys: [431,426,419,411,404,396,389,377,372,367,365] },
        { xs: [626,626,634,639,645,652,658,665,678,687,693,698,705,713,718,726,733,738,746,757,768,775,780,789,798,806,812,816,825,831,835,838,841,844,848,851,854,855,856,856,855,849,846,842,826,820,810,802,791,782,775,768,762,755,749,743,736,728,721,715,710,704,698,693,687,681,676,671,665,658,653,647,641,636,633], ys: [375,369,342,328,313,298,288,272,257,249,245,243,241,239,238,237,237,237,237,240,243,245,247,251,254,258,264,270,279,285,291,299,308,317,330,336,341,348,359,365,370,381,390,400,418,424,427,426,423,419,414,409,405,403,400,399,398,398,398,398,400,401,401,403,404,402,399,394,390,385,382,379,377,374,370] },
        { xs: [781,775,772,776,782,788,793,795,796,791,786,781,786,778,783,788,783], ys: [277,279,285,290,291,292,290,284,279,277,277,278,280,281,282,280,281] }
      ]
    },
    {
      source: "full_raw_hockey stick.ndjson",
      index: 33830,
      drawing: [
        { xs: [517,519,524,528,533,538,543,548,553,556,560,564,568,571,576,578,580,584,589,594,598,602,607,612,617,623,627,631,636,641,646,651,656,661,666,671,676,681,686,681,676,671,666,661,656,651,647], ys: [110,116,122,128,134,140,146,151,156,161,166,171,176,181,186,191,197,202,209,216,221,227,233,238,243,247,252,257,259,259,259,259,261,263,265,265,265,265,262,262,263,263,263,263,264,264,264] }
      ]
    },
    {
      source: "full_raw_house.ndjson",
      index: 128514,
      drawing: [
        { xs: [594,591,588,582,575,569,562,556,547,544,539,536,536], ys: [61,66,71,81,94,107,120,136,148,155,163,168,168] },
        { xs: [593,601,609,618,631,638,645,648,654,656,661,661], ys: [64,69,78,93,113,130,144,151,158,163,167,169] },
        { xs: [587,596,606,616,623,631,639,652,663,677,690,702,712,724,735,746,757,769,783,795,814,828,837,849,860,871,879,888,894,899,906,910,909,907,906,905,903,902,901,900,899,899,899,898,898,898,898,898,898,898,898,898,898,898,898,898,898,893,880,869,856,840,819,819], ys: [51,51,51,51,51,51,51,51,51,51,51,52,54,55,56,56,56,56,56,56,56,56,56,53,49,46,42,38,35,34,32,37,44,52,58,64,72,81,91,103,113,121,128,134,145,154,167,180,199,209,221,229,234,241,248,254,259,262,264,264,260,242,215,215] },
        { xs: [642,648,657,663,676,682,693,710,720,732,744,756,764,772,779,787,796,803,812,821,831,840,846,855,864,872,878,886,892,897,902,907,912,917,919], ys: [164,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,163,164,165,165,165,165,165,165,165,165,163,161,158,155,154,153] },
        { xs: [531,540,551,565,575,594,601,618,628,637,645,651,656,656], ys: [168,168,168,166,166,166,166,166,166,166,166,168,170,171] },
        { xs: [525,525,525,525,525,525,525,525,525,525,524,522,521,520,519,516,514,512,510,506,504,503,502,509,521,542,565,591,614,628,646,663,676,687,699,710,723,730,741,752,765,776,791,799,808,817,826,836,842,851,856,862,869,875,879,883,889,896,902,906], ys: [170,177,182,187,192,199,210,217,227,235,245,255,261,269,274,279,287,294,299,304,310,315,320,320,316,310,303,297,293,293,293,293,293,293,289,286,281,280,277,274,272,271,271,271,271,271,273,275,277,278,280,281,281,281,274,268,262,256,251,249] },
        { xs: [591,589,589,589,589,589,589,589,589,589,589,589,589,590,591,592,592,592,593,594,599,604,612,626,638,653,662,672,677,686,694,700,706,707,706,705,705,704,701,701,701,699,698,698,698], ys: [246,252,257,264,274,279,287,295,300,285,276,265,256,250,244,239,233,226,220,215,214,215,215,217,217,217,217,215,214,212,210,210,210,215,222,229,235,245,253,261,266,275,282,287,291] },
        { xs: [672,674,668,663,662,668,673,673,666,671,665,660,658,663,668,669], ys: [253,247,245,245,250,255,257,252,252,255,253,254,260,262,258,257] },
        { xs: [745,745,744,744,742,742,741,738,746,754,762,771,782,788,794,802,809,814,815,818,821,823,824,824], ys: [62,68,78,85,92,97,102,108,109,109,106,104,101,100,98,95,92,89,84,75,65,59,54,54] },
        { xs: [670,671,671,671,671,671,676,683,691,696,704,709,715,724,729,733,736,739,741,742,744,745,738,732,726,720,713,708,701,695,690,685,680,675,675], ys: [113,124,134,144,157,163,166,162,159,159,159,159,158,157,156,150,142,130,119,110,104,99,99,102,103,103,103,103,103,104,107,109,111,113,113] },
        { xs: [679,681], ys: [120,120] }
      ]
    },
    {
      source: "./images/full_binary_sun.bin",
      index: 84652,
      drawing: [
        { xs: [139,134,122,110,99,83,67,61,60,71,88,119,129,145,153,151,133], ys: [87,71,49,42,43,56,82,100,127,145,158,164,157,138,119,104,70] },
        { xs: [130,134,167], ys: [70,52,0] },
        { xs: [147,202,243], ys: [91,80,67] },
        { xs: [151,174,181], ys: [147,203,238] },
        { xs: [108,44], ys: [166,255] },
        { xs: [84,27,8,0], ys: [138,135,130,122] },
        { xs: [74,48,30,22], ys: [91,65,29,29] }
      ]
    }
  ];
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
  let autoAdvanceTimeoutId = null;
  let autoAdvancePaused = false;
  let feedbackPlaybackComplete = false;
  let feedbackStepIndex = -1;
  let feedbackPreviewData = null;
  let feedbackStepTimeoutId = null;
  let progressDots = [];
  let confettiCleanupTimeoutId = null;
  let currentTransitionSummaryIndex = 0;
  let transitionSummaryState = {
    works: false,
    good: false,
    struggle: false
  };

  const TRANSITION_SUMMARY_ORDER = ["works", "good", "struggle"];

  const TRANSITION_SUMMARY_CORRECT = {
    works: "rules",
    good: "clear",
    struggle: "unusual"
  };

  function drawCanvasMessage(message) {
    quizCtx.fillStyle = "#f6f6f6";
    quizCtx.fillRect(0, 0, ruleQuizCanvas.width, ruleQuizCanvas.height);
    quizCtx.fillStyle = "#4a4e69";
    quizCtx.textAlign = "center";
    quizCtx.textBaseline = "middle";
    quizCtx.font = "1.4rem Gloria Hallelujah, sans-serif";
    quizCtx.fillText(message, ruleQuizCanvas.width / 2, ruleQuizCanvas.height / 2);
  }

  function initializeProgressDots() {
    if (!ruleProgressEl) return;

    ruleProgressEl.innerHTML = "";
    progressDots = Array.from({ length: TOTAL_ROUNDS }, (_, index) => {
      const dot = document.createElement("span");
      dot.className = "rule-progress-dot";
      dot.setAttribute("aria-hidden", "true");
      dot.dataset.index = String(index);
      ruleProgressEl.appendChild(dot);
      return dot;
    });
  }

  function clearAutoAdvanceTimer() {
    if (autoAdvanceTimeoutId !== null) {
      window.clearTimeout(autoAdvanceTimeoutId);
      autoAdvanceTimeoutId = null;
    }
  }

  function clearFeedbackStepTimer() {
    if (feedbackStepTimeoutId !== null) {
      window.clearTimeout(feedbackStepTimeoutId);
      feedbackStepTimeoutId = null;
    }
  }

  function clearConfettiBurst() {
    if (confettiCleanupTimeoutId !== null) {
      window.clearTimeout(confettiCleanupTimeoutId);
      confettiCleanupTimeoutId = null;
    }
    if (confettiLayerEl) {
      confettiLayerEl.innerHTML = "";
    }
  }

  function resetTransitionSummary() {
    currentTransitionSummaryIndex = 0;
    transitionSummaryState = {
      works: false,
      good: false,
      struggle: false
    };

    transitionSummaryItems.forEach((item, index) => {
      item.classList.remove("is-complete");
      item.hidden = index !== 0;
    });

    transitionChoiceButtons.forEach(button => {
      button.disabled = false;
      button.hidden = false;
      button.classList.remove("is-correct", "is-incorrect", "is-eliminated");
      button.setAttribute("aria-pressed", "false");
      button.removeAttribute("aria-disabled");
    });

    TRANSITION_SUMMARY_ORDER.forEach(itemKey => {
      const relatedButtons = transitionChoiceButtons.filter(button => button.dataset.summaryItem === itemKey);
      const choicesContainer = relatedButtons[0]?.closest(".rule-transition-summary-choices");
      if (choicesContainer) {
        shuffle(relatedButtons).forEach(button => choicesContainer.appendChild(button));
      }
    });

    if (transitionSummaryIntroEl) transitionSummaryIntroEl.hidden = false;
    if (transitionSummaryProgressEl) transitionSummaryProgressEl.hidden = false;
    if (transitionSummaryFinalEl) transitionSummaryFinalEl.hidden = true;

    updateTransitionSummaryProgress();

    if (moduleTransitionButton) {
      moduleTransitionButton.disabled = true;
    }
  }

  function updateTransitionSummaryProgress() {
    if (!transitionSummaryProgressEl) return;
    const total = TRANSITION_SUMMARY_ORDER.length;
    if (Object.values(transitionSummaryState).every(Boolean)) {
      transitionSummaryProgressEl.textContent = `${total} / ${total}`;
      return;
    }

    transitionSummaryProgressEl.textContent = `${Math.min(currentTransitionSummaryIndex + 1, total)} / ${total}`;
  }

  function updateTransitionButtonState() {
    if (!moduleTransitionButton) return;
    moduleTransitionButton.disabled = !Object.values(transitionSummaryState).every(Boolean);
  }

  function showNextTransitionSummaryItem() {
    const total = TRANSITION_SUMMARY_ORDER.length;
    currentTransitionSummaryIndex += 1;

    if (currentTransitionSummaryIndex >= total) {
      if (transitionSummaryIntroEl) transitionSummaryIntroEl.hidden = true;
      if (transitionSummaryProgressEl) transitionSummaryProgressEl.hidden = true;
      transitionSummaryItems.forEach(item => {
        item.hidden = true;
      });
      if (transitionSummaryFinalEl) transitionSummaryFinalEl.hidden = false;
      updateTransitionSummaryProgress();
      if (moduleTransitionButton) {
        window.requestAnimationFrame(() => moduleTransitionButton.focus());
      }
      return;
    }

    const nextKey = TRANSITION_SUMMARY_ORDER[currentTransitionSummaryIndex];
    const nextItem = transitionSummaryItems.find(item => item.dataset.summaryItem === nextKey);
    transitionSummaryItems.forEach(item => {
      item.hidden = true;
    });
    if (nextItem) {
      nextItem.hidden = false;
      updateTransitionSummaryProgress();
      window.requestAnimationFrame(() => {
        const firstChoice = nextItem.querySelector(".rule-transition-choice");
        if (firstChoice) firstChoice.focus();
      });
    }
  }

  function handleTransitionChoice(button) {
    const itemKey = button.dataset.summaryItem;
    const value = button.dataset.summaryValue;
    if (!itemKey || transitionSummaryState[itemKey]) return;

    const relatedButtons = transitionChoiceButtons.filter(candidate => candidate.dataset.summaryItem === itemKey);
    const itemShell = transitionSummaryItems.find(item => item.dataset.summaryItem === itemKey);
    const isCorrect = TRANSITION_SUMMARY_CORRECT[itemKey] === value;

    if (isCorrect) {
      launchConfettiBurst();
      transitionSummaryState[itemKey] = true;
      if (itemShell) itemShell.classList.add("is-complete");
      relatedButtons.forEach(candidate => {
        candidate.disabled = true;
        candidate.classList.remove("is-incorrect", "is-eliminated");
        if (candidate === button) {
          candidate.classList.add("is-correct");
          candidate.setAttribute("aria-pressed", "true");
          candidate.hidden = false;
        } else {
          candidate.setAttribute("aria-pressed", "false");
          candidate.hidden = true;
        }
      });
      updateTransitionButtonState();
      showNextTransitionSummaryItem();
      return;
    }

    button.classList.add("is-incorrect", "is-eliminated");
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");
  }

  function launchConfettiBurst() {
    if (!confettiLayerEl) return;

    clearConfettiBurst();

    const colors = ["#f9c74f", "#f3722c", "#f94144", "#90be6d", "#577590", "#f9844a"];
    const pieceCount = 42;

    for (let index = 0; index < pieceCount; index++) {
      const piece = document.createElement("span");
      piece.className = "rule-confetti-piece";
      piece.style.left = `${42 + Math.random() * 16}%`;
      piece.style.background = colors[index % colors.length];
      piece.style.animationDelay = `${Math.random() * 140}ms`;
      piece.style.animationDuration = `${1200 + Math.random() * 420}ms`;
      piece.style.setProperty("--confetti-x", `${(Math.random() - 0.5) * 520}px`);
      piece.style.setProperty("--confetti-rotate", `${360 + Math.random() * 720}deg`);
      piece.style.width = `${9 + Math.random() * 7}px`;
      piece.style.height = `${14 + Math.random() * 12}px`;
      confettiLayerEl.appendChild(piece);
    }

    confettiCleanupTimeoutId = window.setTimeout(() => {
      clearConfettiBurst();
    }, 1900);
  }

  function resetFeedbackSequenceUi() {
    feedbackStepIndex = -1;
    feedbackPreviewData = null;

    if (ruleSequenceCalloutEl) ruleSequenceCalloutEl.hidden = true;
    if (ruleSequenceStepCountEl) ruleSequenceStepCountEl.textContent = "";
    if (ruleSequenceStepTextEl) ruleSequenceStepTextEl.textContent = "";
    if (ruleSequenceSkipBtn) ruleSequenceSkipBtn.hidden = true;
    if (ruleCanvasOverlayEl) {
      const overlayCtx = ruleCanvasOverlayEl.getContext("2d");
      overlayCtx.clearRect(0, 0, ruleCanvasOverlayEl.width, ruleCanvasOverlayEl.height);
      ruleCanvasOverlayEl.hidden = true;
    }
    if (rulePageEl) rulePageEl.classList.remove("sequence-open");
  }

  function advanceAfterReveal() {
    clearAutoAdvanceTimer();
    clearFeedbackStepTimer();
    hideFeedbackOverlay();

    if (completedRounds >= TOTAL_ROUNDS) {
      showFinalQuestion();
      return;
    }

    beginRound();
  }

  function hideFeedbackOverlay() {
    autoAdvancePaused = false;
    feedbackPlaybackComplete = false;
    clearFeedbackStepTimer();
    resetFeedbackSequenceUi();
    if (feedbackOverlayEl) feedbackOverlayEl.hidden = true;
    if (rulePageEl) rulePageEl.classList.remove("overlay-open");
  }

  function showFeedbackPanel(playerAnswer, aiAnswer) {
    if (!feedbackOverlayEl || !feedbackCardEl) return;

    const isMatch = playerAnswer === aiAnswer;
    feedbackCardEl.dataset.state = isMatch ? "correct" : "incorrect";
    if (feedbackResultEl) {
      feedbackResultEl.textContent = isMatch
        ? t("rulesOverlayCorrect")
        : t("rulesOverlayIncorrect");
    }
    if (feedbackPlayerEl) feedbackPlayerEl.textContent = t(playerAnswer);
    if (feedbackAiEl) feedbackAiEl.textContent = t(aiAnswer);
    if (feedbackAhaEl) {
      feedbackAhaEl.hidden = completedRounds !== 7;
      if (feedbackAhaTextEl) feedbackAhaTextEl.textContent = t("rulesAhaHardDoodle");
    }
    if (feedbackReviewBtn) {
      feedbackReviewBtn.hidden = isMatch || !currentRound?.rule;
      feedbackReviewBtn.textContent = t("rulesOverlayReview");
    }
    if (feedbackNextBtn) {
      feedbackNextBtn.textContent = completedRounds >= TOTAL_ROUNDS
        ? t("rulesToFinalQuestion")
        : t("rulesOverlayNextNow");
    }
    updateFeedbackHint();
    feedbackOverlayEl.hidden = false;
    if (rulePageEl) rulePageEl.classList.add("overlay-open");
  }

  function updateFeedbackHint() {
    if (!feedbackHintEl) return;

    if (!feedbackPlaybackComplete) {
      feedbackHintEl.textContent = t("rulesOverlayChecking");
      return;
    }

    feedbackHintEl.textContent = "";
  }

  function buildRuleExplanationText(rule, index) {
    if (!rule?.conditions?.[index]) return "";

    return rule.explanationKeys?.[index]
      ? t(rule.explanationKeys[index])
      : buildConditionText(rule.conditions[index]);
  }

  function buildRuleDisplaySteps(rule) {
    if (!rule?.conditions?.length) return [];

    const steps = [];
    let explanationIndex = 0;

    for (let index = 0; index < rule.conditions.length; index++) {
      const condition = rule.conditions[index];
      const nextCondition = rule.conditions[index + 1];
      const shouldCombineAspectRange =
        condition.feature === "aspectRatio" &&
        condition.op === ">" &&
        nextCondition?.feature === "aspectRatio" &&
        nextCondition.op === "<" &&
        Array.isArray(rule.explanationKeys) &&
        rule.explanationKeys.length < rule.conditions.length;

      if (shouldCombineAspectRange) {
        const explanationKey = rule.explanationKeys?.[explanationIndex] || null;
        steps.push({
          primaryCondition: condition,
          explanationText: explanationKey ? t(explanationKey) : buildConditionText(condition)
        });
        explanationIndex += 1;
        index += 1;
        continue;
      }

      const explanationKey = rule.explanationKeys?.[explanationIndex] || null;
      steps.push({
        primaryCondition: condition,
        explanationText: explanationKey ? t(explanationKey) : buildConditionText(condition)
      });
      explanationIndex += 1;
    }

    return steps;
  }

  function drawRuleOverlayOnCanvas(condition, previewData) {
    if (!ruleCanvasOverlayEl || !previewData) return;

    const overlayCtx = ruleCanvasOverlayEl.getContext("2d");
    const { normalizedCanvas, features, featureSize } = previewData;
    const canvasWidth = ruleCanvasOverlayEl.width;
    const canvasHeight = ruleCanvasOverlayEl.height;
    const scale = canvasWidth / featureSize;
    const bboxX = features.minX * scale;
    const bboxY = features.minY * scale;
    const bboxWidth = Math.max(1, features.boxWidth * scale);
    const bboxHeight = Math.max(1, features.boxHeight * scale);
    const highlight = "rgba(249, 199, 79, 0.28)";
    const outline = "#f3722c";

    overlayCtx.clearRect(0, 0, canvasWidth, canvasHeight);
    overlayCtx.fillStyle = "#f6f6f6";
    overlayCtx.fillRect(0, 0, canvasWidth, canvasHeight);
    overlayCtx.drawImage(normalizedCanvas, 0, 0, canvasWidth, canvasHeight);

    if (condition.feature === "topRatio") {
      overlayCtx.fillStyle = highlight;
      overlayCtx.fillRect(0, 0, canvasWidth, canvasHeight / 3);
    } else if (condition.feature === "middleHRatio") {
      overlayCtx.fillStyle = highlight;
      overlayCtx.fillRect(0, canvasHeight / 3, canvasWidth, canvasHeight / 3);
    } else if (condition.feature === "bottomRatio") {
      overlayCtx.fillStyle = highlight;
      overlayCtx.fillRect(0, (canvasHeight / 3) * 2, canvasWidth, canvasHeight / 3);
    } else if (condition.feature === "leftRatio") {
      overlayCtx.fillStyle = highlight;
      overlayCtx.fillRect(0, 0, canvasWidth / 3, canvasHeight);
    } else if (condition.feature === "rightRatio") {
      overlayCtx.fillStyle = highlight;
      overlayCtx.fillRect((canvasWidth / 3) * 2, 0, canvasWidth / 3, canvasHeight);
    } else if (condition.feature === "verticalSymmetry") {
      overlayCtx.strokeStyle = outline;
      overlayCtx.setLineDash([12, 10]);
      overlayCtx.lineWidth = 4;
      overlayCtx.beginPath();
      overlayCtx.moveTo(canvasWidth / 2, 20);
      overlayCtx.lineTo(canvasWidth / 2, canvasHeight - 20);
      overlayCtx.stroke();
      overlayCtx.setLineDash([]);
    } else if (condition.feature === "density") {
      overlayCtx.fillStyle = condition.op === ">" ? "rgba(249, 175, 175, 0.24)" : "rgba(249, 199, 79, 0.18)";
      overlayCtx.fillRect(bboxX, bboxY, bboxWidth, bboxHeight);
    } else if (condition.feature === "aspectRatio") {
      const squareSide = Math.min(bboxHeight, bboxWidth, canvasWidth * 0.72);
      const squareX = bboxX + (bboxWidth - squareSide) / 2;
      const squareY = bboxY + (bboxHeight - squareSide) / 2;
      overlayCtx.fillStyle = "rgba(249, 199, 79, 0.18)";
      overlayCtx.fillRect(squareX, squareY, squareSide, squareSide);
      overlayCtx.strokeStyle = outline;
      overlayCtx.lineWidth = 4;
      overlayCtx.setLineDash([10, 8]);
      overlayCtx.strokeRect(squareX, squareY, squareSide, squareSide);
      overlayCtx.setLineDash([]);
    }

    ruleCanvasOverlayEl.hidden = false;
  }

  function finishFeedbackSequence() {
    if (feedbackPlaybackComplete) return;
    feedbackPlaybackComplete = true;
    clearFeedbackStepTimer();
    resetFeedbackSequenceUi();
    showFeedbackPanel(currentRound.playerAnswer, currentRound.aiAnswer);
  }

  function skipFeedbackSequence() {
    if (feedbackPlaybackComplete) return;
    finishFeedbackSequence();
  }

  function replayFeedbackSequence() {
    if (!currentRound?.answered || currentRound.playerAnswer === currentRound.aiAnswer || !currentRound.rule) return;
    feedbackPlaybackComplete = false;
    playFeedbackSequence(currentRound.rule);
  }

  function renderFeedbackRuleStep(rule, index) {
    const displaySteps = buildRuleDisplaySteps(rule);
    const step = displaySteps[index];
    if (!step) return;

    feedbackStepIndex = index;

    if (rulePageEl) rulePageEl.classList.add("sequence-open");
    if (ruleSequenceCalloutEl) ruleSequenceCalloutEl.hidden = false;
    if (ruleSequenceStepCountEl) {
      ruleSequenceStepCountEl.textContent = `${t("rulesOverlayStepCounterLabel")} ${index + 1}/${displaySteps.length}`;
    }
    if (ruleSequenceStepTextEl) {
      ruleSequenceStepTextEl.textContent = step.explanationText;
    }
    if (ruleSequenceSkipBtn) ruleSequenceSkipBtn.hidden = false;
    drawRuleOverlayOnCanvas(step.primaryCondition, feedbackPreviewData);
  }

  function queueNextFeedbackRuleStep(rule, index) {
    const displaySteps = buildRuleDisplaySteps(rule);
    if (!displaySteps.length) {
      finishFeedbackSequence();
      return;
    }

    const isLastVisibleStep = index >= displaySteps.length - 1;
    const delay = isLastVisibleStep ? RULE_CHECK_FINISH_DELAY : RULE_CHECK_STEP_DELAY;

    clearFeedbackStepTimer();
    feedbackStepTimeoutId = window.setTimeout(() => {
      if (isLastVisibleStep) {
        finishFeedbackSequence();
        return;
      }

      renderFeedbackRuleStep(rule, index + 1);
      queueNextFeedbackRuleStep(rule, index + 1);
    }, delay);
  }

  function playFeedbackSequence(rule) {
    clearFeedbackStepTimer();
    resetFeedbackSequenceUi();
    feedbackPlaybackComplete = false;
    if (feedbackOverlayEl) feedbackOverlayEl.hidden = true;
    if (rulePageEl) rulePageEl.classList.remove("overlay-open");

    if (!ruleSequenceCalloutEl || !ruleCanvasOverlayEl) {
      finishFeedbackSequence();
      return;
    }

    const displaySteps = buildRuleDisplaySteps(rule);

    if (!displaySteps.length) {
      if (rulePageEl) rulePageEl.classList.add("sequence-open");
      if (ruleSequenceCalloutEl) ruleSequenceCalloutEl.hidden = false;
      if (ruleSequenceStepCountEl) ruleSequenceStepCountEl.textContent = "";
      if (ruleSequenceStepTextEl) ruleSequenceStepTextEl.textContent = t("rulesExplainFallback");
      if (ruleSequenceSkipBtn) ruleSequenceSkipBtn.hidden = false;
      if (ruleCanvasOverlayEl) ruleCanvasOverlayEl.hidden = true;
      clearFeedbackStepTimer();
      feedbackStepTimeoutId = window.setTimeout(() => {
        finishFeedbackSequence();
      }, RULE_CHECK_FINISH_DELAY);
      return;
    }

    feedbackPreviewData = currentRound?.sample?.drawing
      ? createRulePreviewData(currentRound.sample.drawing, ruleCanvasOverlayEl.width, 64)
      : null;

    renderFeedbackRuleStep(rule, 0);
    queueNextFeedbackRuleStep(rule, 0);
  }

  function showFeedbackOverlay(playerAnswer, aiAnswer, rule) {
    feedbackPlaybackComplete = false;
    playFeedbackSequence(rule);
  }

  function pauseAutoAdvanceForReveal() {
    if (!currentRound?.answered || feedbackOverlayEl?.hidden) return;

    clearAutoAdvanceTimer();
    autoAdvancePaused = true;
    updateFeedbackHint();
  }

  function updateDocumentLanguage() {
    document.documentElement.lang = currentLang === "da" ? "da" : "en";
    document.title = t("pageTitleRuleBased");
  }

  window.applyRulesTranslations = function applyRulesTranslations() {
    updateDocumentLanguage();

    if (inFinalQuestion) {
      ruleQuestionEl.textContent = t("rulesFinalQuestion");
      if (ruleHelperEl) {
        ruleHelperEl.textContent = t("rulesFinalHelper");
      }
    } else {
      ruleQuestionEl.textContent = t("rulesPredictionQuestion");
      if (ruleHelperEl) {
        ruleHelperEl.textContent = t("rulesPredictionHelper");
      }
    }

    if (!currentRound) return;

    if (currentRound.answered) {
      if (feedbackCardEl) {
        feedbackCardEl.dataset.state = currentRound.playerAnswer === currentRound.aiAnswer ? "correct" : "incorrect";
      }
      if (feedbackResultEl) {
        feedbackResultEl.textContent = currentRound.playerAnswer === currentRound.aiAnswer
          ? t("rulesOverlayCorrect")
          : t("rulesOverlayIncorrect");
      }
      if (feedbackPlayerEl) feedbackPlayerEl.textContent = t(currentRound.playerAnswer);
      if (feedbackAiEl) feedbackAiEl.textContent = t(currentRound.aiAnswer);
      if (feedbackAhaEl) {
        feedbackAhaEl.hidden = completedRounds !== 7;
        if (feedbackAhaTextEl) feedbackAhaTextEl.textContent = t("rulesAhaHardDoodle");
      }
      if (feedbackReviewBtn) {
        feedbackReviewBtn.hidden = currentRound.playerAnswer === currentRound.aiAnswer || !currentRound.rule;
        feedbackReviewBtn.textContent = t("rulesOverlayReview");
      }
      if (feedbackNextBtn) {
        feedbackNextBtn.textContent = completedRounds >= TOTAL_ROUNDS
          ? t("rulesToFinalQuestion")
          : t("rulesOverlayNextNow");
      }
      updateFeedbackHint();
      if (feedbackStepIndex >= 0) {
        renderFeedbackRuleStep(currentRound.rule, feedbackStepIndex);
      }
      playerAnswerValueEl.textContent = t(currentRound.playerAnswer);
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

  function getConditionMargin(features, condition) {
    const value = features[condition.feature];
    const scale = FEATURE_MARGIN_SCALES[condition.feature] || 0.1;
    const delta = condition.op === ">"
      ? value - condition.value
      : condition.value - value;

    return delta / scale;
  }

  function getRuleStrength(features, rule) {
    if (!rule) return Number.NEGATIVE_INFINITY;
    return Math.min(...rule.conditions.map(condition => getConditionMargin(features, condition)));
  }

  function computeClarityScore(features, winningRule) {
    if (!winningRule || features.empty) return Number.NEGATIVE_INFINITY;

    const winningStrength = getRuleStrength(features, winningRule);
    const strongestAlternative = builtInRules
      .filter(rule => rule !== winningRule)
      .reduce((best, rule) => Math.max(best, getRuleStrength(features, rule)), Number.NEGATIVE_INFINITY);

    return winningStrength - strongestAlternative + winningStrength * 0.35;
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

  function analyzeDrawing(drawing) {
    drawQuickDraw(drawing);
    const normalizedCanvas = normalizeCanvas(quizCtx, ruleQuizCanvas.width, ruleQuizCanvas.height, 64);
    const normalizedCtx = normalizedCanvas.getContext("2d");
    const features = extractFeatures(normalizedCtx, 64, 64);
    const classification = classifyByRules(features);

    return {
      ...classification,
      features,
      clarityScore: computeClarityScore(features, classification.rule)
    };
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

  function inferTruthLabelKey(sourceValue) {
    if (!sourceValue) return null;

    const normalized = String(sourceValue).toLowerCase();
    if (normalized.includes("mona lisa")) return "labelMonaLisa";
    if (normalized.includes("hockey stick") || normalized.includes("hockey_stick")) return "labelHockeyStick";
    if (normalized.includes("crocodile")) return "labelCrocodile";
    if (normalized.includes("house")) return "labelHouse";
    if (normalized.includes("fish")) return "labelFish";
    if (normalized.includes("bee")) return "labelBee";
    if (normalized.includes("sun")) return "labelSun";
    return null;
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

    const displaySteps = buildRuleDisplaySteps(rule);

    displaySteps.forEach(step => {
      const condition = step.primaryCondition;
      const item = document.createElement("li");
      item.className = "rule-condition-item";

      const visualization = previewData
        ? createRuleVisualizationCanvas(condition, previewData)
        : null;

      const body = document.createElement("div");
      body.className = "rule-condition-body";

      const text = document.createElement("p");
      text.className = "rule-condition-text";
      text.textContent = step.explanationText;

      if (visualization) {
        item.appendChild(visualization);
      }

      body.appendChild(text);
      item.appendChild(body);
      rulesAppliedListEl.appendChild(item);
    });
  }

  function updateRevealChipLabels() {
    if (rulesRevealChipEl) {
      const ruleCount = buildRuleDisplaySteps(currentRound?.rule).length;
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
    if (openRevealPanel === "rules") {
      pauseAutoAdvanceForReveal();
    }
    updateRevealPanels();
  }

  function updateProgress() {
    if (!ruleProgressEl) return;
    const currentIndex = Math.min(completedRounds, TOTAL_ROUNDS - 1);

    progressDots.forEach((dot, index) => {
      dot.classList.toggle("is-complete", index < completedRounds);
      dot.classList.toggle("is-current", index === currentIndex && completedRounds < TOTAL_ROUNDS);
    });

    ruleProgressEl.setAttribute(
      "aria-label",
      `Round ${Math.min(completedRounds + 1, TOTAL_ROUNDS)} of ${TOTAL_ROUNDS}`
    );
  }

  function setRoundAnswerChoices(correctAnswer, truthAnswer = correctAnswer) {
    const requiredChoices = [...new Set([correctAnswer, truthAnswer].filter(Boolean))];
    const distractors = shuffle(answerChoicePool.filter(choice => !requiredChoices.includes(choice)));
    const selectedChoices = shuffle([
      ...requiredChoices,
      ...distractors.slice(0, Math.max(0, answerButtons.length - requiredChoices.length))
    ]);

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
    clearAutoAdvanceTimer();
    hideFeedbackOverlay();

    if (ruleQuestionEl) ruleQuestionEl.hidden = false;
    if (rulePlayAreaEl) rulePlayAreaEl.hidden = false;
    if (ruleProgressEl) ruleProgressEl.hidden = false;
    answerButtons.forEach(button => {
      button.disabled = false;
      button.hidden = false;
      button.classList.remove("selected", "correct", "incorrect");
    });

    if (revealSection) revealSection.hidden = true;
    if (finalQuestionSection) finalQuestionSection.hidden = true;
    if (rulesAppliedListEl) rulesAppliedListEl.innerHTML = "";
    if (playerStatusEl) playerStatusEl.textContent = "";
    if (playerAnswerValueEl) playerAnswerValueEl.textContent = "-";
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

  function takeDifficultySamples(pool, count, usedSamples) {
    const available = pool.filter(sample => !usedSamples.has(sample));
    const selected = [];
    const usedLabels = new Set();

    while (selected.length < count && available.length) {
      let nextIndex = available.findIndex(sample => !usedLabels.has(sample.aiAnswer));
      if (nextIndex === -1) nextIndex = 0;

      const [nextSample] = available.splice(nextIndex, 1);
      selected.push(nextSample);
      usedSamples.add(nextSample);
      usedLabels.add(nextSample.aiAnswer);
    }

    return selected;
  }

  function sampleMatchesKey(sample, key) {
    return sample.source === key.source && sample.index === key.index;
  }

  function buildRoundQueue() {
    const allScoredSamples = samplePool
      .filter(sample => Number.isFinite(sample.clarityScore))
      .sort((a, b) => b.clarityScore - a.clarityScore);
    const round4MonaLisaSample = allScoredSamples.find(sample =>
      sample.labelKey === "labelMonaLisa" && sample.aiAnswer === "labelMonaLisa"
    );
    const round8ReplacementSample = allScoredSamples.find(sample => sampleMatchesKey(sample, ROUND8_REPLACEMENT_KEY));
    const round9ReplacementSample = allScoredSamples.find(sample => sampleMatchesKey(sample, ROUND9_REPLACEMENT_KEY));
    const scoredSamples = allScoredSamples.filter(sample =>
      sample !== round4MonaLisaSample &&
      !sampleMatchesKey(sample, ROUND8_REPLACEMENT_KEY) &&
      !sampleMatchesKey(sample, ROUND9_REPLACEMENT_KEY)
    );
    const forcedRounds = [];
    const usedSamples = new Set();
    const forcedCounts = {
      easy: 0,
      medium: 0,
      hard: 0
    };

    FIXED_OPENING_SAMPLE_KEYS.forEach(key => {
      const forcedSample = scoredSamples.find(sample => sampleMatchesKey(sample, key));
      if (forcedSample && !usedSamples.has(forcedSample)) {
        forcedRounds.push(forcedSample);
        usedSamples.add(forcedSample);
        if (forcedCounts[key.tier] !== undefined) {
          forcedCounts[key.tier] += 1;
        }
      }
    });

    const easyWindow = Math.max(DIFFICULTY_DISTRIBUTION.easy, Math.ceil(scoredSamples.length * 0.35));
    const hardWindow = Math.max(DIFFICULTY_DISTRIBUTION.hard, Math.ceil(scoredSamples.length * 0.35));
    const easyCandidates = scoredSamples.slice(0, easyWindow);
    const hardCandidates = scoredSamples.slice(-hardWindow);
    const mediumCandidates = scoredSamples.slice(easyWindow, Math.max(easyWindow, scoredSamples.length - hardWindow));
    const easyRounds = takeDifficultySamples(
      easyCandidates,
      Math.max(0, DIFFICULTY_DISTRIBUTION.easy - forcedCounts.easy),
      usedSamples
    )
      .sort((a, b) => b.clarityScore - a.clarityScore);
    const mediumRounds = takeDifficultySamples(
      mediumCandidates,
      Math.max(0, DIFFICULTY_DISTRIBUTION.medium - forcedCounts.medium),
      usedSamples
    )
      .sort((a, b) => b.clarityScore - a.clarityScore);
    const hardRounds = takeDifficultySamples(
      hardCandidates,
      Math.max(0, DIFFICULTY_DISTRIBUTION.hard - forcedCounts.hard),
      usedSamples
    )
      .sort((a, b) => b.clarityScore - a.clarityScore);

    const queue = [...forcedRounds, ...easyRounds, ...mediumRounds, ...hardRounds];
    const leftovers = scoredSamples.filter(sample => !usedSamples.has(sample));

    while (queue.length < TOTAL_ROUNDS && leftovers.length) {
      queue.push(leftovers.shift());
    }

    const finalQueue = queue.slice(0, TOTAL_ROUNDS);
    if (finalQueue.length >= 8) {
      [finalQueue[3], finalQueue[7]] = [finalQueue[7], finalQueue[3]];
    }
    if (finalQueue.length >= 10) {
      const currentRound8 = finalQueue[7];
      if (round8ReplacementSample) {
        finalQueue[7] = round8ReplacementSample;
      }
      if (round9ReplacementSample) {
        finalQueue[8] = round9ReplacementSample;
      }
      if (currentRound8) {
        finalQueue[9] = currentRound8;
      }
    }
    if (finalQueue.length >= 4 && round4MonaLisaSample) {
      finalQueue[3] = round4MonaLisaSample;
    }

    return finalQueue;
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

    setRoundAnswerChoices(currentRound.aiAnswer, currentRound.sample.labelKey);
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
    playerStatusEl.textContent = playerAnswer === currentRound.aiAnswer
      ? t("rulesPlayerMatched")
      : t("rulesPlayerDiffered");
    renderAppliedRules(currentRound.rule);
    updateRevealChipLabels();
    if (revealSection) revealSection.hidden = true;
    completedRounds += 1;
    showFeedbackOverlay(playerAnswer, currentRound.aiAnswer, currentRound.rule);
  }

  function showFinalQuestion() {
    inFinalQuestion = true;
    currentRound = null;
    if (ruleQuestionEl) ruleQuestionEl.hidden = true;
    if (rulePlayAreaEl) rulePlayAreaEl.hidden = true;
    if (ruleProgressEl) ruleProgressEl.hidden = true;
    progressDots.forEach(dot => {
      dot.classList.add("is-complete");
      dot.classList.remove("is-current");
    });
    if (ruleProgressEl) {
      ruleProgressEl.setAttribute("aria-label", `Round ${TOTAL_ROUNDS} of ${TOTAL_ROUNDS}`);
    }
    answerButtons.forEach(button => {
      button.hidden = true;
    });
    revealSection.hidden = true;
    finalQuestionSection.hidden = true;
    if (moduleTransitionSection) moduleTransitionSection.hidden = false;
    resetTransitionSummary();
    finalAnswerChoice = null;
    hideFeedbackOverlay();
    if (moduleTransitionButton) {
      window.requestAnimationFrame(() => {
        const firstChoice = transitionChoiceButtons.find(button => button.dataset.summaryItem === "works");
        if (firstChoice) {
          firstChoice.focus();
        } else {
          moduleTransitionButton.focus();
        }
      });
    }
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

          const result = analyzeDrawing(drawing);
          const truthLabelKey = inferTruthLabelKey(entry.word || payload.source_file || path) || result.label;
          return {
            labelKey: truthLabelKey,
            drawing,
            aiAnswer: result.label,
            rule: result.rule,
            features: result.features,
            clarityScore: result.clarityScore,
            source: payload.source_file || path,
            index: entry.key_id ? Number(entry.key_id) : -1,
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
    const embeddedSamples = [...FIXED_OPENING_SAMPLES, ...EMBEDDED_SAMPLES].map(sample => {
        const result = analyzeDrawing(sample.drawing);
        const truthLabelKey = inferTruthLabelKey(sample.source) || result.label;
        return {
          labelKey: truthLabelKey,
          drawing: sample.drawing,
          aiAnswer: result.label,
          rule: result.rule,
          features: result.features,
          clarityScore: result.clarityScore,
          source: sample.source || "embedded",
          index: Number.isFinite(sample.index) ? sample.index : -1
        };
      }).filter(sample => supportedLabels.has(sample.aiAnswer));

    const jsonSamples = await loadJsonSamples();
    samplePool = [...embeddedSamples, ...jsonSamples];
    answerChoicePool = [...new Set(samplePool.flatMap(sample => [sample.aiAnswer, sample.labelKey]).filter(Boolean))];

    if (samplePool.length) {
      return;
    }

    const loaded = await Promise.all(DATASETS.map(async dataset => {
      const response = await fetch(dataset.path);
      if (!response.ok) return [];

      const buffer = await response.arrayBuffer();
      const drawings = parseQuickDrawBinary(buffer, DATASET_LIMIT);

      return drawings.map((drawing, index) => {
        const result = analyzeDrawing(drawing);
        return {
          labelKey: dataset.labelKey,
          drawing,
          aiAnswer: result.label,
          rule: result.rule,
          features: result.features,
          clarityScore: result.clarityScore,
          source: dataset.path,
          index
        };
      });
    }));

    samplePool = loaded
      .flat()
      .filter(sample => supportedLabels.has(sample.aiAnswer));
    answerChoicePool = [...new Set(samplePool.flatMap(sample => [sample.aiAnswer, sample.labelKey]).filter(Boolean))];
  }

  answerButtons.forEach(button => {
    button.addEventListener("click", () => revealRound(button.dataset.answer));
  });

  finalAnswerButtons.forEach(button => {
    button.addEventListener("click", () => handleFinalAnswer(button.dataset.finalAnswer));
  });

  if (moduleTransitionButton) {
    moduleTransitionButton.addEventListener("click", () => {
      if (moduleTransitionButton.disabled) return;
      localStorage.setItem("imageClassifierUnlocked", "true");
      sessionStorage.setItem("homeScreen", "levels");
      sessionStorage.setItem("skipHomeTransition", "true");
      sessionStorage.setItem("levelMenuHighlightTarget", "classifier");
      window.location.href = "index.html";
    });
  }

  transitionChoiceButtons.forEach(button => {
    button.addEventListener("click", () => handleTransitionChoice(button));
  });

  if (ruleSequenceSkipBtn) {
    ruleSequenceSkipBtn.addEventListener("click", skipFeedbackSequence);
  }

  if (feedbackReviewBtn) {
    feedbackReviewBtn.addEventListener("click", replayFeedbackSequence);
  }

  if (rulesRevealChipEl) {
    rulesRevealChipEl.addEventListener("click", () => toggleRevealPanel("rules"));
  }

  if (feedbackOverlayEl) {
    feedbackOverlayEl.addEventListener("click", event => {
      if (event.target === feedbackOverlayEl) {
        advanceAfterReveal();
      }
    });
  }

  if (feedbackNextBtn) {
    feedbackNextBtn.addEventListener("click", () => {
      advanceAfterReveal();
    });
  }

  updateDocumentLanguage();
  applyTranslations();
  initializeProgressDots();
  updateProgress();
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
