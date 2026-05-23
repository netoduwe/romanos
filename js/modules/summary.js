// ===== SUMMARY MODULE =====
import { getPlayerById, getMatchResult, formatDate } from '../data.js';

export function renderSummary(el, data, setData) {
  const hash = window.location.hash;
  const matchId = hash.includes('?id=') ? parseInt(hash.split('?id=')[1]) : null;
  const finished = data.matches.filter(m => m.status === 'finished');
  const match = matchId ? data.matches.find(m => m.id === matchId) : finished[finished.length - 1];

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
        <div>
          <h1 class="page-title">Súmula</h1>
          <p class="page-subtitle">Resultado, eventos e avaliações do jogo</p>
        </div>
        <select class="form-select" id="matchSelect" style="width:auto;min-width:180px;">
          ${finished.map(m => {
            const d = formatDate(m.date);
            return `<option value="${m.id}" ${m.id === match?.id ? 'selected' : ''}>
              ${d.day}/${d.month} — ${m.isHome ? 'vs' : 'em'} ${m.opponent}
            </option>`;
          }).join('')}
        </select>
      </div>
    </div>
    ${match ? renderMatchSummary(match, data, setData) : '<div class="empty-state"><div class="empty-state-icon">📋</div><div class="empty-state-text">Nenhum jogo finalizado</div></div>'}
  `;

  document.getElementById('matchSelect')?.addEventListener('change', e => {
    window.location.hash = `summary?id=${e.target.value}`;
  });

  if (match) {
    document.getElementById('addEventBtn')?.addEventListener('click', () => {
      showAddEventModal(el, match, data, setData);
    });
  }
}

function renderMatchSummary(match, data) {
  const d = formatDate(match.date);
  const result = getMatchResult(match);
  const goals = match.events.filter(e => e.type === 'goal');
  const cards = match.events.filter(e => e.type === 'yellow' || e.type === 'red');

  const scoreColor = result === 'win' ? '#2ECC71' : result === 'loss' ? '#E74C3C' : '#F1C40F';

  return `
    <!-- Score card -->
    <div class="card" style="text-align:center;margin-bottom:20px;background:linear-gradient(135deg,rgba(107,15,26,0.3),var(--dark-2));">
      <div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">
        ${d.full} · ${match.isHome ? '🏠' : '✈️'} ${match.location} · ${match.time}h
      </div>
      <div style="display:flex;align-items:center;justify-content:center;gap:24px;margin:8px 0;">
        <div style="flex:1;text-align:right;">
          <div style="font-family:'Cinzel',serif;font-size:14px;color:var(--gold);">ROMANOS FC</div>
        </div>
        <div style="font-family:'Cinzel',serif;font-size:40px;font-weight:900;color:${scoreColor};min-width:120px;text-align:center;">
          ${match.score.romanos} – ${match.score.opponent}
        </div>
        <div style="flex:1;text-align:left;">
          <div style="font-size:14px;color:var(--text);">${match.opponent}</div>
        </div>
      </div>
      <span class="badge ${result === 'win' ? 'badge-win' : result === 'loss' ? 'badge-loss' : 'badge-draw'}">
        ${result === 'win' ? '✅ Vitória' : result === 'loss' ? '❌ Derrota' : '⚖️ Empate'}
      </span>
    </div>

    <!-- Events & Plays -->
    <div class="grid-2" style="gap:16px;margin-bottom:20px;align-items:start;">
      <!-- Column 1: Match Events -->
      <div style="display:flex;flex-direction:column;gap:16px;">
        <div class="card">
          <div class="card-title">⚽ Gols (${goals.length})</div>
          <div class="event-list">
            ${goals.length ? goals.map(e => {
              const p = getPlayerById(data, e.playerId);
              const assist = match.events.find(a => a.type === 'assist' && a.minute === e.minute);
              const ap = assist ? getPlayerById(data, assist.playerId) : null;
              return `<div class="event-item goal">
                <span class="event-minute">${e.minute}'</span>
                <span class="event-icon">⚽</span>
                <div class="event-desc">
                  <strong>${p?.nickname || '?'}</strong>
                  ${e.detail ? `<br><small style="color:var(--text-muted)">${e.detail}</small>` : ''}
                  ${ap ? `<br><small style="color:var(--gold)">🅰️ ${ap.nickname}</small>` : ''}
                </div>
              </div>`;
            }).join('') : '<div style="color:var(--text-dim);font-size:13px;">Sem gols registrados</div>'}
          </div>
        </div>

        <div class="card">
          <div class="card-title">🟨 Cartões (${cards.length})</div>
          <div class="event-list">
            ${cards.length ? cards.map(e => {
              const p = getPlayerById(data, e.playerId);
              const isRed = e.type === 'red';
              return `<div class="event-item ${e.type}">
                <span class="event-minute">${e.minute}'</span>
                <span class="event-icon">${isRed ? '🟥' : '🟨'}</span>
                <div class="event-desc"><strong>${p?.nickname || '?'}</strong></div>
              </div>`;
            }).join('') : '<div style="color:var(--text-dim);font-size:13px;">Sem cartões</div>'}
          </div>
        </div>
      </div>

      <!-- Column 2: Tactical evaluation of plays -->
      <div class="card">
        <div class="card-title">📋 Avaliação de Jogadas Ensaiadas</div>
        <p style="font-size:11px;color:var(--text-muted);margin-bottom:12px;">Como as jogadas planejadas funcionaram em campo neste jogo:</p>
        <div style="display:flex;flex-direction:column;gap:10px;">
          ${match.plays && match.plays.length ? match.plays.map(play => {
            const statusColor = play.status === 'worked' ? '#2ECC71' : play.status === 'failed' ? '#E74C3C' : '#F1C40F';
            const statusText = play.status === 'worked' ? '🎯 Funcionou' : play.status === 'failed' ? '❌ Falhou' : '⏳ Pendente/Não usada';
            return `
              <div style="padding:10px;background:var(--dark-3);border-radius:6px;border-left:4px solid ${statusColor}">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <strong style="font-size:13px;color:var(--text);">${play.name}</strong>
                  <span style="font-size:10px;font-weight:700;color:${statusColor}">${statusText}</span>
                </div>
                <p style="font-size:11px;color:var(--text-dim);margin:6px 0 0;">${play.description}</p>
              </div>
            `;
          }).join('') : '<div style="font-size:11px;color:var(--text-dim);text-align:center;padding:12px;">Nenhuma jogada planejada cadastrada para este jogo.</div>'}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div style="display:flex;gap:10px;">
      <button class="btn btn-primary" id="addEventBtn">➕ Adicionar Evento de Jogo</button>
      <a href="#lineup?id=${match.id}" class="btn btn-ghost">🗺️ Prancheta Tática deste Jogo</a>
    </div>
  `;
}

function showAddEventModal(pageEl, match, data, setData) {
  const players = data.players;
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-title">➕ Adicionar Evento</div>
      <div class="form-group">
        <label class="form-label">Tipo</label>
        <select class="form-select" id="evType">
          <option value="goal">⚽ Gol</option>
          <option value="assist">🅰️ Assistência</option>
          <option value="yellow">🟨 Cartão Amarelo</option>
          <option value="red">🟥 Cartão Vermelho</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Jogador</label>
        <select class="form-select" id="evPlayer">
          ${players.map(p => `<option value="${p.id}">#${p.number} ${p.nickname}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Minuto</label>
        <input type="number" class="form-input" id="evMinute" min="1" max="90" value="1">
      </div>
      <div class="form-group">
        <label class="form-label">Detalhe (opcional)</label>
        <input type="text" class="form-input" id="evDetail" placeholder="Ex: Pênalti, falta direta...">
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="cancelEvent">Cancelar</button>
        <button class="btn btn-primary" id="confirmEvent">Salvar</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  backdrop.querySelector('#cancelEvent').addEventListener('click', () => backdrop.remove());
  backdrop.querySelector('#confirmEvent').addEventListener('click', () => {
    const type = backdrop.querySelector('#evType').value;
    const playerId = parseInt(backdrop.querySelector('#evPlayer').value);
    const minute = parseInt(backdrop.querySelector('#evMinute').value);
    const detail = backdrop.querySelector('#evDetail').value;

    const idx = data.matches.findIndex(m => m.id === match.id);
    data.matches[idx].events.push({ type, playerId, minute, detail });
    setData(data);
    backdrop.remove();
    window.location.hash = `summary?id=${match.id}`;
  });
}
