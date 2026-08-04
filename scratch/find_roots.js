const P = [1, 0, -3, 0, 3, -2, -1, 2, -1];
// Durand-Kerner method to find roots of P(x) = x^8 + ...
const roots = [];
for (let i = 0; i < 8; i++) {
  // initial guesses: complex roots of unity slightly scaled
  roots.push({
    re: 0.4 + 0.9 * Math.cos(i * 2 * Math.PI / 8),
    im: 0.1 + 0.9 * Math.sin(i * 2 * Math.PI / 8)
  });
}

function cAdd(a, b) { return { re: a.re + b.re, im: a.im + b.im }; }
function cSub(a, b) { return { re: a.re - b.re, im: a.im - b.im }; }
function cMul(a, b) { return { re: a.re*b.re - a.im*b.im, im: a.re*b.im + a.im*b.re }; }
function cDiv(a, b) { 
  const den = b.re*b.re + b.im*b.im;
  return { re: (a.re*b.re + a.im*b.im)/den, im: (a.im*b.re - a.re*b.im)/den };
}
function polyEval(z) {
  let res = { re: P[0], im: 0 };
  for (let i = 1; i <= 8; i++) {
    res = cAdd(cMul(res, z), { re: P[i], im: 0 });
  }
  return res;
}

for (let iter = 0; iter < 100; iter++) {
  for (let i = 0; i < 8; i++) {
    let pz = polyEval(roots[i]);
    let den = { re: 1, im: 0 };
    for (let j = 0; j < 8; j++) {
      if (i !== j) {
        den = cMul(den, cSub(roots[i], roots[j]));
      }
    }
    roots[i] = cSub(roots[i], cDiv(pz, den));
  }
}

for (let i = 0; i < 8; i++) {
  const mag = Math.sqrt(roots[i].re**2 + roots[i].im**2);
  console.log(`Root ${i}: ${roots[i].re.toFixed(5)} + ${roots[i].im.toFixed(5)}i  |z| = ${mag.toFixed(5)}`);
}
