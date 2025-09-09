const KEY = 'classflow:data:v1';


export function loadData() {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}


export function saveData(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { }
}


export function initData() {
    // Week scaffold (Mon–Fri)
    const today = new Date();
    const monday = new Date(today);
    const day = monday.getDay();
    const diff = (day === 0 ? -6 : 1) - day; // move to Monday
    monday.setDate(monday.getDate() + diff);


    const days = Array.from({ length: 5 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return { date: d.toISOString().slice(0, 10), lessons: [] };
    });


    return {
        group: '5A',
        weekStart: monday.toISOString().slice(0, 10),
        days,
        types: [
            { value: 'lesson', label: 'Lesson', color: '#22c55e' },
            { value: 'club', label: 'Club', color: '#3b82f6' },
            { value: 'extra', label: 'Extra', color: '#f59e0b' }
        ]
    };
}