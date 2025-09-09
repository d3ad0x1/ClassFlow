import { ensureGroupSchedule, saveData } from "../lib/storage";

export default function GroupSelect({ data, setData, value, onChange }) {
  function addGroup() {
    const name = prompt("New class name (e.g., 1A, 2Б):");
    if (!name) return;
    const id = name.trim();
    setData(prev => {
      const copy = structuredClone(prev);
      if (!copy.groups.find(g=>g.id===id)) {
        copy.groups.push({ id, name: id });
        ensureGroupSchedule(copy, id);
      }
      copy.activeGroupId = id;
      saveData(copy);
      return copy;
    });
    onChange?.(id);
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e)=>onChange?.(e.target.value)}
        className="px-3 py-2 rounded bg-black/10 dark:bg-black/20 border border-default text-sm"
      >
        {data.groups.map(g => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>
      <button onClick={addGroup} className="px-3 py-2 rounded border border-default text-sm">
        + Class
      </button>
    </div>
  );
}
