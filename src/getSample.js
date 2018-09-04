import * as allLevels from "./data.js";

export function getSample(char, speed = 0) {
  switch (char) {
    case "homeRowEasy":
    case "homeRowHard":
    case "a":
    case "s":
    case "d":
    case "f":
    case "j":
    case "k":
    case "l":
      return speed < 30
        ? {
            currentSampleArr: allLevels.homeRowEasy,
            currentSampleName: "homeRowEasy",
            nextSample: "EIeasy"
          }
        : {
            currentSampleArr: allLevels.homeRowHard,
            currentSampleName: "homeRowHard",
            nextSample: "EIhard"
          };
    case "EIeasy":
    case "EIhard":
    case "e":
    case "i":
      return speed < 30
        ? {
            currentSampleArr: allLevels.EIeasy,
            currentSampleName: "EIeasy",
            nextSample: "EIhard"
          }
        : {
            currentSampleArr: allLevels.EIhard,
            currentSampleName: "EIhard",
            nextSample: "RUhard"
          };
    case "RUeasy":
    case "RUhard":
    case "r":
    case "u":
      return speed < 30
        ? {
            currentSampleArr: allLevels.RUeasy,
            currentSampleName: "RUeasy",
            nextSample: "RUhard"
          }
        : {
            currentSampleArr: allLevels.RUhard,
            currentSampleName: "RUhard",
            nextSample: "TOhard"
          };
    case "TOeasy":
    case "TOhard":
    case "t":
    case "o":
      return speed < 30
        ? {
            currentSampleArr: allLevels.TOeasy,
            currentSampleName: "TOeasy",
            nextSample: "TOhard"
          }
        : {
            currentSampleArr: allLevels.TOhard,
            currentSampleName: "TOhard",
            nextSample: "Chard"
          };
    case "Ceasy":
    case "Chard":
    case "c":
      return speed < 30
        ? {
            currentSampleArr: allLevels.Ceasy,
            currentSampleName: "Ceasy",
            nextSample: "Chard"
          }
        : {
            currentSampleArr: allLevels.Chard,
            currentSampleName: "Chard",
            nextSample: "GHhard"
          };
    case "GHeasy":
    case "GHhard":
    case "g":
    case "h":
      return speed < 30
        ? {
            currentSampleArr: allLevels.GHeasy,
            currentSampleName: "GHeasy",
            nextSample: "GHhard"
          }
        : {
            currentSampleArr: allLevels.GHhard,
            currentSampleName: "GHhard",
            nextSample: "VNhard"
          };
    case "VNeasy":
    case "VNhard":
    case "v":
    case "n":
      return speed < 30
        ? {
            currentSampleArr: allLevels.VNeasy,
            currentSampleName: "VNeasy",
            nextSample: "VNhard"
          }
        : {
            currentSampleArr: allLevels.VNhard,
            currentSampleName: "VNhard",
            nextSample: "WMhard"
          };
    case "WMeasy":
    case "WMhard":
    case "w":
    case "m":
      return speed < 30
        ? {
            currentSampleArr: allLevels.WMeasy,
            currentSampleName: "WMeasy",
            nextSample: "WMhard"
          }
        : {
            currentSampleArr: allLevels.WMhard,
            currentSampleName: "WMhard",
            nextSample: "QPhard"
          };
    case "QPeasy":
    case "QPhard":
    case "q":
    case "p":
      return speed < 30
        ? {
            currentSampleArr: allLevels.QPeasy,
            currentSampleName: "QPeasy",
            nextSample: "QPhard"
          }
        : {
            currentSampleArr: allLevels.QPhard,
            currentSampleName: "QPhard",
            nextSample: "BYhard"
          };
    case "BYeasy":
    case "BYhard":
    case "b":
    case "y":
      return speed < 30
        ? {
            currentSampleArr: allLevels.BYeasy,
            currentSampleName: "BYeasy",
            nextSample: "BYhard"
          }
        : {
            currentSampleArr: allLevels.BYhard,
            currentSampleName: "BYhard",
            nextSample: "ZXhard"
          };
    case "ZXhard":
    case "z":
    case "x":
      return {
        currentSampleArr: allLevels.ZXhard,
        currentSampleName: "ZXhard",
        nextSample: "practiceArr"
      };
    case "practiceArr":
      return {
        currentSampleArr: allLevels.practiceArr,
        currentSampleName: "practiceArr",
        nextSample: "TestArr"
      };
    default:
      return {
        currentSampleArr: allLevels.testArr,
        currentSampleName: "testArr",
        nextSample: "testPracticeArr"
      };
  }
}
//
// random words String genrator
export function randomWordGen(levelArr) {
  return `${levelArr[Math.floor(Math.random() * levelArr.length)]} ${
    levelArr[Math.floor(Math.random() * levelArr.length)]
  } ${levelArr[Math.floor(Math.random() * levelArr.length)]} ${
    levelArr[Math.floor(Math.random() * levelArr.length)]
  } ${levelArr[Math.floor(Math.random() * levelArr.length)]} ${
    levelArr[Math.floor(Math.random() * levelArr.length)]
  } ${levelArr[Math.floor(Math.random() * levelArr.length)]} ${
    levelArr[Math.floor(Math.random() * levelArr.length)]
  } ${levelArr[Math.floor(Math.random() * levelArr.length)]} ${
    levelArr[Math.floor(Math.random() * levelArr.length)]
  } ${levelArr[Math.floor(Math.random() * levelArr.length)]} `;
}
