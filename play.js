function keydown(edown) {
  console.log(edown);
}
function keypress(epress) {
  console.log(epress);
}

function keyup(ekeyup) {
  console.log(ekeyup);
}
window.addEventListener("keypress", keypress);
window.addEventListener("keydown", keydown);
window.addEventListener("keyup", keyup);
