// ===== DATA STORE — Romanos Match Center =====
// Liga: Série Prata 2026 — Liga BC
// Fonte da verdade: localStorage + dados iniciais

const supabaseUrl = 'https://mdttowcgbicevqlcnhit.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kdHRvd2NnYmljZXZxbGNuaGl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NTI4MzksImV4cCI6MjA5NTEyODgzOX0.FOsUdHvbEMyXpfylziM8koxnTzj23FcKunVVz_fZ-nc';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);
const INITIAL_DATA = {
  // ===== COMISSÃO TÉCNICA =====
  staff: [
    { role: 'Técnico',          name: 'Gustavo Caureo' },
    { role: 'Auxiliar',         name: 'Rick' },
    { role: 'Fisioterapeuta',   name: 'Derick' },
  ],

  // ===== ELENCO =====
  players: [
    { id: 1,  number: 1,  name: 'Guilherme Bueno',   nickname: 'Bueno',    position: 'Goleiro',       group: 'Goleiros' },
    { id: 12, number: 12, name: 'Vinicius',           nickname: 'Vinicius', position: 'Goleiro',       group: 'Goleiros' },
    { id: 3,  number: 3,  name: 'Athos',              nickname: 'Athos',    position: 'Zagueiro',      group: 'Zagueiros' },
    { id: 4,  number: 4,  name: 'Kallebi',            nickname: 'Kallebi',  position: 'Zagueiro',      group: 'Zagueiros' },
    { id: 5,  number: 5,  name: 'Otávio',             nickname: 'Otávio',   position: 'Zagueiro',      group: 'Zagueiros' },
    { id: 6,  number: 6,  name: 'Airam',              nickname: 'Airam',    position: 'Ala',           group: 'Alas' },
    { id: 7,  number: 7,  name: 'Kevin',              nickname: 'Kevin',    position: 'Ala',           group: 'Alas' },
    { id: 8,  number: 8,  name: 'Foguete',            nickname: 'Foguete',  position: 'Ala',           group: 'Alas' },
    { id: 11, number: 11, name: 'Igor Yoshida',        nickname: 'Yoshida',  position: 'Ala',           group: 'Alas' },
    { id: 20, number: 20, name: 'Jair Barrios',        nickname: 'Jair',     position: 'Ala',           group: 'Alas' },
    { id: 30, number: 30, name: 'Gabriel Araújo',      nickname: 'G.Araújo', position: 'Ala',           group: 'Alas' },
    { id: 10, number: 10, name: 'Henrique',            nickname: 'Henrique', position: 'Meio-Campo',    group: 'Meio-Campo' },
    { id: 17, number: 17, name: 'Caetano',             nickname: 'Caetano',  position: 'Meio-Campo',    group: 'Meio-Campo' },
    { id: 88, number: 88, name: 'Neto',                nickname: 'Neto',     position: 'Meio-Campo',    group: 'Meio-Campo' },
    { id: 9,  number: 9,  name: 'Thiago Miojo',        nickname: 'Miojo',    position: 'Atacante',      group: 'Atacantes' },
    { id: 75, number: 75, name: 'Gabriel Lunelli',     nickname: 'Lunelli',  position: 'Atacante',      group: 'Atacantes' },
  ],

  // ===== JOGOS DO ROMANOS — GRUPO A =====
  matches: [
    {
      id: 1,
      date: '2026-05-10',
      time: '11:00',
      opponent: 'Sparta FC',
      location: 'Liga BC — Campo Oficial',
      isHome: true,
      status: 'finished',
      score: { romanos: 4, opponent: 2 },
      events: [
        { type: 'goal', minute: 15, playerId: 9, detail: 'Chute cruzado' },
        { type: 'goal', minute: 28, playerId: 75, detail: 'Passe de Henrique' },
        { type: 'assist', minute: 28, playerId: 10, detail: '' },
        { type: 'goal', minute: 40, playerId: 9, detail: 'Jogada ensaiada de escanteio' },
        { type: 'assist', minute: 40, playerId: 11, detail: '' },
      ],
      lineup: [1, 3, 4, 11, 20, 10, 9],
      lineupSpots: { 0: 1, 1: 3, 2: 4, 3: 11, 4: 20, 5: 10, 6: 9 },
      lineupCoords: {},
      formation: '2-3-1',
      leagueMatchId: '456838',
      leagueRound: 1,
      plays: [
        { name: 'Escanteio Curto Yoshida', type: 'planned', status: 'worked', description: 'Yoshida rola curto, Henrique cruza na segunda trave para Miojo.' },
        { name: 'Saída Rápida 2-3-1', type: 'planned', status: 'worked', description: 'Goleiro Bueno lança direto na ala para infiltração rápida do Jair.' }
      ],
      spyReport: {
        strengths: ['Contra-ataque rápido do ala 11', 'Jogada aérea forte'],
        weaknesses: ['Laterais deixam corredor livre', 'Volante lento na cobertura'],
        system: '3-2-1 defensivo'
      }
    },
    {
      id: 2,
      date: '2026-06-07',
      time: '11:00',
      opponent: 'Garra FC',
      location: 'Liga BC — Campo Oficial',
      isHome: true,
      status: 'upcoming',
      score: null,
      events: [],
      lineup: [1, 3, 4, 6, 11, 10, 9],
      lineupSpots: { 0: 1, 1: 3, 2: 4, 3: 6, 4: 11, 5: 10, 6: 9 },
      lineupCoords: {},
      formation: '2-3-1',
      leagueMatchId: '456843',
      leagueRound: 2,
      plays: [
        { name: 'Falta Direta Henrique', type: 'planned', status: 'pending', description: 'Henrique chuta forte por fora da barreira no canto esquerdo.' },
        { name: 'Pivot com Miojo', type: 'planned', status: 'pending', description: 'Miojo recebe de costas, escora para batida vindo de trás do Neto.' }
      ],
      spyReport: {
        strengths: ['Ala 8 chuta muito de média distância', 'Saída de bola rápida e compacta'],
        weaknesses: ['Goleiro rebate bola rasteira no centro', 'Zaga bate cabeça em bola cruzada aérea'],
        system: '2-3-1 ofensivo'
      }
    },
    {
      id: 3,
      date: null,
      time: null,
      opponent: 'Red Bull Camboriú',
      location: 'Liga BC — Campo Oficial',
      isHome: false,
      status: 'upcoming',
      score: null,
      events: [],
      lineup: [],
      lineupSpots: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
      lineupCoords: {},
      formation: '2-3-1',
      leagueMatchId: '456848',
      leagueRound: 3,
      plays: [],
      spyReport: { strengths: [], weaknesses: [], system: '' }
    },
    {
      id: 4,
      date: null,
      time: null,
      opponent: 'Nenes Fut7',
      location: 'Liga BC — Campo Oficial',
      isHome: true,
      status: 'upcoming',
      score: null,
      events: [],
      lineup: [],
      lineupSpots: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
      lineupCoords: {},
      formation: '2-3-1',
      leagueMatchId: '456853',
      leagueRound: 4,
      plays: [],
      spyReport: { strengths: [], weaknesses: [], system: '' }
    },
    {
      id: 5,
      date: null,
      time: null,
      opponent: 'Bandoleiros',
      location: 'Liga BC — Campo Oficial',
      isHome: true,
      status: 'upcoming',
      score: null,
      events: [],
      lineup: [],
      lineupSpots: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
      lineupCoords: {},
      formation: '2-3-1',
      leagueMatchId: '456857',
      leagueRound: 5,
      plays: [],
      spyReport: { strengths: [], weaknesses: [], system: '' }
    },
    {
      id: 6,
      date: null,
      time: null,
      opponent: 'Unidos da Brava',
      location: 'Liga BC — Campo Oficial',
      isHome: false,
      status: 'upcoming',
      score: null,
      events: [],
      lineup: [],
      lineupSpots: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
      lineupCoords: {},
      formation: '2-3-1',
      leagueMatchId: '456860',
      leagueRound: 6,
      plays: [],
      spyReport: { strengths: [], weaknesses: [], system: '' }
    },
    {
      id: 7,
      date: null,
      time: null,
      opponent: 'Paris BC',
      location: 'Liga BC — Campo Oficial',
      isHome: true,
      status: 'upcoming',
      score: null,
      events: [],
      lineup: [],
      lineupSpots: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
      lineupCoords: {},
      formation: '2-3-1',
      leagueMatchId: '456863',
      leagueRound: 7,
      plays: [],
      spyReport: { strengths: [], weaknesses: [], system: '' }
    },
  ],

  // ===== TABELA GRUPO A =====
  leagueTable: [
    { team: 'Garra FC',          p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { team: 'Paris BC',          p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { team: 'Bandoleiros',       p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { team: 'Nenes Fut7',        p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { team: 'Romanos Fut7',      p: 1, w: 1, d: 0, l: 0, gf: 4, ga: 2, pts: 3, isRomanos: true },
    { team: 'Red Bull Camboriú', p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
    { team: 'Sparta FC',         p: 1, w: 0, d: 0, l: 1, gf: 2, ga: 4, pts: 0 },
    { team: 'Unidos da Brava',   p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0 },
  ],

  leagueUrl: 'https://ligascfutebol7.com.br/campeonatos/11134-serie-prata-2026',
};

// --- LOAD / SAVE ---
export async function loadData() {
  try {
    const { data, error } = await supabase
      .from('romanos_data')
      .select('data')
      .eq('id', 1)
      .single();

    if (error || !data) {
      console.log('No data found in Supabase, inserting INITIAL_DATA...', error);
      const initialCopy = JSON.parse(JSON.stringify(INITIAL_DATA));
      await supabase.from('romanos_data').insert([{ id: 1, data: initialCopy }]);
      return initialCopy;
    }
    return data.data;
  } catch (e) {
    console.error('Error loading data from Supabase, falling back to initial data', e);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

export async function saveData(data) {
  try {
    await supabase
      .from('romanos_data')
      .update({ data: data, updated_at: new Date() })
      .eq('id', 1);
  } catch (e) {
    console.error('Error saving to Supabase', e);
  }
}

export async function resetData() {
  try {
    const initialCopy = JSON.parse(JSON.stringify(INITIAL_DATA));
    await supabase
      .from('romanos_data')
      .update({ data: initialCopy, updated_at: new Date() })
      .eq('id', 1);
    return initialCopy;
  } catch (e) {
    console.error('Error resetting Supabase data', e);
    return JSON.parse(JSON.stringify(INITIAL_DATA));
  }
}

// --- HELPERS ---
export function getPlayerById(data, id) {
  return data.players.find(p => p.id === id);
}

export function getMatchResult(match) {
  if (!match.score) return null;
  if (match.score.romanos > match.score.opponent) return 'win';
  if (match.score.romanos < match.score.opponent) return 'loss';
  return 'draw';
}

export function computePlayerStats(data) {
  const stats = {};
  data.players.forEach(p => {
    stats[p.id] = { goals: 0, assists: 0, yellowCards: 0, redCards: 0, appearances: 0 };
  });
  data.matches.filter(m => m.status === 'finished').forEach(match => {
    match.lineup.forEach(pid => {
      if (stats[pid]) stats[pid].appearances++;
    });
    match.events.forEach(e => {
      if (!stats[e.playerId]) return;
      if (e.type === 'goal')   stats[e.playerId].goals++;
      if (e.type === 'assist') stats[e.playerId].assists++;
      if (e.type === 'yellow') stats[e.playerId].yellowCards++;
      if (e.type === 'red')    stats[e.playerId].redCards++;
    });
  });
  return stats;
}

export function getSuspended(data) {
  const stats = computePlayerStats(data);
  return data.players.filter(p => {
    const s = stats[p.id];
    return s && (s.redCards > 0 || s.yellowCards >= 2);
  });
}

export function formatDate(dateStr) {
  if (!dateStr) return { day: '?', month: '???', year: '?', full: 'A definir' };
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return { day: d, month: months[parseInt(m)-1], year: y, full: `${d}/${m}/${y}` };
}

export function getPlayersByGroup(data) {
  const groups = {};
  data.players.forEach(p => {
    if (!groups[p.group]) groups[p.group] = [];
    groups[p.group].push(p);
  });
  return groups;
}

export function addPlayer(data, p) {
  const newId = data.players.reduce((max, player) => Math.max(max, player.id), 0) + 1;
  const player = {
    id: newId,
    number: parseInt(p.number),
    name: p.name,
    nickname: p.nickname || p.name,
    position: p.position,
    group: p.group
  };
  data.players.push(player);
  return data;
}
