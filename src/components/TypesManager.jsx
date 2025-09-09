import { useState } from 'react';


export default function TypesManager({ types, onChange }) {
    const [local, setLocal] = useState(types);
    function add() {
        setLocal([...local, { value: `type${local.length + 1}`, label: 'New Type', color: '#a3a3a3' }]);
    }
    function update(i, patch) {
        const copy = [...local];
        copy[i] = { ...copy[i], ...patch };
        setLocal(copy);
    }
    function remove(i) {
        const copy = [...local];
        copy.splice(i, 1);
        setLocal(copy);
    }
    function save() { onChange(local); }


    return (
        <div className="rounded-xl border border-white/10 p-4 bg-card/60 grid gap-3">
            <div className="flex items-center justify-between">
                <div className="font-semibold">Lesson Types</div>
                <div className="flex gap-2">
                    <button onClick={add} className="text-xs px-3 py-1 rounded border border-white/10 hover:bg-white/5">Add</button>
                    <button onClick={save} className="text-xs px-3 py-1 rounded bg-primary hover:opacity-90">Save</button>
                </div>
            </div>


            <div className="grid gap-2">
                {local.map((t, i) => (
                    <div key={i} className="grid md:grid-cols-5 gap-2 items-center">
                        <input className="px-3 py-2 rounded bg-black/20 border border-white/10 md:col-span-2" placeholder="Label"
                            value={t.label} onChange={e => update(i, { label: e.target.value })} />
                        <input className="px-3 py-2 rounded bg-black/20 border border-white/10" placeholder="Value (id)"
                            value={t.value} onChange={e => update(i, { value: e.target.value })} />
                        <input className="px-3 py-2 rounded bg-black/20 border border-white/10" type="color"
                            value={t.color} onChange={e => update(i, { color: e.target.value })} />
                        <button onClick={() => remove(i)} className="text-xs px-3 py-2 rounded border border-red-400/40 text-red-300 hover:bg-red-400/10">Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}