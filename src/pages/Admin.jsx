import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthGate from '../components/AuthGate.jsx';
import { loadData, saveData, initData, ensureGroupSchedule } from '../lib/storage';

export default function Admin(){
  return (
    <AuthGate need="director">
      <AdminInner />
    </AuthGate>
  );
}

function AdminInner(){
  const { t } = useTranslation();
  const [data, setData] = useState(() => {
    const loaded = loadData() || initData();
    if (!loaded.settings) loaded.settings = { schoolLevel: 'primary' };
    if (!('schoolLevel' in loaded.settings)) loaded.settings.schoolLevel = 'primary';
    return loaded;
  });
  useEffect(()=> saveData(data), [data]);

  /* ---------- Classes (Groups) ---------- */
  const [newClass, setNewClass] = useState('');
  function addClass(){
    const id = (newClass || '').trim();
    if (!id) return;
    setData(prev => {
      const copy = structuredClone(prev);
      if (!copy.groups.find(g=>g.id===id)) {
        copy.groups.push({ id, name: id });
        ensureGroupSchedule(copy, id);
      }
      if (!copy.activeGroupId) copy.activeGroupId = id;
      return copy;
    });
    setNewClass('');
  }
  function removeClass(id){
    setData(prev => {
      if (prev.groups.length <= 1) return prev; // не удаляем последний
      const copy = structuredClone(prev);
      copy.groups = copy.groups.filter(g=>g.id!==id);
      delete copy.schedules[id];
      if (copy.activeGroupId === id) {
        copy.activeGroupId = copy.groups[0]?.id || '';
      }
      return copy;
    });
  }
  function setDefaultClass(id){
    setData(prev => ({ ...prev, activeGroupId: id }));
  }

  /* ---------- School Level ---------- */
  const [level, setLevel] = useState(data.settings.schoolLevel);
  function saveLevel(){
    setData(prev => ({ ...prev, settings: { ...prev.settings, schoolLevel: level }}));
  }

  /* ---------- Teachers ---------- */
  const [teacher, setTeacher] = useState({ name:'', subject:'', groups:'' });
  function addTeacher(){
    if(!teacher.name) return;
    const id = `t_${Date.now()}`;
    const entry = {
      id,
      name: teacher.name,
      subject: teacher.subject,
      groups: teacher.groups.split(',').map(s=>s.trim()).filter(Boolean)
    };
    setData(prev => ({ ...prev, teachers: [...(prev.teachers || []), entry] }));
    setTeacher({ name:'', subject:'', groups:'' });
  }
  function removeTeacher(id){
    setData(prev => ({ ...prev, teachers: (prev.teachers || []).filter(x=>x.id!==id) }));
  }

  /* ---------- Lesson Types ---------- */
  const [types, setTypes] = useState(data.types || []);
  function addType(){
    setTypes([...types, { value:`type${types.length+1}`, label: t('ui.newType') || 'New Type', color:'#a3a3a3' }]);
  }
  function updateType(i, patch){
    const copy = [...types];
    copy[i] = { ...copy[i], ...patch };
    setTypes(copy);
  }
  function removeType(i){
    const copy = [...types];
    copy.splice(i,1);
    setTypes(copy);
  }
  function saveTypes(){
    setData(prev => ({ ...prev, types }));
  }

  const fmtGroups = (g)=> (g && g.length ? g.join(', ') : '-');

  return (
    <div className="grid gap-8">
      <div className="text-2xl font-semibold">Admin</div>

      {/* Classes */}
      <section className="rounded-xl border border-default p-4 bg-card/60 grid gap-4">
        <div className="font-semibold">Classes</div>
        <div className="grid md:grid-cols-4 gap-2">
          <input
            className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default"
            placeholder="Class name (e.g., 1A, 2Б)"
            value={newClass}
            onChange={e=>setNewClass(e.target.value)}
          />
          <button onClick={addClass} className="px-3 py-2 rounded bg-primary">Add</button>
        </div>

        <div className="grid gap-2">
          {data.groups.map(g => (
            <div key={g.id} className="flex items-center justify-between rounded-lg border border-default p-3">
              <div className="text-sm">
                <div className="font-medium">{g.name}</div>
                <div className="text-muted">Default: {data.activeGroupId === g.id ? 'yes' : 'no'}</div>
              </div>
              <div className="flex gap-2">
                {data.activeGroupId !== g.id && (
                  <button onClick={()=>setDefaultClass(g.id)} className="text-xs px-3 py-1 rounded border border-default">Set default</button>
                )}
                {data.groups.length > 1 && (
                  <button onClick={()=>removeClass(g.id)}
                          className="text-xs px-3 py-1 rounded border border-red-400/40 text-red-300 hover:bg-red-400/10">
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* School level */}
      <section className="rounded-xl border border-default p-4 bg-card/60 grid gap-3">
        <div className="font-semibold">{t('ui.schoolLevel')}</div>
        <div className="flex gap-3 items-center">
          <select value={level} onChange={e=>setLevel(e.target.value)}
                  className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default">
            <option value="primary">Primary</option>
            <option value="high">High</option>
          </select>
          <button onClick={saveLevel} className="px-3 py-2 rounded bg-primary">{t('ui.save')}</button>
        </div>
        <div className="text-sm text-muted">{t('ui.current')}: <b>{data.settings?.schoolLevel ?? 'primary'}</b></div>
      </section>

      {/* Teachers */}
      <section className="rounded-xl border border-default p-4 bg-card/60 grid gap-4">
        <div className="font-semibold">{t('ui.teachers')}</div>

        <div className="grid md:grid-cols-4 gap-2">
          <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" placeholder={t('ui.name')}
                 value={teacher.name} onChange={e=>setTeacher({...teacher, name:e.target.value})}/>
          <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" placeholder={t('ui.subject')}
                 value={teacher.subject} onChange={e=>setTeacher({...teacher, subject:e.target.value})}/>
          <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" placeholder={t('ui.groups')}
                 value={teacher.groups} onChange={e=>setTeacher({...teacher, groups:e.target.value})}/>
          <button onClick={addTeacher} className="px-3 py-2 rounded bg-primary">{t('ui.add')}</button>
        </div>

        <div className="grid gap-2">
          {data.teachers?.length ? data.teachers.map(tch => (
            <div key={tch.id} className="flex items-center justify-between rounded-lg border border-default p-3">
              <div className="text-sm">
                <div className="font-medium">{tch.name} <span className="text-muted">· {tch.subject || '-'}</span></div>
                <div className="text-muted">Groups: {fmtGroups(tch.groups)}</div>
              </div>
              <button onClick={()=>removeTeacher(tch.id)}
                      className="text-xs px-3 py-1 rounded border border-red-400/40 text-red-300 hover:bg-red-400/10">
                {t('ui.delete')}
              </button>
            </div>
          )) : <div className="text-muted text-sm">No teachers yet</div>}
        </div>
      </section>

      {/* Lesson types */}
      <section className="rounded-xl border border-default p-4 bg-card/60 grid gap-3">
        <div className="flex items-center justify-between">
          <div className="font-semibold">{t('ui.lessonTypes')}</div>
          <div className="flex gap-2">
            <button onClick={addType} className="text-xs px-3 py-1 rounded border border-default hover:bg-white/5">{t('ui.add')}</button>
            <button onClick={saveTypes} className="text-xs px-3 py-1 rounded bg-primary">{t('ui.save')}</button>
          </div>
        </div>
        <div className="grid gap-2">
          {types.map((it,i)=>(
            <div key={i} className="grid md:grid-cols-5 gap-2 items-center">
              <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default md:col-span-2" placeholder={t('ui.label')}
                     value={it.label} onChange={e=>updateType(i,{label:e.target.value})}/>
              <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" placeholder={t('ui.valueId')}
                     value={it.value} onChange={e=>updateType(i,{value:e.target.value})}/>
              <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" type="color"
                     value={it.color} onChange={e=>updateType(i,{color:e.target.value})}/>
              <button onClick={()=>removeType(i)} className="text-xs px-3 py-2 rounded border border-red-400/40 text-red-300 hover:bg-red-400/10">
                {t('ui.delete')}
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
