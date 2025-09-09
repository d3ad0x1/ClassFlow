import { useEffect, useMemo, useState } from 'react';
import { loadData, initData, saveData } from '../lib/storage';
import { formatDate, tgShareHref } from '../lib/share';


export default function Public() {
    const [data, setData] = useState(() => loadData() || initData());
    useEffect(() => saveData(data), [data]);


    const url = new URL(window.location.href);
    const initial = url.searchParams.get('date') || data.days[0].date;
    const [selectedDate, setSelectedDate] = useState(initial);


    const day = useMemo(() => data.days.find(d => d.date === selectedDate), [data, selectedDate]);


    return (
        <div className="space-y-6">
            <div className="flex gap-2 flex-wrap">
                {data.days.map(d => (
                    <button key={d.date}
                        onClick={() => setSelectedDate(d.date)}
                        className={`px-3 py-1 rounded-full border ${selectedDate === d.date ? 'border-primary text-white' : 'border-white/10 text-muted hover:text-white'}`}>
                        {formatDate(d.date)}
                    </button>
                ))}
                <a href={tgShareHref(selectedDate, data.group)} target="_blank" rel="noreferrer"
                    className="ml-auto px-3 py-1 rounded-full bg-primary text-white hover:opacity-90">Share via Telegram</a>
            </div>


            <div className="grid gap-3">
                {day?.lessons?.length ? day.lessons.map(les => (
                    <div key={les.id} className="rounded-xl border border-white/10 p-4 bg-card/60">
                        <div className="flex items-center justify-between">
                            <div className="font-semibold">{les.title}</div>
                            <span className="text-xs px-2 py-0.5 rounded-full border border-white/10" style={{ borderColor: '#ffffff22', background: `${data.types.find(t => t.value === les.type)?.color}22` }}>
                                {data.types.find(t => t.value === les.type)?.label || les.type}
                            </span>
                        </div>
                        <div className="text-sm text-muted mt-1">
                            {les.start}–{les.end} {les.room ? `· room ${les.room}` : ''} {les.teacher ? `· ${les.teacher}` : ''}
                        </div>
                    </div>
                )) : <div className="text-muted">No activities</div>}
            </div>
        </div>
    );
}