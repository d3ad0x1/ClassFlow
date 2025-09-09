import { useState } from 'react';


export default function LessonForm({ types, onSubmit }) {
    const [state, setState] = useState({
        title: '', teacher: '', room: '', type: types?.[0]?.value || 'lesson', start: '', end: ''
    });


    function handleSubmit(e) {
        e.preventDefault();
        if (!state.title || !state.start || !state.end) return;
        onSubmit({ ...state });
        setState(s => ({ ...s, title: '', teacher: '', room: '', start: '', end: '' }));
    }


    return (
        <form onSubmit={handleSubmit} className="rounded-xl border border-white/10 p-4 bg-card/60 grid md:grid-cols-3 gap-3">
            <input className="px-3 py-2 rounded bg-black/20 border border-white/10" placeholder="Title (Math)"
                value={state.title} onChange={e => setState({ ...state, title: e.target.value })} />
            <input className="px-3 py-2 rounded bg-black/20 border border-white/10" placeholder="Teacher"
                value={state.teacher} onChange={e => setState({ ...state, teacher: e.target.value })} />
            <input className="px-3 py-2 rounded bg-black/20 border border-white/10" placeholder="Room"
                value={state.room} onChange={e => setState({ ...state, room: e.target.value })} />
            <select className="px-3 py-2 rounded bg-black/20 border border-white/10"
                value={state.type} onChange={e => setState({ ...state, type: e.target.value })}>
                {types.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
            <input className="px-3 py-2 rounded bg-black/20 border border-white/10" type="time"
                value={state.start} onChange={e => setState({ ...state, start: e.target.value })} />
            <input className="px-3 py-2 rounded bg-black/20 border border-white/10" type="time"
                value={state.end} onChange={e => setState({ ...state, end: e.target.value })} />
            <div className="md:col-span-3">
                <button className="px-4 py-2 rounded bg-primary hover:opacity-90">Add</button>
            </div>
        </form>
    );
}