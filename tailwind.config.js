/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: '#8b5cf6',
                background: '#0f172a',
                card: '#111827',
                muted: '#94a3b8'
            }
        }
    },
    plugins: []
};