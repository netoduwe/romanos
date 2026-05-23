// ===== TABLE MODULE =====
export function renderTable(el, data) {
  const table = [...data.leagueTable].sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    const sgA = a.gf - a.ga, sgB = b.gf - b.ga;
    if (sgB !== sgA) return sgB - sgA;
    return b.gf - a.gf;
  });

  el.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Tabela</h1>
      <p class="page-subtitle">Liga Série Prata — Classificação</p>
    </div>

    <div class="card">
      <div style="overflow-x:auto;">
        <table class="league-table" style="min-width:480px;">
          <thead>
            <tr>
              <th style="width:32px">#</th>
              <th style="text-align:left">Time</th>
              <th>P</th>
              <th>J</th>
              <th>V</th>
              <th>E</th>
              <th>D</th>
              <th>GF</th>
              <th>GC</th>
              <th>SG</th>
              <th>PTS</th>
            </tr>
          </thead>
          <tbody>
            ${table.map((team, i) => {
              const pos = i + 1;
              const sg = team.gf - team.ga;
              return `<tr class="${team.isRomanos ? 'romanos' : ''}">
                <td><span class="rank-pos ${pos <= 3 ? 'top3' : ''}">${pos}</span></td>
                <td>${team.isRomanos ? '⚔️ ' : ''}${team.team}</td>
                <td>${team.pts}</td>
                <td style="color:var(--text-muted)">${team.p}</td>
                <td style="color:#2ECC71">${team.w}</td>
                <td style="color:#F1C40F">${team.d}</td>
                <td style="color:#E74C3C">${team.l}</td>
                <td>${team.gf}</td>
                <td>${team.ga}</td>
                <td style="${sg > 0 ? 'color:#2ECC71' : sg < 0 ? 'color:#E74C3C' : ''}">${sg > 0 ? '+' : ''}${sg}</td>
                <td><strong style="color:var(--gold)">${team.pts}</strong></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>

    <div style="margin-top:12px;display:flex;gap:12px;font-size:11px;color:var(--text-muted);">
      <span>PTS = Pontos</span>
      <span>J = Jogos</span>
      <span>V/E/D = Vitória/Empate/Derrota</span>
      <span>SG = Saldo de Gols</span>
    </div>
  `;
}
