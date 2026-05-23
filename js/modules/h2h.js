// ===== H2H MODULE =====
import { getMatchResult, formatDate } from '../data.js';

export function renderH2H(el, data) {
  // Group matches by opponent
  const opponents = {};
  data.matches.filter(m => m.status === 'finished').forEach(m => {
    if (!opponents[m.opponent]) opponents[m.opponent] = [];
    opponents[m.opponent].push(m);
  });

  const opponentNames = Object.keys(opponents);

  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Confrontos</h1>
      <p class="page-subtitle">Histórico contra adversários</p>
    </div>

    ${opponentNames.length === 0
      ? `<div class="empty-state"><div class="empty-state-icon">⚔️</div><div class="empty-state-text">Nenhum confronto registrado</div></div>`
      : opponentNames.map(opp => renderH2HCard(opp, opponents[opp])).join('')
    }
  `;
}

function renderH2HCard(opponent, matches) {
  const wins   = matches.filter(m => getMatchResult(m) === 'win').length;
  const draws  = matches.filter(m => getMatchResult(m) === 'draw').length;
  const losses = matches.filter(m => getMatchResult(m) === 'loss').length;
  const gf = matches.reduce((s, m) => s + m.score.romanos, 0);
  const ga = matches.reduce((s, m) => s + m.score.opponent, 0);

  return `
    <div class="card" style="margin-bottom:16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
        <div>
          <div style="font-size:15px;font-weight:700;color:var(--text)">⚔️ ${opponent}</div>
          <div style="font-size:11px;color:var(--text-muted);margin-top:2px">${matches.length} confronto${matches.length > 1 ? 's' : ''} · ${gf} gols marcados</div>
        </div>
        <div style="display:flex;gap:10px;">
          <div class="stat-box" style="padding:8px 14px;"><div class="stat-value" style="font-size:18px;color:#2ECC71">${wins}</div><div class="stat-label">V</div></div>
          <div class="stat-box" style="padding:8px 14px;"><div class="stat-value" style="font-size:18px;color:#F1C40F">${draws}</div><div class="stat-label">E</div></div>
          <div class="stat-box" style="padding:8px 14px;"><div class="stat-value" style="font-size:18px;color:#E74C3C">${losses}</div><div class="stat-label">D</div></div>
        </div>
      </div>
      <hr class="divider">
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${matches.map(m => {
          const d = formatDate(m.date);
          const result = getMatchResult(m);
          const scoreColor = result === 'win' ? '#2ECC71' : result === 'loss' ? '#E74C3C' : '#F1C40F';
          return `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
            <span style="font-size:11px;color:var(--text-muted);min-width:60px">${d.full}</span>
            <span style="font-size:11px;color:var(--text-dim)">${m.isHome ? '🏠' : '✈️'}</span>
            <span style="font-family:'Cinzel',serif;font-size:16px;font-weight:700;color:${scoreColor};">${m.score.romanos}–${m.score.opponent}</span>
            <span class="badge ${result === 'win' ? 'badge-win' : result === 'loss' ? 'badge-loss' : 'badge-draw'}">${result === 'win' ? 'V' : result === 'loss' ? 'D' : 'E'}</span>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}
