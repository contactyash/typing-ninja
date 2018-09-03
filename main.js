import * as allLevels from "./data.js";
import chart from "./chart.js";
import { randomWordGen, showSample } from "./showSample.js";
import fetchArticles, { apiResults } from "./random-article.js";
import { speedTest } from "./speedTest.js";
const modeButton = document.querySelector(".toggle-btn");
const wordsBox = document.querySelector(".words-array");
let testModeOn = false;

//check mode

let sampleDataObj = {};
let currentSampleName = "";
let nextSample = "";

let currentSampleArr = allLevels.testArr;
let randomWord = randomWordGen(currentSampleArr);
let randomWordArr = randomWord.split("");
let currentKeyToType = 0;

// time elapsed during one sample completion
let sampleTimeStart = 0;
let sampleTimeEnd = 0;
let totalSampleTime = 0;
// per sample error counter
let totalErrorChar = 0;
// have all times errors ,
//  last20 samples errors data , and current sample errors char to show graph
let currentSampleErrors = [];
let last20SamplesErrors = [];
let allSamplesErrorsObj = {};

let sampleCounter = 0;

// allNPM and allAccuracy  to calculate average
let allNPM = 0;
let allAccuracy = 0;
let averageNPM = 0;
let averageAccuracy = 0;
// last 3 samples average , array to keep only last three
let last3NPM = [];
let last3averageNPM = 0;
let last3Accuracy = [];
let last3averageAccuracy = 0;

// populate empty chart on first load
chart();
let randomApiPara = "";

function typing(e) {
  if (testModeOn && apiResults.length === 0) return;
  wordsBox.innerHTML = randomWordArr.join("");

  if (e.key === randomWord[currentKeyToType]) {
    // start time when pressed first key is pressed wrong
    if (currentKeyToType === 0) {
      sampleTimeStart = Date.now();
    }
    const replaceWithThis = `<span class="bg">${
      randomWord[currentKeyToType]
    }</span>`;
    const nextKeyToType = `<span class="bg-next">${
      randomWord[currentKeyToType + 1]
    }</span>`;
    randomWordArr[currentKeyToType] = replaceWithThis;
    randomWordArr[currentKeyToType + 1] = nextKeyToType;
    wordsBox.innerHTML = randomWordArr.join("");
    currentKeyToType += 1;
  } else if (
    randomWord[currentKeyToType] === " " &&
    e.keyCode === 32 &&
    e.keyCode !== 8
  ) {
    const replaceWithThis = `<span class="bg-space">${
      randomWord[currentKeyToType]
    }</span>`;
    const nextKeyToType = `<span class="bg-next">${
      randomWord[currentKeyToType + 1]
    }</span>`;

    randomWordArr[currentKeyToType] = replaceWithThis;
    randomWordArr[currentKeyToType + 1] = nextKeyToType;

    wordsBox.innerHTML = randomWordArr.join("");
    currentKeyToType += 1;
  } // if currentKeyToType is space and pressed incorrect
  else if (
    randomWord[currentKeyToType] === " " && //if space
    e.keyCode !== 32 &&
    e.keyCode !== 8
  ) {
    totalErrorChar += 1;
    const replaceWithThis = `<span class="bg-red-space">${
      randomWord[currentKeyToType]
    }</span>`;
    const nextKeyToType = `<span class="bg-next">${
      randomWord[currentKeyToType + 1]
    }</span>`;

    randomWordArr[currentKeyToType] = replaceWithThis;
    randomWordArr[currentKeyToType + 1] = nextKeyToType;
    currentKeyToType += 1;

    wordsBox.innerHTML = randomWordArr.join("");
  } else if (
    e.keyCode === 8 && // check if backspace
    currentKeyToType > 0 && //  you can't go more back
    randomWord[currentKeyToType - 1] !== " " // no backspace if moved to next word
  ) {
    currentKeyToType -= 1;
    // changing currentKeyToType to nextKeyToType and nextKeyToType to prevCharToType
    const nextKeyToType = `<span class="bg-next">${
      randomWord[currentKeyToType]
    }</span>`;
    const prevCharToType = `<span>${randomWord[currentKeyToType + 1]}<span>`;

    randomWordArr[currentKeyToType] = nextKeyToType;
    randomWordArr[currentKeyToType + 1] = prevCharToType;

    wordsBox.innerHTML = randomWordArr.join("");
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
    const replaceWithThis = `<span class="bg-red">${
      randomWord[currentKeyToType]
    }</span>`;
    const nextKeyToType = `<span class="bg-next">${
      randomWord[currentKeyToType + 1]
    }</span>`;
    randomWordArr[currentKeyToType] = replaceWithThis;
    randomWordArr[currentKeyToType + 1] = nextKeyToType;
    currentKeyToType += 1;

    wordsBox.innerHTML = randomWordArr.join("");
  }

  //---------------------------SAMPLE TYPING ENDS-----------------------
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

  allNPM += speedAndAccuracy[0];
  allAccuracy += speedAndAccuracy[1];
  averageNPM = allNPM / sampleCounter;
  averageAccuracy = allAccuracy / sampleCounter;
  // pushing current sample speed and accuracy,limiting length of arr to three
  last3NPM.push(speedAndAccuracy[0]);
  last3Accuracy.push(speedAndAccuracy[1]);
  last3NPM.splice(-4, last3NPM.length - 3);
  last3Accuracy.splice(-4, last3Accuracy.length - 3);

  last3averageNPM = last3NPM.reduce((acc, el) => acc + el) / last3NPM.length;
  last3averageAccuracy =
    last3Accuracy.reduce((acc, el) => acc + el) / last3Accuracy.length;

  //re-render chart with current values
  chart(labels, last20SamplesErrorsData, currentSampleErrorsData);

  currentSampleErrors = [];

  if (testModeOn) {
    testMode();
  } else if (last3averageNPM > 25 && last3averageAccuracy > 95) {
    sampleDataObj = showSample(nextSample, speedAndAccuracy[0]);
    currentSampleArr = sampleDataObj.currentSampleArr;
    // rerender string to type
    console.log("going good > 35 > 95", sampleDataObj.currentSampleName);
    randomWord = randomWordGen(currentSampleArr);
    randomWordArr = randomWord.split("");
    wordsBox.innerHTML = randomWordArr.join("");
    nextSample = sampleDataObj.nextSample;
    console.log("if npm > 25, acc > 95 nextSample", nextSample);
  } else {
    if (currentSampleErrorsData.length === 0) {
      console.log("currentSampleErrorsData", currentSampleErrorsData);
      sampleDataObj = showSample(nextSample, speedAndAccuracy[0]);
      currentSampleArr = sampleDataObj.currentSampleArr;
      randomWord = randomWordGen(currentSampleArr);
      randomWordArr = randomWord.split(""); // need arr of string to replace with span tags
      wordsBox.innerHTML = randomWordArr.join("");
      nextSample = sampleDataObj.nextSample;
    } else {
      console.log("else");
      const highestErrorNum = currentSampleErrorsData.reduce((acc, ele) =>
        Math.max(acc, ele)
      );
      const highestErrorChar =
        labels[currentSampleErrorsData.indexOf(highestErrorNum)];

      sampleDataObj = showSample(highestErrorChar, speedAndAccuracy[0]);
      currentSampleArr = sampleDataObj.currentSampleArr;

      // rerender string to type
      randomWord = randomWordGen(currentSampleArr);
      randomWordArr = randomWord.split(""); // need arr of string to replace with span tags
      wordsBox.innerHTML = randomWordArr.join("");
      nextSample = sampleDataObj.nextSample;
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
  randomApiPara = apiResults[Math.floor(Math.random() * apiResults.length)];
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
    wordsBox.innerHTML = "press space to start";
    randomWord = randomWordGen(currentSampleArr);
    randomWordArr = randomWord.split("");
    currentKeyToType = 0;
  }
}
window.addEventListener("keyup", typing);
window.addEventListener("click", modeButtonHandle);
