// ===== STATS MODULE =====
import { computePlayerStats } from '../data.js';

export function renderStats(el, data) {
  const stats = computePlayerStats(data);
  const finished = data.matches.filter(m => m.status === 'finished');
  const wins   = finished.filter(m => m.score.romanos > m.score.opponent).length;
  const draws  = finished.filter(m => m.score.romanos === m.score.opponent).length;
  const losses = finished.filter(m => m.score.romanos < m.score.opponent).length;
  const gf = finished.reduce((s, m) => s + m.score.romanos, 0);
  const ga = finished.reduce((s, m) => s + m.score.opponent, 0);

  // Sort players by goals
  const sorted = [...data.players].sort((a, b) => {
    const sa = stats[a.id], sb = stats[b.id];
    return (sb?.goals || 0) - (sa?.goals || 0) || (sb?.assists || 0) - (sa?.assists || 0);
  });

  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Estatísticas</h1>
      <p class="page-subtitle">Temporada 2026 · ${finished.length} jogos</p>
    </div>

    <!-- Team stats -->
    <div class="card" style="margin-bottom:20px;">
      <div class="card-title">📊 Desempenho do Time</div>
      <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:12px;text-align:center;">
        <div class="stat-box"><div class="stat-value">${finished.length}</div><div class="stat-label">Jogos</div></div>
        <div class="stat-box"><div class="stat-value" style="color:#2ECC71">${wins}</div><div class="stat-label">Vitórias</div></div>
        <div class="stat-box"><div class="stat-value" style="color:#F1C40F">${draws}</div><div class="stat-label">Empates</div></div>
        <div class="stat-box"><div class="stat-value" style="color:#E74C3C">${losses}</div><div class="stat-label">Derrotas</div></div>
        <div class="stat-box"><div class="stat-value">${gf}–${ga}</div><div class="stat-label">Gols (F/C)</div></div>
      </div>
    </div>

    <!-- Player stats table -->
    <div class="card">
      <div class="card-title">👤 Estatísticas Individuais</div>
      <div style="overflow-x:auto;">
        <table class="league-table">
          <thead>
            <tr>
              <th>Jogador</th>
              <th>Pos</th>
              <th>JG</th>
              <th>⚽</th>
              <th>🅰️</th>
              <th>🟨</th>
              <th>🟥</th>
              <th>Part.</th>
            </tr>
          </thead>
          <tbody>
            ${sorted.map(p => {
              const s = stats[p.id] || {};
              return `<tr>
                <td><strong>#${p.number} ${p.nickname}</strong></td>
                <td style="color:var(--text-muted)">${p.position}</td>
                <td style="color:var(--gold);font-weight:700">${s.goals || 0}</td>
                <td>${s.assists || 0}</td>
                <td>${s.yellowCards || 0}</td>
                <td style="color:#C0392B">${s.redCards || 0}</td>
                <td>${s.appearances || 0}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Suspensions -->
    ${renderSuspensions(data, stats)}
  `;
}

function renderSuspensions(data, stats) {
  const suspended = data.players.filter(p => {
    const s = stats[p.id];
    return s && (s.redCards > 0 || s.yellowCards >= 2);
  });
  if (!suspended.length) return '';
  return `
    <div class="card" style="margin-top:20px;border-color:rgba(192,57,43,0.3);">
      <div class="card-title" style="color:#E74C3C;">🚫 Suspensos / Atenção</div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${suspended.map(p => {
          const s = stats[p.id];
          return `<div class="player-card">
            <div class="player-number">${p.number}</div>
            <div>
              <div class="player-name">${p.nickname}</div>
              <div class="player-pos">${p.position}</div>
            </div>
            <div style="margin-left:auto;text-align:right;">
              ${s.redCards > 0 ? '<span class="badge badge-loss">🟥 Suspenso</span>' :
                '<span class="badge" style="background:rgba(243,156,18,0.15);color:#F39C12;border:1px solid rgba(243,156,18,0.3);">🟨🟨 Atenção</span>'}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}
