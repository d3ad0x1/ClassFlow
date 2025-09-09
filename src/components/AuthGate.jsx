import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getAuth, setAuth, requireRole } from '../lib/auth';

const DEFAULT_PINS = {
  director: '4321', // поменяй!
  teacher: '1111'   // если нужно
};

export default function AuthGate({ need = 'director', children }) {
  const { t } = useTranslation();
  const ok = requireRole(need);
  const [pin, setPin] = useState('');
  const [err, setErr] = useState('');

  if (ok) return children;

  function login(role) {
    const expected = DEFAULT_PINS[role];
    if (pin === expected) {
      setAuth({ role });
      window.location.reload();
    } else {
      setErr('Wrong PIN');
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 rounded-xl border border-default p-6 bg-card/60">
      <div className="text-lg font-semibold mb-2">{t('app.restricted')}</div>
      <div className="text-sm text-muted mb-4">{t('app.enterPin')}</div>
      <input
        type="password"
        value={pin}
        onChange={e=>setPin(e.target.value)}
        placeholder="PIN"
        className="w-full px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default mb-3"
      />
      {err && <div className="text-red-400 text-sm mb-2">{err}</div>}
      <div className="flex gap-2">
        <button onClick={()=>login('director')} className="px-3 py-2 rounded bg-primary">Director</button>
        <button onClick={()=>login('teacher')} className="px-3 py-2 rounded border border-default">Teacher</button>
      </div>
    </div>
  );
}
