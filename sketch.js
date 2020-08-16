
const sketch = p => {

  // Loading bar dimensions.
  let height = 25;
  let width = 400;

  // Loading bar animation (basic).
  let value = 0;
  let target = 0;
  let speed = 0.01;

  // Loading bar animation (z-direction specific).
  let zOffset = 0;
  let maxZOffset = 1.2;
  let zGrowDirection = -1;

  // Colours.
  let xColour = [ 0, 208, 0 ];
  let zColour = [ 0, 104, 0 ];
  let emptyColour = [ 144, 144, 144 ];

  // Tracks loading bar movements.
  let loadingBarSteps = [
    { dir: 'x', length: 0 }
  ];

  p.setTarget = newTarget => {
    target = Math.max(newTarget, target);  // Target cannot go down.
  }

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL).parent('sketch-container');
    p.ortho(-p.width / 2, p.width / 2, p.height / 2, -p.height / 2, -10000, 10000);
    p.normalMaterial();
  }
  
  p.draw = () => {
    // Update.
    updateLoadingBar(speed);    
    // Draw.
    p.background(255);
    p.push();
    p.rotateX(0.3);
    p.rotateY(-0.3);
    p.translate(-0.5 * width, 0, 0);
    drawLoadingBar(loadingBarSteps);
    p.pop();
  }

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.ortho(-p.width / 2, p.width / 2, p.height / 2, -p.height / 2, -10000, 10000);
  }

  const updateLoadingBar = stepSize => {
    // Return if the value reached the end of the loading bar.
    if (value >= 1) {
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
    // Loop through all steps.
    steps.forEach(step => {
      // Draw a plane in the x-direction if applicable.
      if (step.dir === 'x') {
        p.fill(xColour);
        drawPlaneX(pos.x, pos.z, step.length);
        pos.x += step.length;
      }
      // Draw a plane in the z-direction if applicable.
      else if (step.dir === 'z') {
        p.fill(zColour);
        drawPlaneZ(pos.x, pos.z, step.length);
        pos.z += step.length;
      }
    });
    // Draw a plane in the x-direction to represent empty area.
    p.fill(emptyColour);
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
