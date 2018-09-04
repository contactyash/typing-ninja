const statsIcon = document.querySelector(".stats-icon");
const graphStats = document.querySelector(".canvas-graph-accuracyAndNPM");
const caret = document.querySelector(".caret");
function showStats(e) {
  graphStats.classList.toggle("active");
  caret.classList.toggle("active");
}
statsIcon.addEventListener("click", showStats);
export default showStats;
