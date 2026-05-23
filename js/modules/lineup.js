// ===== LINEUP & TACTICAL BOARD MODULE WITH APPLE-STYLE MARKUP =====
import { getPlayerById, formatDate } from '../data.js';

const TACTICAL_PHASES = ['Esquema Inicial', 'Fase Defensiva', 'Fase Ofensiva', 'Escanteio Favor', 'Pressionando Saída'];

const FORMATIONS = {
  '3-2-1': [
    { spotId: 0, label: 'GK',  x: 50, y: 88 },
    { spotId: 1, label: 'ZQE', x: 25, y: 70 },
    { spotId: 2, label: 'ZQD', x: 75, y: 70 },
    { spotId: 3, label: 'ZGC', x: 50, y: 72 },
    { spotId: 4, label: 'ALE', x: 20, y: 48 },
    { spotId: 5, label: 'ALD', x: 80, y: 48 },
    { spotId: 6, label: 'PIV', x: 50, y: 22 }
  ],
  '2-3-1': [
    { spotId: 0, label: 'GK',  x: 50, y: 88 },
    { spotId: 1, label: 'ZQE', x: 35, y: 70 },
    { spotId: 2, label: 'ZQD', x: 65, y: 70 },
    { spotId: 3, label: 'ALE', x: 18, y: 45 },
    { spotId: 4, label: 'MEC', x: 50, y: 48 },
    { spotId: 5, label: 'ALD', x: 82, y: 45 },
    { spotId: 6, label: 'PIV', x: 50, y: 20 }
  ],
  '3-1-2': [
    { spotId: 0, label: 'GK',  x: 50, y: 88 },
    { spotId: 1, label: 'ZQE', x: 25, y: 70 },
    { spotId: 2, label: 'ZQD', x: 75, y: 70 },
    { spotId: 3, label: 'ZGC', x: 50, y: 72 },
    { spotId: 4, label: 'MEC', x: 50, y: 45 },
    { spotId: 5, label: 'ATE', x: 35, y: 22 },
    { spotId: 6, label: 'ATD', x: 65, y: 22 }
  ],
  '2-2-2': [
    { spotId: 0, label: 'GK',  x: 50, y: 88 },
    { spotId: 1, label: 'ZQE', x: 30, y: 72 },
    { spotId: 2, label: 'ZQD', x: 70, y: 72 },
    { spotId: 3, label: 'ALE', x: 20, y: 46 },
    { spotId: 4, label: 'ALD', x: 80, y: 46 },
    { spotId: 5, label: 'ATE', x: 35, y: 22 },
    { spotId: 6, label: 'ATD', x: 65, y: 22 }
  ]
};

let currentMode = 'move'; // 'move', 'draw', 'pass', 'run'
let activeDrawingPath = null;
let activeRouteArrow = null;

export function renderLineup(el, data, setData) {
  const hash = window.location.hash;
  const matchId = hash.includes('?id=') ? parseInt(hash.split('?id=')[1]) : null;
  const match = matchId ? data.matches.find(m => m.id === matchId) : data.matches[0];
  const currentMatch = match || data.matches[0];

  // Initialize fields
  if (!currentMatch.lineupSpots) {
    currentMatch.lineupSpots = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
  }
  if (!currentMatch.phaseCoords) {
    currentMatch.phaseCoords = {};
  }
  if (!currentMatch.currentPhase) {
    currentMatch.currentPhase = 'Esquema Inicial';
  }
  if (!currentMatch.plays) {
    currentMatch.plays = [];
  }
  if (!currentMatch.drawings) {
    currentMatch.drawings = {};
  }
  if (!currentMatch.spyReport) {
    currentMatch.spyReport = { strengths: [], weaknesses: [], system: '' };
  }

  const activeFormation = currentMatch.formation || '3-2-1';
  const spotsTemplate = FORMATIONS[activeFormation] || FORMATIONS['3-2-1'];
  const activePhase = currentMatch.currentPhase;
  const d = formatDate(currentMatch.date);

  // Setup phase coordinates
  if (!currentMatch.phaseCoords[activePhase]) {
    currentMatch.phaseCoords[activePhase] = {};
    spotsTemplate.forEach(s => {
      currentMatch.phaseCoords[activePhase][s.spotId] = { x: s.x, y: s.y };
    });
    currentMatch.phaseCoords[activePhase]['ball'] = { x: 50, y: 50 };
  }
  
  if (!currentMatch.phaseCoords[activePhase]['ball']) {
    currentMatch.phaseCoords[activePhase]['ball'] = { x: 50, y: 50 };
  }

  const activeCoords = currentMatch.phaseCoords[activePhase];

  if (!currentMatch.drawings[activePhase]) {
    currentMatch.drawings[activePhase] = { paths: [], arrows: [] };
  }
  const phaseDrawings = currentMatch.drawings[activePhase];

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;width:100%;">
        <div>
          <h1 class="page-title">Prancheta Tática</h1>
          <p class="page-subtitle">Jogo vs ${currentMatch.opponent} (${d.full})</p>
        </div>
        <select class="form-select" id="matchSelect" style="width:auto;min-width:180px;">
          ${data.matches.map(m => {
            const md = formatDate(m.date);
            return `<option value="${m.id}" ${m.id === currentMatch.id ? 'selected' : ''}>
              ${md.day}/${md.month} vs ${m.opponent} (${m.status === 'finished' ? 'Finalizado' : 'Próximo'})
            </option>`;
          }).join('')}
        </select>
      </div>
    </div>

    <!-- Phase Selector Tab Bar -->
    <div class="tabs" style="margin-bottom:16px; overflow-x:auto; white-space:nowrap; display:flex; justify-content:flex-start;">
      ${TACTICAL_PHASES.map(p => `
        <button class="tab ${p === activePhase ? 'active' : ''}" data-phase="${p}" style="flex:none; padding:8px 16px;">
          ${p}
        </button>
      `).join('')}
    </div>

    <div class="lineup-grid">
      
      <!-- Field Card -->
      <div>
        <div class="card" style="padding:12px;margin-bottom:16px;position:relative;">
          
          <!-- Apple-Style Annotation Toolbar -->
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
            <div class="tactical-toolbar">
              <button class="tool-btn ${currentMode === 'move' ? 'active' : ''}" id="tool-move" title="Mover Peças & Bola">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                <span>Mover</span>
              </button>
              <button class="tool-btn ${currentMode === 'draw' ? 'active' : ''}" id="tool-draw" title="Rabiscar Livre">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                <span>Rabiscar</span>
              </button>
              <button class="tool-btn ${currentMode === 'pass' ? 'active' : ''}" id="tool-pass" title="Desenhar Seta de Passe (Sólida Amarela)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F1C40F" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                <span style="color:#F1C40F;">Passe (──)</span>
              </button>
              <button class="tool-btn ${currentMode === 'run' ? 'active' : ''}" id="tool-run" title="Desenhar Seta de Corrida (Tracejada Vermelha)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E74C3C" stroke-width="2.5" stroke-dasharray="3 3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                <span style="color:#E74C3C;">Corrida (- -)</span>
              </button>
              <button class="tool-btn" id="tool-reset" title="Restaurar Posições Padrão">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><polyline points="3 3 3 8 8 8"/></svg>
                <span>Resetar</span>
              </button>
              <button class="tool-btn danger" id="tool-clear" title="Limpar Desenhos">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                <span>Limpar</span>
              </button>
            </div>
            
            <div style="display:flex;align-items:center;gap:6px;">
              <select class="form-select" id="formationSelect" style="width:auto;padding:4px 24px 4px 10px;font-size:12px;">
                <option value="3-2-1" ${activeFormation === '3-2-1' ? 'selected' : ''}>3-2-1 (Padrão)</option>
                <option value="2-3-1" ${activeFormation === '2-3-1' ? 'selected' : ''}>2-3-1 (Ofensivo)</option>
                <option value="3-1-2" ${activeFormation === '3-1-2' ? 'selected' : ''}>3-1-2 (Duplo Pivô)</option>
                <option value="2-2-2" ${activeFormation === '2-2-2' ? 'selected' : ''}>2-2-2 (Quadrante)</option>
              </select>
            </div>
          </div>

          <!-- Tactical Field Canvas Container -->
          <div class="tactical-field-container" id="tacticalField" style="position:relative;">
            <!-- Field Lines Background -->
            <div style="position:absolute;top:50%;left:0;right:0;height:2px;background:rgba(255,255,255,0.45);transform:translateY(-50%);"></div>
            <div style="position:absolute;top:50%;left:50%;width:28%;aspect-ratio:1;border:2px solid rgba(255,255,255,0.45);border-radius:50%;transform:translate(-50%,-50%);"></div>
            <div style="position:absolute;top:0;left:25%;width:50%;height:14%;border:2px solid rgba(255,255,255,0.45);border-top:none;"></div>
            <div style="position:absolute;bottom:0;left:25%;width:50%;height:14%;border:2px solid rgba(255,255,255,0.45);border-bottom:none;"></div>
            
            <!-- Canvas Layer for Drawings -->
            <canvas id="fieldCanvas" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:5;pointer-events:${currentMode !== 'move' ? 'auto' : 'none'};"></canvas>

            <!-- Draggable pins layer -->
            <div id="pinsLayer" style="position:absolute;top:0;left:0;width:100%;height:100%;z-index:10;pointer-events:none;"></div>
          </div>
        </div>

        <!-- 🕵️ Espião de Rival Panel -->
        <div class="card" style="border: 1px solid rgba(241,196,15,0.3); background: rgba(241,196,15,0.03); margin-bottom: 20px;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px;">
            <div class="card-title" style="margin:0;color:var(--gold);">🕵️ Dossiê Espião (Contra ${currentMatch.opponent})</div>
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="font-size:11px;color:var(--text-muted);">Esquema Rival:</span>
              <input type="text" id="spySystemInput" class="form-input" style="width:120px;padding:4px 8px;font-size:12px;height:auto;" placeholder="Ex: 3-2-1" value="${currentMatch.spyReport.system || ''}">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <!-- Strengths -->
            <div style="padding:12px;background:var(--dark-3);border-radius:6px;border-top:2px solid #2ECC71;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:11px;font-weight:700;color:#2ECC71;text-transform:uppercase;">💪 Pontos Fortes</span>
                <button class="btn btn-primary" id="addStrengthBtn" style="padding:2px 8px;font-size:11px;height:auto;">+</button>
              </div>
              <ul id="spyStrengthsList" style="margin:0;padding-left:16px;font-size:11px;color:var(--text);display:flex;flex-direction:column;gap:6px;">
                ${currentMatch.spyReport.strengths.length ? currentMatch.spyReport.strengths.map((s, idx) => `
                  <li style="display:flex;justify-content:space-between;align-items:center;">
                    <span>• ${s}</span>
                    <span class="delete-spy-item" data-type="strengths" data-idx="${idx}" style="cursor:pointer;color:#E74C3C;font-weight:700;padding-left:6px;">✕</span>
                  </li>
                `).join('') : '<li style="list-style:none;margin-left:-16px;color:var(--text-dim);">Nenhum ponto forte anotado.</li>'}
              </ul>
            </div>

            <!-- Weaknesses -->
            <div style="padding:12px;background:var(--dark-3);border-radius:6px;border-top:2px solid #E74C3C;">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <span style="font-size:11px;font-weight:700;color:#E74C3C;text-transform:uppercase;">⚠️ Fraquezas</span>
                <button class="btn btn-primary" id="addWeaknessBtn" style="padding:2px 8px;font-size:11px;height:auto;">+</button>
              </div>
              <ul id="spyWeaknessesList" style="margin:0;padding-left:16px;font-size:11px;color:var(--text);display:flex;flex-direction:column;gap:6px;">
                ${currentMatch.spyReport.weaknesses.length ? currentMatch.spyReport.weaknesses.map((w, idx) => `
                  <li style="display:flex;justify-content:space-between;align-items:center;">
                    <span>• ${w}</span>
                    <span class="delete-spy-item" data-type="weaknesses" data-idx="${idx}" style="cursor:pointer;color:#E74C3C;font-weight:700;padding-left:6px;">✕</span>
                  </li>
                `).join('') : '<li style="list-style:none;margin-left:-16px;color:var(--text-dim);">Nenhuma fraqueza anotada.</li>'}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Info panel -->
      <div style="display:flex;flex-direction:column;gap:16px;">
        <!-- Plays planner -->
        <div class="card">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
            <div class="card-title" style="margin:0;">📝 Planejamento & Avaliações</div>
            <button class="btn btn-primary" id="addPlayBtn" style="padding:4px 8px;font-size:11px;">+ Jogada</button>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;" id="playsList">
            ${currentMatch.plays.length ? currentMatch.plays.map((play, idx) => {
              const badgeClass = play.status === 'worked' ? 'badge-win' : play.status === 'failed' ? 'badge-loss' : 'badge-draw';
              const statusText = play.status === 'worked' ? 'Funcionou' : play.status === 'failed' ? 'Falhou' : 'Pendente';
              return `
                <div style="padding:10px;background:var(--dark-3);border-radius:6px;border-left:3px solid ${play.status === 'worked' ? '#2ECC71' : play.status === 'failed' ? '#E74C3C' : '#F1C40F'}">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                    <strong style="font-size:12px;color:var(--text);">${play.name}</strong>
                    <span class="badge ${badgeClass}" style="font-size:9px;cursor:pointer" data-play-idx="${idx}">${statusText}</span>
                  </div>
                  <p style="font-size:11px;color:var(--text-muted);margin:4px 0 0;">${play.description}</p>
                </div>
              `;
            }).join('') : '<div style="font-size:11px;color:var(--text-dim);text-align:center;padding:12px;">Nenhuma jogada planejada ainda.</div>'}
          </div>
        </div>
      </div>

    </div>

    <!-- Dropdown Modal popup -->
    <div id="positionSelectorPopup" style="display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:1000;align-items:center;justify-content:center;padding:20px;">
      <div class="card" style="width:100%;max-width:320px;max-height:80vh;overflow-y:auto;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <strong style="font-size:14px;color:var(--gold);">Escalar Posição</strong>
          <button class="btn btn-ghost" id="closePopupBtn" style="padding:2px 8px;">✕</button>
        </div>
        <div style="display:flex;flex-direction:column;gap:6px;" id="popupPlayerOptions"></div>
      </div>
    </div>
  `;

  // Init canvas size
  const canvas = document.getElementById('fieldCanvas');
  const ctx = canvas.getContext('2d');
  
  const resizeCanvas = () => {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    drawSavedGraphics(ctx, canvas, phaseDrawings);
  };
  
  setTimeout(resizeCanvas, 100);
  window.addEventListener('resize', resizeCanvas);

  // --- Apple Toolbar Handlers ---
  document.getElementById('tool-move').onclick = () => { currentMode = 'move'; setData(data); renderLineup(el, data, setData); };
  document.getElementById('tool-draw').onclick = () => { currentMode = 'draw'; setData(data); renderLineup(el, data, setData); };
  document.getElementById('tool-pass').onclick = () => { currentMode = 'pass'; setData(data); renderLineup(el, data, setData); };
  document.getElementById('tool-run').onclick = () => { currentMode = 'run'; setData(data); renderLineup(el, data, setData); };
  
  document.getElementById('tool-reset').onclick = () => {
    const idx = data.matches.findIndex(m => m.id === currentMatch.id);
    const activeFormation = data.matches[idx].formation || '3-2-1';
    const currentSpotsTemplate = FORMATIONS[activeFormation] || FORMATIONS['3-2-1'];
    data.matches[idx].phaseCoords[activePhase] = {};
    currentSpotsTemplate.forEach(s => {
      data.matches[idx].phaseCoords[activePhase][s.spotId] = { x: s.x, y: s.y };
    });
    data.matches[idx].phaseCoords[activePhase]['ball'] = { x: 50, y: 50 };
    setData(data);
    renderLineup(el, data, setData);
  };

  document.getElementById('tool-clear').onclick = () => {
    const idx = data.matches.findIndex(m => m.id === currentMatch.id);
    data.matches[idx].drawings[activePhase] = { paths: [], arrows: [] };
    setData(data);
    renderLineup(el, data, setData);
  };

  document.getElementById('matchSelect').onchange = e => {
    window.location.hash = `lineup?id=${e.target.value}`;
  };

  el.querySelectorAll('.tab[data-phase]').forEach(tab => {
    tab.onclick = () => {
      const ph = tab.dataset.phase;
      const idx = data.matches.findIndex(m => m.id === currentMatch.id);
      data.matches[idx].currentPhase = ph;
      setData(data);
      renderLineup(el, data, setData);
    };
  });

  document.getElementById('formationSelect').onchange = e => {
    const f = e.target.value;
    const idx = data.matches.findIndex(m => m.id === currentMatch.id);
    data.matches[idx].formation = f;
    data.matches[idx].phaseCoords = {};
    data.matches[idx].lineupSpots = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
    setData(data);
    renderLineup(el, data, setData);
  };

  // --- Canvas Pointer Drag & Drawing Handler (Supports click and drag anywhere) ---
  let isDrawing = false;
  canvas.onpointerdown = e => {
    if (currentMode === 'move') return;
    isDrawing = true;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (currentMode === 'draw') {
      activeDrawingPath = [{ x, y }];
    } else { // 'pass' or 'run'
      activeRouteArrow = { fromX: x, fromY: y, toX: x, toY: y, style: currentMode === 'run' ? 'dashed' : 'solid' };
    }
    canvas.setPointerCapture(e.pointerId);
  };

  canvas.onpointermove = e => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    if (currentMode === 'draw' && activeDrawingPath) {
      activeDrawingPath.push({ x, y });
      drawSavedGraphics(ctx, canvas, phaseDrawings);
      ctx.beginPath();
      ctx.moveTo((activeDrawingPath[0].x * canvas.width) / 100, (activeDrawingPath[0].y * canvas.height) / 100);
      for (let i = 1; i < activeDrawingPath.length; i++) {
        ctx.lineTo((activeDrawingPath[i].x * canvas.width) / 100, (activeDrawingPath[i].y * canvas.height) / 100);
      }
      ctx.strokeStyle = '#FFFFFF'; // White for freehand
      ctx.lineWidth = 3;
      ctx.setLineDash([]);
      ctx.stroke();
    } else if ((currentMode === 'pass' || currentMode === 'run') && activeRouteArrow) {
      activeRouteArrow.toX = x;
      activeRouteArrow.toY = y;
      drawSavedGraphics(ctx, canvas, phaseDrawings);
      const isDashed = currentMode === 'run';
      const color = isDashed ? '#E74C3C' : '#F1C40F';
      drawArrow(ctx, 
        (activeRouteArrow.fromX * canvas.width) / 100, 
        (activeRouteArrow.fromY * canvas.height) / 100, 
        (x * canvas.width) / 100, 
        (y * canvas.height) / 100, 
        isDashed ? 'dashed' : 'solid',
        color
      );
    }
  };

  canvas.onpointerup = e => {
    if (!isDrawing) return;
    isDrawing = false;
    canvas.releasePointerCapture(e.pointerId);
    
    const matchIdx = data.matches.findIndex(m => m.id === currentMatch.id);

    if (currentMode === 'draw' && activeDrawingPath && activeDrawingPath.length > 1) {
      phaseDrawings.paths.push({ path: activeDrawingPath, style: 'solid', color: '#FFFFFF' });
      data.matches[matchIdx].drawings[activePhase] = phaseDrawings;
      setData(data);
    } else if ((currentMode === 'pass' || currentMode === 'run') && activeRouteArrow) {
      const isDashed = activeRouteArrow.style === 'dashed';
      phaseDrawings.arrows.push({
        fromX: activeRouteArrow.fromX,
        fromY: activeRouteArrow.fromY,
        toX: activeRouteArrow.toX,
        toY: activeRouteArrow.toY,
        style: activeRouteArrow.style,
        color: isDashed ? '#E74C3C' : '#F1C40F'
      });
      data.matches[matchIdx].drawings[activePhase] = phaseDrawings;
      setData(data);
      activeRouteArrow = null;
    }
    activeDrawingPath = null;
    drawSavedGraphics(ctx, canvas, phaseDrawings);
  };

  // --- Espião Handlers ---
  const spySystemEl = document.getElementById('spySystemInput');
  spySystemEl.oninput = e => {
    const matchIdx = data.matches.findIndex(m => m.id === currentMatch.id);
    data.matches[matchIdx].spyReport.system = e.target.value.trim();
    setData(data);
  };

  document.getElementById('addStrengthBtn').onclick = () => {
    showAddSpyItemModal(el, currentMatch, 'strengths', data, setData);
  };

  document.getElementById('addWeaknessBtn').onclick = () => {
    showAddSpyItemModal(el, currentMatch, 'weaknesses', data, setData);
  };

  el.querySelectorAll('.delete-spy-item').forEach(btn => {
    btn.onclick = () => {
      const type = btn.dataset.type;
      const idx = parseInt(btn.dataset.idx);
      const matchIdx = data.matches.findIndex(m => m.id === currentMatch.id);
      data.matches[matchIdx].spyReport[type].splice(idx, 1);
      setData(data);
      renderLineup(el, data, setData);
    };
  });

  renderTacticalPins(currentMatch, spotsTemplate, activeCoords, phaseDrawings, data, setData, el);
}

function showAddSpyItemModal(pageEl, match, type, data, setData) {
  const title = type === 'strengths' ? '💪 Novo Ponto Forte' : '⚠️ Nova Fraqueza';
  const placeholder = type === 'strengths' ? 'Ex: Ala esquerdo cruza muito bem' : 'Ex: Goleiro rebate bola fácil';
  
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-title">${title}</div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <input type="text" class="form-input" id="spyItemTextInput" placeholder="${placeholder}">
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="cancelSpyItem">Cancelar</button>
        <button class="btn btn-primary" id="confirmSpyItem">Adicionar</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  backdrop.querySelector('#cancelSpyItem').onclick = () => backdrop.remove();
  backdrop.querySelector('#confirmSpyItem').onclick = () => {
    const text = backdrop.querySelector('#spyItemTextInput').value.trim();
    if (!text) {
      alert('Texto é obrigatório!');
      return;
    }
    const idx = data.matches.findIndex(m => m.id === match.id);
    data.matches[idx].spyReport[type].push(text);
    setData(data);
    backdrop.remove();
    renderLineup(pageEl, data, setData);
  };
}

function renderTacticalPins(match, spotsTemplate, activeCoords, phaseDrawings, data, setData, pageEl) {
  const container = document.getElementById('pinsLayer');
  const canvas = document.getElementById('fieldCanvas');
  const ctx = canvas.getContext('2d');
  if (!container) return;

  // Render players first
  spotsTemplate.forEach(s => {
    const spotId = s.spotId;
    const playerId = match.lineupSpots[spotId];
    const player = playerId ? getPlayerById(data, playerId) : null;
    const coord = activeCoords[spotId] || { x: s.x, y: s.y };

    const pin = document.createElement('div');
    pin.className = 'tactical-pin';
    pin.style.position = 'absolute';
    pin.style.left = `${coord.x}%`;
    pin.style.top = `${coord.y}%`;
    pin.style.transform = 'translate(-50%, -50%)';
    pin.style.zIndex = '10';
    // ALWAYS active to allow moving the player anytime
    pin.style.pointerEvents = 'auto';

    pin.innerHTML = `
      <div style="position:relative;display:flex;flex-direction:column;align-items:center;">
        <div style="width:38px;height:38px;border-radius:50%;background:${player ? 'var(--wine)' : '#34495e'};border:2px solid ${player ? 'var(--gold)' : '#bdc3c7'};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:bold;font-size:12px;box-shadow:0 4px 8px rgba(0,0,0,0.3);">
          ${player ? player.number : s.label}
        </div>
        <div style="margin-top:2px;background:rgba(0,0,0,0.8);color:#fff;font-size:10px;padding:1px 6px;border-radius:3px;white-space:nowrap;font-weight:600;max-width:80px;overflow:hidden;text-overflow:ellipsis;">
          ${player ? player.nickname : 'Vazio'}
        </div>
      </div>
    `;

    pin.onclick = () => {
      // Allow opening player selection only in move mode (not while drawing)
      if (currentMode !== 'move') return;
      if (pin.dataset.dragged === 'true') {
        delete pin.dataset.dragged;
        return;
      }
      openPlayerSelector(spotId, match, data, setData, pageEl);
    };

    setupDragEvents(pin, spotId, coord, match, activeCoords, data, setData, canvas);
    container.appendChild(pin);
  });

  // Render Football Ball (⚽)
  const ballCoord = activeCoords['ball'] || { x: 50, y: 50 };
  const ballPin = document.createElement('div');
  ballPin.className = 'tactical-pin ball';
  ballPin.style.position = 'absolute';
  ballPin.style.left = `${ballCoord.x}%`;
  ballPin.style.top = `${ballCoord.y}%`;
  ballPin.style.transform = 'translate(-50%, -50%)';
  ballPin.style.zIndex = '12';
  ballPin.style.pointerEvents = 'auto';

  ballPin.innerHTML = `
    <div style="width:28px;height:28px;border-radius:50%;background:#fff;border:2.5px solid #000;display:flex;align-items:center;justify-content:center;font-size:15px;box-shadow:0 4px 8px rgba(0,0,0,0.4);cursor:grab;">
      ⚽
    </div>
  `;

  setupDragEvents(ballPin, 'ball', ballCoord, match, activeCoords, data, setData, canvas);
  container.appendChild(ballPin);
}

function setupDragEvents(pin, spotId, coord, match, activeCoords, data, setData, canvas) {
  let isInteracting = false;
  let startX = 0;
  let startY = 0;

  pin.onpointerdown = e => {
    // ALWAYS stop propagation to prevent drawing under player pins!
    e.stopPropagation();
    isInteracting = true;
    startX = e.clientX;
    startY = e.clientY;
    pin.setPointerCapture(e.pointerId);
  };

  pin.onpointermove = e => {
    if (!isInteracting) return;
    const rect = canvas.getBoundingClientRect();
    const currentX = ((e.clientX - rect.left) / rect.width) * 100;
    const currentY = ((e.clientY - rect.top) / rect.height) * 100;

    if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) {
      pin.dataset.dragged = 'true';
    }

    let x = Math.max(4, Math.min(96, currentX));
    let y = Math.max(4, Math.min(96, currentY));
    pin.style.left = `${x}%`;
    pin.style.top = `${y}%`;
    activeCoords[spotId] = { x: Math.round(x), y: Math.round(y) };
  };

  pin.onpointerup = e => {
    if (!isInteracting) return;
    isInteracting = false;
    pin.releasePointerCapture(e.pointerId);

    const matchIdx = data.matches.findIndex(m => m.id === match.id);
    data.matches[matchIdx].phaseCoords[match.currentPhase] = activeCoords;
    setData(data);
  };
}

function drawSavedGraphics(ctx, canvas, drawings) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!drawings) return;

  (drawings.paths || []).forEach(pInfo => {
    const path = pInfo.path || pInfo;
    const color = pInfo.color || '#FFFFFF';
    if (path.length < 2) return;
    ctx.beginPath();
    ctx.moveTo((path[0].x * canvas.width) / 100, (path[0].y * canvas.height) / 100);
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo((path[i].x * canvas.width) / 100, (path[i].y * canvas.height) / 100);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.setLineDash([]);
    ctx.stroke();
  });

  (drawings.arrows || []).forEach(arr => {
    drawArrow(
      ctx,
      (arr.fromX * canvas.width) / 100,
      (arr.fromY * canvas.height) / 100,
      (arr.toX * canvas.width) / 100,
      (arr.toY * canvas.height) / 100,
      arr.style || 'solid',
      arr.color || (arr.style === 'dashed' ? '#E74C3C' : '#F1C40F')
    );
  });
}

function drawArrow(ctx, fromx, fromy, tox, toy, style = 'solid', color = '#F1C40F') {
  const angle = Math.atan2(toy - fromy, tox - fromx);
  
  ctx.beginPath();
  ctx.moveTo(fromx, fromy);
  ctx.lineTo(tox, toy);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3.5;
  if (style === 'dashed') {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }
  ctx.stroke();
  
  ctx.setLineDash([]);
  
  const headlen = 10;
  ctx.beginPath();
  ctx.moveTo(tox, toy);
  ctx.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
  ctx.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

function openPlayerSelector(spotId, match, data, setData, pageEl) {
  const popup = document.getElementById('positionSelectorPopup');
  const optionsList = document.getElementById('popupPlayerOptions');
  const closeBtn = document.getElementById('closePopupBtn');
  if (!popup || !optionsList) return;

  optionsList.innerHTML = `
    <div class="player-selection-item" data-val="null" style="padding:8px 10px;background:rgba(231,76,60,0.15);border:1px dashed #E74C3C;border-radius:6px;cursor:pointer;text-align:center;font-size:12px;font-weight:700;color:#E74C3C;">
      ❌ Deixar Posição Vazia
    </div>
    ${data.players.map(p => {
      const otherPlaced = Object.entries(match.lineupSpots).some(([key, val]) => val === p.id && parseInt(key) !== spotId);
      return `
        <div class="player-selection-item" data-val="${p.id}" style="padding:8px 10px;background:var(--dark-3);border-radius:6px;cursor:pointer;opacity:${otherPlaced ? '0.4' : '1'};display:flex;justify-content:space-between;font-size:12px;">
          <span><strong>#${p.number}</strong> ${p.nickname}</span>
          <span style="color:var(--text-muted);font-size:10px;">${p.position} ${otherPlaced ? '(Já escalado)' : ''}</span>
        </div>
      `;
    }).join('')}
  `;

  popup.style.display = 'flex';
  const closePopup = () => { popup.style.display = 'none'; };
  closeBtn.onclick = closePopup;

  optionsList.querySelectorAll('.player-selection-item').forEach(opt => {
    opt.onclick = () => {
      const val = opt.dataset.val;
      const matchIdx = data.matches.findIndex(m => m.id === match.id);
      
      if (val === 'null') {
        data.matches[matchIdx].lineupSpots[spotId] = null;
      } else {
        const pid = parseInt(val);
        Object.entries(data.matches[matchIdx].lineupSpots).forEach(([key, value]) => {
          if (value === pid) data.matches[matchIdx].lineupSpots[key] = null;
        });
        data.matches[matchIdx].lineupSpots[spotId] = pid;
      }
      
      data.matches[matchIdx].lineup = Object.values(data.matches[matchIdx].lineupSpots).filter(v => v !== null);

      setData(data);
      closePopup();
      renderLineup(pageEl, data, setData);
    };
  });
}
