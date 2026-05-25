// ===== APP ROUTER =====
import { loadData, saveData, supabase } from './data.js';
import { renderCalendar } from './modules/calendar.js';
import { renderLineup }   from './modules/lineup.js';
import { renderSummary }  from './modules/summary.js';
import { renderStats }    from './modules/stats.js';
import { renderTable }    from './modules/table.js';
import { renderH2H }      from './modules/h2h.js';
import { renderRanking }  from './modules/ranking.js';
import { renderSquad }    from './modules/squad.js';

const pages = {
  calendar: { render: renderCalendar },
  lineup:   { render: renderLineup   },
  summary:  { render: renderSummary  },
  stats:    { render: renderStats    },
  table:    { render: renderTable    },
  h2h:      { render: renderH2H      },
  ranking:  { render: renderRanking  },
  squad:    { render: renderSquad    },
};

let appData = null;

export function getData() { return appData; }
export function setData(d) { appData = d; saveData(d); }

function getHash() {
  const h = window.location.hash.replace('#', '');
  return h.split('?')[0] || 'calendar';
}

function navigate(page) {
  if (!pages[page]) page = 'calendar';

  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));

  const pageEl = document.getElementById(`page-${page}`);
  if (pageEl) {
    pageEl.classList.add('active');
    pageEl.innerHTML = '';
    pages[page].render(pageEl, appData, setData);
  }

  const navEl = document.querySelector(`.nav-item[data-page="${page}"]`);
  if (navEl) navEl.classList.add('active');

  document.getElementById('sidebar')?.classList.remove('open');
  document.querySelector('.overlay')?.classList.remove('active');
}

function renderStaffFooter() {
  const el = document.getElementById('staffFooter');
  if (!el || !appData.staff) return;
  el.innerHTML = `
    <div style="font-size:9px;text-transform:uppercase;letter-spacing:1px;color:var(--text-dim);margin-bottom:8px;">Comissão Técnica</div>
    ${appData.staff.map(s => `
      <div style="display:flex;align-items:center;gap:6px;padding:4px 0;">
        <span style="font-size:11px;">${s.role === 'Técnico' ? '📋' : s.role === 'Auxiliar' ? '🔧' : '🩺'}</span>
        <div>
          <div style="font-size:11px;color:var(--text);font-weight:600;">${s.name}</div>
          <div style="font-size:9px;color:var(--text-dim);">${s.role}</div>
        </div>
      </div>
    `).join('')}
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  const menuBtn = document.getElementById('menuBtn');
  const sidebar = document.getElementById('sidebar');
  menuBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
  });
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  });

  document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      window.location.hash = el.dataset.page;
    });
  });

  window.addEventListener('hashchange', () => navigate(getHash()));

  // Setup App Data
  async function initApp() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('app').style.display = 'block';
    appData = await loadData();
    renderStaffFooter();
    navigate(getHash());
  }

  // Auth Logic
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    initApp();
  } else {
    document.getElementById('loginScreen').style.display = 'flex';
  }

  const loginBtn = document.getElementById('loginBtn');
  const emailInput = document.getElementById('loginEmail');
  const passwordInput = document.getElementById('loginPassword');
  const loginError = document.getElementById('loginError');

  loginBtn.addEventListener('click', async () => {
    loginBtn.textContent = 'Carregando...';
    loginBtn.disabled = true;
    loginError.style.display = 'none';

    const { error } = await supabase.auth.signInWithPassword({
      email: emailInput.value.trim(),
      password: passwordInput.value
    });

    if (error) {
      loginError.textContent = 'E-mail ou senha incorretos.';
      loginError.style.display = 'block';
      loginBtn.textContent = 'ENTRAR';
      loginBtn.disabled = false;
    } else {
      initApp();
    }
  });
});
