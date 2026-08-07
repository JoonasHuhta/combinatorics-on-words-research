/**
 * ABELISK Renderer
 *
 * Pure DOM rendering functions. No state mutation.
 */

const LABELS = ['a', 'b', 'c', 'd'];

export function renderArrival(root, dispatch) {
  root.innerHTML = '';
  const div = document.createElement('div');
  div.className = 'arrival';
  div.innerHTML = `
    <div class="arrival-obelisk" aria-hidden="true"></div>
    <h1>Abelisk</h1>
    <p class="subtitle">Hidden Echoes</p>
  `;

  const btn = document.createElement('button');
  btn.className = 'btn-enter';
  btn.textContent = 'Enter the Abelisk';
  btn.addEventListener('click', () => dispatch({ type: 'ENTER_ABELISK' }));
  div.appendChild(btn);
  root.appendChild(div);
}

export function renderScene(root, scene, state, dispatch) {
  root.innerHTML = '';

  if (scene.type === 'arrival') {
    renderArrival(root, dispatch);
    return;
  }

  const container = document.createElement('div');
  container.className = 'scene';

  // Header
  const header = document.createElement('div');
  header.className = 'scene-header';
  if (scene.chapter) {
    const ch = document.createElement('div');
    ch.className = 'scene-chapter';
    ch.textContent = `Chamber ${scene.chapter}`;
    header.appendChild(ch);
  }
  const title = document.createElement('h2');
  title.className = 'scene-title';
  title.textContent = scene.title || '';
  header.appendChild(title);
  container.appendChild(header);

  // Glyph progress
  const glyphBar = renderGlyphs(state.restoredGlyphs, state.totalGlyphs);
  container.appendChild(glyphBar);

  // Body panel
  const body = document.createElement('div');
  body.className = 'scene-body';

  // Render based on scene type
  switch (scene.type) {
    case 'observe':
      renderObserveScene(body, scene, state, dispatch);
      break;
    case 'count':
      renderCountScene(body, scene, state, dispatch);
      break;
    case 'repair':
      renderRepairScene(body, scene, state, dispatch);
      break;
    case 'forced':
      renderForcedScene(body, scene, state, dispatch);
      break;
    case 'longrange':
      renderLongRangeScene(body, scene, state, dispatch);
      break;
    case 'doublelock':
      renderDoubleLockScene(body, scene, state, dispatch);
      break;
    case 'makela':
      renderMakelaScene(body, scene, state, dispatch);
      break;
  }

  container.appendChild(body);
  root.appendChild(container);
}

function renderObserveScene(body, scene, state, dispatch) {
  // Text
  scene.body.forEach(text => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.innerHTML = text;
    body.appendChild(p);
  });

  // Word display
  const wordDiv = renderWordWithDivider(scene.word, scene.dividerAt, scene.echoRange, state.scenePhase === 'revealed');
  body.appendChild(wordDiv);

  if (state.scenePhase === 'initial') {
    const actions = document.createElement('div');
    actions.className = 'scene-actions';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Observe';
    btn.addEventListener('click', () => dispatch({ type: 'REVEAL_SCENE' }));
    actions.appendChild(btn);
    body.appendChild(actions);
  }

  if (state.scenePhase === 'revealed') {
    scene.afterReveal.forEach(text => {
      const p = document.createElement('p');
      p.className = 'scene-text';
      p.innerHTML = text;
      body.appendChild(p);
    });

    const actions = document.createElement('div');
    actions.className = 'scene-actions';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Continue';
    btn.addEventListener('click', () => {
      if (scene.glyph !== undefined) {
        dispatch({ type: 'RESTORE_GLYPH', glyphIndex: scene.glyph });
      }
      dispatch({ type: 'ADVANCE_SCENE' });
    });
    actions.appendChild(btn);
    body.appendChild(actions);
  }
}

function renderCountScene(body, scene, state, dispatch) {
  scene.body.forEach(text => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.innerHTML = text;
    body.appendChild(p);
  });

  const wordDiv = renderWordWithDivider(scene.word, scene.dividerAt, scene.echoRange, true);
  body.appendChild(wordDiv);

  // Count comparison
  const countPanel = document.createElement('div');
  countPanel.className = 'count-panel';

  const leftBlock = renderCountBlock('Left half', scene.leftCounts);
  const rightBlock = renderCountBlock('Right half', scene.rightCounts);

  countPanel.appendChild(leftBlock);
  countPanel.appendChild(rightBlock);
  body.appendChild(countPanel);

  // Match indicator
  const matchMsg = document.createElement('div');
  matchMsg.className = 'violation-msg';
  matchMsg.textContent = 'Same inventory — a hidden echo forms.';
  body.appendChild(matchMsg);

  if (state.scenePhase === 'initial') {
    const actions = document.createElement('div');
    actions.className = 'scene-actions';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'I see it';
    btn.addEventListener('click', () => dispatch({ type: 'REVEAL_SCENE' }));
    actions.appendChild(btn);
    body.appendChild(actions);
  }

  if (state.scenePhase === 'revealed') {
    scene.afterReveal.forEach(text => {
      const p = document.createElement('p');
      p.className = 'scene-text';
      p.innerHTML = text;
      body.appendChild(p);
    });

    const actions = document.createElement('div');
    actions.className = 'scene-actions';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Continue';
    btn.addEventListener('click', () => {
      if (scene.glyph !== undefined) {
        dispatch({ type: 'RESTORE_GLYPH', glyphIndex: scene.glyph });
      }
      dispatch({ type: 'ADVANCE_SCENE' });
    });
    actions.appendChild(btn);
    body.appendChild(actions);
  }
}

function renderRepairScene(body, scene, state, dispatch) {
  scene.body.forEach(text => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.innerHTML = text;
    body.appendChild(p);
  });

  const word = state.repairWord || scene.word;
  const isComplete = state.repairWord && window._abeliskEngine.findAllViolations(word, scene.rule).length === 0;

  // Instructional text
  const instructDiv = document.createElement('div');
  instructDiv.className = 'scene-text instruct-text';
  instructDiv.style.opacity = '0.7';
  if (isComplete) {
    instructDiv.textContent = 'The echo is broken.';
  } else if (state.repairSelectedCell === null) {
    instructDiv.textContent = 'Choose a cell.';
    instructDiv.setAttribute('aria-label', `Choose one of the ${word.length} cells to edit.`);
  } else {
    instructDiv.textContent = 'Now choose a different symbol.';
    const currSym = LABELS[word[state.repairSelectedCell]];
    instructDiv.setAttribute('aria-label', `Cell ${state.repairSelectedCell + 1} selected. Current symbol ${currSym}. Choose a replacement symbol.`);
  }
  body.appendChild(instructDiv);

  // Word Display
  const wordDiv = document.createElement('div');
  wordDiv.className = 'word-display';
  word.forEach((sym, i) => {
    if (i === scene.dividerAt) {
      const divider = document.createElement('span');
      divider.className = 'block-divider';
      divider.setAttribute('aria-hidden', 'true');
      wordDiv.appendChild(divider);
    }
    
    if (scene.editableIndices.includes(i) && !isComplete) {
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'puzzle-cell editable';
      if (state.repairSelectedCell === i) {
        cell.classList.add('selected-edit');
      }
      cell.dataset.sym = String(sym);
      cell.textContent = LABELS[sym];
      cell.setAttribute('aria-label', `Cell ${i + 1}, editable, current symbol ${LABELS[sym]}`);
      cell.addEventListener('click', () => {
        dispatch({ type: 'SELECT_REPAIR_CELL', index: i });
      });
      wordDiv.appendChild(cell);
    } else {
      const cell = document.createElement('span');
      cell.className = 'word-cell fixed';
      cell.dataset.sym = String(sym);
      cell.textContent = LABELS[sym];
      wordDiv.appendChild(cell);
    }
  });
  body.appendChild(wordDiv);

  // Palette
  const paletteWrapper = document.createElement('div');
  if (state.repairSelectedCell === null || isComplete) {
    paletteWrapper.style.opacity = '0.3';
    paletteWrapper.style.pointerEvents = 'none';
    paletteWrapper.setAttribute('aria-hidden', 'true');
  }
  
  const palette = document.createElement('div');
  palette.className = 'symbol-palette';
  palette.setAttribute('role', 'radiogroup');
  palette.setAttribute('aria-label', 'Replacement symbols');
  
  for (let s = 0; s < scene.rule.alphabetSize; s++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'palette-btn';
    btn.dataset.sym = String(s);
    btn.textContent = LABELS[s];
    
    if (state.repairSelectedCell !== null && word[state.repairSelectedCell] === s) {
      btn.disabled = true;
      btn.setAttribute('aria-label', `${LABELS[s]} (current symbol)`);
    } else {
      btn.setAttribute('aria-label', `Replace with ${LABELS[s]}`);
      btn.addEventListener('click', () => {
        if (state.repairSelectedCell !== null) {
          const newWord = [...word];
          newWord[state.repairSelectedCell] = s;
          dispatch({ type: 'SET_REPAIR_WORD', word: newWord });
        }
      });
    }
    palette.appendChild(btn);
  }
  paletteWrapper.appendChild(palette);
  body.appendChild(paletteWrapper);

  // Check if repair succeeded
  const { findAllViolations } = window._abeliskEngine;
  const violations = findAllViolations(word, scene.rule);
  
  if (state.repairWord && violations.length === 0) {
    const msg = document.createElement('div');
    msg.className = 'success-msg';
    msg.textContent = 'The echo is broken. The Abelisk is quiet.';
    body.appendChild(msg);

    const actions = document.createElement('div');
    actions.className = 'scene-actions';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Continue';
    btn.addEventListener('click', () => {
      if (scene.glyph !== undefined) {
        dispatch({ type: 'RESTORE_GLYPH', glyphIndex: scene.glyph });
      }
      dispatch({ type: 'ADVANCE_SCENE' });
    });
    actions.appendChild(btn);
    body.appendChild(actions);
  } else if (state.repairWord && violations.length > 0) {
    const origViolations = findAllViolations(scene.word, scene.rule);
    let origV = origViolations.find(viol => viol.middle === scene.dividerAt);
    if (!origV) origV = origViolations[0];
    
    const origStillExists = violations.some(viol => viol.start === origV.start && viol.end === origV.end && viol.halfLength === origV.halfLength);
    
    // Deterministic witness policy: shortest first, then earliest start
    const sortedViolations = violations.slice().sort((a, b) => {
      if (a.halfLength !== b.halfLength) return a.halfLength - b.halfLength;
      return a.start - b.start;
    });
    
    const v = sortedViolations[0];
    const typeStr = v.halfLength === 1 ? 'surface echo' : 'hidden echo';
    const origTypeStr = origV.halfLength === 1 ? 'surface echo' : 'hidden echo';
    
    let msgText = '';
    if (origStillExists) {
      if (v.start === origV.start && v.end === origV.end && v.halfLength === origV.halfLength) {
        msgText = `The ${typeStr} remains. Try a different symbol.`;
      } else {
        msgText = `The original ${origTypeStr} remains, and a new ${typeStr} formed.`;
      }
    } else {
      msgText = `You broke the original ${origTypeStr} — but a ${typeStr} formed.`;
    }

    const msg = document.createElement('div');
    msg.className = 'violation-msg';
    msg.textContent = msgText;
    body.appendChild(msg);

    const witnessDiv = document.createElement('div');
    witnessDiv.className = 'word-display';
    state.repairWord.forEach((sym, idx) => {
      if (idx === v.middle) {
        const divider = document.createElement('span');
        divider.className = 'block-divider';
        divider.setAttribute('aria-hidden', 'true');
        witnessDiv.appendChild(divider);
      }
      const cell = document.createElement('span');
      cell.className = 'word-cell';
      cell.dataset.sym = String(sym);
      cell.textContent = LABELS[sym];
      
      if (idx >= v.start && idx < v.middle) {
        cell.classList.add('echo-left');
      } else if (idx >= v.middle && idx < v.end) {
        cell.classList.add('echo-right');
      } else {
        cell.style.opacity = '0.35';
      }
      witnessDiv.appendChild(cell);
    });
    body.appendChild(witnessDiv);
  }
}

function renderForcedScene(body, scene, state, dispatch) {
  scene.body.forEach(text => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.innerHTML = text;
    body.appendChild(p);
  });

  const word = state.forcedWord || scene.word;
  const emptyIdx = scene.emptyIndex;

  // Show word with the empty cell
  const wordDiv = document.createElement('div');
  wordDiv.className = 'word-display';
  word.forEach((sym, i) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    if (sym === null) {
      cell.className = 'puzzle-cell empty';
      cell.textContent = '?';
      cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
      cell.addEventListener('click', () => {
        if (state.selectedSymbol !== null) {
          const newWord = [...word];
          newWord[i] = state.selectedSymbol;
          dispatch({ type: 'SET_FORCED_WORD', word: newWord });
        }
      });
    } else {
      cell.className = 'word-cell';
      cell.dataset.sym = String(sym);
      cell.textContent = LABELS[sym];
      cell.setAttribute('aria-label', `Cell ${i + 1}, ${LABELS[sym]}`);
    }
    wordDiv.appendChild(cell);
  });
  body.appendChild(wordDiv);

  // Palette
  const palette = renderPalette(scene.rule.alphabetSize, state.selectedSymbol, dispatch);
  body.appendChild(palette);

  // Check placement
  if (state.forcedWord && state.forcedWord[emptyIdx] !== null) {
    const placed = state.forcedWord[emptyIdx];
    const { findAllViolations } = window._abeliskEngine;
    const violations = findAllViolations(state.forcedWord, scene.rule);

    if (placed === scene.correctSymbol && violations.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'success-msg';
      msg.innerHTML = `<strong>${LABELS[placed]}</strong> is the only symbol that fits. You deduced it — no guessing needed.`;
      body.appendChild(msg);

      const actions = document.createElement('div');
      actions.className = 'scene-actions';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.textContent = 'Continue';
      btn.addEventListener('click', () => {
        if (scene.glyph !== undefined) {
          dispatch({ type: 'RESTORE_GLYPH', glyphIndex: scene.glyph });
        }
        dispatch({ type: 'ADVANCE_SCENE' });
      });
      actions.appendChild(btn);
      body.appendChild(actions);
    } else {
      const explanation = scene.explanations[placed];
      const msg = document.createElement('div');
      msg.className = 'violation-msg';
      msg.innerHTML = explanation || 'This creates an echo. Try another symbol.';
      body.appendChild(msg);

      // Reset button
      const actions = document.createElement('div');
      actions.className = 'scene-actions';
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.textContent = 'Try again';
      btn.addEventListener('click', () => {
        dispatch({ type: 'SET_FORCED_WORD', word: scene.word });
      });
      actions.appendChild(btn);
      body.appendChild(actions);
    }
  }
}

function renderDoubleLockScene(body, scene, state, dispatch) {
  scene.body.forEach(text => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.innerHTML = text;
    body.appendChild(p);
  });

  const word = state.forcedWord || scene.word;
  const emptyIdx = scene.emptyIndex;

  // Show word with the empty cell
  const wordDiv = document.createElement('div');
  wordDiv.className = 'word-display';
  word.forEach((sym, i) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    if (sym === null) {
      cell.className = 'puzzle-cell empty';
      cell.textContent = '?';
      cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
      cell.addEventListener('click', () => {
        if (state.selectedSymbol !== null) {
          const newWord = [...word];
          newWord[i] = state.selectedSymbol;
          dispatch({ type: 'SET_FORCED_WORD', word: newWord });
        }
      });
    } else {
      cell.className = 'word-cell';
      cell.dataset.sym = String(sym);
      cell.textContent = LABELS[sym];
      cell.setAttribute('aria-label', `Cell ${i + 1}, ${LABELS[sym]}`);
    }
    wordDiv.appendChild(cell);
  });
  body.appendChild(wordDiv);

  const palette = document.createElement('div');
  palette.className = 'symbol-palette';
  palette.setAttribute('role', 'radiogroup');
  palette.setAttribute('aria-label', 'Symbol palette');

  const instruction = document.createElement('div');
  instruction.className = 'sr-only';
  instruction.textContent = 'Focus or tap a symbol to preview it in the empty cell. Press Enter or tap again to commit.';
  body.appendChild(instruction);

  let lastActivatedByPointer = null;
  let lastPointerType = '';

  function updatePreview(sym) {
    if (word[emptyIdx] !== null) return;
    const holeBtn = wordDiv.children[emptyIdx];
    if (sym === null) {
      holeBtn.className = 'puzzle-cell empty';
      holeBtn.textContent = '?';
      holeBtn.removeAttribute('data-sym');
      holeBtn.setAttribute('aria-label', `Cell ${emptyIdx + 1}, empty`);
    } else {
      holeBtn.className = 'puzzle-cell empty previewing';
      holeBtn.dataset.sym = String(sym);
      holeBtn.textContent = LABELS[sym];
      holeBtn.setAttribute('aria-label', `Cell ${emptyIdx + 1}, previewing ${LABELS[sym]}`);
    }
  }

  function commit(sym) {
    if (word[emptyIdx] !== null) return;
    const newWord = [...word];
    newWord[emptyIdx] = sym;
    dispatch({ type: 'SET_FORCED_WORD', word: newWord });
  }

  for (let sym = 0; sym < scene.rule.alphabetSize; sym++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'palette-btn';
    btn.dataset.sym = String(sym);
    btn.textContent = LABELS[sym];
    
    const hypotheticalWord = [...word];
    hypotheticalWord[emptyIdx] = sym;
    const wordString = hypotheticalWord.map(s => LABELS[s]).join(' ');
    btn.setAttribute('aria-label', `Preview ${LABELS[sym]} in cell ${emptyIdx + 1}. Resulting word: ${wordString}. Press Enter or tap twice to commit.`);
    
    btn.setAttribute('role', 'radio');

    btn.addEventListener('focus', () => {
      updatePreview(sym);
    });

    btn.addEventListener('blur', () => {
      updatePreview(null);
      lastActivatedByPointer = null;
    });

    btn.addEventListener('pointerdown', (e) => {
      lastPointerType = e.pointerType;
    });

    btn.addEventListener('click', (e) => {
      if (lastPointerType === '') {
        commit(sym);
        return;
      }
      if (lastActivatedByPointer !== sym) {
        lastActivatedByPointer = sym;
        updatePreview(sym);
        btn.focus();
      } else {
        commit(sym);
      }
      lastPointerType = '';
    });

    palette.appendChild(btn);
  }
  body.appendChild(palette);

  // Check placement
  if (state.forcedWord && state.forcedWord[emptyIdx] !== null) {
    const placed = state.forcedWord[emptyIdx];
    const { findAllViolations } = window._abeliskEngine;
    const violations = findAllViolations(state.forcedWord, scene.rule);

    if (placed === scene.correctSymbol && violations.length === 0) {
      const msg = document.createElement('div');
      msg.className = 'success-msg';
      msg.innerHTML = `<strong>${LABELS[placed]}</strong> is the only symbol that fits.<br>You used two different echo lengths to eliminate two symbols. This technique is called a <strong>Double Lock</strong>.`;
      body.appendChild(msg);

      const actions = document.createElement('div');
      actions.className = 'scene-actions';
      const btn = document.createElement('button');
      btn.className = 'btn btn-primary';
      btn.textContent = 'Continue';
      btn.addEventListener('click', () => {
        if (scene.glyph !== undefined) {
          dispatch({ type: 'RESTORE_GLYPH', glyphIndex: scene.glyph });
        }
        dispatch({ type: 'ADVANCE_SCENE' });
      });
      actions.appendChild(btn);
      body.appendChild(actions);
    } else {
      const v = violations[0];
      const leftWord = state.forcedWord.slice(v.start, v.middle).map(s => LABELS[s]).join('');
      const rightWord = state.forcedWord.slice(v.middle, v.end).map(s => LABELS[s]).join('');

      const msg = document.createElement('div');
      msg.className = 'violation-msg';
      msg.innerHTML = `Placing <strong>${LABELS[placed]}</strong> creates an echo of length ${v.halfLength * 2}:`;
      body.appendChild(msg);

      const witnessDiv = document.createElement('div');
      witnessDiv.className = 'word-display';
      state.forcedWord.forEach((sym, idx) => {
        if (idx === v.middle) {
          const divider = document.createElement('span');
          divider.className = 'block-divider';
          divider.setAttribute('aria-hidden', 'true');
          witnessDiv.appendChild(divider);
        }
        const cell = document.createElement('span');
        cell.className = 'word-cell';
        cell.dataset.sym = String(sym);
        cell.textContent = LABELS[sym];
        
        if (idx >= v.start && idx < v.middle) {
          cell.classList.add('echo-left');
        } else if (idx >= v.middle && idx < v.end) {
          cell.classList.add('echo-right');
        } else {
          cell.style.opacity = '0.35';
        }
        witnessDiv.appendChild(cell);
      });
      body.appendChild(witnessDiv);

      const leftCountsObj = {};
      const rightCountsObj = {};
      v.leftCounts.forEach((count, sIdx) => { if (count > 0) leftCountsObj[LABELS[sIdx]] = count; });
      v.rightCounts.forEach((count, sIdx) => { if (count > 0) rightCountsObj[LABELS[sIdx]] = count; });

      const srText = document.createElement('div');
      srText.className = 'sr-only';
      srText.setAttribute('aria-live', 'polite');
      srText.textContent = `Echo found from cell ${v.start + 1} to ${v.end}. Half-length is ${v.halfLength}. Left block is ${leftWord}. Right block is ${rightWord}. Matching counts: ${Object.entries(leftCountsObj).map(([k, c]) => `${k} times ${c}`).join(', ')}.`;
      body.appendChild(srText);

      if (v.halfLength > 1) {
        const countPanel = document.createElement('div');
        countPanel.className = 'count-panel';
        countPanel.style.transform = 'scale(0.85)';
        countPanel.style.marginTop = '0';
        countPanel.appendChild(renderCountBlock('Left block', leftCountsObj));
        countPanel.appendChild(renderCountBlock('Right block', rightCountsObj));
        body.appendChild(countPanel);
      }

      // Reset button
      const actions = document.createElement('div');
      actions.className = 'scene-actions';
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.textContent = 'Try again';
      btn.addEventListener('click', () => {
        dispatch({ type: 'SET_FORCED_WORD', word: scene.word });
      });
      actions.appendChild(btn);
      body.appendChild(actions);
    }
  }
}

function renderLongRangeScene(body, scene, state, dispatch) {
  scene.body.forEach(text => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.innerHTML = text;
    body.appendChild(p);
  });

  const wordDiv = renderWordWithDivider(
    scene.word,
    scene.dividerAt,
    state.scenePhase === 'revealed' ? scene.echoRange : null,
    state.scenePhase === 'revealed'
  );
  body.appendChild(wordDiv);

  if (state.scenePhase === 'initial') {
    const actions = document.createElement('div');
    actions.className = 'scene-actions';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Reveal the echo';
    btn.addEventListener('click', () => dispatch({ type: 'REVEAL_SCENE' }));
    actions.appendChild(btn);
    body.appendChild(actions);
  }

  if (state.scenePhase === 'revealed') {
    scene.afterReveal.forEach(text => {
      const p = document.createElement('p');
      p.className = 'scene-text';
      p.innerHTML = text;
      body.appendChild(p);
    });

    const actions = document.createElement('div');
    actions.className = 'scene-actions';
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = 'Continue';
    btn.addEventListener('click', () => {
      if (scene.glyph !== undefined) {
        dispatch({ type: 'RESTORE_GLYPH', glyphIndex: scene.glyph });
      }
      dispatch({ type: 'ADVANCE_SCENE' });
    });
    actions.appendChild(btn);
    body.appendChild(actions);
  }
}

function renderMakelaScene(body, scene, state, dispatch) {
  scene.body.forEach(text => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.innerHTML = text;
    body.appendChild(p);
  });

  const door = document.createElement('div');
  door.className = 'makela-door';

  const rules = [scene.ternaryRule, scene.allowedTrivial, scene.forbidden];
  rules.forEach(text => {
    const p = document.createElement('p');
    p.className = 'scene-text';
    p.innerHTML = text;
    door.appendChild(p);
  });

  // Show aa, bb, cc as allowed
  const allowed = document.createElement('div');
  allowed.className = 'word-display';
  [[0,0],[1,1],[2,2]].forEach((pair, idx) => {
    pair.forEach(sym => {
      const cell = document.createElement('span');
      cell.className = 'word-cell';
      cell.dataset.sym = String(sym);
      cell.textContent = LABELS[sym];
      cell.style.opacity = '0.7';
      allowed.appendChild(cell);
    });
    if (idx < 2) {
      const spacer = document.createElement('span');
      spacer.style.width = '1rem';
      spacer.style.display = 'inline-block';
      allowed.appendChild(spacer);
    }
  });
  door.appendChild(allowed);

  const question = document.createElement('p');
  question.className = 'question';
  question.textContent = scene.question;
  door.appendChild(question);

  const note = document.createElement('p');
  note.className = 'makela-note';
  note.textContent = scene.note;
  door.appendChild(note);

  body.appendChild(door);

  const actions = document.createElement('div');
  actions.className = 'scene-actions';
  const btn = document.createElement('button');
  btn.className = 'btn btn-primary';
  btn.textContent = 'Try a puzzle';
  btn.addEventListener('click', () => {
    if (scene.glyph !== undefined) {
      dispatch({ type: 'RESTORE_GLYPH', glyphIndex: scene.glyph });
    }
    dispatch({ type: 'STORY_COMPLETE' });
  });
  actions.appendChild(btn);
  body.appendChild(actions);
}

// --- Puzzle mode rendering ---

export function renderPuzzleMode(root, state, dispatch) {
  root.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'scene';

  // Header
  const header = document.createElement('div');
  header.className = 'puzzle-header';
  const title = document.createElement('h2');
  title.className = 'puzzle-title';
  title.textContent = 'First Light';
  header.appendChild(title);

  const ruleText = document.createElement('p');
  ruleText.className = 'puzzle-rule';
  ruleText.textContent = 'Fill empty cells so no two adjacent blocks of equal length share the same letter inventory.';
  header.appendChild(ruleText);

  const status = document.createElement('p');
  status.className = 'puzzle-status';
  const filled = state.puzzleCells.filter(c => c !== null).length;
  status.textContent = `${filled} of ${state.puzzleCells.length} cells filled`;
  header.appendChild(status);

  container.appendChild(header);

  // Glyphs
  const glyphBar = renderGlyphs(state.restoredGlyphs, state.totalGlyphs);
  container.appendChild(glyphBar);

  // Puzzle body
  const body = document.createElement('div');
  body.className = 'scene-body';

  // Grid
  const grid = document.createElement('div');
  grid.className = 'puzzle-grid';
  grid.setAttribute('role', 'grid');
  grid.setAttribute('aria-label', 'Puzzle grid');

  state.puzzleCells.forEach((sym, i) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    const isHole = state.puzzleHoles.includes(i);

    if (sym === null) {
      cell.className = 'puzzle-cell empty';
      cell.textContent = '';
      cell.setAttribute('aria-label', `Cell ${i + 1}, empty`);
    } else {
      cell.className = `puzzle-cell${isHole ? '' : ' fixed'}`;
      cell.dataset.sym = String(sym);
      cell.textContent = LABELS[sym];
      cell.setAttribute('aria-label', `Cell ${i + 1}, ${LABELS[sym]}${isHole ? '' : ' (fixed)'}`);
    }

    // Violation highlight
    if (state.violations.some(v => v.start <= i && i < v.end)) {
      cell.classList.add('violation');
    }

    cell.addEventListener('click', () => {
      if (!isHole) return;
      if (sym !== null && state.selectedSymbol === null) {
        // Clear
        dispatch({ type: 'CLEAR_CELL', index: i });
      } else if (state.selectedSymbol !== null) {
        dispatch({ type: 'PLACE_SYMBOL', index: i, symbol: state.selectedSymbol });
      }
    });

    grid.appendChild(cell);
  });

  body.appendChild(grid);

  // Palette
  const palette = renderPalette(state.puzzleRule.alphabetSize, state.selectedSymbol, dispatch);
  body.appendChild(palette);

  // Eraser
  const tools = document.createElement('div');
  tools.className = 'scene-actions';
  const eraseBtn = document.createElement('button');
  eraseBtn.className = `btn btn-secondary${state.selectedSymbol === null ? ' selected' : ''}`;
  eraseBtn.textContent = '✕ Erase';
  eraseBtn.addEventListener('click', () => dispatch({ type: 'SELECT_SYMBOL', symbol: null }));
  tools.appendChild(eraseBtn);

  const newBtn = document.createElement('button');
  newBtn.className = 'btn btn-secondary';
  newBtn.textContent = '↻ New Puzzle';
  newBtn.addEventListener('click', () => dispatch({ type: 'NEW_PUZZLE' }));
  tools.appendChild(newBtn);
  body.appendChild(tools);

  // Violation message
  if (state.violations.length > 0) {
    const v = state.violations[0];
    const leftWord = state.puzzleCells.slice(v.start, v.middle).map(s => LABELS[s]).join('');
    const rightWord = state.puzzleCells.slice(v.middle, v.end).map(s => LABELS[s]).join('');
    const msg = document.createElement('div');
    msg.className = 'violation-msg';
    msg.innerHTML = `A hidden echo formed: <strong>${leftWord}</strong> | <strong>${rightWord}</strong> — same inventory.`;
    body.appendChild(msg);

    // Announce to screen reader
    const live = document.getElementById('abelisk-live');
    if (live) live.textContent = `Hidden echo found from cell ${v.start + 1} to ${v.end}`;
  }

  // Completion
  if (state.puzzleComplete) {
    const msg = document.createElement('div');
    msg.className = 'success-msg';
    msg.innerHTML = '<strong>The Abelisk is quiet.</strong> No echoes remain.';
    body.appendChild(msg);

    // Break-in analysis
    if (state.puzzleBreakIn) {
      const bi = state.puzzleBreakIn;
      const analysis = document.createElement('div');
      analysis.className = 'scene-reveal';
      analysis.innerHTML = `
        <span class="label">How the puzzle unfolded</span>
        Cell ${bi.cell + 1} was forced to <strong>${bi.forcedLabel}</strong> — 
        ${bi.technique === 'DOUBLE_LOCK' ? 'two different echo lengths excluded all other symbols (Double Lock)' :
          'all other symbols created echoes (Last Symbol)'}.
      `;
      body.appendChild(analysis);
    }

    const actions = document.createElement('div');
    actions.className = 'scene-actions';
    const newPuzzle = document.createElement('button');
    newPuzzle.className = 'btn btn-primary';
    newPuzzle.textContent = 'Another puzzle';
    newPuzzle.addEventListener('click', () => dispatch({ type: 'NEW_PUZZLE' }));
    actions.appendChild(newPuzzle);
    body.appendChild(actions);
  }

  container.appendChild(body);
  root.appendChild(container);
}

// --- Helper renderers ---

function renderWordWithDivider(word, dividerAt, echoRange, showEcho) {
  const div = document.createElement('div');
  div.className = 'word-display';

  word.forEach((sym, i) => {
    if (dividerAt && i === dividerAt) {
      const divider = document.createElement('span');
      divider.className = 'block-divider';
      divider.setAttribute('aria-hidden', 'true');
      div.appendChild(divider);
    }

    const cell = document.createElement('span');
    cell.className = 'word-cell';
    cell.dataset.sym = String(sym);
    cell.textContent = LABELS[sym];
    cell.setAttribute('aria-label', `${LABELS[sym]}`);

    if (showEcho && echoRange && i >= echoRange[0] && i < echoRange[1]) {
      cell.classList.add(i < dividerAt ? 'echo-left' : 'echo-right');
    }

    div.appendChild(cell);
  });

  return div;
}

function renderInteractiveWord(word, editableIndices, selectedSymbol, onCellClick) {
  const div = document.createElement('div');
  div.className = 'word-display';

  word.forEach((sym, i) => {
    const cell = document.createElement('button');
    cell.type = 'button';
    const editable = editableIndices.includes(i);

    cell.className = `puzzle-cell${editable ? '' : ' fixed'}`;
    cell.dataset.sym = String(sym);
    cell.textContent = LABELS[sym];
    cell.setAttribute('aria-label', `Cell ${i + 1}, ${LABELS[sym]}${editable ? ' (editable)' : ''}`);

    if (editable) {
      cell.addEventListener('click', () => onCellClick(i));
    }

    div.appendChild(cell);
  });

  return div;
}

function renderCountBlock(label, counts) {
  const block = document.createElement('div');
  block.className = 'count-block';

  const lbl = document.createElement('div');
  lbl.className = 'count-label';
  lbl.textContent = label;
  block.appendChild(lbl);

  Object.entries(counts).forEach(([sym, count]) => {
    const row = document.createElement('div');
    row.className = 'count-row count-match';
    row.textContent = `${sym} × ${count}`;
    block.appendChild(row);
  });

  return block;
}

function renderPalette(alphabetSize, selectedSymbol, dispatch) {
  const palette = document.createElement('div');
  palette.className = 'symbol-palette';
  palette.setAttribute('role', 'radiogroup');
  palette.setAttribute('aria-label', 'Symbol palette');

  for (let sym = 0; sym < alphabetSize; sym++) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `palette-btn${selectedSymbol === sym ? ' selected' : ''}`;
    btn.dataset.sym = String(sym);
    btn.textContent = LABELS[sym];
    btn.setAttribute('aria-label', `Select ${LABELS[sym]}`);
    btn.setAttribute('role', 'radio');
    btn.setAttribute('aria-checked', String(selectedSymbol === sym));
    btn.addEventListener('click', () => dispatch({ type: 'SELECT_SYMBOL', symbol: sym }));
    palette.appendChild(btn);
  }

  return palette;
}

function renderGlyphs(restored, total) {
  const bar = document.createElement('div');
  bar.className = 'glyph-progress';
  bar.setAttribute('aria-label', `${restored.length} of ${total} glyphs restored`);

  for (let i = 0; i < total; i++) {
    const g = document.createElement('div');
    g.className = `glyph${restored.includes(i) ? ' restored' : ''}`;
    g.setAttribute('aria-hidden', 'true');
    bar.appendChild(g);
  }

  return bar;
}
