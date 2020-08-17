
const sketch = p => {

  // Loading bar dimensions.
  let height = 25;
  let width = 400;

  // Loading bar animation (basic).
  let value = 0;
  let target = 0;
  let speed = 0.01;
  let freeze = true;

  // Loading bar animation (z-direction specific).
  let zOffset = 0;
  let maxZOffset = 1000;  // Relative to the loading bar width.
  let zGrowDirection = -1;

  // Colours.
  let colour = [ 0, 208, 0 ];
  let emptyColour = [ 144, 144, 144 ];

  // Tracks loading bar movements.
  let loadingBarSteps = [ { dir: 'x', length: 0 } ];

  // Runs when the loading bar finishes.
  let onFinishedFunc = () => {};

  p.start = () => {
    value = 0;
    target = 0;
    zOffset = 0;
    zGrowDirection = 0;
    loadingBarSteps = [ { dir: 'x', length: 0 } ];
    freeze = false;
  }

  p.setTarget = newTarget => {
    target = Math.max(newTarget, target);  // Target cannot go down.
  }

  p.changeColour = newColour => {
    colour = newColour;
  }

  p.onFinished = func => {
    onFinishedFunc = func;
  }

  p.setup = () => {
    p.createCanvas(600, 600, p.WEBGL).parent('sketch-container');
    p.frameRate(60);
    p.ortho(-p.width / 2, p.width / 2, -p.height / 2, p.height / 2, -10000, 10000);
  }
  
  p.draw = () => {
    // Update.
    if (!freeze) {
      updateLoadingBar(speed);
    }    
    // Draw.
    p.orbitControl();
    p.background(255);
    p.ambientLight(128);
    p.directionalLight(255, 255, 255, 0, -1, -1);
    p.noStroke();
    p.push();
    p.translate(-0.5 * width, 0, 0);
    drawLoadingBar(loadingBarSteps);
    p.pop();
  }

  const updateLoadingBar = stepSize => {
    // Return if the value reached the end of the loading bar.
    if (value >= 1) {
      onFinishedFunc();
      freeze = true;
      return;
    }

    let reachedTarget = value >= target;
    let currentDir = loadingBarSteps[loadingBarSteps.length - 1].dir;
    // Change between x and z movement when applicable.
    if (reachedTarget === (currentDir === 'x')) {
      currentDir = (currentDir === 'x') ? 'z' : 'x';
      if (currentDir === 'z') {
        zGrowDirection = zOffset > 0 ? -1 : 1;
      }
      loadingBarSteps.push({ dir: currentDir, length: 0 });
    }
    // Move the bar in the x direction if applicable.
    if (currentDir === 'x') {
      loadingBarSteps[loadingBarSteps.length - 1].length += stepSize;
      value += stepSize;
    }
    // Move the bar in the z direction if applicable.
    if (currentDir === 'z') {
      if (Math.abs(zOffset + stepSize * zGrowDirection) >= maxZOffset) {  // Limit z offset.
        return;
      }
      loadingBarSteps[loadingBarSteps.length - 1].length += stepSize * zGrowDirection;
      zOffset += stepSize * zGrowDirection;
    }
  }
  
  const drawLoadingBar = steps => {
    let pos = { x: 0, z: 0 };  // Tracks current position.
    
    p.ambientMaterial(colour);
    // Loop through all steps.
    steps.forEach(step => {
      // Draw a plane in the x-direction if applicable.
      if (step.dir === 'x') {
        drawPlaneX(pos.x, pos.z, step.length);
        pos.x += step.length;
      }
      // Draw a plane in the z-direction if applicable.
      else if (step.dir === 'z') {
        drawPlaneZ(pos.x, pos.z, step.length);
        pos.z += step.length;
      }
    });
    // Draw a plane in the x-direction to represent empty area.
    p.ambientMaterial(emptyColour);
    drawPlaneX(pos.x, pos.z, 1 - pos.x);
  }
  
  const drawPlaneX = (startX, startZ, length) => {
    p.push();
    p.translate(width * (startX + length / 2), 0, -width * startZ);
    p.plane(width * length, height);
    p.pop();
  }
  const drawPlaneZ = (startX, startZ, length) => {
    p.push();
    p.rotateY(p.PI / 2);
    drawPlaneX(startZ, -startX, length);
    p.pop();
  }
}
