let bendCounter = 0;

const automate = steps => {
  bendCounter = 0;
  automateHelper(steps);
}

const automateHelper = stepsLeft => {
  if (stepsLeft === 0) {
    return;
  }
  nextStep();
  setTimeout(() => automateHelper(stepsLeft - 1), generateAutomateDuration(stepsLeft - 1));
}

const generateAutomateDuration = stepsLeft => {

  let minTimeBuffer = 8;
  let minTime = 100 / 7 * (1 / 60) * 1000 - minTimeBuffer;  // The time it takes to animate 1 horizontal segment.

  let straightProbability = 0.3;  // The probability of no bend between adjacent horizontal segments.
  let forceBend = bendCounter === 0 && stepsLeft === 1;  // Force a bend if on last segment with no bends yet.

  if (Math.random() < straightProbability && !forceBend) {
    return minTime;
  }
  bendCounter += 1;
  return Math.random() * 800 + minTime + 200;
}
