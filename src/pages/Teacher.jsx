// src/pages/Teacher.jsx
import { useEffect, useMemo, useState } from 'react';
import { nanoid } from 'nanoid';
import LessonForm from '../components/LessonForm.jsx';
import TypesManager from '../components/TypesManager.jsx';
import { loadData, saveData, initData } from '../lib/storage';

export default function Teacher(){
  const [data, setData] = useState(() => loadData() || initData());
  useEffect(()=> saveData(data), [data]);

  const [selectedDate, setSelectedDate] = useState(data.days[0].date);
  const dayIdx = data.days.findIndex(d => d.date === selectedDate);
  const day = useMemo(() => data.days[dayIdx], [data, dayIdx]);

  function upsertLesson(payload){
    setData(prev => {
      const copy = structuredClone(prev);
      const arr = copy.days[dayIdx].lessons;
      if (payload.id){
        const i = arr.findIndex(x => x.id === payload.id);
        if (i >= 0) arr[i] = payload;
      } else {
        payload.id = nanoid();
        arr.push(payload);
      }
      return copy;
    });
  }

  function removeLesson(id){
    setData(prev => {
      const copy = structuredClone(prev);
      copy.days[dayIdx].lessons = copy.days[dayIdx].lessons.filter(l => l.id !== id);
      return copy;
    });
  }

  function setTypes(newTypes){
    setData(prev => ({ ...prev, types: newTypes }));
  }

  return (
    <div className="grid gap-6">
      <div className="flex gap-2 flex-wrap">
        {data.days.map(d => (
          <button key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`px-3 py-1 rounded-full border ${selectedDate===d.date? 'border-primary text-white':'border-white/10 text-muted hover:text-white'}`}>
            {new Date(d.date).toLocaleDateString(undefined,{weekday:'short', day:'2-digit', month:'2-digit'})}
          </button>
        ))}
        <div className="ml-auto text-sm text-muted">Class: <b>{data.group}</b></div>
      </div>

      <LessonForm types={data.types} onSubmit={upsertLesson} />

      <div className="grid gap-3">
        {day.lessons.length ? day.lessons.map(les => (
          <div key={les.id} className="rounded-xl border border-white/10 p-4 bg-card/60">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="font-semibold">{les.title}</div>
                <div className="text-sm text-muted">
                  {les.start}–{les.end} {les.room?`· room ${les.room}`:''} {les.teacher?`· ${les.teacher}`:''} · {data.types.find(t=>t.value===les.type)?.label || les.type}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(JSON.stringify(les,null,2))}
                        className="text-xs px-3 py-1 rounded border border-white/10 hover:bg-white/5">Copy</button>
                <button onClick={() => removeLesson(les.id)}
                        className="text-xs px-3 py-1 rounded border border-red-400/40 text-red-300 hover:bg-red-400/10">Delete</button>
              </div>
            </div>
          </div>
        )) : <div className="text-muted">No activities — add above.</div>}
      </div>

      <TypesManager types={data.types} onChange={setTypes} />
    </div>
  );
}
