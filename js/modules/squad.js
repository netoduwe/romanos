// ===== SQUAD & PLAYER MANAGEMENT MODULE =====
import { getPlayersByGroup, addPlayer } from '../data.js';

const GROUP_ORDER = ['Goleiros', 'Zagueiros', 'Alas', 'Meio-Campo', 'Atacantes'];
const GROUP_ICONS = {
  'Goleiros':    '🧤',
  'Zagueiros':   '🛡️',
  'Alas':        '⚡',
  'Meio-Campo':  '🎯',
  'Atacantes':   '⚽',
};

export function renderSquad(el, data, setData) {
  const groups = getPlayersByGroup(data);

  el.innerHTML = `
    <div class="page-header">
      <div style="display:flex;align-items:center;justify-content:space-between;width:100%;flex-wrap:wrap;gap:10px;">
        <div>
          <h1 class="page-title">Elenco</h1>
          <p class="page-subtitle">Romanos FC · ${data.players.length} atletas cadastrados</p>
        </div>
        <button class="btn btn-primary" id="addPlayerBtn">➕ Novo Atleta</button>
      </div>
    </div>

    <!-- Comissão Técnica -->
    <div class="card" style="margin-bottom:24px;border-color:rgba(201,168,76,0.25);">
      <div class="card-title">🎽 Comissão Técnica</div>
      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        ${data.staff.map(s => `
          <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:var(--dark-3);border-radius:var(--radius);flex:1;min-width:140px;">
            <div style="width:36px;height:36px;border-radius:8px;background:linear-gradient(135deg,var(--wine),var(--wine-deep));border:1px solid rgba(201,168,76,0.2);display:flex;align-items:center;justify-content:center;font-size:16px;">
              ${s.role === 'Técnico' ? '📋' : s.role === 'Auxiliar' ? '🔧' : '🩺'}
            </div>
            <div>
              <div style="font-weight:700;font-size:13px;color:var(--text)">${s.name}</div>
              <div style="font-size:10px;color:var(--gold);text-transform:uppercase;letter-spacing:0.5px">${s.role}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Elenco por posição -->
    <div style="display:flex;flex-direction:column;gap:20px;">
      ${GROUP_ORDER.map(group => {
        const list = groups[group] || [];
        return `
          <div>
            <div class="section-header" style="margin-bottom:10px;">
              <span class="section-title">${GROUP_ICONS[group]} ${group}</span>
              <span style="font-size:11px;color:var(--text-muted)">${list.length} atleta${list.length !== 1 ? 's' : ''}</span>
            </div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">
              ${list.length ? list.map(p => `
                <div class="player-card" style="display:flex;align-items:center;gap:10px;">
                  <div class="player-number">${p.number}</div>
                  <div>
                    <div class="player-name">${p.nickname}</div>
                    <div class="player-pos" style="font-size:10px">${p.name !== p.nickname ? p.name : ''}</div>
                  </div>
                </div>
              `).join('') : '<div style="font-size:11px;color:var(--text-dim);padding:8px;">Nenhum jogador cadastrado.</div>'}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;

  // Bind Add Player Button
  document.getElementById('addPlayerBtn').addEventListener('click', () => {
    showAddPlayerModal(el, data, setData);
  });
}

function showAddPlayerModal(pageEl, data, setData) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop open';
  backdrop.innerHTML = `
    <div class="modal">
      <div class="modal-title">➕ Cadastrar Novo Atleta</div>
      <div class="form-group">
        <label class="form-label">Número da Camisa</label>
        <input type="number" class="form-input" id="pNumber" placeholder="Ex: 99" min="1" max="99">
      </div>
      <div class="form-group">
        <label class="form-label">Nome Completo</label>
        <input type="text" class="form-input" id="pName" placeholder="Ex: Thiago Cristofer">
      </div>
      <div class="form-group">
        <label class="form-label">Apelido (como aparece no app)</label>
        <input type="text" class="form-input" id="pNickname" placeholder="Ex: Miojo">
      </div>
      <div class="form-group">
        <label class="form-label">Posição principal</label>
        <select class="form-select" id="pPosition">
          <option value="Goleiro">Goleiro</option>
          <option value="Zagueiro">Zagueiro</option>
          <option value="Ala">Ala</option>
          <option value="Meio-Campo">Meio-Campo</option>
          <option value="Atacante">Atacante</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Grupo tático</label>
        <select class="form-select" id="pGroup">
          <option value="Goleiros">Goleiros</option>
          <option value="Zagueiros">Zagueiros</option>
          <option value="Alas">Alas</option>
          <option value="Meio-Campo">Meio-Campo</option>
          <option value="Atacantes">Atacantes</option>
        </select>
      </div>
      <div class="modal-footer">
        <button class="btn btn-ghost" id="cancelAddPlayer">Cancelar</button>
        <button class="btn btn-primary" id="confirmAddPlayer">Salvar Atleta</button>
      </div>
    </div>
  `;
  document.body.appendChild(backdrop);

  backdrop.querySelector('#cancelAddPlayer').addEventListener('click', () => backdrop.remove());
  backdrop.querySelector('#confirmAddPlayer').addEventListener('click', () => {
    const number = backdrop.querySelector('#pNumber').value.trim();
    const name = backdrop.querySelector('#pName').value.trim();
    const nickname = backdrop.querySelector('#pNickname').value.trim();
    const position = backdrop.querySelector('#pPosition').value;
    const group = backdrop.querySelector('#pGroup').value;

    if (!number || !name) {
      alert('Número e Nome Completo são obrigatórios!');
      return;
    }

    // Check if number already taken
    if (data.players.some(p => p.number == parseInt(number))) {
      alert(`O número ${number} já está sendo usado por outro atleta!`);
      return;
    }

    const updatedData = addPlayer(data, { number, name, nickname, position, group });
    setData(updatedData);
    backdrop.remove();
    renderSquad(pageEl, updatedData, setData);
  });
}
