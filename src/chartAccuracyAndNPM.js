var ctxAccuracyAndNPM = document
  .getElementById("chartAccuracyAndNPM")
  .getContext("2d");

export default function chartAccuracyAndNPM(
  sampleCounter,
  NPMArr,
  accuracyArr,
  averageNPM,
  averageAccuracy
) {
  let sampleCounterArr = [];

  for (let i = 1; i <= sampleCounter; i++) {
    let twentyCrossed = false;
    let hundredCrossed = false;
    if (sampleCounter < 20) {
      sampleCounterArr.push(i);
    } else if (sampleCounter >= 20 && sampleCounter <= 100) {
      if (sampleCounter === 20 && !twentyCrossed) {
        twentyCrossed === true;
        i === 0;
        sampleCounterArr === [];
        sampleCounterArr.push(i * 2);
      } else {
        sampleCounterArr.push(i * 2);
        if (sampleCounter / 2 === i) {
          i *= 2;
        }
      }
    } else if (sampleCounter > 100) {
      if (sampleCounter === 100 && !hundredCrossed) {
        hundredCrossed === true;
        i === 0;
        sampleCounterArr === [];
        sampleCounterArr.push(i * 5);
      } else {
        sampleCounterArr.push(i * 5);
        if (sampleCounter / 5 === i) {
          i *= 5;
        }
      }
    }
  }
  return new Chart(ctxAccuracyAndNPM, {
    // The type of chart we want to create
    type: "line",

    // The data for our dataset
    data: {
      labels: sampleCounterArr,
      datasets: [
        {
          label: `Average NPM:${averageNPM}`,
          backgroundColor: "transparent",
          borderColor: "blue",
          data: NPMArr
        },
        {
          label: `Average Accuracy:${averageAccuracy}`,
          backgroundColor: "transparent",
          borderColor: "rgb(0, 0, 132)",
          data: accuracyArr
        }
      ]
    },

    // Configuration options go here
    options: {
      title: {
        display: true,
        text: "Average Net Words Per Minute And Accuracy Per Sample"
      },
      legend: {},
      // tooltips: { enabled: false },
      events: []
      // maintainAspectRatio: false
    }
  });
}
