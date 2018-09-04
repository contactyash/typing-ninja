import chartErrors from "./chartErrors.js";
import showStats from "./statsClickHandle.js";
import { randomWordGen, getSample } from "./getSample.js";
import fetchArticles, { apiResults } from "./random-article.js";
import speedTest from "./speedTest.js";
import chartAccuracyAndNPM from "./chartAccuracyAndNPM.js";
const modeButton = document.querySelector(".toggle-btn");
const wordsBox = document.querySelector(".words-array");
let testModeOn = false;
let nextSample;
let randomWord;
let randomWordArr;
let currentKeyToType = 0;
let sampleTimeStart = 0;
let sampleTimeEnd = 0;
let totalSampleTime = 0;
let totalErrorChar = 0;
const currentSampleErrors = [];
const last20SamplesErrors = [];
let allSamplesErrorsObj = {};
const last3NPM = [];
let last3averageNPM = 0;
const last3Accuracy = [];
let last3averageAccuracy = 0;
let sampleCounter = 0;
let allNPM = [];
let allAccuracy = [];

chartErrors();
chartAccuracyAndNPM();
function typing(e) {
  if (testModeOn && apiResults.length === 0) return; //the time of fetching data;
  if (randomWord === undefined) {
    showSample();
  }

  if (e.key === randomWord[currentKeyToType]) {
    // start time when pressed first key
    if (currentKeyToType === 0) {
      sampleTimeStart = Date.now();
    }
    keyTyped("correct");
  } else if (
    randomWord[currentKeyToType] === " " &&
    e.keyCode === 32 &&
    e.keyCode !== 8
  ) {
    keyTyped("correct");
  } // if currentKeyToType is space and pressed incorrect
  else if (
    randomWord[currentKeyToType] === " " && //if space
    e.keyCode !== 32 &&
    e.keyCode !== 8
  ) {
    totalErrorChar += 1;

    keyTyped("incorrect");
  } else if (
    e.keyCode === 8 && // check if backspace
    currentKeyToType > 0 && //  you can't go more back
    randomWord[currentKeyToType - 1] !== " " // no backspace if moved to next word
  ) {
    // replace previous key with previous span class .bg-prev .bg-next is same as
    keyTyped("back");
  } else if (
    e.key !== randomWord[currentKeyToType] && //typed key is anything other than current key
    e.keyCode !== 8
  ) {
    if (currentKeyToType === 0 && e.keyCode === 32) return;
    if (e.key === "Shift") return;
    last20SamplesErrors.push(e.key);
    currentSampleErrors.push(e.key);
    //start sample time even if first key is wrong
    totalErrorChar += 1;

    keyTyped("incorrect");
  }

  if (currentKeyToType === randomWord.length) {
    typingEnds();
  }
}

function typingEnds() {
  currentKeyToType = 0;
  sampleTimeEnd = Date.now();
  totalSampleTime = (sampleTimeEnd - sampleTimeStart) / 1000;
  sampleCounter += 1;
  let last20SamplesErrorsObj = last20SamplesErrors.reduce((countMap, word) => {
    countMap[word] = ++countMap[word] || 1;
    return countMap;
  }, {});

  // from errors array get a obj with which key how many times
  let currentSampleErrorsObj = currentSampleErrors.reduce((countMap, word) => {
    countMap[word] = ++countMap[word] || 1;
    return countMap;
  }, {});
  // Labels(incorrect key names) will be same for both in graph
  let labels = Object.keys(last20SamplesErrorsObj);
  // errorsData is array of  no. of errors
  let last20SamplesErrorsData = Object.values(last20SamplesErrorsObj);
  let currentSampleErrorsData = Object.values(currentSampleErrorsObj);

  let unCorrectErrors = 0; // for net word/min
  //to check uncorrected errors(in words) split the typed string from space-classed spans
  const splitFrom = /<span class="(bg-space|bg-red-space)"> <\/span>/gi;

  // check if arr element contains error
  randomWordArr
    .join("")
    .split(splitFrom)
    .forEach(el => {
      let bgRedRegex = /<span class="bg-red">\w<\/span>/gi;
      if (bgRedRegex.test(el)) {
        unCorrectErrors += 1;
      }
    });

  //below  functions return speed and accuracy array of  current sample
  let speedAndAccuracy = speedTest(
    randomWord,
    totalSampleTime,
    unCorrectErrors,
    totalErrorChar
  );

  totalErrorChar = 0; //done its job for this sample

  allNPM.push(speedAndAccuracy[0]);
  allAccuracy.push(speedAndAccuracy[1]);

  // pushing current sample speed and accuracy,limiting length of arr to three
  last3NPM.push(speedAndAccuracy[0]);
  last3Accuracy.push(speedAndAccuracy[1]);
  last3NPM.splice(-4, last3NPM.length - 3);
  last3Accuracy.splice(-4, last3Accuracy.length - 3);

  last3averageNPM = last3NPM.reduce((acc, el) => acc + el) / last3NPM.length;
  last3averageAccuracy =
    last3Accuracy.reduce((acc, el) => acc + el) / last3Accuracy.length;

  //re-render chart with current values
  let averageNPM = Math.floor(
    allNPM.reduce((acc, el) => acc + el, 0) / sampleCounter
  );
  let averageAccuracy = Math.floor(
    allAccuracy.reduce((acc, el) => acc + el, 0) / sampleCounter
  );
  chartErrors(labels, last20SamplesErrorsData, currentSampleErrorsData);
  chartAccuracyAndNPM(
    sampleCounter,
    allNPM,
    allAccuracy,
    averageNPM,
    averageAccuracy
  );

  currentSampleErrors.splice(0);

  if (testModeOn) {
    testMode();
  } else if (last3averageNPM > 25 && last3averageAccuracy > 95) {
    showSample(nextSample, speedAndAccuracy[0]);
  } else {
    if (currentSampleErrorsData.length === 0) {
      showSample(nextSample, speedAndAccuracy[0]);
    } else {
      const highestErrorNum = currentSampleErrorsData.reduce((acc, ele) =>
        Math.max(acc, ele)
      );
      const highestErrorChar =
        labels[currentSampleErrorsData.indexOf(highestErrorNum)];
      showSample(highestErrorChar, speedAndAccuracy[0]);
    }
  }

  last20SamplesErrors.splice(-500, last20SamplesErrors.length - 499); // limit length to 20
  //for research
  allSamplesErrorsObj = {
    ...allSamplesErrorsObj,
    ...last20SamplesErrorsObj
  };
}
function testMode() {
  currentKeyToType = 0;
  let randomApiPara = apiResults[Math.floor(Math.random() * apiResults.length)];
  randomWord = randomApiPara.substring(0, 100);
  wordsBox.innerHTML = randomWord;
  randomWordArr = randomWord.split("");
}
function modeButtonHandle(e) {
  if (!e.target.matches(".toggle-btn,.inner-circle")) return;
  modeButton.classList.toggle("active");
  testModeOn = !testModeOn;
  if (testModeOn) {
    if (apiResults.length === 0) {
      fetchArticles(testMode);
      wordsBox.innerHTML = "wait...";
    } else {
      testMode();
    }
  } else {
    showSample();
  }
}

function keyTyped(flag) {
  const replaceWithBg = `<span class="bg">${
    randomWord[currentKeyToType]
  }</span>`;
  const nextKeyToType = `<span class="bg-next">${
    randomWord[currentKeyToType + 1]
  }</span>`;
  const replaceWithBgRed = `<span class="bg-red">${
    randomWord[currentKeyToType]
  }</span>`;
  if (flag === "correct") {
    randomWordArr[currentKeyToType] = replaceWithBg;
    randomWordArr[currentKeyToType + 1] = nextKeyToType;
    wordsBox.innerHTML = randomWordArr.join("");
    currentKeyToType += 1;
  } else if (flag === "incorrect") {
    randomWordArr[currentKeyToType] = replaceWithBgRed;
    randomWordArr[currentKeyToType + 1] = nextKeyToType;
    currentKeyToType += 1;
    wordsBox.innerHTML = randomWordArr.join("");
  } else if (flag === "back") {
    const prevKey = `<span class="bg-next">${
      randomWord[currentKeyToType - 1]
    }</span>`;
    const currentChar = `<span>${randomWord[currentKeyToType]}<span>`;

    randomWordArr[currentKeyToType - 1] = prevKey;
    randomWordArr[currentKeyToType] = currentChar;
    wordsBox.innerHTML = randomWordArr.join("");
    currentKeyToType -= 1;
  }
}
function showSample(sampleName, speed) {
  let sampleDataObj = getSample((sampleName = "testArr"), (speed = 0));
  let currentSampleArr = sampleDataObj.currentSampleArr;
  nextSample = sampleDataObj.nextSample;
  randomWord = randomWordGen(currentSampleArr);
  randomWordArr = randomWord.split("");
  wordsBox.innerHTML = randomWordArr.join("");
}
window.addEventListener("keyup", typing);
window.addEventListener("click", modeButtonHandle);
window.addEventListener("keydown", function(e) {
  if (e.keyCode == 32 && e.target == document.body) {
    e.preventDefault();
  }
});
