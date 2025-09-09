import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LessonForm({ types, onSubmit }) {
  const { t } = useTranslation();
  const [state, setState] = useState({
    title: '', teacher: '', room: '', type: types?.[0]?.value || 'lesson', start: '', end: ''
  });

  function handleSubmit(e){
    e.preventDefault();
    if(!state.title || !state.start || !state.end) return;
    onSubmit({ ...state });
    setState(s => ({ ...s, title:'', teacher:'', room:'', start:'', end:'' }));
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-default p-4 bg-card/60 grid md:grid-cols-3 gap-3">
      <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" placeholder={t('ui.titlePh')}
             value={state.title} onChange={e=>setState({...state, title:e.target.value})}/>
      <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" placeholder={t('ui.teacherPh')}
             value={state.teacher} onChange={e=>setState({...state, teacher:e.target.value})}/>
      <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" placeholder={t('ui.roomPh')}
             value={state.room} onChange={e=>setState({...state, room:e.target.value})}/>

      <select className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default"
              value={state.type} onChange={e=>setState({...state, type:e.target.value})}>
        {types.map(ti => <option key={ti.value} value={ti.value}>{ti.label}</option>)}
      </select>

      <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" type="time"
             aria-label={t('ui.start')}
             value={state.start} onChange={e=>setState({...state, start:e.target.value})}/>
      <input className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default" type="time"
             aria-label={t('ui.end')}
             value={state.end} onChange={e=>setState({...state, end:e.target.value})}/>

      <div className="md:col-span-3">
        <button className="px-4 py-2 rounded bg-primary hover:opacity-90">{t('ui.add')}</button>
      </div>
    </form>
  );
}
