function parikh(w) {
  let a = 0, b = 0, c = 0;
  for (let i = 0; i < w.length; i++) {
    if (w[i] === 'a') a++;
    else if (w[i] === 'b') b++;
    else c++;
  }
  return `${a},${b},${c}`;
}

function isASF(w) {
  for (let k = 1; k <= w.length / 2; k++) {
    for (let i = 0; i + 2*k <= w.length; i++) {
      if (parikh(w.slice(i, i+k)) === parikh(w.slice(i+k, i+2*k))) {
        console.log(`Square found: ${w.slice(i, i+k)} and ${w.slice(i+k, i+2*k)}`);
        return false;
      }
    }
  }
  return true;
}
console.log('abc:', isASF('abc'));
console.log('abcacb:', isASF('abcacb')); // should be false
