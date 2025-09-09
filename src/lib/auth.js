const AUTH_KEY = 'classflow:auth';

export function getAuth() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : { role: 'viewer' }; // viewer | teacher | director
  } catch {
    return { role: 'viewer' };
  }
}
export function setAuth(next) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(next));
}

export function requireRole(needRole) {
  const order = { viewer: 0, teacher: 1, director: 2 };
  const cur = getAuth().role;
  return order[cur] >= order[needRole];
}
