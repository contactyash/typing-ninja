export function speedTest(
  allCharacters,
  time,
  unCorrectErrors,
  totalErrorCharacters
) {
  let grossSpeed = 0;
  let netSpeed = 0;
  let accuracy = 0;
  grossSpeed = Math.floor(Math.round(allCharacters.length / 5) / (time / 60));
  netSpeed = Math.floor(grossSpeed - unCorrectErrors / (time / 60));
  accuracy = Math.floor(
    ((allCharacters.length - totalErrorCharacters) / allCharacters.length) * 100
  );
  // wpm.innerHTML = grossSpeed || 0;
  // npm.innerHTML = netSpeed || 0;
  // accuracyElement.innerHTML = accuracy || 0;
  anime({
    targets: "#domAttributes1 input",
    value: grossSpeed,
    round: 1,
    easing: "easeInOutExpo"
  });
  anime({
    targets: "#domAttributes2 input",
    value: netSpeed,
    round: 1,
    easing: "easeInOutExpo"
  });
  anime({
    targets: "#domAttributes3 input",
    value: accuracy,
    round: 1,
    easing: "easeInOutExpo"
  });
  return [netSpeed, accuracy];
}

export default speedTest;
