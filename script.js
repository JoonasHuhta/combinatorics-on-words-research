
// =====================================================
// KERÃ„NEN'S G85 MORPHISM & CORE CONSTANTS
// =====================================================
const G85_A = 'abcacdcbcdcadcdbdabacabadbabcbdbcbacbcdcacbabdabacadcbcdcacdbcbacbcdcacdcbdcdadbdcbca';
function cyclicPerm(s) {
  const map = { a:'b', b:'c', c:'d', d:'a' };
  return s.split('').map(c => map[c]).join('');
}
const G85 = { a: G85_A, b: cyclicPerm(G85_A), c: cyclicPerm(cyclicPerm(G85_A)), d: cyclicPerm(cyclicPerm(cyclicPerm(G85_A))) };
const G98_A = "abcacdcbcdcadbdcbdbabcbdcacbabdbabcabdadcdadbdcbdbabdbcbacbcdbabdcdbdcacdbcbacbcdcacdcbdcdadbdcbca";

const COLORS = { a: '#e74c3c', b: '#2980b9', c: '#f1c40f', d: '#27ae60' };

// =====================================================
// GLOBAL STATE
// =====================================================
const $ = id => document.getElementById(id);
let mode = '3letter';
let running = false;
let loopTimer = null;
let fourLetterWord = ['a']; 
let fourLetterIteration = 0;

// =====================================================
// AUDIO CONTEXT
// =====================================================
let audioCtx = null; let audioOsc = null; let audioGain = null;
let audioPlaying = false; let audioIdx = 0;
const FREQS = { a: 261.63, b: 329.63, c: 392.00, d: 440.00 };

// =====================================================
// HELPERS
// =====================================================
function getParikh(word) {
  const p = {a:0, b:0, c:0, d:0};
  for (const ch of word) if(p[ch]!==undefined) p[ch]++;
  return p;
}
function parikhEqual(p1, p2, alphabet) {
  return alphabet.every(k => (p1[k]||0) === (p2[k]||0));
}
function parikhStr(p, alphabet) {
  return '(' + alphabet.map(k => `${k}:${p[k]||0}`).join(', ') + ')';
}
function parikhDeltaStr(p1, p2, alphabet) {
  return '(' + alphabet.map(k => {
    const delta = (p1[k] || 0) - (p2[k] || 0);
    return `${k}:${delta >= 0 ? '+' : ''}${delta}`;
  }).join(', ') + ')';
}
function renderParikhBars(vec, alphabet, maxVal, classPrefix = 'sn') {
  return alphabet.map(ch => {
    const val = vec[ch] || 0;
    const width = maxVal > 0 ? Math.round((val / maxVal) * 100) : 0;
    return `
      <div class="aa2fr-bar-row">
        <span class="${classPrefix}-${ch}">${ch}</span>
        <div class="aa2fr-bar-track"><div class="aa2fr-bar-fill" style="width:${width}%; background:${COLORS[ch]};"></div></div>
        <span>${val}</span>
      </div>
    `;
  }).join('');
}
function renderParikhLens(data) {
  const alphabet = data.alphabet || ['a','b','c'];
  const first = data.first || [];
  const second = data.second || [];
  const p1 = data.p1 || getParikh(first);
  const p2 = data.p2 || getParikh(second);
  const match = parikhEqual(p1, p2, alphabet);
  const maxVal = Math.max(1, ...alphabet.map(ch => p1[ch] || 0), ...alphabet.map(ch => p2[ch] || 0));
  const word = data.word || first.concat(second);
  const start = data.start || 0;
  const halfLen = data.halfLen || first.length;
  const title = data.title || 'Parikh Lens';
  const classPrefix = data.classPrefix || 'sn';
  const charClass = data.charClass || (ch => `${classPrefix}-${ch}`);

  let wordHtml = '';
  word.forEach((ch, i) => {
    let cls = charClass(ch);
    if (i >= start && i < start + halfLen) cls += ' parikh-lens-half1';
    if (i >= start + halfLen && i < start + 2 * halfLen) cls += ' parikh-lens-half2';
    wordHtml += `<span class="${cls}">${ch}</span>`;
  });

  return `
    <h4>${title}</h4>
    <div class="parikh-lens-word">${wordHtml}</div>
    <div class="aa2fr-vector-grid">
      <div class="aa2fr-vector-card">
        <h4>First half: ${first.join('')}</h4>
        ${renderParikhBars(p1, alphabet, maxVal, classPrefix)}
      </div>
      <div class="aa2fr-vector-card">
        <h4>Second half: ${second.join('')}</h4>
        ${renderParikhBars(p2, alphabet, maxVal, classPrefix)}
      </div>
    </div>
    <div class="parikh-lens-result ${match ? 'match' : 'diff'}">
      ${match
        ? `MATCH: both halves have ${parikhStr(p1, alphabet)}. This is an abelian square.`
        : `DIFFERENCE: ${parikhDeltaStr(p1, p2, alphabet)}. The adjacent halves are not abelian equivalent.`}
    </div>
  `;
}
function setAttemptsLabel(text) { $('stat-attempts-label').textContent = text; }
function setSquaresLabel(text) { $('stat-squares-label').textContent = text; }
function updateStats(s) {
  if (s.len !== undefined) $('stat-len').textContent = s.len;
  if (s.attempts !== undefined) $('stat-attempts').textContent = s.attempts;
  if (s.backtracks !== undefined) $('stat-backtracks').textContent = s.backtracks;
  if (s.squares !== undefined) $('stat-squares').textContent = s.squares;
  if (s.maxLen !== undefined) $('stat-max').textContent = s.maxLen;
}
function addLog(html) {
  const div = document.createElement('div'); div.className = 'log-entry'; div.innerHTML = html;
  $('log').appendChild(div); $('log').scrollTop = $('log').scrollHeight;
  while ($('log').children.length > 200) $('log').removeChild($('log').firstChild);
}
function renderTiles(word, containerId, highlights = {}) {
  const container = $(containerId);
  container.innerHTML = '';
  word.forEach((ch, i) => {
    const tile = document.createElement('div'); tile.className = `tile ${ch}`;
    if (highlights.sq1Start != null && i >= highlights.sq1Start && i < highlights.sq1Start + highlights.halfLen) tile.classList.add('square-half-1');
    if (highlights.sq2Start != null && i >= highlights.sq2Start && i < highlights.sq2Start + highlights.halfLen) tile.classList.add('square-half-2');
    container.appendChild(tile);
  });
}

// =====================================================
// abelian square CHECK (generic alphabet)
// =====================================================
function findAbelianSquare(word, alphabet) {
  for (let start = 0; start < word.length; start++) {
    const maxHalf = Math.floor((word.length - start) / 2);
    for (let halfLen = 1; halfLen <= maxHalf; halfLen++) {
      const first = word.slice(start, start + halfLen);
      const second = word.slice(start + halfLen, start + halfLen * 2);
      if (parikhEqual(getParikh(first), getParikh(second), alphabet)) {
        return { start, halfLen, first, second, p1: getParikh(first), p2: getParikh(second) };
      }
    }
  }
  return null;
}

function findSuffixAbelianSquare(word, alphabet) {
  for (let halfLen = 1; halfLen <= Math.floor(word.length / 2); halfLen++) {
    const start = word.length - halfLen * 2;
    const first = word.slice(start, start + halfLen);
    const second = word.slice(start + halfLen);
    if (parikhEqual(getParikh(first), getParikh(second), alphabet)) {
      return { start, halfLen, first, second, p1: getParikh(first), p2: getParikh(second) };
    }
  }
  return null;
}

// =====================================================
// 3-LETTER SEARCH & VISUALIZATION (TREE + SCANNER)
// =====================================================
const treeCanvas = $('treeCanvas');
const treeCtx = treeCanvas.getContext('2d');
let searchTreeRoot = null;
let currentSearchNode = null;
let searchState = 'idle';
let scanHalfLen = 1;
let stats3 = { attempts: 0, backtracks: 0, maxLen: 0, squares: 0 };

function init3LetterSearch() {
  searchTreeRoot = { id: 0, letter: '', children: [], parent: null, status: 'active', depth: 0, nextTry: 0 };
  currentSearchNode = searchTreeRoot;
  stats3 = { attempts: 0, backtracks: 0, maxLen: 0, squares: 0 };
  searchState = 'extending';
  scanHalfLen = 1;
  resizeTreeCanvas();
}

function getWordFromNode(node) {
  let w = [];
  let curr = node;
  while(curr.parent) { w.unshift(curr.letter); curr = curr.parent; }
  return w;
}

function getDelay() { return Math.max(10, 600 - parseInt($('speed-slider').value) * 5.5); }

function step3Letter() {
  if (!running) return;
  const ALPHA3 = ['a','b','c'];

  if (searchState === 'extending') {
    if (currentSearchNode.nextTry >= 3) {
      searchState = 'backtracking';
    } else {
      const letter = ALPHA3[currentSearchNode.nextTry++];
      const newNode = { id: stats3.attempts++, letter, children: [], parent: currentSearchNode, status: 'active', depth: currentSearchNode.depth + 1, nextTry: 0 };
      currentSearchNode.children.push(newNode);
      currentSearchNode = newNode;
      
      const word = getWordFromNode(currentSearchNode);
      if (word.length > stats3.maxLen) stats3.maxLen = word.length;
      updateStats({ len: word.length, maxLen: stats3.maxLen, attempts: stats3.attempts });
      renderTiles(word, 'tiles-3letter');
      addLog(`Appended '${letter}'. Initiating scanner...`);
      
      searchState = 'scanning';
      scanHalfLen = 1;
    }
  } 
  else if (searchState === 'scanning') {
    const word = getWordFromNode(currentSearchNode);
    const n = word.length;
    
    if (scanHalfLen > Math.floor(n / 2)) {
      addLog(`Scan complete. No abelian squares found.`);
      $('scanner-status').textContent = 'Valid word. Expanding further...';
      $('parikh-compare').classList.add('hidden');
      searchState = 'extending';
    } else {
      const start = n - 2 * scanHalfLen;
      const first = word.slice(start, start + scanHalfLen);
      const second = word.slice(start + scanHalfLen);
      
      renderTiles(word, 'tiles-3letter', { sq1Start: start, sq2Start: start + scanHalfLen, halfLen: scanHalfLen });
      
      const p1 = getParikh(first);
      const p2 = getParikh(second);
      
      $('parikh-compare').classList.remove('hidden');
      $('scanner-status').textContent = `Scanning half-length: ${scanHalfLen}`;
      $('pval-1').textContent = parikhStr(p1, ALPHA3);
      $('pval-2').textContent = parikhStr(p2, ALPHA3);
      $('pbox-1').className = 'parikh-box'; $('pbox-2').className = 'parikh-box';

      if (parikhEqual(p1, p2, ALPHA3)) {
        $('pbox-1').classList.add('match'); $('pbox-2').classList.add('match');
        $('scanner-status').innerHTML = `<span class="log-fail">abelian square Found! Rejecting branch.</span>`;
        addLog(`<span class="log-fail">Matched Parikh vectors ${parikhStr(p1, ALPHA3)}! Dead end.</span>`);
        currentSearchNode.status = 'dead';
        stats3.squares++;
        updateStats({ squares: stats3.squares });
        searchState = 'backtracking';
      } else {
        scanHalfLen++;
      }
    }
  }
  else if (searchState === 'backtracking') {
    if (!currentSearchNode.parent) {
      searchState = 'exhausted';
    } else {
      currentSearchNode = currentSearchNode.parent;
      stats3.backtracks++;
      updateStats({ backtracks: stats3.backtracks, len: getWordFromNode(currentSearchNode).length });
      renderTiles(getWordFromNode(currentSearchNode), 'tiles-3letter');
      addLog(`Backtracking up the tree...`);
      $('parikh-compare').classList.add('hidden');
      $('scanner-status').textContent = 'Backtracking...';
      searchState = 'extending';
    }
  }
  else if (searchState === 'exhausted') {
    running = false;
    $('btn-start').disabled = false; $('btn-pause').disabled = true;
    addLog(`<span class="log-fail">SEARCH EXHAUSTED. It is impossible to build an infinite abelian square-free word on 3 letters.</span>`);
    $('scanner-status').innerHTML = `<b>Exhausted all possibilities. Max length: ${stats3.maxLen}.</b>`;
    return;
  }

  drawTree();
  loopTimer = setTimeout(step3Letter, getDelay());
}

// Tree Drawing
function resizeTreeCanvas() { treeCanvas.width = treeCanvas.clientWidth; treeCanvas.height = treeCanvas.clientHeight; }
window.addEventListener('resize', () => { if (mode === '3letter') resizeTreeCanvas(); drawTree(); });

function drawTree() {
  if (!searchTreeRoot) return;
  treeCtx.clearRect(0, 0, treeCanvas.width, treeCanvas.height);
  
  let maxDepth = stats3.maxLen + 1;
  const levelHeight = treeCanvas.height / (maxDepth + 1);
  
  function setX(node, left, right) {
    node.x = (left + right) / 2;
    node.y = (node.depth + 1) * levelHeight;
    const w = (right - left) / Math.max(1, node.children.length);
    node.children.forEach((c, i) => setX(c, left + i*w, left + (i+1)*w));
  }
  setX(searchTreeRoot, 0, treeCanvas.width);

  function drawLines(node) {
    node.children.forEach(c => {
      treeCtx.beginPath();
      treeCtx.moveTo(node.x, node.y);
      treeCtx.lineTo(c.x, c.y);
      treeCtx.strokeStyle = c.status === 'dead' ? '#ffcccc' : '#cccccc';
      if (c === currentSearchNode || isAncestor(c, currentSearchNode)) treeCtx.strokeStyle = '#000000';
      treeCtx.stroke();
      drawLines(c);
    });
  }
  
  function isAncestor(ancestor, node) {
    let curr = node;
    while(curr) { if(curr === ancestor) return true; curr = curr.parent; }
    return false;
  }

  function drawNodes(node) {
    treeCtx.beginPath();
    treeCtx.arc(node.x, node.y, 4, 0, Math.PI*2);
    if (node === currentSearchNode) treeCtx.fillStyle = '#f1c40f';
    else if (node.status === 'dead') treeCtx.fillStyle = '#e74c3c';
    else treeCtx.fillStyle = '#bdc3c7';
    if (node === searchTreeRoot) treeCtx.fillStyle = '#000';
    treeCtx.fill();
    node.children.forEach(drawNodes);
  }

  drawLines(searchTreeRoot);
  drawNodes(searchTreeRoot);
}

// =====================================================
// ABC LABORATORY: FINITE EXHAUSTIVE SEARCH
// =====================================================
const ABC_ALPHABET = ['a', 'b', 'c'];
let abcLevels = [];
let abcFailures = [];

function enumerateAbcLab(maxLength = 8) {
  abcLevels = [['']] ;
  abcFailures = [];

  for (let len = 1; len <= maxLength; len++) {
    const next = [];
    for (const prefix of abcLevels[len - 1]) {
      for (const letter of ABC_ALPHABET) {
        const candidate = prefix + letter;
        const arr = candidate.split('');
        const square = findSuffixAbelianSquare(arr, ABC_ALPHABET);
        if (square) {
          abcFailures.push({ candidate, from: prefix, letter, square });
        } else {
          next.push(candidate);
        }
      }
    }
    abcLevels[len] = next;
  }
}

function renderAbcLab() {
  enumerateAbcLab();
  const counts = $('abc-counts');
  counts.innerHTML = '';
  abcLevels.forEach((level, len) => {
    const row = document.createElement('div');
    row.className = 'abc-row';
    row.innerHTML = `<span>length ${len}</span><span>${level.length}</span>`;
    counts.appendChild(row);
  });

  const maxNonEmptyLen = abcLevels.reduce((best, level, len) => level.length ? len : best, 0);
  const survivors = abcLevels[maxNonEmptyLen] || [];
  $('abc-max-count').textContent = survivors.length;
  $('abc-survivors').innerHTML = '';
  survivors.forEach(word => {
    const row = document.createElement('div');
    row.className = 'abc-row';
    row.innerHTML = `<span class="abc-word"><button type="button" data-word="${word}">${word}</button></span><span class="abc-success">valid</span>`;
    $('abc-survivors').appendChild(row);
  });

  const failedAtEight = abcFailures.filter(item => item.candidate.length === 8);
  $('abc-failures').innerHTML = '';
  failedAtEight.slice(0, 80).forEach(item => {
    const row = document.createElement('div');
    row.className = 'abc-row';
    row.innerHTML = `<span class="abc-word"><button type="button" data-word="${item.candidate}">${item.candidate}</button></span><span class="abc-fail">x${item.square.halfLen}</span>`;
    $('abc-failures').appendChild(row);
  });
  if (failedAtEight.length > 80) {
    const row = document.createElement('div');
    row.className = 'abc-row';
    row.textContent = `... ${failedAtEight.length - 80} more rejected extensions`;
    $('abc-failures').appendChild(row);
  }

  const firstWord = survivors[0] || (failedAtEight[0] && failedAtEight[0].candidate) || '';
  selectAbcWord(firstWord);
  updateStats({ len: maxNonEmptyLen, maxLen: maxNonEmptyLen, attempts: abcFailures.length, backtracks: 0, squares: abcFailures.length });
  addLog(`<span class="log-ok">ABC enumeration complete. Length 8 has ${abcLevels[8].length} valid words.</span>`);
}

function selectAbcWord(word) {
  const chars = word.split('');
  const square = findAbelianSquare(chars, ABC_ALPHABET);
  const highlights = square ? { sq1Start: square.start, sq2Start: square.start + square.halfLen, halfLen: square.halfLen } : {};
  renderTiles(chars, 'tiles-abc', highlights);
  $('abc-selected-text').textContent = word || '-';

  const table = $('abc-vector-table');
  if (!word) { table.innerHTML = ''; return; }
  if (!square) {
    table.innerHTML = '<tr><th>Status</th><td class="abc-success">No abelian square found in this finite word.</td></tr>';
    return;
  }
  table.innerHTML = `
    <tr><th>Half 1</th><td>${square.first.join('')}</td><td>${parikhStr(square.p1, ABC_ALPHABET)}</td></tr>
    <tr><th>Half 2</th><td>${square.second.join('')}</td><td>${parikhStr(square.p2, ABC_ALPHABET)}</td></tr>
    <tr><th>Position</th><td colspan="2">starts at ${square.start}, half length ${square.halfLen}</td></tr>
  `;
}

function handleAbcClick(evt) {
  const button = evt.target.closest('button[data-word]');
  if (!button) return;
  selectAbcWord(button.dataset.word);
}

// =====================================================
// 4-LETTER G85 LOGIC & CANVAS VIEW
// =====================================================
function applyMorphism() {
  if (fourLetterWord.length > 200000) { addLog("String too large to iterate in browser."); return; }
  $('btn-apply-morphism').disabled = true;
  fourLetterIteration++;
  const oldLen = fourLetterWord.length;
  addLog(`Applying g&#8328;&#8325; (Iteration ${fourLetterIteration})...`);

  const newWord = [];
  for (const ch of fourLetterWord) { for (const c of G85[ch]) newWord.push(c); }
  fourLetterWord = newWord;
  updateStats({ len: newWord.length, maxLen: newWord.length });
  
  if (mode === '4letter') {
    if (newWord.length <= 8000) {
      $('tiles-general').classList.remove('hidden'); $('word-empty').classList.add('hidden');
      renderTiles(newWord, 'tiles-general');
    } else {
      $('tiles-general').innerHTML = ''; $('word-empty').classList.remove('hidden'); 
      $('word-empty').textContent = `String is too large (${newWord.length} chars) for DOM. Use Canvas view.`; 
    }
  } else if (mode === 'canvas') {
    drawCanvas2DWalk();
  }
  
  addLog(`<span class="log-ok">g&#8328;&#8325; applied: length grew from ${oldLen} to ${newWord.length}.</span>`);
  $('btn-apply-morphism').disabled = false;
}

let walkAnimId = null;

function drawCanvas2DWalk() {
  if (walkAnimId) { cancelAnimationFrame(walkAnimId); walkAnimId = null; }
  if (fourLetterWord.length === 0) return;
  
  $('tiles-general').classList.add('hidden'); $('word-empty').classList.add('hidden');
  const cvs = $('condensedCanvas'); cvs.classList.remove('hidden');

  const width = cvs.clientWidth;
  const height = 500;
  cvs.width = width;
  cvs.height = height;
  const ctx = cvs.getContext('2d');
  
  // 1. Calculate bounds
  let x = 0, y = 0;
  let minX = 0, maxX = 0, minY = 0, maxY = 0;
  
  for (let i = 0; i < fourLetterWord.length; i++) {
    const ch = fourLetterWord[i];
    if (ch === 'a') x -= 1;
    else if (ch === 'b') x += 1;
    else if (ch === 'c') y += 1;
    else if (ch === 'd') y -= 1;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  
  const rawWidth = (maxX - minX) || 1;
  const rawHeight = (maxY - minY) || 1;
  
  // 2. Scaling & Padding
  const padding = 30;
  const scaleX = (width - padding * 2) / rawWidth;
  const scaleY = (height - padding * 2) / rawHeight;
  const scale = Math.min(scaleX, scaleY, 15); // max scale 15
  
  const startX = padding - minX * scale + (width - padding*2 - rawWidth*scale)/2;
  const startY = padding - minY * scale + (height - padding*2 - rawHeight*scale)/2;
  
  ctx.clearRect(0, 0, width, height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = Math.max(1, Math.min(3, scale * 0.4));
  
  const animate = $('chk-anim-walk').checked;
  const wordLen = fourLetterWord.length;
  
  if (!animate) {
    let curX = startX, curY = startY;
    ctx.beginPath();
    for (let i = 0; i < wordLen; i++) {
      const ch = fourLetterWord[i];
      let nextX = curX; let nextY = curY;
      if (ch === 'a') nextX -= scale;
      else if (ch === 'b') nextX += scale;
      else if (ch === 'c') nextY += scale;
      else if (ch === 'd') nextY -= scale;
      
      ctx.strokeStyle = COLORS[ch];
      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(nextX, nextY);
      ctx.stroke();
      
      curX = nextX; curY = nextY;
    }
    addLog(`Drew 2D Walk with ${wordLen} steps.`);
  } else {
    let curX = startX, curY = startY;
    let i = 0;
    const stepsPerFrame = Math.max(1, Math.floor(wordLen / 120)); 
    
    function drawFrame() {
      for (let s = 0; s < stepsPerFrame && i < wordLen; s++, i++) {
        const ch = fourLetterWord[i];
        let nextX = curX; let nextY = curY;
        if (ch === 'a') nextX -= scale;
        else if (ch === 'b') nextX += scale;
        else if (ch === 'c') nextY += scale;
        else if (ch === 'd') nextY -= scale;
        
        ctx.strokeStyle = COLORS[ch];
        ctx.beginPath();
        ctx.moveTo(curX, curY);
        ctx.lineTo(nextX, nextY);
        ctx.stroke();
        
        curX = nextX; curY = nextY;
      }
      if (i < wordLen) {
        walkAnimId = requestAnimationFrame(drawFrame);
      } else {
        addLog(`Finished animating 2D Walk with ${wordLen} steps.`);
      }
    }
    walkAnimId = requestAnimationFrame(drawFrame);
    addLog(`Animating 2D Walk (${wordLen} steps)...`);
  }
}

// =====================================================
// WEB AUDIO SONIFICATION
// =====================================================
let audioTracksData = [];
let audioCurrentTrack = -1;
let audioEndIdx = 0;

function renderAudioTracks() {
  const container = $('audio-track-list');
  if (fourLetterWord.length === 0) {
    container.innerHTML = '<span style="color:#999; font-style:italic;">Generate a word first in the 4-Letter tab.</span>';
    return;
  }
  
  const chunkInput = parseInt($('audio-chunk-input').value) || 85;
  const chunkSize = Math.max(1, chunkInput);
  
  audioTracksData = [];
  let html = '';
  for (let i = 0; i < fourLetterWord.length; i += chunkSize) {
    const chunk = fourLetterWord.slice(i, i + chunkSize);
    const trackId = audioTracksData.length;
    audioTracksData.push({ start: i, length: chunk.length, active: false });
    
    // Build mini vis (cap at 200 items for dom performance)
    let visHtml = '';
    const visLimit = Math.min(chunk.length, 200);
    for(let c=0; c<visLimit; c++) {
      visHtml += `<div class="tile ${chunk[c]}"></div>`;
    }
    if (chunk.length > 200) visHtml += '<div style="font-size:10px; align-self:center;">...</div>';
    
    html += `
      <div class="audio-track" id="track-row-${trackId}">
        <button class="btn" id="btn-play-track-${trackId}" onclick="playAudioTrack(${trackId})">&#9654; Play</button>
        <button class="btn hidden" id="btn-stop-track-${trackId}" onclick="stopAudioTrack()">&#9632; Stop</button>
        <div class="audio-track-title">Track ${trackId + 1} (${chunk.length} ltr)</div>
        <div class="audio-track-vis">${visHtml}</div>
      </div>
    `;
  }
  container.innerHTML = html;
}

$('btn-audio-generate').addEventListener('click', renderAudioTracks);

function stopAudioTrack() {
  if (!audioPlaying) return;
  audioPlaying = false;
  if (audioOsc) { audioOsc.stop(); audioOsc.disconnect(); }
  if (audioGain) { audioGain.disconnect(); }
  $('audio-current-letter').textContent = '-'; $('audio-current-note').style.background = '#eee';
  
  if (audioCurrentTrack !== -1) {
    const pBtn = $('btn-play-track-' + audioCurrentTrack);
    const sBtn = $('btn-stop-track-' + audioCurrentTrack);
    if(pBtn) pBtn.classList.remove('hidden');
    if(sBtn) sBtn.classList.add('hidden');
  }
  audioCurrentTrack = -1;
  addLog(`Audio stopped.`);
}

// Backward compatibility alias for switchMode
function stopAudio() { stopAudioTrack(); }

function playAudioTrack(trackId) {
  if (audioPlaying) stopAudioTrack();
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  const track = audioTracksData[trackId];
  if(!track) return;
  
  audioPlaying = true;
  audioCurrentTrack = trackId;
  audioIdx = track.start;
  audioEndIdx = track.start + track.length;
  
  $('btn-play-track-' + trackId).classList.add('hidden');
  $('btn-stop-track-' + trackId).classList.remove('hidden');
  
  audioOsc = audioCtx.createOscillator(); audioGain = audioCtx.createGain();
  audioOsc.type = 'sine';
  audioOsc.connect(audioGain); audioGain.connect(audioCtx.destination);
  audioOsc.start();
  
  addLog(`<span class="log-ok">Audio synthesis started for Track ${trackId + 1}.</span>`);
  audioLoop();
}

function audioLoop() {
  if (!audioPlaying) return;
  if (audioIdx >= audioEndIdx) {
    stopAudioTrack();
    return;
  }
  
  const ch = fourLetterWord[audioIdx];
  const delayMs = Math.max(20, 200 - parseInt($('speed-slider').value) * 1.8);
  
  audioOsc.frequency.setValueAtTime(FREQS[ch], audioCtx.currentTime);
  $('audio-current-letter').textContent = ch.toUpperCase();
  $('audio-current-note').style.background = COLORS[ch];
  
  audioGain.gain.setValueAtTime(0, audioCtx.currentTime);
  audioGain.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.02);
  audioGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + (delayMs/1000));
  
  audioIdx++;
  setTimeout(audioLoop, delayMs);
}


// =====================================================
// 6. TRY IT YOURSELF
// =====================================================
let tryItWord = [];
let tryItAlpha = ['a','b','c'];
let tryItLensHalf = null;

function tryItGetAlpha() {
  return document.querySelector('input[name="tryit-alpha"]:checked').value === '4'
    ? ['a','b','c','d'] : ['a','b','c'];
}

function tryItUpdate() {
  tryItAlpha = tryItGetAlpha();
  const word = tryItWord;
  const n = word.length;

  // Render colored word
  const display = $('tryit-display');
  if (n === 0) {
    display.innerHTML = '<span style="color:#aaa; font-style:italic; font-family:Arial; font-size:1rem; letter-spacing:0;">Press a key to start&hellip;</span>';
  } else {
    const square = findAbelianSquare(word, tryItAlpha);
    let html = '';
    word.forEach((ch, i) => {
      let cls = `ch-${ch}`;
      if (square) {
        if (i >= square.start && i < square.start + square.halfLen) cls += ' sq-half1';
        if (i >= square.start + square.halfLen && i < square.start + square.halfLen * 2) cls += ' sq-half2';
      }
      html += `<span class="${cls}">${ch}</span>`;
    });
    display.innerHTML = html;

    // Status
    const status = $('tryit-status');
    if (square) {
      const s1 = square.first.join('');
      const s2 = square.second.join('');
      status.className = 'tryit-status error';
      status.innerHTML = `&#10007; abelian square at position ${square.start}: 
        <strong>${s1}</strong> | <strong>${s2}</strong> â€” both have ${parikhStr(square.p1, tryItAlpha)}`;
    } else if (tryItAlpha.length === 3 && n >= 8) {
      status.className = 'tryit-status warn';
      status.innerHTML = `&#9888; Length ${n} â€” amazingly still no abelian square! This is extremely rare in 3-letter words.`;
    } else if (tryItAlpha.length === 3 && n === 7) {
      status.className = 'tryit-status warn';
      status.innerHTML = `&#9888; Length 7 â€” no square yet, but length 8 is the wall. Try adding one more letter.`;
    } else {
      status.className = 'tryit-status ok';
      status.innerHTML = `&#10003; Length ${n} â€” no abelian square found. Keep going!`;
    }
  }

  // Render tiles
  if (n === 0) {
    $('tryit-tiles').innerHTML = '';
  } else {
    const sq = findAbelianSquare(word, tryItAlpha);
    const hl = sq ? { sq1Start: sq.start, sq2Start: sq.start + sq.halfLen, halfLen: sq.halfLen } : {};
    renderTiles(word, 'tryit-tiles', hl);
  }

  // Parikh panel â€” show all possible splits
  const parikhList = $('tryit-parikh-list');
  const lensOutput = $('tryit-lens-output');
  const lensHalfInput = $('tryit-lens-half');
  if (n < 2) {
    parikhList.innerHTML = '<span style="color:#aaa; font-style:italic;">Type a word to see its Parikh splits.</span>';
    lensOutput.innerHTML = '<span style="color:#aaa; font-style:italic;">Type at least two letters to inspect adjacent halves.</span>';
    if (lensHalfInput) lensHalfInput.value = 1;
    return;
  }
  const maxHalfLen = Math.floor(n / 2);
  let rows = '';
  let firstClashHalf = null;
  for (let halfLen = 1; halfLen <= maxHalfLen; halfLen++) {
    const start = n - 2 * halfLen;
    const first = word.slice(start, start + halfLen);
    const second = word.slice(start + halfLen, start + halfLen * 2);
    const p1 = getParikh(first);
    const p2 = getParikh(second);
    const clash = parikhEqual(p1, p2, tryItAlpha);
    if (clash && firstClashHalf === null) firstClashHalf = halfLen;
    const rowCls = clash ? 'parikh-split-row clash' : 'parikh-split-row ok';
    rows += `<div class="${rowCls}">
      <span title="${first.join('')}" style="flex:1.2; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${first.join('')}</span>
      <span class="parikh-vec">${parikhStr(p1, tryItAlpha)}</span>
      <span class="parikh-vs">vs</span>
      <span class="parikh-vec">${parikhStr(p2, tryItAlpha)}</span>
      <span title="${second.join('')}" style="flex:1.2; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-align:right;">${second.join('')}</span>
      ${clash ? '<span style="margin-left:4px;">&#10007;</span>' : ''}
    </div>`;
  }
  parikhList.innerHTML = rows || '<span style="color:#aaa; font-style:italic;">No splits yet.</span>';

  const chosenHalf = Math.max(1, Math.min(maxHalfLen, tryItLensHalf || firstClashHalf || maxHalfLen));
  if (tryItLensHalf !== null) tryItLensHalf = chosenHalf;
  if (lensHalfInput) {
    lensHalfInput.max = maxHalfLen;
    lensHalfInput.value = chosenHalf;
  }
  const lensStart = n - 2 * chosenHalf;
  const lensFirst = word.slice(lensStart, lensStart + chosenHalf);
  const lensSecond = word.slice(lensStart + chosenHalf, lensStart + chosenHalf * 2);
  lensOutput.innerHTML = renderParikhLens({
    title: `Suffix split, half length ${chosenHalf}`,
    word,
    start: lensStart,
    halfLen: chosenHalf,
    first: lensFirst,
    second: lensSecond,
    alphabet: tryItAlpha,
    classPrefix: 'ch'
  });
}

function tryItAppend(letter) {
  tryItWord.push(letter);
  tryItUpdate();
}
function tryItBack() {
  if (tryItWord.length > 0) { tryItWord.pop(); tryItUpdate(); }
}
function tryItClear() {
  tryItWord = [];
  tryItLensHalf = null;
  tryItUpdate();
}

// Keyboard support for try-it
document.addEventListener('keydown', function(e) {
  if (mode !== 'try-it') return;
  if (e.key === 'Backspace') { tryItBack(); e.preventDefault(); return; }
  if (e.key === 'Delete' || e.key === 'Escape') { tryItClear(); return; }
  const allowed = tryItAlpha.includes(e.key) ? e.key : null;
  if (allowed) { tryItAppend(allowed); }
});

document.querySelectorAll('.key-btn[data-letter]').forEach(btn => {
  btn.addEventListener('click', () => tryItAppend(btn.dataset.letter));
});
$('tryit-back').addEventListener('click', tryItBack);
$('tryit-clear').addEventListener('click', tryItClear);
$('tryit-lens-half').addEventListener('input', function() {
  const value = parseInt(this.value, 10);
  tryItLensHalf = Number.isFinite(value) ? value : null;
  tryItUpdate();
});
$('tryit-lens-auto').addEventListener('click', function() {
  tryItLensHalf = null;
  tryItUpdate();
});

document.querySelectorAll('input[name="tryit-alpha"]').forEach(radio => {
  radio.addEventListener('change', function() {
    const is4 = this.value === '4';
    $('tryit-key-d').classList.toggle('hidden', !is4);
    tryItWord = []; // reset on alphabet change
    tryItLensHalf = null;
    tryItUpdate();
  });
});

// =====================================================
// 7. HISTORICAL TIMELINE
// =====================================================
const TL_EVENTS = [
  {
    year: 1906, name: 'Thue', letters: null, color: '#bdc3c7',
    title: 'Axel Thue (1906)',
    text: `Norwegian mathematician Axel Thue proved that an infinite <em>square-free</em> word exists over a 3-letter alphabet {a,b,c}. A square-free word avoids patterns like "ww" (identical repetition). This is the founding result of combinatorics on words â€” but it concerns <em>ordinary</em> squares, not abelian squares.`
  },
  {
    year: 1961, name: 'ErdÅ‘s', letters: '?', color: '#e67e22',
    title: 'Paul ErdÅ‘s (1961)',
    text: `Hungarian mathematician Paul ErdÅ‘s posed the question: can <em>abelian</em> squares be avoided on some finite alphabet? An abelian square "uv" allows u and v to be permutations of each other â€” a far weaker condition than ordinary squares. This seemingly simple generalization turned out to be extremely hard to resolve.`
  },
  {
    year: 1968, name: 'Evdokimov', letters: '25', color: '#8e44ad',
    title: 'Evdokimov (1968)',
    text: `A.A. Evdokimov gave the first positive answer to ErdÅ‘s's question: an infinite abelian square-free word exists over an alphabet of <strong>25 letters</strong>. This was a major existence proof, but the alphabet was enormous. It left open whether the number could be reduced.`
  },
  {
    year: 1970, name: 'Pleasants', letters: '5', color: '#2980b9',
    title: 'P.A.B. Pleasants (1970)',
    text: `Peter Pleasants drastically reduced the alphabet size. He proved that an infinite abelian square-free word exists over just <strong>5 letters</strong>. He also proved the key negative result: with only 3 letters {a,b,c}, it is <em>impossible</em> â€” every word of length â‰¥ 8 over 3 letters must contain an abelian square. The gap of 4 vs 5 letters remained open.`
  },
  {
    year: 1992, name: 'KerÃ¤nen', letters: '4', color: '#d35400',
    title: 'Veikko KerÃ¤nen (1992) â€” The Solution',
    text: `Finnish mathematician Veikko KerÃ¤nen resolved the final case: <strong>4 letters suffice</strong> â€” and 4 is optimal (since 3 do not suffice). His construction uses a uniform morphism gâ‚ˆâ‚… where each letter maps to an 85-letter string. The images of b, c, d are cyclic permutations of gâ‚ˆâ‚…(a). He proved computer-assistedly that gâ‚ˆâ‚… preserves abelian square-freedom: if w is abelian square-free, so is gâ‚ˆâ‚…(w). This solved ErdÅ‘s's 1961 question after 31 years. Published at ICALP 1992.`
  }
];

function buildTimeline() {
  const track = $('tl-track');
  track.innerHTML = '';

  const maxLetters = 25;

  TL_EVENTS.forEach((ev, idx) => {
    // Gap label before event (except first)
    if (idx > 0) {
      const prevYear = TL_EVENTS[idx-1].year;
      const gap = ev.year - prevYear;
      const gapDiv = document.createElement('div');
      gapDiv.className = 'tl-gap-label';
      gapDiv.innerHTML = `<span class="tl-gap-arrow">&#8594;</span><span class="tl-gap-years">${gap}y</span>`;
      track.appendChild(gapDiv);
    }

    const col = document.createElement('div');
    col.className = 'tl-event';
    col.dataset.idx = idx;

    const barH = ev.letters ? Math.max(20, Math.round((parseInt(ev.letters) / maxLetters) * 180)) : 0;
    
    let badgeHtml = '';
    if (ev.letters) {
      badgeHtml = `<div class="tl-letters-badge" style="bottom:${barH + 8}px">${ev.letters}</div>`;
    }

    col.innerHTML = `
      ${ev.letters ? `<div class="tl-bar" style="height:${barH}px; background:${ev.color};"></div>` : ''}
      ${badgeHtml}
      <div class="tl-dot"></div>
      <div class="tl-labels">
        <div class="tl-year">${ev.year}</div>
        <div class="tl-name">${ev.name}</div>
      </div>
    `;
    col.addEventListener('click', () => selectTimelineEvent(idx));
    track.appendChild(col);
  });
}

function selectTimelineEvent(idx) {
  document.querySelectorAll('.tl-event').forEach((el, i) => {
    el.classList.toggle('highlighted', i === idx);
  });
  const ev = TL_EVENTS[idx];
  $('tl-detail').innerHTML = `<h3>${ev.title}</h3><p>${ev.text}</p>`;
}

// =====================================================
// 8. UNFAVORABLE FACTORS
// =====================================================
const UNF_ALPHA = ['a','b','c','d'];
const UNF_MAX_STEPS = 200; // max letters to try per direction

function unfavorableExtend(seed) {
  const seedArr = seed.toLowerCase().split('').filter(c => UNF_ALPHA.includes(c));
  if (seedArr.length === 0) return null;

  // Extend right
  let rightWord = [...seedArr];
  let rightAdded = 0;
  let rightDead = '';
  while (rightAdded < UNF_MAX_STEPS) {
    let extended = false;
    for (const c of UNF_ALPHA) {
      const candidate = [...rightWord, c];
      if (!findSuffixAbelianSquare(candidate, UNF_ALPHA)) {
        rightWord = candidate;
        rightAdded++;
        extended = true;
        break;
      }
    }
    if (!extended) { rightDead = UNF_ALPHA.find(c => true); break; }
  }

  // Extend left â€” reverse the word, use suffix check, reverse back
  let leftWord = [...seedArr];
  let leftAdded = 0;
  while (leftAdded < UNF_MAX_STEPS) {
    let extended = false;
    for (const c of UNF_ALPHA) {
      const candidate = [c, ...leftWord];
      // Check suffix of reversed candidate (= prefix of candidate reversed)
      const reversed = [...candidate].reverse();
      if (!findSuffixAbelianSquare(reversed, UNF_ALPHA)) {
        leftWord = candidate;
        leftAdded++;
        extended = true;
        break;
      }
    }
    if (!extended) { break; }
  }

  return { seedArr, rightWord, leftWord, rightAdded, leftAdded, hitRight: rightAdded >= UNF_MAX_STEPS, hitLeft: leftAdded >= UNF_MAX_STEPS };
}

function renderUnfavorable() {
  const seed = $('unf-input').value.trim();
  if (!seed) return;

  const result = unfavorableExtend(seed);
  if (!result) { $('unf-stats').textContent = 'Invalid input.'; return; }

  const { seedArr, rightWord, leftWord, rightAdded, leftAdded, hitRight, hitLeft } = result;

  // Stats
  $('unf-stats').innerHTML = `
    <strong>Seed:</strong> <code>${seedArr.join('')}</code> (length ${seedArr.length})<br>
    <strong>Right extension:</strong> ${rightAdded} letters added ${hitRight ? '(reached limit '+UNF_MAX_STEPS+')' : 'â€” <span style="color:#e74c3c">DEAD END</span>'}<br>
    <strong>Left extension:</strong> ${leftAdded} letters added ${hitLeft ? '(reached limit '+UNF_MAX_STEPS+')' : 'â€” <span style="color:#e74c3c">DEAD END</span>'}
  `;

  // Bars
  const maxBar = UNF_MAX_STEPS;
  $('unf-bars').innerHTML = `
    <div class="unf-resusn-bar">
      <span class="label">Left ext.</span>
      <div class="unf-bar-fill left-ext" style="width:${Math.round(leftAdded / maxBar * 300)}px">${leftAdded}</div>
      ${!hitLeft ? '<div class="unf-bar-fill dead" style="width:24px; margin-left:2px;">âœ—</div>' : ''}
    </div>
    <div class="unf-resusn-bar">
      <span class="label">Right ext.</span>
      <div class="unf-bar-fill right-ext" style="width:${Math.round(rightAdded / maxBar * 300)}px">${rightAdded}</div>
      ${!hitRight ? '<div class="unf-bar-fill dead" style="width:24px; margin-left:2px;">âœ—</div>' : ''}
    </div>
  `;

  // Word display (show right extension, with seed highlighted in middle)
  // Show: [left added] [seed] [right added]
  const leftAddedPart = leftWord.slice(0, leftAdded);
  const rightAddedPart = rightWord.slice(seedArr.length);

  let displayHtml = '';
  leftAddedPart.forEach(c => { displayHtml += `<span class="unf-added-l ch-${c}">${c}</span>`; });
  seedArr.forEach(c => { displayHtml += `<span class="unf-seed ch-${c}">${c}</span>`; });
  rightAddedPart.forEach(c => { displayHtml += `<span class="unf-added-r ch-${c}">${c}</span>`; });

  // Add colors inline for unf-word-display
  const wrapDiv = $('unf-word-display');
  wrapDiv.innerHTML = displayHtml || '&mdash;';

  // add CSS for ch- classes in unf display
  updateStats({ len: leftAdded + seedArr.length + rightAdded });
  addLog(`Seed "${seedArr.join('')}": left +${leftAdded}, right +${rightAdded} before dead end.`);
}

// Unf examples
document.querySelectorAll('.unf-examples button').forEach(btn => {
  btn.addEventListener('click', () => {
    $('unf-input').value = btn.dataset.ex;
    renderUnfavorable();
  });
});
$('unf-run').addEventListener('click', renderUnfavorable);
$('unf-input').addEventListener('keydown', e => { if (e.key === 'Enter') renderUnfavorable(); });

// =====================================================
// UI TABS & INIT
// =====================================================
function switchMode(newMode) {
  mode = newMode;
  running = false; if (loopTimer) clearTimeout(loopTimer); stopAudio();
  $('btn-pause').textContent = 'Pause';
  $('log').innerHTML = '';
  
  document.querySelectorAll('.mode-tab').forEach(t => t.classList.toggle('active', t.dataset.mode === newMode));
  ['btn-start','btn-pause','btn-apply-morphism','btn-draw-canvas','lbl-canvas-anim','btn-run-abc'].forEach(id => {
    const el = $(id); if(el) el.classList.add('hidden');
  });
  
  // Hide all view panels
  ['view-3letter','view-abc-lab','view-general','view-audio','view-tryit','view-timeline','view-unfavorable','view-microscope','view-knowledge','view-morph-lab','view-heat-map','view-snake','view-aa2fr','view-impact'].forEach(id => $(id).classList.add('hidden'));
  try { snakePause(); } catch(e) { /* snake vars not yet initialized on first load */ }
  $('condensedCanvas').classList.add('hidden');
  $('audio-ui').classList.add('hidden');
  $('word-empty').classList.add('hidden');
  $('tiles-general').classList.add('hidden');
  
  // Hide info panel for some modes, show for others
  const noInfoModes = ['timeline', 'microscope', 'knowledge', 'morph-lab', 'heat-map', 'snake', 'aa2fr', 'impact'];
  $('info-panel').style.display = noInfoModes.includes(newMode) ? 'none' : '';
  $('speed-wrap').style.display = ['3letter'].includes(newMode) ? '' : 'none';

  if (mode === '3letter') {
    $('view-3letter').classList.remove('hidden');
    $('btn-start').classList.remove('hidden'); $('btn-pause').classList.remove('hidden');
    $('btn-start').disabled = false; $('btn-pause').disabled = true;
    $('stat-attempts-row').classList.remove('hidden'); $('stat-backtracks-row').classList.remove('hidden');
    $('speed-wrap').style.display = '';
    setAttemptsLabel('Nodes Explored');
    setSquaresLabel('Squares Found');
    init3LetterSearch();

  } else if (mode === 'abc-lab') {
    $('view-abc-lab').classList.remove('hidden');
    $('btn-run-abc').classList.remove('hidden');
    $('stat-attempts-row').classList.remove('hidden');
    $('stat-backtracks-row').classList.add('hidden');
    setAttemptsLabel('Rejected Extensions');
    setSquaresLabel('Square Collisions');
    renderAbcLab();

  } else if (mode === 'try-it') {
    $('view-tryit').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');
    setSquaresLabel('Squares Found');
    tryItWord = [];
    tryItUpdate();

  } else if (mode === 'timeline') {
    $('view-timeline').classList.remove('hidden');
    buildTimeline();

  } else if (mode === 'unfavorable') {
    $('view-unfavorable').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');
    // Auto-compute with the default/current input value on tab entry
    renderUnfavorable();

  } else if (mode === 'microscope') {
    $('view-microscope').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');
    renderMicroscope();

  } else if (mode === 'knowledge') {
    $('view-knowledge').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');
    if (!kgInitialized) initKG();
    else { if (!kgAnimationId) kgLoop(); }

  } else if (mode === 'morph-lab') {
    $('view-morph-lab').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');

  } else if (mode === 'heat-map') {
    $('view-heat-map').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');

  } else if (mode === 'snake') {
    $('view-snake').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');
    snakeInit();

  } else if (mode === 'aa2fr') {
    $('view-aa2fr').classList.remove('hidden');
    aa2frUpdateUI();

  } else if (mode === 'impact') {
    $('view-impact').classList.remove('hidden');

  } else if (mode === 'audio') {
    $('view-audio').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');
    setSquaresLabel('Squares Found');
    renderAudioTracks();
  } else {
    // 4letter, canvas
    $('view-general').classList.remove('hidden');
    $('btn-apply-morphism').classList.remove('hidden');
    $('stat-attempts-row').classList.add('hidden'); $('stat-backtracks-row').classList.add('hidden');
    setSquaresLabel('Squares Found');
    
    if (mode === '4letter') {
      $('tiles-general').classList.remove('hidden');
      if (fourLetterWord.length <= 8000) {
        renderTiles(fourLetterWord, 'tiles-general');
      } else {
        $('tiles-general').classList.add('hidden');
        $('word-empty').classList.remove('hidden');
        $('word-empty').textContent = `String is too large (${fourLetterWord.length} chars) for DOM. Use Canvas view.`;
      }
    } else if (mode === 'canvas') {
      $('btn-draw-canvas').classList.remove('hidden');
      $('lbl-canvas-anim').classList.remove('hidden');
      $('lbl-canvas-anim').style.display = 'flex';
      drawCanvas2DWalk();
    }
  }
}

// =====================================================
// EVENT LISTENERS
// =====================================================
$('btn-start').addEventListener('click', () => { if (mode === '3letter') { running = true; $('btn-start').disabled=true; $('btn-pause').disabled=false; step3Letter(); }});
$('btn-pause').addEventListener('click', () => {
  if (running) { running = false; if (loopTimer) clearTimeout(loopTimer); addLog('Paused.'); $('btn-pause').textContent = 'Resume'; }
  else { running = true; step3Letter(); addLog('Resuming...'); $('btn-pause').textContent = 'Pause'; }
});
$('btn-reset').addEventListener('click', () => { fourLetterWord = ['a']; fourLetterIteration = 0; switchMode(mode); });
$('btn-apply-morphism').addEventListener('click', applyMorphism);
$('btn-draw-canvas').addEventListener('click', drawCanvas2DWalk);
$('btn-run-abc').addEventListener('click', renderAbcLab);
$('abc-survivors').addEventListener('click', handleAbcClick);
$('abc-failures').addEventListener('click', handleAbcClick);

// Inline style for ch- colors in unf display (avoid adding <style> tags dynamically)
const unfStyle = document.createElement('style');
unfStyle.textContent = `
  .unf-word-display .ch-a { color: #e74c3c; }
  .unf-word-display .ch-b { color: #2980b9; }
  .unf-word-display .ch-c { color: #f1c40f; }
  .unf-word-display .ch-d { color: #27ae60; }
`;
document.head.appendChild(unfStyle);

document.querySelectorAll('.mode-tab').forEach(tab => tab.addEventListener('click', () => switchMode(tab.dataset.mode)));

// Initialize
switchMode('3letter');

// =====================================================
// MICROSCOPE RENDERER
// =====================================================
function renderMicroscope() {
  const ALPHABET = ['a','b','c','d'];

  // --- g85 ---
  $('mic-g85-a').innerHTML = G85_A.split('').map((c, i) => {
    // group into blocks of 5 for readability
    const sep = (i > 0 && i % 5 === 0) ? '<span style="color:#ccc">Â·</span>' : '';
    return sep + `<span style="color:${COLORS[c]||'#000'}; font-weight:bold;">${c}</span>`;
  }).join('');
  const p85 = getParikh(G85_A, ALPHABET);
  $('mic-g85-parikh').textContent = `a:${p85.a}, b:${p85.b}, c:${p85.c}, d:${p85.d}`;

  // --- g98 ---
  const g98len = G98_A.length;
  if ($('mic-g98-len')) $('mic-g98-len').textContent = g98len;
  if (G98_A.includes('PLACEHOLDER') || g98len < 10) {
    $('mic-g98-a').innerHTML = `<span style="color:#e74c3c;">Sequence not yet loaded.</span>`;
    $('mic-g98-parikh').textContent = 'n/a';
  } else {
    $('mic-g98-a').innerHTML = G98_A.split('').map((c, i) => {
      const sep = (i > 0 && i % 5 === 0) ? '<span style="color:#ccc">Â·</span>' : '';
      return sep + `<span style="color:${COLORS[c]||'#000'}; font-weight:bold;">${c}</span>`;
    }).join('');
    const p98 = getParikh(G98_A, ALPHABET);
    $('mic-g98-parikh').textContent = `a:${p98.a}, b:${p98.b}, c:${p98.c}, d:${p98.d}`;
  }
}

// =====================================================
// KNOWLEDGE GRAPH
// =====================================================
let kgInitialized = false;
let kgAnimationId = null;
let kgLoop = null;

function initKG() {
  kgInitialized = true;
  const canvas = $('kgCanvas');
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const nodes = [
    { id: 'alphabet', label: 'Alphabet', cat: 'concept', desc: 'A finite set of letters.' },
    { id: 'word', label: 'Word (String)', cat: 'concept', desc: 'A sequence of letters from the alphabet.' },
    { id: 'parikh', label: 'Parikh Vector', cat: 'concept', desc: 'Counts the occurrences of each letter in a word. If two words have the same Parikh vector, they are anagrams.' },
    { id: 'abelian_eq', label: 'abelian equivalence', cat: 'concept', desc: 'Two words are abelian equivalent if they have the same Parikh vector.' },
    { id: 'abelian_sq', label: 'abelian square', cat: 'concept', desc: 'A word of the form UV where U and V are abelian equivalent.' },
    { id: 'morphism', label: 'Morphism', cat: 'concept', desc: 'A mapping that replaces each letter with a fixed word.' },
    { id: 'dt0l', label: 'DT0L System', cat: 'concept', desc: 'A system with multiple morphisms that can be applied non-deterministically to generate languages.' },
    { id: 'keranen', label: 'Veikko KerÃ¤nen', cat: 'person', desc: 'Proved in 1992 that abelian squares are avoidable on 4 letters.' },
    { id: 'thue', label: 'Axel Thue', cat: 'person', desc: 'Started combinatorics on words in 1906. Proved ordinary squares are avoidable on 3 letters.' },
    { id: 'pleasants', label: 'P.A.B. Pleasants', cat: 'person', desc: 'Proved in 1970 that abelian squares are avoidable on 5 letters.' },
    { id: 'g85', label: 'Morphism g85', cat: 'discovery', desc: 'KerÃ¤nen\'s 85-letter morphism (1992) that avoids abelian squares on 4 letters.' },
    { id: 'g98', label: 'Morphism g98', cat: 'discovery', desc: 'KerÃ¤nen\'s 98-letter morphism (2002). Iterating it gives an infinite abelian square-free word.' },
    { id: 'unfavorable', label: 'Unfavorable Factor', cat: 'concept', desc: 'A short pattern that cannot be extended into an infinite abelian square-free word.' }
  ];
  
  const edges = [
    { source: 'alphabet', target: 'word' },
    { source: 'word', target: 'parikh' },
    { source: 'parikh', target: 'abelian_eq' },
    { source: 'abelian_eq', target: 'abelian_sq' },
    { source: 'morphism', target: 'word' },
    { source: 'dt0l', target: 'morphism' },
    { source: 'keranen', target: 'g85' },
    { source: 'keranen', target: 'g98' },
    { source: 'keranen', target: 'unfavorable' },
    { source: 'thue', target: 'word' },
    { source: 'pleasants', target: 'abelian_sq' },
    { source: 'g85', target: 'morphism' },
    { source: 'g98', target: 'morphism' },
    { source: 'g85', target: 'abelian_sq' },
    { source: 'g98', target: 'abelian_sq' }
  ];
  
  // map edges to objects
  edges.forEach(e => {
    e.source = nodes.find(x => x.id === e.source);
    e.target = nodes.find(x => x.id === e.target);
  });
  
  // init positions on a ring to avoid starting from an unreadable cluster
  nodes.forEach((n, i) => {
    const angle = (Math.PI * 2 * i) / nodes.length;
    const radius = Math.min(canvas.width, canvas.height) * 0.34;
    n.x = canvas.width / 2 + Math.cos(angle) * radius;
    n.y = canvas.height / 2 + Math.sin(angle) * radius;
    n.vx = 0; n.vy = 0;
  });
  
  const colors = { 'concept': '#3498db', 'person': '#e67e22', 'discovery': '#9b59b6' };
  
  let draggedNode = null;
  
  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    
    draggedNode = null;
    for(let n of nodes) {
      const dx = mx - n.x; const dy = my - n.y;
      if (dx*dx + dy*dy < 400) {
        draggedNode = n;
        $('kg-title').textContent = n.label;
        $('kg-desc').textContent = n.desc;
        break;
      }
    }
  });
  
  canvas.addEventListener('mousemove', e => {
    if (!draggedNode) return;
    const rect = canvas.getBoundingClientRect();
    draggedNode.x = e.clientX - rect.left;
    draggedNode.y = e.clientY - rect.top;
    draggedNode.vx = 0; draggedNode.vy = 0;
  });
  
  canvas.addEventListener('mouseup', () => { draggedNode = null; });
  canvas.addEventListener('mouseleave', () => { draggedNode = null; });
  
  kgLoop = function() {
    if (mode !== 'knowledge') {
      kgAnimationId = null;
      return;
    }
    kgAnimationId = requestAnimationFrame(kgLoop);
    
    // Physics step
    const k = 0.025; // spring constant
    const rep = 5200; // repulsion
    const damp = 0.72; // damping
    const nodeR = 28;
    const minNodeDist = 88;
    const margin = 56;
    
    nodes.forEach(n => {
      let fx = 0, fy = 0;
      
      // Repulsion
      nodes.forEach(n2 => {
        if (n === n2) return;
        let dx = n.x - n2.x; let dy = n.y - n2.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist === 0) dist = 0.1;
        let f = rep / (dist * dist);
        fx += (dx/dist) * f;
        fy += (dy/dist) * f;
      });
      
      // Center gravity
      fx += (canvas.width/2 - n.x) * 0.006;
      fy += (canvas.height/2 - n.y) * 0.006;
      
      n.vx = (n.vx + fx) * damp;
      n.vy = (n.vy + fy) * damp;
    });
    
    // Springs
    edges.forEach(e => {
      let dx = e.target.x - e.source.x; 
      let dy = e.target.y - e.source.y;
      let dist = Math.sqrt(dx*dx + dy*dy);
      if(dist===0) dist=0.1;
      let f = (dist - 150) * k;
      let fx = (dx/dist) * f;
      let fy = (dy/dist) * f;
      
      e.source.vx += fx; e.source.vy += fy;
      e.target.vx -= fx; e.target.vy -= fy;
    });
    
    // Hard collision pass keeps node circles and their labels readable.
    for (let pass = 0; pass < 2; pass++) {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          let dx = b.x - a.x;
          let dy = b.y - a.y;
          let dist = Math.sqrt(dx * dx + dy * dy);
          if (dist === 0) {
            dx = 1; dy = 0; dist = 1;
          }
          if (dist < minNodeDist) {
            const push = (minNodeDist - dist) / 2;
            const ux = dx / dist;
            const uy = dy / dist;
            if (a !== draggedNode) { a.x -= ux * push; a.y -= uy * push; a.vx *= 0.5; a.vy *= 0.5; }
            if (b !== draggedNode) { b.x += ux * push; b.y += uy * push; b.vx *= 0.5; b.vy *= 0.5; }
          }
        }
      }
    }

    nodes.forEach(n => {
      if (n !== draggedNode) {
        n.vx = Math.max(-8, Math.min(8, n.vx));
        n.vy = Math.max(-8, Math.min(8, n.vy));
        n.x += n.vx;
        n.y += n.vy;
      }
      n.x = Math.max(margin, Math.min(canvas.width - margin, n.x));
      n.y = Math.max(margin, Math.min(canvas.height - margin, n.y));
    });
    
    // Render
    ctx.clearRect(0,0, canvas.width, canvas.height);
    
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ccc';
    edges.forEach(e => {
      ctx.beginPath();
      ctx.moveTo(e.source.x, e.source.y);
      ctx.lineTo(e.target.x, e.target.y);
      ctx.stroke();
    });
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    function drawNodeLabel(node) {
      const words = node.label.split(' ');
      const lines = [];
      let line = '';
      words.forEach(word => {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > 92 && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      });
      if (line) lines.push(line);

      const lineHeight = 12;
      const boxW = Math.max(...lines.map(l => ctx.measureText(l).width)) + 8;
      const boxH = lines.length * lineHeight + 4;
      const lx = node.x;
      const ly = node.y + 38;
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.fillRect(lx - boxW/2, ly - boxH/2, boxW, boxH);
      ctx.fillStyle = '#111';
      lines.forEach((text, i) => {
        ctx.fillText(text, lx, ly - ((lines.length - 1) * lineHeight) / 2 + i * lineHeight);
      });
    }

    nodes.forEach(n => {
      // Node circle
      ctx.beginPath();
      ctx.arc(n.x, n.y, nodeR, 0, Math.PI*2);
      ctx.fillStyle = colors[n.cat] || '#999';
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = (n === draggedNode) ? '#222' : '#fff';
      ctx.stroke();
      
      // Label below node with background for legibility
      ctx.font = 'bold 11px Arial';
      drawNodeLabel(n);
    });
  };
  
  kgLoop();
}

// =====================================================
// 11. MORPHISM LABORATORY
// =====================================================
$('btn-load-g85').addEventListener('click', () => {
  $('morph-input-a').value = G85.a;
  $('morph-input-b').value = G85.b;
  $('morph-input-c').value = G85.c;
  $('morph-input-d').value = G85.d;
});
$('btn-load-g98').addEventListener('click', () => {
  $('morph-input-a').value = G98_A;
  $('morph-input-b').value = cyclicPerm(G98_A);
  $('morph-input-c').value = cyclicPerm(cyclicPerm(G98_A));
  $('morph-input-d').value = cyclicPerm(cyclicPerm(cyclicPerm(G98_A)));
});
$('btn-load-clear').addEventListener('click', () => {
  ['a','b','c','d'].forEach(c => $('morph-input-'+c).value = '');
  $('morph-eval-results').innerHTML = '<em>Enter a morphism and click evaluate to see results.</em>';
});
$('btn-eval-morph').addEventListener('click', evaluateMorphism);

function evaluateMorphism() {
  const m = {
    a: $('morph-input-a').value.trim(),
    b: $('morph-input-b').value.trim(),
    c: $('morph-input-c').value.trim(),
    d: $('morph-input-d').value.trim()
  };
  
  if (!m.a || !m.b || !m.c || !m.d) {
    $('morph-eval-results').innerHTML = '<span style="color:red">Error: All 4 images must be provided.</span>';
    return;
  }
  
  const len = m.a.length;
  if (len !== m.b.length || len !== m.c.length || len !== m.d.length) {
    $('morph-eval-results').innerHTML = '<span style="color:red">Error: Morphism must be uniform (all images same length).</span>';
    return;
  }
  
  const pA = getParikh(m.a);
  const pB = getParikh(m.b);
  const pC = getParikh(m.c);
  const pD = getParikh(m.d);
  
  function isParikhCyclic(p1, p2) {
    return p1.a === p2.b && p1.b === p2.c && p1.c === p2.d && p1.d === p2.a;
  }
  
  const c1 = isParikhCyclic(pA, pB);
  const c2 = isParikhCyclic(pB, pC);
  const c3 = isParikhCyclic(pC, pD);
  const c4 = isParikhCyclic(pD, pA);
  
  const isCyclic = c1 && c2 && c3 && c4;
  
  let html = `<strong>Uniform Length:</strong> ${len}<br>`;
  html += `<strong>Parikh Vector of a:</strong> a:${pA.a}, b:${pA.b}, c:${pA.c}, d:${pA.d}<br>`;
  html += `<strong>Cyclic Permutation Property:</strong> ${isCyclic ? '<span style="color:green">YES</span>' : '<span style="color:red">NO</span>'}<br><br>`;
  
  html += `<strong>Evaluating abelian square-freedom...</strong><br>`;
  $('morph-eval-results').innerHTML = html;
  
  setTimeout(() => {
    const ALPH = ['a','b','c','d'];
    let word = [];
    let currentIdx = 0;
    let seed = ['a'];
    
    let maxLen = 3000;
    if (len * len > 3000) maxLen = len * len * 2;
    if (maxLen > 10000) maxLen = 10000;
    
    let foundSquareAt = -1;
    let generating = true;
    while(generating && word.length < maxLen) {
      if (currentIdx >= seed.length) {
         let nextSeed = [];
         for(let i=0; i<seed.length; i++) {
           let expanded = m[seed[i]].split('');
           nextSeed.push(...expanded);
         }
         seed = nextSeed;
         if (currentIdx >= seed.length) break;
      }
      
      let nextChar = seed[currentIdx];
      word.push(nextChar);
      currentIdx++;
      
      if (findSuffixAbelianSquare(word, ALPH)) {
        foundSquareAt = word.length;
        break;
      }
    }
    
    if (foundSquareAt !== -1) {
       $('morph-eval-results').innerHTML += `<span style="color:red">Failed! abelian square found at length ${foundSquareAt}.</span>`;
    } else {
       $('morph-eval-results').innerHTML += `<span style="color:green">Success! No abelian squares found in prefix of length ${word.length}.</span>`;
    }
  }, 50);
}

// =====================================================
// 12. HEAT MAP
// =====================================================
let heatWordArr = [];
let heatCellW = 0, heatCellH = 0, heatMaxPos = 0, heatMaxHalf = 0;
let heatPSum = null;

$('btn-heat-g85').addEventListener('click', () => {
  $('heat-overlay').style.display = 'block';
  $('heat-status').textContent = 'Generating g\u2088\u2085(a) \u00d72\u2026';
  setTimeout(() => {
    let word = ['a'];
    for(let i=0; i<2; i++) {
       let next = [];
       for(let ch of word) { next.push(...G85[ch].split('')); }
       word = next;
    }
    drawHeatMap(word, 'g\u2088\u2085 word (7225 chars, abelian square-free)');
    $('heat-overlay').style.display = 'none';
  }, 60);
});

$('btn-heat-rand').addEventListener('click', () => {
  $('heat-overlay').style.display = 'block';
  $('heat-status').textContent = 'Generating random word\u2026';
  setTimeout(() => {
    const ALPH = ['a','b','c','d'];
    let word = [];
    for(let i=0; i<7225; i++) { word.push(ALPH[Math.floor(Math.random()*4)]); }
    drawHeatMap(word, 'Random word (7225 chars) \u2014 expect many red squares');
    $('heat-overlay').style.display = 'none';
  }, 60);
});

function drawHeatMap(wordArr, label) {
  heatWordArr = wordArr;
  const canvas = $('heatCanvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  ctx.clearRect(0,0,W,H);

  heatMaxPos = Math.min(2000, wordArr.length);
  heatMaxHalf = Math.min(400, Math.floor(wordArr.length / 2));

  heatCellW = W / heatMaxPos;
  heatCellH = H / heatMaxHalf;

  ctx.fillStyle = '#f4f4f4';
  ctx.fillRect(0,0,W,H);

  // Prefix sums for O(1) Parikh range queries
  heatPSum = { a: [0], b: [0], c: [0], d: [0] };
  for(let i=0; i<wordArr.length; i++) {
    let ch = wordArr[i];
    heatPSum.a.push(heatPSum.a[i] + (ch === 'a' ? 1 : 0));
    heatPSum.b.push(heatPSum.b[i] + (ch === 'b' ? 1 : 0));
    heatPSum.c.push(heatPSum.c[i] + (ch === 'c' ? 1 : 0));
    heatPSum.d.push(heatPSum.d[i] + (ch === 'd' ? 1 : 0));
  }

  let squareCount = 0, nearCount = 0;

  for (let pos = 0; pos < heatMaxPos; pos++) {
    for (let hLen = 1; hLen <= heatMaxHalf; hLen++) {
       if (pos + 2*hLen > wordArr.length) continue;
       const end1 = pos + hLen, end2 = pos + 2*hLen;
       const p1a = heatPSum.a[end1]-heatPSum.a[pos], p2a = heatPSum.a[end2]-heatPSum.a[end1];
       const p1b = heatPSum.b[end1]-heatPSum.b[pos], p2b = heatPSum.b[end2]-heatPSum.b[end1];
       const p1c = heatPSum.c[end1]-heatPSum.c[pos], p2c = heatPSum.c[end2]-heatPSum.c[end1];
       const p1d = heatPSum.d[end1]-heatPSum.d[pos], p2d = heatPSum.d[end2]-heatPSum.d[end1];
       const diff = Math.abs(p1a-p2a) + Math.abs(p1b-p2b) + Math.abs(p1c-p2c) + Math.abs(p1d-p2d);

       if (diff === 0) {
         ctx.fillStyle = 'rgba(231, 76, 60, 0.88)';
         ctx.fillRect(pos * heatCellW, H - hLen * heatCellH, Math.max(1, heatCellW), Math.max(1, heatCellH));
         squareCount++;
       } else if (diff <= 2) {
         ctx.fillStyle = 'rgba(241, 196, 15, 0.45)';
         ctx.fillRect(pos * heatCellW, H - hLen * heatCellH, Math.max(1, heatCellW), Math.max(1, heatCellH));
         nearCount++;
       }
    }
  }

  // Bottom-left annotation
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.fillRect(4, H - 18, 280, 16);
  ctx.fillStyle = '#555';
  ctx.font = '11px Arial';
  ctx.fillText(`word[0\u2026${heatMaxPos-1}], half-len 1\u2026${heatMaxHalf}`, 6, H - 5);

  const statusEl = $('heat-status');
  if (statusEl) statusEl.textContent = `${label} | ${squareCount} squares, ${nearCount} near-misses`;
}

// Hover tooltip on heat map
$('heatCanvas').addEventListener('mousemove', function(e) {
  if (!heatWordArr.length || !heatPSum) return;
  const rect = this.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const scaleX = this.width / rect.width;
  const scaleY = this.height / rect.height;
  const cx = x * scaleX, cy = y * scaleY;
  const H = this.height;
  const pos = Math.floor(cx / heatCellW);
  const hLen = Math.floor((H - cy) / heatCellH) + 1;

  if (pos < 0 || pos >= heatMaxPos || hLen < 1 || hLen > heatMaxHalf) {
    $('heat-tooltip').textContent = ''; return;
  }
  if (pos + 2*hLen > heatWordArr.length) { $('heat-tooltip').textContent = ''; return; }

  const end1 = pos + hLen, end2 = pos + 2*hLen;
  const p1a = heatPSum.a[end1]-heatPSum.a[pos];
  const p1b = heatPSum.b[end1]-heatPSum.b[pos];
  const p1c = heatPSum.c[end1]-heatPSum.c[pos];
  const p1d = heatPSum.d[end1]-heatPSum.d[pos];
  const p2a = heatPSum.a[end2]-heatPSum.a[end1];
  const p2b = heatPSum.b[end2]-heatPSum.b[end1];
  const p2c = heatPSum.c[end2]-heatPSum.c[end1];
  const p2d = heatPSum.d[end2]-heatPSum.d[end1];
  const diff = Math.abs(p1a-p2a)+Math.abs(p1b-p2b)+Math.abs(p1c-p2c)+Math.abs(p1d-p2d);

  const half1 = heatWordArr.slice(pos, end1).join('').substring(0, 18);
  const half2 = heatWordArr.slice(end1, end2).join('').substring(0, 18);
  const dots1 = hLen > 18 ? '\u2026' : '';
  const dots2 = hLen > 18 ? '\u2026' : '';
  const state = diff === 0 ? '\uD83D\uDD34 abelian square' : diff <= 2 ? '\uD83D\uDFE1 near-miss' : '\u2705 ok';
  $('heat-tooltip').textContent =
    `pos=${pos}, half-len=${hLen} | "${half1}${dots1}" vs "${half2}${dots2}" | P\u2081=(a:${p1a},b:${p1b},c:${p1c},d:${p1d}) P\u2082=(a:${p2a},b:${p2b},c:${p2c},d:${p2d}) | ${state}`;
});
$('heatCanvas').addEventListener('mouseleave', () => { $('heat-tooltip').textContent = ''; });

// =====================================================
// 13. ABELIAN SNAKE GAME
// =====================================================
const SNAKE_ALPHA = ['a','b','c','d'];
const SNAKE_GRID = 20;        // grid cells
const SNAKE_CELL = 26;        // px per cell (will be overridden by canvas size)
const SNAKE_COLORS = { a: '#ef4444', b: '#3b82f6', c: '#eab308', d: '#22c55e' };
const SNAKE_MILESTONES = [
  { n: 85,  label: '85 â€” gâ‚ˆâ‚… length' },
  { n: 100, label: '100' },
  { n: 250, label: '250' },
  { n: 500, label: '500' },
  { n: 1000,label: '1000' }
];

let snakeState = null;        // full game state
let snakeTickTimer = null;
let snakeDangerVision = true; // Easy mode by default
let snakeHS = parseInt(localStorage.getItem('abelian_snake_hs') || '1');
let snakePaused = false;
let snakeAlive = false;
let snakeReachedMilestones = new Set();
let snakeFlashTimer = null;

function snakePause() {
  if (snakeTickTimer) { clearTimeout(snakeTickTimer); snakeTickTimer = null; }
  snakePaused = true;
}

function snakeGetCellSize() {
  const wrap = $('snake-canvas-wrap');
  const w = wrap ? Math.min(wrap.clientWidth, 600) : 520;
  return Math.floor(w / SNAKE_GRID);
}

function snakeInit() {
  snakePaused = false;
  snakeAlive = false;
  if (snakeTickTimer) clearTimeout(snakeTickTimer);

  const cell = snakeGetCellSize();
  const cvs = $('snakeCanvas');
  cvs.width = SNAKE_GRID * cell;
  cvs.height = SNAKE_GRID * cell;

  $('snake-start-overlay').classList.remove('hidden');
  $('snake-gameover-overlay').classList.add('hidden');
  updateSnakeHSDisplay();
  snakeDraw();
}

function snakeStart() {
  snakePaused = false;
  snakeAlive = true;
  if (snakeTickTimer) clearTimeout(snakeTickTimer);

  const startX = Math.floor(SNAKE_GRID / 2);
  const startY = Math.floor(SNAKE_GRID / 2);

  snakeState = {
    body: [{x: startX, y: startY}],
    word: ['a'],          // first cell is letter 'a'
    dir: {x: 1, y: 0},   // moving right
    nextDir: {x: 1, y: 0},
    letters: [],          // { x, y, char, fatal } â€” 4 food items
    eaten: 0,
    tickMs: 180
  };
  snakeReachedMilestones = new Set();
  snakeRenderMilestoneBadges();

  $('snake-start-overlay').classList.add('hidden');
  $('snake-gameover-overlay').classList.add('hidden');
  $('snake-deadend-warn').classList.remove('active');
  $('snake-score').textContent = '1';
  $('snake-eaten').textContent = '0';
  $('snake-pause-btn').disabled = false;

  snakeSpawnLetters();
  snakeUpdateUI();
  snakeTick();
}

function snakeTick() {
  if (!snakeAlive || snakePaused) return;
  snakeStep();
  if (snakeAlive) {
    snakeTickTimer = setTimeout(snakeTick, snakeState.tickMs);
  }
}

function snakeStep() {
  const s = snakeState;
  s.dir = { ...s.nextDir };

  const head = s.body[0];
  const newHead = {
    x: (head.x + s.dir.x + SNAKE_GRID) % SNAKE_GRID,
    y: (head.y + s.dir.y + SNAKE_GRID) % SNAKE_GRID
  };

  // Self-collision (skip tail because it will move away)
  for (let i = 0; i < s.body.length - 1; i++) {
    if (s.body[i].x === newHead.x && s.body[i].y === newHead.y) {
      snakeGameOver('self'); return;
    }
  }

  // Check if we eat a letter
  const ateIdx = s.letters.findIndex(l => l.x === newHead.x && l.y === newHead.y);

  if (ateIdx !== -1) {
    const ateChar = s.letters[ateIdx].char;
    const newWord = [...s.word, ateChar];
    const sq = findSuffixAbelianSquare(newWord, SNAKE_ALPHA);
    if (sq) {
      // Ate a fatal letter â€” grow the body to show the full snake then die
      s.body.unshift(newHead);
      s.word = newWord;
      snakeDrawFrame();
      snakeGameOver('square', sq, newWord); return;
    }
    // Safe eat
    s.word = newWord;
    s.body.unshift(newHead);   // grow
    s.eaten++;
    // Slightly speed up every 10 eats (floor at 110ms so it doesn't get ridiculously fast)
    if (s.eaten % 10 === 0 && s.tickMs > 110) s.tickMs -= 5;
    snakeSpawnLetters();
    snakeCheckMilestones();
  } else {
    // Normal move â€” shift body
    s.body.unshift(newHead);
    s.body.pop();
  }

  snakeUpdateUI();
  snakeDrawFrame();
}

function snakeSpawnLetters() {
  const s = snakeState;
  const occupied = new Set(s.body.map(c => `${c.x},${c.y}`));
  const allCells = [];
  for (let x = 0; x < SNAKE_GRID; x++)
    for (let y = 0; y < SNAKE_GRID; y++)
      if (!occupied.has(`${x},${y}`)) allCells.push({x, y});

  // Shuffle
  for (let i = allCells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
  }

  s.letters = SNAKE_ALPHA.map((ch, i) => {
    const cell = allCells[i] || { x: 0, y: 0 };
    // Danger Vision: test if eating this char would be fatal
    const testWord = [...s.word, ch];
    const fatal = !!findSuffixAbelianSquare(testWord, SNAKE_ALPHA);
    return { x: cell.x, y: cell.y, char: ch, fatal };
  });
}

function snakeGameOver(reason, sq, word) {
  snakeAlive = false;
  snakePaused = false;
  if (snakeTickTimer) clearTimeout(snakeTickTimer);
  $('snake-pause-btn').disabled = true;

  const score = snakeState.word.length;

  // Update high score
  if (score > snakeHS) {
    snakeHS = score;
    localStorage.setItem('abelian_snake_hs', snakeHS);
  }
  updateSnakeHSDisplay();

  const goOverlay = $('snake-gameover-overlay');
  const goSquare = $('snake-go-square');
  const goSub = $('snake-go-subtitle');
  const goHs = $('snake-go-hs');

  goHs.textContent = `Score: ${score}  |  High Score: ${snakeHS}`;

  if (reason === 'self') {
    goSub.textContent = 'You bit your own tail!';
    goSquare.innerHTML = `<span style="color:#f59e0b">No abelian square â€” just a self-collision.</span>`;
    $('snake-go-fullword').innerHTML = word.map(c => `<span class="sn-${c}">${c}</span>`).join('');
  } else if (sq) {
    goSub.textContent = `abelian square detected at length ${score}!`;
    const half1 = word.slice(sq.start, sq.start + sq.halfLen).join('');
    const half2 = word.slice(sq.start + sq.halfLen, sq.start + sq.halfLen * 2).join('');
    const pStr = p => `(a:${p.a||0} b:${p.b||0} c:${p.c||0} d:${p.d||0})`;
    const pre = word.slice(Math.max(0, sq.start - 4), sq.start).join('');
    const post = word.slice(sq.start + sq.halfLen * 2, sq.start + sq.halfLen * 2 + 4).join('');
    goSquare.innerHTML =
      `<div style="color:#94a3b8; margin-bottom:6px;">Word at death (excerpt):</div>` +
      `<div style="margin-bottom:8px;">${pre ? '<span style="color:#475569">' + pre + '</span>' : ''}` +
      `<span class="snake-go-sq-h1">${half1}</span>` +
      `<span class="snake-go-sq-h2">${half2}</span>` +
      `${post ? '<span style="color:#475569">' + post + '</span>' : ''}</div>` +
      `<div style="color:#94a3b8">Half 1: <span style="color:#ef4444">${pStr(sq.p1)}</span></div>` +
      `<div style="color:#94a3b8">Half 2: <span style="color:#f97316">${pStr(sq.p2)}</span></div>` +
      `<div style="color:#64748b; margin-top:6px; font-size:0.74rem;">pos=${sq.start}, half-length=${sq.halfLen}</div>`;
      
    $('snake-go-fullword').innerHTML = word.map((c, i) => {
      if (i >= sq.start && i < sq.start + sq.halfLen) return `<span class="snake-go-sq-h1" style="font-weight:bold">${c}</span>`;
      if (i >= sq.start + sq.halfLen && i < sq.start + sq.halfLen * 2) return `<span class="snake-go-sq-h2" style="font-weight:bold">${c}</span>`;
      return `<span style="color:#64748b">${c}</span>`;
    }).join('');
  }

  goOverlay.classList.remove('hidden');
  snakeDrawFrame();
}

function updateSnakeHSDisplay() {
  $('snake-hs').textContent = snakeHS > 1 ? snakeHS : 'â€”';
}

function snakeRenderMilestoneBadges() {
  const list = $('snake-milestone-list');
  if (!list) return;
  const len = snakeState ? snakeState.word.length : 0;
  const nextIdx = SNAKE_MILESTONES.findIndex(m => !snakeReachedMilestones.has(m.n));
  list.innerHTML = SNAKE_MILESTONES.map((m, i) => {
    const reached = snakeReachedMilestones.has(m.n);
    const isNext = (i === nextIdx);
    const cls = reached ? 'snake-m reached' : (isNext ? 'snake-m next' : 'snake-m');
    return `<span class="${cls}">${m.label}</span>`;
  }).join('');
}

function snakeCheckMilestones() {
  if (!snakeState) return;
  const len = snakeState.word.length;
  SNAKE_MILESTONES.forEach(m => {
    if (len >= m.n && !snakeReachedMilestones.has(m.n)) {
      snakeReachedMilestones.add(m.n);
      snakeRenderMilestoneBadges();
      snakeShowFlash(`ðŸ† ${m.label} letters!`);
    }
  });
}

function snakeShowFlash(text) {
  const flash = $('snake-flash');
  const inner = $('snake-flash-text');
  if (!flash || !inner) return;
  inner.textContent = text;
  flash.classList.add('visible');
  if (snakeFlashTimer) clearTimeout(snakeFlashTimer);
  snakeFlashTimer = setTimeout(() => flash.classList.remove('visible'), 2200);
}

function snakeUpdateUI() {
  if (!snakeState) return;
  const s = snakeState;
  $('snake-score').textContent = s.word.length;
  $('snake-eaten').textContent = s.eaten;
  
  const speedLevel = Math.floor((180 - s.tickMs) / 5) + 1;
  const speedEl = $('snake-speed');
  if (speedEl) speedEl.textContent = speedLevel;

  // Parikh balance panel
  const pAll = getParikh(s.word);
  const maxP = Math.max(1, pAll.a||0, pAll.b||0, pAll.c||0, pAll.d||0);
  const bPanel = $('snake-balance-panel');
  if (bPanel) {
    bPanel.innerHTML = SNAKE_ALPHA.map(ch => {
      const v = pAll[ch] || 0;
      const pct = (v / maxP) * 100;
      return `<div class="snake-b-row"><div class="snake-b-lbl">${ch}</div><div class="snake-b-bar-wrap"><div class="snake-b-bar" style="background:${SNAKE_COLORS[ch]}; width:${pct}%"></div></div><div class="snake-b-val">${v}</div></div>`;
    }).join('');
  }

  // DNA display (show last 120 chars, colorised)
  const dnaDiv = $('snake-dna-display');
  const show = s.word.slice(-120);
  const prefix = s.word.length > 120 ? '<span style="color:#374151">â€¦</span>' : '';
  dnaDiv.innerHTML = prefix + show.map(c =>
    `<span class="sn-${c}">${c}</span>`).join('');
  dnaDiv.scrollTop = dnaDiv.scrollHeight;

  // Parikh splits panel (show last 8 splits)
  const panel = $('snake-parikh-panel');
  const word = s.word;
  const n = word.length;
  if (n < 2) {
    panel.innerHTML = '<span style="color:#475569; font-style:italic;">Length â‰¥ 2 needed.</span>';
    return;
  }
  // Dead-end warning: are ALL 4 letters fatal?
  const allFatal = s.letters.length === 4 && s.letters.every(l => l.fatal);
  const warnEl = $('snake-deadend-warn');
  if (warnEl) warnEl.classList.toggle('active', allFatal);

  let rows = '';
  const maxSplits = 8;
  const startHalf = Math.max(1, Math.floor(n / 2) - maxSplits + 1);
  for (let halfLen = startHalf; halfLen <= Math.floor(n / 2); halfLen++) {
    const start = n - halfLen * 2;
    const first = word.slice(start, start + halfLen);
    const second = word.slice(start + halfLen);
    const p1 = getParikh(first); const p2 = getParikh(second);
    const clash = parikhEqual(p1, p2, SNAKE_ALPHA);
    const rowCls = clash ? 'sp-row sp-danger' : 'sp-row';
    const pFmt = p => `a${p.a||0}b${p.b||0}c${p.c||0}d${p.d||0}`;
    rows += `<div class="${rowCls}">`
      + `<span class="sp-half" title="${first.join('')}">${pFmt(p1)}</span>`
      + `<span class="sp-vs">vs</span>`
      + `<span class="sp-half" title="${second.join('')}">${pFmt(p2)}</span>`
      + `<span style="color:${clash ? '#ef4444' : '#22c55e'}; padding-left:4px;">${clash ? 'âœ—' : 'âœ“'}</span>`
      + `</div>`;
  }
  panel.innerHTML = rows;
  snakeRenderMilestoneBadges();
}

function snakeDraw() {
  const cvs = $('snakeCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const cell = cvs.width / SNAKE_GRID;

  // Dark background
  ctx.fillStyle = '#0d0d14';
  ctx.fillRect(0, 0, cvs.width, cvs.height);

  // Grid lines
  ctx.strokeStyle = '#1a1a2a';
  ctx.lineWidth = 0.5;
  for (let i = 0; i <= SNAKE_GRID; i++) {
    ctx.beginPath(); ctx.moveTo(i * cell, 0); ctx.lineTo(i * cell, cvs.height); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i * cell); ctx.lineTo(cvs.width, i * cell); ctx.stroke();
  }
}

function snakeDrawFrame() {
  const cvs = $('snakeCanvas');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  const cell = cvs.width / SNAKE_GRID;
  const pad = Math.max(1, cell * 0.06);

  snakeDraw(); // clear + grid

  if (!snakeState) return;
  const s = snakeState;

  // Draw food letters
  s.letters.forEach(l => {
    const lx = l.x * cell; const ly = l.y * cell;
    let baseColor = SNAKE_COLORS[l.char];

    if (snakeDangerVision) {
      if (l.fatal) {
        // Death letter â€” red pulsing halo
        const grd = ctx.createRadialGradient(lx+cell/2, ly+cell/2, cell*0.1, lx+cell/2, ly+cell/2, cell*0.8);
        grd.addColorStop(0, 'rgba(239,68,68,0.35)');
        grd.addColorStop(1, 'rgba(239,68,68,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(lx - cell*0.3, ly - cell*0.3, cell*1.6, cell*1.6);
        baseColor = '#ef4444';
      } else {
        // Safe letter â€” green glow
        const grd = ctx.createRadialGradient(lx+cell/2, ly+cell/2, cell*0.1, lx+cell/2, ly+cell/2, cell*0.75);
        grd.addColorStop(0, 'rgba(34,197,94,0.22)');
        grd.addColorStop(1, 'rgba(34,197,94,0)');
        ctx.fillStyle = grd;
        ctx.fillRect(lx - cell*0.3, ly - cell*0.3, cell*1.6, cell*1.6);
        baseColor = '#22c55e';
      }
    }

    // Letter tile
    const r = cell * 0.38;
    ctx.beginPath();
    ctx.roundRect(lx + pad, ly + pad, cell - pad*2, cell - pad*2, r);
    ctx.fillStyle = snakeDangerVision
      ? (l.fatal ? 'rgba(127,29,29,0.9)' : 'rgba(20,83,45,0.9)')
      : '#1f2937';
    ctx.fill();
    ctx.strokeStyle = baseColor;
    ctx.lineWidth = snakeDangerVision ? 2 : 1;
    ctx.stroke();

    ctx.fillStyle = snakeDangerVision ? (l.fatal ? '#fca5a5' : '#86efac') : SNAKE_COLORS[l.char];
    ctx.font = `bold ${Math.round(cell * 0.48)}px monospace`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(l.char, lx + cell / 2, ly + cell / 2 + 1);
  });

  // Draw snake body
  s.body.forEach((seg, i) => {
    const sx = seg.x * cell; const sy = seg.y * cell;
    const ch = s.word[s.word.length - 1 - i] || s.word[0]; // newest char at head
    const isHead = (i === 0);

    // Body segment
    const alpha = isHead ? 1 : Math.max(0.3, 1 - i / (s.body.length + 3) * 0.6);
    ctx.beginPath();
    ctx.roundRect(sx + pad, sy + pad, cell - pad*2, cell - pad*2,
      isHead ? cell * 0.35 : cell * 0.2);
    const col = SNAKE_COLORS[ch] || '#94a3b8';
    ctx.fillStyle = isHead ? col : col.replace(')', `,${alpha})`);
    // Approximate alpha on hex: use globalAlpha
    ctx.globalAlpha = isHead ? 1 : Math.max(0.3, 1 - i / (s.body.length + 5) * 0.65);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Letter on body
    if (cell > 14) {
      ctx.fillStyle = isHead ? '#ffffff' : `rgba(255,255,255,${Math.max(0.25, 0.8 - i / s.body.length)})`;
      ctx.font = `bold ${Math.round(cell * (isHead ? 0.44 : 0.38))}px monospace`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(ch, sx + cell / 2, sy + cell / 2 + 1);
    }

    // Head eyes
    if (isHead) {
      const ex = cell * 0.22; const ey = cell * 0.24;
      const eyeOffX = s.dir.y !== 0 ? ex : 0;
      const eyeOffY = s.dir.x !== 0 ? ey : 0;
      ctx.fillStyle = '#fff';
      [[-1, -1],[1, -1]].forEach(([dx, dy]) => {
        ctx.beginPath();
        ctx.arc(sx + cell/2 + dx * (ex + eyeOffX * s.dir.x),
                sy + cell/2 + dy * (ey + eyeOffY * s.dir.y),
                cell * 0.09, 0, Math.PI*2);
        ctx.fill();
      });
    }
  });
}

// ---- Input handling ----
document.addEventListener('keydown', function(e) {
  if (mode !== 'snake') return;

  if (!snakeAlive && (e.key === 'Enter' || e.key === ' ')) {
    if (!$('snake-gameover-overlay').classList.contains('hidden') ||
        !$('snake-start-overlay').classList.contains('hidden')) {
      snakeStart(); return;
    }
  }

  if (e.key === 'p' || e.key === 'P') { snakeTogglePause(); return; }

  if (!snakeAlive || !snakeState) return;
  const d = snakeState.dir;
  if ((e.key === 'ArrowLeft'  || e.key === 'a' || e.key === 'A') && d.x !== 1)  { snakeState.nextDir = {x:-1,y:0}; e.preventDefault(); }
  if ((e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') && d.x !== -1) { snakeState.nextDir = {x:1,y:0};  e.preventDefault(); }
  if ((e.key === 'ArrowUp'    || e.key === 'w' || e.key === 'W') && d.y !== 1)  { snakeState.nextDir = {x:0,y:-1}; e.preventDefault(); }
  if ((e.key === 'ArrowDown'  || e.key === 's' || e.key === 'S') && d.y !== -1) { snakeState.nextDir = {x:0,y:1};  e.preventDefault(); }
});

function snakeTogglePause() {
  if (!snakeAlive) return;
  snakePaused = !snakePaused;
  $('snake-pause-btn').textContent = snakePaused ? 'Resume' : 'Pause';
  if (!snakePaused) snakeTick();
}

// ---- Buttons ----
$('snake-start-btn').addEventListener('click', snakeStart);
$('snake-restart-btn').addEventListener('click', snakeStart);
$('snake-pause-btn').addEventListener('click', snakeTogglePause);
$('snake-easy-btn').addEventListener('click', () => {
  snakeDangerVision = true;
  $('snake-easy-btn').classList.add('active');
  $('snake-hard-btn').classList.remove('active');
  if (snakeState) snakeDrawFrame();
});
$('snake-hard-btn').addEventListener('click', () => {
  snakeDangerVision = false;
  $('snake-hard-btn').classList.add('active');
  $('snake-easy-btn').classList.remove('active');
  if (snakeState) snakeDrawFrame();
});

// Touch/swipe support for mobile
(function() {
  let tx0 = 0, ty0 = 0;
  const cvs = $('snakeCanvas');
  cvs.addEventListener('touchstart', e => { tx0 = e.touches[0].clientX; ty0 = e.touches[0].clientY; }, {passive:true});
  cvs.addEventListener('touchend', e => {
    if (!snakeAlive || !snakeState) return;
    const dx = e.changedTouches[0].clientX - tx0;
    const dy = e.changedTouches[0].clientY - ty0;
    const d = snakeState.dir;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 20 && d.x !== -1) snakeState.nextDir = {x:1,y:0};
      if (dx < -20 && d.x !== 1) snakeState.nextDir = {x:-1,y:0};
    } else {
      if (dy > 20 && d.y !== -1) snakeState.nextDir = {x:0,y:1};
      if (dy < -20 && d.y !== 1) snakeState.nextDir = {x:0,y:-1};
    }
  }, {passive:true});
})();

// Resize canvas if window changes while snake tab is open
window.addEventListener('resize', () => {
  if (mode !== 'snake') return;
  const cell = snakeGetCellSize();
  const cvs = $('snakeCanvas');
  cvs.width = SNAKE_GRID * cell;
  cvs.height = SNAKE_GRID * cell;
  if (snakeState) snakeDrawFrame(); else snakeDraw();
});

updateSnakeHSDisplay();

// =====================================================
// 14. AA2FR LABORATORY
// =====================================================
const FORBID4 = ['baac', 'caab', 'abbc', 'cbba', 'accb', 'bcca'];
const AA2F15796 = "abaccbbbcccbaacccaaaccbbaaabbbcbbabbcccacbcccaaaccbbbacccbbaaacaaabaaaccbbabbbcbbaaccbcaaabbcccbbbccabbcccacccbcaaabaacccbbbaacbaaabbcbbbaaccbcccaccbbaaabbbcbbbabbbccaaabbbaaacaaabaaacccbcaabaaacaabcbbabbcccaaacbaacccbcccacccbbbacccaabbcabbbaaacabcacccbbaaabccaaacccabccaaabaaacaaabbbaaacccbaaabbbaaccbbbcccabccaabaaacaabbbaacccaaabbcaabbbcbbabbcccbbbccaaabbbaacaabaaaccbabbcccbaacccaaabaaacaaabbbaacccbaaabbbaccbbbcccbaccbbbaacaabaaacccbccabbcccacccbcccaaacbbbabbcccbbbccaabcbbbaaabbcccabccaaacccabbcccbbbacaabaaccbbbaacbbaaabbbcbbbabbbccacbabbbcbbbaaacaabbccaaacccaabaaacaabbccaaabbbaccbcccaabccaaabaacbbabbbcccbbaaabcacccbcccaabbbcccbbbabbbcbacaabbbcccaaacbbaaabbbaccbbbcccabccaaabaacbbbcacbcccaaaccbbacbcccacccbbaccbbbcccaaabacbabbbcccbaaabbbcbbbabbbccabbcccbbbaacbcccacbbbcccbbaaacaaabaaacccbbbabbbcbbbaaabbcaabbbcbbbabbbcccbacccaabbbcbbbabbbccaaacbbaaabbbaacbbaaacaaabacccaaabbccacccbbabbcbaacaaabaacccbbaaabbbcbbbabbbccabbcccacbcccaaaccbabbbcccbbbaaabbbcbbbabbbccabbcbbbaaacccaaabaaacaaabbbcabbcccaaaccbcccaabbbaaacccaaabaaacaaabbbacbbaaacaaabaaacccbccaaabbbcccbbabbcbbbaaacabacccbbbaaacaaabaaacccabcccbbaacbacccaaacbbaaabbbaaccbbabcccbaacccabcccbbbabbbcbbbaaacabacccbbabcbbaaacaaabacccabbcccbacaaabbbcbaacccabbcccbbbccabbcccacccbcccaaacccbbbccacccbccaaabaaacaaabbcbaacccbabbcbbaacaaabbbcccaaacccbcacccbbbcccaabbbaaabcbbbabbbccaaabbbaaacaabaacccabbbcbbaaacaabaacccaabbbcccbabbbcbaaacbccabbcccacccbcccaaabaaacabbbaaacccaaabaaacaaabbcaabbbcaccbaacaaabaacbbabbbcbbaacabbcccbacccaaabaaacaaabbcaabbbaaabbcccaaabaccbbaaabbbcbbbabbbcccbbaaccbcaaaccbbaaabbbacbbaaacaaabaaacccbbaccbbbcccacccbcccaaabbccacccbabbbcbacaaabbbacbbbccaaacccabbcccbbbccaaabbbcccbabbbcbbbaaabbbcccbbaaabbbaacaabaaaccbacccbbbacaabbbcbbbabbbccacbbbaaacaabbccacccbbbaaacccaaabaaacaaabbcaabbbcccaaabaaacaaabbbcbbbabbbcccacccbcccaabaccbbbcccbbabbbcaaaccbbbabbbcbbbaacaaabaacccaaaccbbbaaacaabcccaccbbabbcbaacccaaabbcaabbbaaacaaabaaaccbaacccaaaccbaaabbcaaacccbaccbbabbcbaaaccbccacccbbbcccaaacccbcccacccbbaccbbbcccbbacccaabbbcccbbbabbbcbbbaaacabccaaabaaacaaabbbaacccaaaccbaacccbbbccabbbaacccaaaccbaacccbcccacccbbbccaaacccbcccacbbbcccbbaacccaabaacaaabbcccaabbbcbbbabcccbbaacccaaaccbccacccbbbccabbbaacabbcccbbbabbbcbbbaaabbcaabbbccaabcaaacccbbbccaaabbbaacbbaaacaaabaaacccbcccacccbbabbcbacaaabbcaabbbcbabbbcccbbaaacccbccabbcccacccbcccaaabaaacabbbaccbcccaccbbaacbabbbcbacbcccaabbbaaacaabbcbbbaaacaaabaaaccbaacccbcabaaacaaabbbacbbaacccbbbccacccbccaaacccbbaaabbbcbbbabbbccaaabbcaabbbaaacaaabacccabbbaaacabcbbbaaabbbcccbbaccbbbabbbcbbbaaabbbcccbbaaabbbacbbbcccabaacccaabbbcccbbacaaabbbcbbaaacaaabaaacccabbcbbbaaacaabbbcccaaaccbcccaccbbbcccaaaccbbabbcbbbaacccaaabaaacaaabbbcbbaacccbaaabbbcbbbabbbcccbbbaaacccbcccacbbabbbcccbbaaabbbcbbbabbbccacccbbbabbbcbbbaaabbbcccbbaaacaaabaccbbbcccbbaaacccbcccacccbbabbcbbbaaabcccaccbabbccaccbcccaabaaacbbbccaaacbaaabbbaacbbbcacbcaaacccabcccbbbcabbbaaabbcccbaccbbbabbbcbbbaaabcaaaccbbbaacbbabbbcccbacccaaabbcbbbaaabbcccaaabaaacaaabbcbbabbbcccaaabbbaacaaabbcccaaaccbaacccbcccacbbbaaacabaaaccbacaabbbcbabbbcccabbbaaaccbacccaabbbcccbbbabbbcbbbaaabbcaabbbccaaabaaacabbbcccaaacbbaaabbbaacbccaaabbbaaacaaabaaaccbaacccaaabaaacaaabbbcccacccbcccaabbbaaabcccaaabaaacaaabbbaaacccbbbaacbbaaabbbcbbbabbbccabbcccbbbaacccbaaabbbacbbbccabbcccacccbcccaaabaaacaaabbbaacbbaaacccabcccbbbabbbcbbbaaabcccabbcbbbabbccabcccbbbabccaaacccbcccacccbbacbcccaaaccbaaabbbaaccbcccabbcbbbabbcacccbcccaaacbbbcacbcccaaabaaacaaabbbaaacccabbbcbbacccaaaccbbbabbbcbbbaaabbcaabbbcbbbabbbcccbbbaaabbbcbabbbcccbaaacbbbcccabcbbbabbbcccaaacbbbacaaabacccbabbbcbbbaaacbcccacccbbbcccaaabbbcccbbbabbbcbaaaccbcccaccbbbcccaaacccbcccacccbbaccbbbcccacbcccaaabaccbbbabbcbbaaabcaaacccbcaaabbbcccacccbcabbbcccbacaabbbcbbbabbbcccbbbaaabbbcbaaacaabbcabaaacccaabcccbbaaabbbcbabbbccabbcccabcaaabbbcbaacccbcccacccbbbcccaabbbcbbabbcccbbbccaabcaaaccbbabbbcccbbbaaabbbcbbbabbbccabcccbbbabbbcbbbaaaccbaacccbccaccbbbaacbcccaaabaaacabcbbbabbbcccabbbaaabbcaaacccbbaacaaabbcbbbaaacaaabacbbbcccaabaaacaabcccaccbbacbccaaabbbcaccbaacaaabbbaacbbbccaabcabbbcccbbacccaaabbbcaaacccbcccacccbbaccbbbaaabbccaccbcccaaabaaacabcbbaaacaaabaaacccaabccaaabaaacaaabbbcccacccbcabbbaaabcaaaccbbacaaabbbcbbabbccaccbcccaaabaaacaaabbbaacbccaaacbbaaabbbaccbbbcccacbbabbbcbbaaacccbbbcaabbbaaacaaabaaacccbcccacbabbbcccacccbcccaabccaaacccbcccacccbbbcccaabcbbaaabbcccacccbcccaabaaacccbccaabbbaaabcacccbbaaabbbcbbbabbbccabcccbbabbbccaabcacccbcccaabbbcccbbbabcbbbaacabaacccbbbccabaaacccbcccacccbbaccbbbcccbbacccaabbcbbbabbcccbbaaacccaabcbbaaacaaabaaaccbccacccbbbcccaabccaaabbcbaccbbabbcbbbaaacaaabaaacccbbbaaacabcccbbabbbcbbacaaabbbcbbbabbbccacccbbbccaaacccbccaaabaaccbcaabbbaaabbcbbbabbcccbbbccaabcbbbaaabbccacccbbbcabbcccacccbcccaaacccbbbacccaaabbcbbbacaaabacccaaabbccacccbbbcaaabbcccbbbabbbcbbbaaabbcaabbbcccbbbabcccaabbbaaacabccaaabaaacaaabbbcbaacccaaaccbcccabbcbbbacaaabaaacccbbbaaabbcaabbbcccaccbaaabbbcbbaacccbbbcccacccbcaaacccbbacaaabacccaabbbcccbacaabaaccbbbabbcaaabaacccbbbacaaabaaaccbaacccaaabbcccacccbcaaacccaabbbaccbbbcccacccbcccaabccaaacccaabcccbbacccaaacbaaabbcbbbabbcccbbbaacccabbcccbbbccabbcccacccbcccaaacccbbabcbbaacccaaaccbaacccbcccacccbbbacaabbbcbacbcccaabaaaccbbbcabbbaaacaaabaaaccbcaccbbbaaacaabbcccaaacccbcccacccbbacbbbccaaacbcccacccbbaaacaabbcbbbaacccabcccbbbabbbcbbbaaabcccbbbabbcaaabaaccbbaaacccbbacbbbcccbbacccaaaccbaaabbbcccaaabbbacaaabaaaccbaacabbbcccbaacccaaacbaacccbcccacccbbbcccaaabbbcccbaacccaaabaaacaaabbbcbaacaaabbbcccabcaaacccabcccbbaccbbbabbbcbaaacaabcccbbabccaaabbbaaacaaabaaacccabccaaabaaacaaabbbcccbbbabccacccbccaabaaaccbcaabbbaaacaaabaaaccbaacccaaaccbaaabbccaaacccbcccacccbbacbcccaaabbbcccbbabbcbacaaabaccbcccaccbaacaaabaacbccaccbbabccaaabcaabbbcbbbabbbcccbacccaabbcccaccbbbcccbbacaaabaaacccaabcccbbabccaaacccbcccacccbbaccbbbcccbbacccaabcccbbbcabaaacccbbaacaaabaacccaaaccbabbcaabaaacccbcccacccbbbccabbcccacccbcccaaacccbbbcccaccbccaaabaaccbcaccbbaaabbbcbaacccabbcccbbbccabbcccacccbcccaaacccbbbcccaccbccaaabbbaaccbbbcccacccbcccaabbbcbbbabbbcccbbaacccabcccbbbccaabaaacccbbbcaabbbacbbbcccbbaaacabaaacccaabcccbbbabbccaabbbcccacccbcccaabccaaacbbbccaccbcccaaabaaacaaabbcccbbbccaabbbaacabccaabaacaaabbbcbbbabbbcccbbbaaccbcccaccbbbccaabcbbbaaacccabccaabaaacbccaaabbbacbbaaacaaabaaacccbccaaabaacaabbbccacccbccabbbaacbbaaacabaccbbbabcbbbaaabbbcccabbbaaacaaabaaacccaaabbcccabaacaabbbaaabbcccbbbabbbcbbbaacbabbbcccacccbcccaaacccbbacaabbbcccbbbabcbbbaaacbbbcccaaabaaacaaabbbcbbbabbbccabbcbbbaaaccbcabbcccacccbcccaaacccbbaaabbbacbbbcccaccbccaabcbbbaaaccbacaaabaaaccbacccaabbcccaccbbbcccbbaaacccaabccaaabbcbbabbbcccbbbaacbbaaabcccaaabaacbbaaacaaabaaacccaaabbcccacccbcccaaaccbbacabaaacccaaabbcccbbbccaabbbaaacccbcccacccbbbccabbcccacccbcccaaacccbbbcccacbbaaabccaaacccbcaabbcccaaabaaacaaabbcaabbbaaabbcaaacccbbbcaaabcbbbabbbcccbaccbbaacccabbcccbbbcabbcccacccbcccaaacccbbbcccacbbaaabbbaaccbcabaaacaaabbbcbbbabbbcccabaacaabbbaacccabbcccbbbabbbcbbbaacbbabbbcccbbbaaabcccabaaacaaabbcbabbcccbbaacccbccaaacccbbbabccaaabaaacaaabbbaaacccbbbccabaaacccbbbaaabbbcbbabbcccbbbaacccabcccbbbabbccaabaaacccbccaaabaaacabccaabbbacbbbcccbacbbbaacccaaacbaacccbcccacccbbbacccabacabbbacccbbbccabbbaaacbbabcccbbaacccaaabacabbcccacbcccaaacbbbacaaabaaaccbaacccaaaccbabbbcbbbaaacaaabaaacccbbaacaaabaacbbabbbcbbacaaabbbcacccbcabbbaaacaabaacccaaabbccacccbccabbbcbbaacabbcccacbacaaabbbcbbbabbbccabbcccacccbcccaaabaaccbbbcccbabbbcbaaabbcccaccbbaaabbcbaacccaaabaaacabcbbaaabbcccaabbbaacabcbbbabbbcccbbbaacccbaaabbcbbbaaccbcaabaaaccbcccaccbbacbbbcccaccbbaaabbbcbbaacaaabbbcbbbabbbcccbbbaacabbcccbbbccabbcccacccbcabbbaaacabcccbbaccbbbabcbbbaaabbbcccbaacaaabbccabcaaacccabcccbbbccaabcbbbabbbccaaacccbbbccaabaaaccbcccaccbbbcccaaacccbcccacccbbaccbbbcccacccbcccaaabbbcbabbbcccbbbaacccbccabaacaabbcccbbbabcbaacaaabaacccabbbcacccbcccaaacccbbaaacaaabacccaaaccbbacbbbaacbbaaacccabcccbbbabcccaaabbbcbbbabbbccabcccbbbaaacbbbcccacccbcccaabccaaacccbbbcccacbabbbcccbbbaaaccbaacaaabbbaaacccbbbabbcaabbbcbbbabcccbbbccaaacbbaaabbbccabaacccbcccacccbbbabbbcbbbaaacabcccbbbaaaccbbaacaaabbbaaaccbbbcabaaaccbcccaccbaaacaabbbccaaabaacaabbbaaabbcccbacaaabbbcbbabbcccbaacccaaabcbbbaaabcaaaccbaacccbcccacbaaccbbbcaaabbbcbbbabbbcccbaacccabcbbaaabcaaaccbaacccbcccacccbbbabccacccbccabaacaabbbccaaabbbaaacaaabaaaccbcccaccbabbcccacccbcccaaabaaccbcccaaaccbbbacbaaabbbaccbbbcccbbacccaaaccbbbaaabbcccaaacccbcccacccbbacbbbcccacccbcccaaacccbbbccaaacccabbcccbbbabbbcbbbaacbbabbbcccbbbaacaabacccbccaabaacaaabbcccbabbcaaabbbacbbbccabbcccacbcccaaabcccbbbaccbcaaabbccaaacccbcccacccbbaaacccaaabacabbcccaaacbcccacbbbcaabbbaaacbbbcaccbbaaacccaaabaacaabbcbabbcccaaabbbaaacabbcbbbabbcccbbbccaabcacccbcccaabccaaacbabbbcccbaccbbaaacccaaabacaaabbcaabbbcbabbbcccacbbaaabbbcbbbabbbcccbbbaacccbcccacbaaabbcccbaccbbbabbcaabaaacccbacbbbaacccbbbcccacccbcccaabccacccbbbacccaaabacaaabbcbbbacccbccaabcaaabbccabcbbbabbbccabbcccbbbccaaacccbcccacccbbaccbbbcccbbaaacaabaacccbbbcccacccbcccaabccaaacccbcccacccbbaaabbbacaaabacbcccacccbbabbbccaabacccbbbabcbaacaaabcccaabbbaaabbcbbbaaccbbbabbcccbbbccaabbbaacabbcccacbcaaabaacbcccacccbbbacccabaaccbbabbbcbbaacccbbaccbbbcccacccbcccaabccacccbbbaaacccabbcccbbbcaabaaacaabccacccbccaabaccbbbcccacccbcccaabccaaacccbbaacaaabaacccaaaccbbabcacccbcccaaaccbbbaaabbcaabbbcccaaacccbcccacccbbabbcbbbaaacccbcccacccbbbaaacaaabaaacccaabbbcccbbbabcbbbaacccaaabbbcbbbabccaaabbbaaacaaabaaaccbcccacccbbbaacccaaaccbaaabbbacccaaabbbaaacaaabaaaccaaabbbaccbcccaccbaaacaabbccaaabbbcbbbabccaaabbbaacaabaaacccbcccacccbbbcccaaabcccbbbaacbbaaacaaabaaacccaabbbcccaaacccbcccacccbbbcccaaaccbbbaaabcacccbcccaabccaaabaacaabbbcbbaacccbccabbcbbbabbccaabcaaaccbcccaccbbacbbbccaabbbaccbbbcccbaccbbbabbbcbbbaaacaabcbbbaaabbbcccaccbbaacccaaabacaaabbcccaabbbcccbbbabbcbbaaccbcccaaabaacccbcccacccbbbcccaabcbbbaaaccbbbccacccbccaaabaaacaaabbbcbbbabcccabbbaaacccaaabaaacaaabbcbbabcccabaaacccabccaabbcbbbaccbcccaccbbaaccbacccaaabaacaabbbaaabbcccbbbabbbcbbbaaabbcaabbbcccbbaaaccbcccaabbcbbbaacaaabaacccaabbbaaacaaabaaaccbaacccaaaccbbabcccbbaacaaabbcccbbabbbccaaabaaacaaabbbcccbacaaabaaacccbcccacccbbacbcccaaabcbbabbccaaabbcaabbbcbbbabcccbbbaacccbccaaacccbbbabbccaabbbaaacaabaacccaaaccbbaaacbbbccacccbccaaacccbbbccaabbbaaacabccaabbbacbbbccabcccb";

let aa2frState = {
  mode: 'aa2fr',
  dir: 'right',
  wordArr: [],
  stack: [],
  stats: { len: 0, attempts: 0, backtracks: 0, maxLen: 0 },
  lastReject: null,
  challenge: null,
  challengeCursor: 0,
  running: false,
  timer: null,
  delay: 50
};

function aa2frLoadExample(val) {
  if (val === 40) {
    $('aa2fr-base-word').value = "abaacbbabbbcccbaaabcacccbcccaabbbcccbbba";
  } else if (val === '15796') {
    $('aa2fr-base-word').value = AA2F15796;
  }
}

function aa2frSetBase() {
  const val = $('aa2fr-base-word').value.trim().toLowerCase().replace(/[^abc]/g, '');
  aa2frState.wordArr = val.split('');
  aa2frState.stack = [];
  aa2frState.stats = { len: aa2frState.wordArr.length, attempts: 0, backtracks: 0, maxLen: aa2frState.wordArr.length };
  aa2frState.lastReject = null;
  aa2frState.challenge = null;
  aa2frState.running = false;
  $('aa2fr-status').textContent = 'Base word set. Ready to extend.';
  $('aa2fr-challenge-feedback').className = 'aa2fr-challenge-feedback';
  $('aa2fr-challenge-feedback').textContent = 'Base word changed. Press New 40-letter Challenge to load a challenge.';
  aa2frUpdateUI();
}

function aa2frStart() {
  if (aa2frState.wordArr.length === 0) aa2frSetBase();
  aa2frState.challenge = null;
  aa2frState.running = true;
  aa2frState.mode = $('aa2fr-mode').value;
  aa2frState.dir = $('aa2fr-dir').value;
  $('aa2fr-btn-start').classList.add('hidden');
  $('aa2fr-btn-pause').classList.remove('hidden');
  aa2frLoop();
}

function aa2frPause() {
  aa2frState.running = false;
  $('aa2fr-btn-pause').classList.add('hidden');
  $('aa2fr-btn-start').classList.remove('hidden');
}

function validateWordConstraints(wordArr, opts = {}) {
  const alphabet = opts.alphabet || ['a','b','c'];
  const minHalfLen = opts.minHalfLen || 1;
  const forbiddenFactors = opts.forbiddenFactors || [];
  const scan = opts.scan || 'full';
  const n = wordArr.length;

  if (forbiddenFactors.length > 0) {
    const factorLen = forbiddenFactors[0].length;
    const starts = [];
    if (scan === 'prefix') {
      if (n >= factorLen) starts.push(0);
    } else if (scan === 'suffix') {
      if (n >= factorLen) starts.push(n - factorLen);
    } else {
      for (let start = 0; start <= n - factorLen; start++) starts.push(start);
    }

    for (const start of starts) {
      const factor = wordArr.slice(start, start + factorLen).join('');
      if (forbiddenFactors.includes(factor)) {
        return { valid: false, type: 'forbid4', start, length: factorLen, factor };
      }
    }
  }

  const squareStarts = [];
  if (scan === 'prefix') {
    squareStarts.push(0);
  } else if (scan === 'suffix') {
    squareStarts.push(null);
  } else {
    for (let start = 0; start < n; start++) squareStarts.push(start);
  }

  for (const startValue of squareStarts) {
    const maxH = scan === 'suffix'
      ? Math.floor(n / 2)
      : Math.floor((n - startValue) / 2);
    for (let h = minHalfLen; h <= maxH; h++) {
      const start = scan === 'suffix' ? n - 2 * h : startValue;
      const first = wordArr.slice(start, start + h);
      const second = wordArr.slice(start + h, start + 2 * h);
      const p1 = getParikh(first);
      const p2 = getParikh(second);
      if (parikhEqual(p1, p2, alphabet)) {
        return { valid: false, type: 'square', start, halfLen: h, first, second, p1, p2 };
      }
    }
  }

  return { valid: true };
}

function checkAA2F(wordArr, isLeft, mode) {
  return explainAA2FViolation(wordArr, isLeft, mode).valid;
}

function explainAA2FViolation(wordArr, isLeft, mode) {
  return validateWordConstraints(wordArr, {
    alphabet: ['a','b','c'],
    minHalfLen: 2,
    forbiddenFactors: mode === 'aa2fr' ? FORBID4 : [],
    scan: isLeft ? 'prefix' : 'suffix'
  });
}

function aa2frFindFullViolation(wordArr, mode) {
  return validateWordConstraints(wordArr, {
    alphabet: ['a','b','c'],
    minHalfLen: 2,
    forbiddenFactors: mode === 'aa2fr' ? FORBID4 : [],
    scan: 'full'
  });
}

function aa2frRightExtensionOptions(wordArr, mode) {
  return ['a','b','c'].map(letter => {
    const candidate = wordArr.concat(letter);
    const reason = explainAA2FViolation(candidate, false, mode);
    return { letter, valid: reason.valid, candidate, reason };
  });
}

function aa2frNewChallenge() {
  aa2frPause();
  const length = 40;
  const source = AA2F15796.replace(/[^abc]/g, '');
  const maxStart = Math.max(0, source.length - length);
  const startCursor = aa2frState.challengeCursor % Math.max(1, maxStart + 1);
  let found = null;

  for (let offset = 0; offset <= maxStart; offset++) {
    const start = (startCursor + offset) % (maxStart + 1);
    const arr = source.slice(start, start + length).split('');
    if (!aa2frFindFullViolation(arr, 'aa2fr').valid) continue;
    const options = aa2frRightExtensionOptions(arr, 'aa2fr');
    const legal = options.filter(o => o.valid);
    if (legal.length === 1) {
      found = { wordArr: arr, answer: legal[0].letter, options, start };
      aa2frState.challengeCursor = start + 1;
      break;
    }
  }

  if (!found) {
    $('aa2fr-challenge-feedback').className = 'aa2fr-challenge-feedback bad';
    $('aa2fr-challenge-feedback').textContent = 'No 40-letter single-extension challenge was found in the local source word.';
    return;
  }

  aa2frState.mode = 'aa2fr';
  aa2frState.dir = 'right';
  aa2frState.wordArr = found.wordArr.slice();
  aa2frState.stack = [];
  aa2frState.stats = { len: found.wordArr.length, attempts: 0, backtracks: 0, maxLen: found.wordArr.length };
  aa2frState.lastReject = null;
  aa2frState.challenge = found;
  $('aa2fr-mode').value = 'aa2fr';
  $('aa2fr-dir').value = 'right';
  $('aa2fr-base-word').value = found.wordArr.join('');
  $('aa2fr-status').innerHTML = 'Challenge loaded. Choose the only legal next letter.';
  $('aa2fr-challenge-feedback').className = 'aa2fr-challenge-feedback';
  $('aa2fr-challenge-feedback').textContent = `Challenge source window: ${found.start}. Word length: ${found.wordArr.length}.`;
  aa2frUpdateUI();
}

function aa2frGuessChallenge(letter) {
  if (!aa2frState.challenge) aa2frNewChallenge();
  const challenge = aa2frState.challenge;
  if (!challenge) return;

  const picked = challenge.options.find(o => o.letter === letter);
  if (!picked) return;

  if (picked.valid) {
    aa2frState.lastReject = null;
    $('aa2fr-status').innerHTML = `Challenge solved: '<span class="sn-${letter}"><b>${letter}</b></span>' is the unique legal right extension.`;
    $('aa2fr-challenge-feedback').className = 'aa2fr-challenge-feedback ok';
    $('aa2fr-challenge-feedback').textContent = `Correct. The word can continue as ${challenge.wordArr.join('')}${letter}.`;
  } else {
    aa2frState.lastReject = {
      letter,
      candidate: picked.candidate,
      reason: picked.reason,
      dir: 'right',
      mode: 'aa2fr'
    };
    $('aa2fr-status').innerHTML = `Challenge guess '<span class="sn-${letter}"><b>${letter}</b></span>' fails. See the obstruction below.`;
    $('aa2fr-challenge-feedback').className = 'aa2fr-challenge-feedback bad';
    $('aa2fr-challenge-feedback').textContent = `Not ${letter}. The obstruction panel shows why this extension is illegal.`;
  }
  aa2frUpdateUI();
}

function aa2frStep() {
  if (!aa2frState.running) aa2frState.running = true; // allow manual stepping
  aa2frState.challenge = null;
  const ALPHA = ['a','b','c'];
  if (aa2frState.stack.length === 0) {
    aa2frState.stack.push({ tryIdx: 0 });
    if (aa2frState.wordArr.length > aa2frState.stats.maxLen) aa2frState.stats.maxLen = aa2frState.wordArr.length;
  }
  const top = aa2frState.stack[aa2frState.stack.length - 1];
  if (top.tryIdx >= 3) {
    aa2frState.stack.pop();
    if (aa2frState.dir === 'right') aa2frState.wordArr.pop();
    else aa2frState.wordArr.shift();
    aa2frState.stats.backtracks++;
    if (aa2frState.stack.length === 0) {
      aa2frState.running = false;
      $('aa2fr-status').innerHTML = '<span style="color:#e74c3c">Search exhausted/failed. No more extensions possible.</span>';
      aa2frPause();
      aa2frUpdateUI();
    }
    return;
  }
  const letter = ALPHA[top.tryIdx++];
  aa2frState.stats.attempts++;
  if (aa2frState.dir === 'right') aa2frState.wordArr.push(letter);
  else aa2frState.wordArr.unshift(letter);
  
  const explanation = explainAA2FViolation(aa2frState.wordArr, aa2frState.dir === 'left', aa2frState.mode);
  if (explanation.valid) {
    aa2frState.lastReject = null;
    aa2frState.stack.push({ tryIdx: 0 });
    if (aa2frState.wordArr.length > aa2frState.stats.maxLen) aa2frState.stats.maxLen = aa2frState.wordArr.length;
    $('aa2fr-status').innerHTML = `Appended '<span class="sn-${letter}"><b>${letter}</b></span>'. <span style="color:#2ecc71">Valid!</span> Expanding...`;
  } else {
    aa2frState.lastReject = {
      letter,
      candidate: aa2frState.wordArr.slice(),
      reason: explanation,
      dir: aa2frState.dir,
      mode: aa2frState.mode
    };
    if (aa2frState.dir === 'right') aa2frState.wordArr.pop();
    else aa2frState.wordArr.shift();
    $('aa2fr-status').innerHTML = `Tried '<span class="sn-${letter}"><b>${letter}</b></span>'. <span style="color:#e74c3c">Collision found.</span>`;
    if ($('aa2fr-pause-on-collision').checked) {
      aa2frState.running = false;
      aa2frPause();
    }
  }
  aa2frState.stats.len = aa2frState.wordArr.length;
  aa2frUpdateUI();
}

function aa2frLoop() {
  if (!aa2frState.running) return;
  const speed = parseInt($('aa2fr-speed').value);
  const iters = speed > 80 ? 50 : speed > 50 ? 10 : 1;
  const delay = Math.max(1, 100 - speed);
  for (let i = 0; i < iters && aa2frState.running; i++) {
    const wasRunning = aa2frState.running;
    aa2frStep();
    if (wasRunning && !aa2frState.running) break;
  }
  if (aa2frState.running) {
    aa2frState.timer = setTimeout(aa2frLoop, delay);
  }
}

function aa2frRenderCandidate(candidate, reason) {
  const n = candidate.length;
  let from = 0;
  let to = n;
  const limit = 220;
  if (n > limit) {
    const center = reason.type === 'square'
      ? reason.start + reason.halfLen
      : reason.start + Math.floor(reason.length / 2);
    from = Math.max(0, center - Math.floor(limit / 2));
    to = Math.min(n, from + limit);
    from = Math.max(0, to - limit);
  }

  let html = '';
  if (from > 0) html += `<span style="color:#777; letter-spacing:0;">[...${from} omitted...] </span>`;
  for (let i = from; i < to; i++) {
    const ch = candidate[i];
    let cls = `sn-${ch}`;
    if (reason.type === 'square') {
      if (i >= reason.start && i < reason.start + reason.halfLen) cls += ' aa2fr-sq1';
      if (i >= reason.start + reason.halfLen && i < reason.start + 2 * reason.halfLen) cls += ' aa2fr-sq2';
    } else if (i >= reason.start && i < reason.start + reason.length) {
      cls += ' aa2fr-forbid';
    }
    html += `<span class="${cls}">${ch}</span>`;
  }
  if (to < n) html += `<span style="color:#777; letter-spacing:0;"> [...${n - to} omitted]</span>`;
  return html;
}

function aa2frRenderExplain() {
  const panel = $('aa2fr-explain');
  const reject = aa2frState.lastReject;
  if (!reject) {
    panel.classList.add('hidden');
    panel.innerHTML = '';
    return;
  }

  const reason = reject.reason;
  const dirText = reject.dir === 'left' ? 'left' : 'right';
  let html = `<h3>Why letter '${reject.letter}' was rejected</h3>`;
  html += `<div class="aa2fr-mini-note">The search tried to extend the word on the ${dirText}. The candidate below is shown before the algorithm removes the failed letter.</div>`;
  html += `<div class="aa2fr-candidate">${aa2frRenderCandidate(reject.candidate, reason)}</div>`;

  if (reason.type === 'square') {
    const alphabet = ['a','b','c'];
    html += `
      <div class="aa2fr-mini-note">
        The highlighted adjacent blocks have the same length (${reason.halfLen}) and the same letter counts.
        Order does not matter for an abelian square, only the Parikh vectors matter.
      </div>
      <div class="parikh-lens">
        ${renderParikhLens({
          title: `Rejected square, half length ${reason.halfLen}`,
          word: reason.first.concat(reason.second),
          start: 0,
          halfLen: reason.halfLen,
          first: reason.first,
          second: reason.second,
          p1: reason.p1,
          p2: reason.p2,
          alphabet,
          classPrefix: 'sn'
        })}
      </div>
    `;
  } else {
    html += `
      <div class="aa2fr-mini-note">
        The highlighted factor <strong>${reason.factor}</strong> is one of the six forbidden AA2FR pure-repetition patterns:
        ${FORBID4.join(', ')}.
      </div>
      <div class="aa2fr-mini-note"><strong>Conclusion:</strong> this extension may still satisfy the relaxed aa2f rule, but it fails the stricter aa2fr rule.</div>
    `;
  }

  panel.innerHTML = html;
  panel.classList.remove('hidden');
}

function aa2frUpdateUI() {
  $('aa2fr-stat-len').textContent = aa2frState.stats.len;
  $('aa2fr-stat-att').textContent = aa2frState.stats.attempts;
  $('aa2fr-stat-bt').textContent = aa2frState.stats.backtracks;
  $('aa2fr-stat-max').textContent = aa2frState.stats.maxLen;
  
  const arr = aa2frState.wordArr;
  let displayStr = '';
  const MAX_DISP = 300;
  if (arr.length <= MAX_DISP) {
    displayStr = arr.map(c => `<span class="sn-${c}">${c}</span>`).join('');
  } else {
    if (aa2frState.dir === 'right') {
      displayStr = `<span style="color:#64748b">[...${arr.length - MAX_DISP} omitted...]</span> <br>` + 
        arr.slice(arr.length - MAX_DISP).map(c => `<span class="sn-${c}">${c}</span>`).join('');
    } else {
      displayStr = arr.slice(0, MAX_DISP).map(c => `<span class="sn-${c}">${c}</span>`).join('') +
        `<br> <span style="color:#64748b">[...${arr.length - MAX_DISP} omitted...]</span>`;
    }
  }
  $('aa2fr-display').innerHTML = displayStr;
  aa2frRenderExplain();
}

// =====================================================
// 15. APPLICATIONS & IMPACT LOGIC
// =====================================================
const impactData = {
  bio: {
    title: "Bioinformatics and Genetics",
    content: `<p>DNA is written in a four-letter alphabet {A, C, G, T}. Identifying repeated patterns, such as tandem repeats (e.g., ATCGATCG), is a fundamental task in genomics because they often play roles in evolution or are linked to genetic disorders.</p>
      <div class="impact-demo">
        <div class="impact-word">
          <span style="color:#888;">GAT</span><span class="impact-half-a" style="padding-bottom:2px;">AGCT</span><span class="impact-half-b" style="padding-bottom:2px;">TCGA</span><span style="color:#888;">TCA</span>
        </div>
      </div>
      <p>An <strong>abelian square</strong> in DNA would mean a sequence followed by a permutation of itself. Understanding sequence avoidance helps design algorithms (like Burrows-Wheeler) to index genomes.</p>`,
    caution: "Genomic repeats are typically exact tandem repeats or approximate repeats, rather than purely abelian ones."
  },
  compression: {
    title: "Compression and Entropy",
    content: `<p>Data compression algorithms (like LZ77/LZ78 used in ZIP) look for repeated factors to compress them. If a string avoids repetitions (like a square-free word), it represents high entropy.</p>
      <div class="impact-demo" style="font-family:monospace; color:#333; font-size:0.9rem;">
        "ababab" compresses well.<br>
        "abcacbabcbac" resists compression.
      </div>
      <p>By studying how long strings can avoid repetitions, we understand the mathematical limits of string complexity and compressibility.</p>`,
    caution: "Compression uses dictionaries of exact substrings, while abelian squares involve permutations."
  },
  security: {
    title: "Security and Randomness",
    content: `<p>Cryptography requires pseudorandom numbers that lack predictable structure. If a sequence generator frequently produces structured patterns, it might be vulnerable to attacks.</p>
      <p>The mathematics of combinatorics on words provides strict theoretical bounds on how "random-like" a deterministic sequence can be.</p>`,
    caution: "Abelian square-free words are NOT cryptographic keys. They are highly structured in their avoidance, which makes them predictable if the generating morphism is known."
  },
  search: {
    title: "Search Algorithms",
    content: `<p>How does a database find a word in milliseconds? Algorithms like Knuth-Morris-Pratt use the internal periodic structure of words to skip unnecessary comparisons.</p>
      <p>Knowing "unfavorable factors" and the longest possible repetitions in an alphabet allows engineers to optimize suffix trees for worst-case scenarios.</p>`,
    caution: "The specific ternary abelian square search is an extreme edge case, acting as a stress-test for theories rather than a daily-use algorithm."
  },
  coding: {
    title: "Codes and Communication",
    content: `<p>In digital communication, we design "constrained codes" that avoid certain substrings (e.g., avoiding long runs of zeros for synchronization).</p>
      <p>The mathematical techniques used to prove the existence of abelian square-free words (morphisms, backtracking) are the same tools used to design error-correcting codes.</p>`,
    caution: "Real-world line coding (like 8b/10b) focuses on DC balance and transition density, not abelian square avoidance."
  }
};

function renderImpact(id) {
  const d = impactData[id];
  if(!d) return;
  document.querySelectorAll('#impact-card-grid .impact-card').forEach(c => c.classList.toggle('active', c.dataset.impact === id));
  
  const detail = document.getElementById('impact-detail');
  if(detail) {
    detail.innerHTML = `
      <h3>${d.title}</h3>
      ${d.content}
      <div class="impact-note impact-caution">
        <strong>Caution:</strong> ${d.caution}
      </div>
    `;
  }
}

document.querySelectorAll('#impact-card-grid .impact-card').forEach(card => {
  card.addEventListener('click', () => renderImpact(card.dataset.impact));
});

// Init first card
renderImpact('bio');


