import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function TypesManager({ types, onChange }){
  const { t } = useTranslation();
  const [local, setLocal] = useState(types);

  function add(){
    setLocal([...local, { value: `type${local.length+1}`, label: t('ui.newType'), color: '#a3a3a3' }]);
  }
  function update(i, patch){
    const copy = [...local];
    copy[i] = { ...copy[i], ...patch };
    setLocal(copy);
  }
  function remove(i){
    const copy = [...local];
    copy.splice(i,1);
    setLocal(copy);
  }
  function save(){ onChange(local); }

  return (
    <div className="rounded-xl border border-default p-4 bg-card/60 grid gap-3">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{t('ui.lessonTypes')}</div>
        <div className="flex gap-2">
          <button onClick={add} className="text-xs px-3 py-1 rounded border border-default hover:bg-white/5">{t('ui.add')}</button>
          <button onClick={save} className="text-xs px-3 py-1 rounded bg-primary hover:opacity-90">{t('ui.save')}</button>
        </div>
      </div>

      <div className="grid gap-2">
        {local.map((item, i) => (
          <div key={i} className="grid md:grid-cols-5 gap-2 items-center">
            <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default md:col-span-2" placeholder={t('ui.label')}
                   value={item.label} onChange={e=>update(i,{label:e.target.value})}/>
            <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" placeholder={t('ui.valueId')}
                   value={item.value} onChange={e=>update(i,{value:e.target.value})}/>
            <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" type="color"
                   value={item.color} onChange={e=>update(i,{color:e.target.value})}/>
            <button onClick={()=>remove(i)} className="text-xs px-3 py-2 rounded border border-red-400/40 text-red-300 hover:bg-red-400/10">
              {t('ui.delete')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
