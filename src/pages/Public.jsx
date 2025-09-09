import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { loadData, initData, saveData, ensureGroupSchedule } from '../lib/storage';
import GroupSelect from '../components/GroupSelect.jsx';

export default function Public(){
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(() => {
    const loaded = loadData() || initData();
    ensureGroupSchedule(loaded, loaded.activeGroupId);
    return loaded;
  });
  useEffect(()=> saveData(data), [data]);

  const [groupId, setGroupId] = useState(data.activeGroupId);
  useEffect(() => {
    setData(prev => ({ ...prev, activeGroupId: groupId }));
  }, [groupId]);

  const schedule = data.schedules[groupId];
  const url = new URL(window.location.href);
  const initial = url.searchParams.get('date') || schedule.days[0].date;
  const [selectedDate, setSelectedDate] = useState(initial);

  useEffect(() => {
    // при смене класса сбрасываем выбранную дату на первую в расписании
    const s = data.schedules[groupId];
    if (s && !s.days.find(d=>d.date===selectedDate)) {
      setSelectedDate(s.days[0]?.date || initial);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  const day = useMemo(
    () => schedule.days.find(d => d.date === selectedDate),
    [schedule, selectedDate]
  );

  const fmtDate = (d) =>
    new Date(d).toLocaleDateString(i18n.language, { weekday:'long', day:'2-digit', month:'2-digit' });

  const tgHref = () => {
    const u = new URL(window.location.href);
    u.searchParams.set('date', selectedDate);
    const urlEnc = encodeURIComponent(u.toString());
    const textEnc = encodeURIComponent(`${t('app.scheduleWord')} ${groupId} — ${fmtDate(selectedDate)}`);
    return `https://t.me/share/url?url=${urlEnc}&text=${textEnc}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-3 flex-wrap items-center">
        <GroupSelect data={data} setData={setData} value={groupId} onChange={setGroupId} />
        <div className="ml-auto"></div>
        <a href={tgHref()} target="_blank" rel="noreferrer"
           className="px-3 py-1 rounded-full bg-primary text-white hover:opacity-90">
          {t('app.share')}
        </a>
      </div>

      <div className="flex gap-2 flex-wrap">
        {schedule.days.map(d => (
          <button key={d.date}
                  onClick={() => setSelectedDate(d.date)}
                  className={`px-3 py-1 rounded-full border ${selectedDate===d.date?'border-primary':'border-default'} text-sm`}>
            {fmtDate(d.date)}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {day?.lessons?.length ? day.lessons.map(les => (
          <div key={les.id} className="rounded-xl border border-default p-4 bg-card/60">
            <div className="flex items-center justify-between">
              <div className="font-semibold">{les.title}</div>
              <span
                className="text-xs px-2 py-0.5 rounded-full border border-default"
                style={{ background: `${(data.types.find(ti=>ti.value===les.type)?.color || '#888')}22` }}
              >
                {data.types.find(ti=>ti.value===les.type)?.label || les.type}
              </span>
            </div>
            <div className="text-sm text-muted mt-1">
              {les.start}–{les.end} {les.room ? `· ${t('ui.roomPh')} ${les.room}` : ""} {les.teacher ? `· ${les.teacher}` : ""}
            </div>
          </div>
        )) : <div className="text-muted">{t('app.noActivities')}</div>}
      </div>
    </div>
  );
}
