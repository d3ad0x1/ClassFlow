export function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString(undefined, {
        weekday: 'long', day: '2-digit', month: '2-digit'
    });
}


export function dayUrl(date) {
    const url = new URL(window.location.href);
    url.searchParams.set('date', date);
    return url.toString();
}


export function tgShareHref(date, group) {
    const url = encodeURIComponent(dayUrl(date));
    const text = encodeURIComponent(`Schedule ${group} — ${formatDate(date)}`);
    return `https://t.me/share/url?url=${url}&text=${text}`;
}