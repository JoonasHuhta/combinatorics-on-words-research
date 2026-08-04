const P = [1, 0, -3, 0, 3, -2, -1, 2, -1];
const Q = [1, -2, 1, 2, -3, 0, 3, 0, -1];

// Evaluate P at e^{i theta} to see if any roots have modulus 1.
let minVal = Infinity;
let minTheta = 0;
for (let i = 0; i < 10000; i++) {
  const theta = (Math.PI * 2 * i) / 10000;
  const zRe = Math.cos(theta);
  const zIm = Math.sin(theta);
  
  // evaluate P(z)
  let re = 0;
  let im = 0;
  for (let d = 0; d <= 8; d++) {
    const c = P[8 - d]; // coeff of x^d
    // z^d
    const rd = Math.cos(theta * d);
    const id = Math.sin(theta * d);
    re += c * rd;
    im += c * id;
  }
  const mag = Math.sqrt(re*re + im*im);
  if (mag < minVal) {
    minVal = mag;
    minTheta = theta;
  }
}

console.log('Minimum modulus of P(z) on unit circle:', minVal, 'at theta:', minTheta);
