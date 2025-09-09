const KEY = 'classflow:data:v3';
const LEGACY_KEYS = ['classflow:data:v2','classflow:data:v1','classflow:data'];

const DEFAULT_TYPES = [
  { value: 'lesson', label: 'Lesson', color: '#22c55e' },
  { value: 'club',   label: 'Club',   color: '#3b82f6' },
  { value: 'extra',  label: 'Extra',  color: '#f59e0b' },
];

function mondayOf(date = new Date()){
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0,0,0,0);
  return d;
}
function scaffoldWeek(startMonday){
  const m = new Date(startMonday);
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(m);
    d.setDate(m.getDate() + i);
    return { date: d.toISOString().slice(0,10), lessons: [] };
  });
}

function migrateToV3(d) {
  if (!d || typeof d !== 'object') return null;

  // Базовые поля
  if (!Array.isArray(d.types) || d.types.length === 0) d.types = DEFAULT_TYPES.slice();
  if (!Array.isArray(d.teachers)) d.teachers = [];
  if (!d.settings || typeof d.settings !== 'object') d.settings = { schoolLevel: 'primary' };
  if (!('schoolLevel' in d.settings)) d.settings.schoolLevel = 'primary';

  // Если уже v3 (есть schedules/groups)
  if (d.schedules && d.groups && d.activeGroupId) {
    return d;
  }

  // Легаси: был один класс и days на корне
  const legacyGroup = d.group || '5A';
  const weekStart = d.weekStart || mondayOf().toISOString().slice(0,10);
  const days = Array.isArray(d.days) ? d.days : scaffoldWeek(mondayOf());

  const groups = [{ id: legacyGroup, name: legacyGroup }];
  const schedules = {
    [legacyGroup]: { weekStart, days }
  };

  const v3 = {
    groups,
    activeGroupId: legacyGroup,
    schedules,
    types: d.types,
    teachers: d.teachers,
    settings: d.settings,
  };
  return v3;
}

export function loadData() {
  // v3
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return migrateToV3(parsed);
    }
  } catch {}

  // legacy keys
  for (const k of LEGACY_KEYS) {
    try {
      const raw = localStorage.getItem(k);
      if (raw) {
        const parsed = JSON.parse(raw);
        const migrated = migrateToV3(parsed);
        if (migrated) {
          saveData(migrated);
          return migrated;
        }
      }
    } catch {}
  }

  return null;
}

export function saveData(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
}

export function initData() {
  const m = mondayOf();
  const weekStart = m.toISOString().slice(0,10);
  const groupId = '5A';
  return {
    groups: [{ id: groupId, name: groupId }],
    activeGroupId: groupId,
    schedules: {
      [groupId]: {
        weekStart,
        days: scaffoldWeek(m),
      }
    },
    types: DEFAULT_TYPES.slice(),
    teachers: [{ id: 't1', name: 'Ivanova A.A.', subject: 'Math', groups: [groupId] }],
    settings: { schoolLevel: 'primary' },
  };
}

/** утилиты */
export function ensureGroupSchedule(data, groupId){
  if (!data.schedules[groupId]) {
    const m = mondayOf();
    data.schedules[groupId] = {
      weekStart: m.toISOString().slice(0,10),
      days: scaffoldWeek(m),
    };
  }
  return data;
}

export function resetData() {
  try { localStorage.removeItem(KEY); } catch {}
}
