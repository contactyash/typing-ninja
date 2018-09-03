var ctx = document.getElementById("myChart").getContext("2d");

export default function chart(labels, allData, data) {
  return new Chart(ctx, {
    // The type of chart we want to create
    type: "bar",

    // The data for our dataset
    data: {
      labels,
      datasets: [
        {
          label: "Last 20 Samples Error",
          backgroundColor: "blue",
          borderColor: "rgb(255, 99, 132)",
          data: allData
        },
        {
          label: "This Sample",
          backgroundColor: "rgb(0, 0, 132)",
          borderColor: "rgb(255, 99, 132)",
          data
        }
      ]
    },

    // Configuration options go here
    options: {
      title: { display: true, text: "All Samples vs This This Sample Errors" },
      legend: {},
      // tooltips: { enabled: false },
      events: []
      // maintainAspectRatio: false
    }
  });
}
