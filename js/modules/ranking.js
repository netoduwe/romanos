// ===== RANKING MODULE =====
import { computePlayerStats } from '../data.js';

export function renderRanking(el, data) {
  const stats = computePlayerStats(data);

  // Score: goals*5 + assists*3 + appearances - yellowCards*2 - redCards*5
  const ranked = [...data.players]
    .map(p => {
      const s = stats[p.id] || {};
      const score = (s.goals||0)*5 + (s.assists||0)*3 + (s.appearances||0) - (s.yellowCards||0)*2 - (s.redCards||0)*5;
      return { ...p, ...s, score };
    })
    .sort((a, b) => b.score - a.score);

  const medals = ['🥇', '🥈', '🥉'];
  const posClass = ['gold', 'silver', 'bronze'];

  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Ranking</h1>
      <p class="page-subtitle">Desempenho interno dos jogadores</p>
    </div>

    <!-- Top 3 -->
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:24px;">
      ${ranked.slice(0, 3).map((p, i) => `
        <div class="card" style="text-align:center;${i === 0 ? 'border-color:rgba(255,215,0,0.4);' : ''}">
          <div style="font-size:28px;margin-bottom:8px;">${medals[i]}</div>
          <div class="player-number" style="margin:0 auto 8px;width:48px;height:48px;font-size:16px;">${p.number}</div>
          <div style="font-weight:700;color:var(--text);font-size:13px;">${p.nickname}</div>
          <div style="font-size:10px;color:var(--text-muted);margin-top:2px;">${p.position}</div>
          <div style="font-family:'Cinzel',serif;font-size:20px;color:var(--gold);font-weight:700;margin-top:8px;">${p.score}</div>
          <div style="font-size:9px;color:var(--text-dim);text-transform:uppercase;letter-spacing:1px;">pts</div>
          <div style="display:flex;justify-content:center;gap:10px;margin-top:8px;font-size:11px;color:var(--text-muted);">
            <span>⚽ ${p.goals||0}</span>
            <span>🅰️ ${p.assists||0}</span>
            <span>🎮 ${p.appearances||0}</span>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Full ranking -->
    <div class="card">
      <div class="card-title">📊 Classificação Completa</div>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${ranked.map((p, i) => `
          <div class="ranking-item">
            <div class="ranking-pos-num ${posClass[i] || ''}">${i + 1}</div>
            <div class="player-number" style="width:36px;height:36px;font-size:12px;">${p.number}</div>
            <div style="flex:1">
              <div style="font-weight:600;color:var(--text);font-size:13px;">${p.nickname}</div>
              <div style="font-size:10px;color:var(--text-muted)">${p.position}</div>
            </div>
            <div style="display:flex;gap:14px;text-align:center;">
              <div><div style="font-size:14px;font-weight:700;color:var(--gold)">${p.goals||0}</div><div style="font-size:9px;color:var(--text-dim)">Gols</div></div>
              <div><div style="font-size:14px;font-weight:700;color:var(--text)">${p.assists||0}</div><div style="font-size:9px;color:var(--text-dim)">Ass.</div></div>
              <div><div style="font-size:14px;font-weight:700;color:var(--text)">${p.appearances||0}</div><div style="font-size:9px;color:var(--text-dim)">JG</div></div>
              <div style="min-width:40px;text-align:right;"><div style="font-family:'Cinzel',serif;font-size:16px;font-weight:700;color:var(--gold)">${p.score}</div><div style="font-size:9px;color:var(--text-dim)">PTS</div></div>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:12px;padding-top:12px;border-top:1px solid rgba(201,168,76,0.08);font-size:11px;color:var(--text-dim);">
        Fórmula: Gol×5 + Assistência×3 + Partida×1 − AmarelO×2 − Vermelho×5
      </div>
    </div>
  `;
}
