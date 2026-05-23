// ===== CALENDAR MODULE =====
import { getMatchResult, formatDate } from '../data.js';

export function renderCalendar(el, data) {
  const finished = data.matches.filter(m => m.status === 'finished').reverse();
  const upcoming = data.matches.filter(m => m.status === 'upcoming');
  const next = upcoming[0];

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:10px;">
        <div>
          <h1 class="page-title">Calendário</h1>
          <p class="page-subtitle">Série Prata 2026 — Liga BC · Grupo A</p>
        </div>
        <a href="${data.leagueUrl}" target="_blank" class="btn btn-ghost" style="font-size:11px;">
          🌐 Liga Oficial
        </a>
      </div>
    </div>

    ${next ? `
    <div class="card" style="margin-bottom:24px; border-color:rgba(201,168,76,0.35); background: linear-gradient(135deg, rgba(107,15,26,0.25), var(--dark-2));">
      <div class="card-title">⚔️ Próximo Jogo</div>
      ${matchCard(next, true)}
    </div>` : ''}

    <div style="margin-bottom:24px;">
      <div class="section-header">
        <span class="section-title">Todos os Jogos — Fase de Grupos</span>
        <span style="font-size:11px;color:var(--text-muted)">${upcoming.length} jogos</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${upcoming.map((m, i) => matchCard(m, false, i + 1)).join('')}
      </div>
    </div>

    ${finished.length ? `
    <div>
      <div class="section-header">
        <span class="section-title">Jogos Realizados</span>
        <span style="font-size:11px;color:var(--text-muted)">${finished.length} jogos</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        ${finished.map(m => matchCard(m, false)).join('')}
      </div>
    </div>` : ''}
  `;

  el.querySelectorAll('.match-card[data-id]').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      const match = data.matches.find(m => m.id == id);
      if (!match) return;
      if (match.status === 'finished') {
        window.location.hash = `summary?id=${id}`;
      } else {
        window.location.hash = `lineup?id=${id}`;
      }
    });
  });
}

function matchCard(match, isNext, round) {
  const d = formatDate(match.date);
  const result = getMatchResult(match);
  const scoreColor = result === 'win' ? '#2ECC71' : result === 'loss' ? '#E74C3C' : '#F1C40F';
  const badgeMap = { win: 'badge-win', loss: 'badge-loss', draw: 'badge-draw' };

  return `
    <div class="match-card ${isNext ? 'next' : ''}" data-id="${match.id}" style="cursor:pointer">
      <div class="match-date-block">
        ${d.day !== '?' ? `<div class="match-day">${d.day}</div><div class="match-month">${d.month}</div>` : `<div style="font-size:10px;color:var(--text-dim);text-align:center">A<br>DEF.</div>`}
      </div>
      <div class="match-divider"></div>
      <div class="match-info">
        <div class="match-teams">
          ${match.isHome ? '<span>Romanos</span> × ' + match.opponent : match.opponent + ' × <span>Romanos</span>'}
        </div>
        <div class="match-meta">
          ${round ? `<span style="color:var(--gold-dim);font-size:10px;font-weight:700;">R${round}</span> · ` : ''}
          ${match.isHome ? '🏠' : '✈️'} ${match.location}${match.time ? ' · ' + match.time + 'h' : ''}
        </div>
      </div>
      ${match.score
        ? `<div class="match-score" style="color:${scoreColor}">${match.score.romanos}–${match.score.opponent}</div>
           <span class="badge ${badgeMap[result] || ''}">${result === 'win' ? 'V' : result === 'loss' ? 'D' : 'E'}</span>`
        : `<span class="badge badge-upcoming">Em breve</span>`
      }
    </div>
  `;
}
