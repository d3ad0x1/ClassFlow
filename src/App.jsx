import { Outlet, Link, useLocation } from 'react-router-dom';


export default function App() {
    const loc = useLocation();
    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-10 border-b border-white/10 bg-background/80 backdrop-blur">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
                    <Link to="/" className="font-bold text-xl text-primary">ClassFlow</Link>
                    <nav className="text-sm flex gap-4">
                        <Link to="/" className={loc.pathname === '/' ? 'text-white' : 'text-muted hover:text-white'}>Timetable</Link>
                        <Link to="/teacher" className={loc.pathname === '/teacher' ? 'text-white' : 'text-muted hover:text-white'}>Teacher</Link>
                    </nav>
                </div>
            </header>
            <main className="max-w-6xl mx-auto px-4 py-6">
                <Outlet />
            </main>
            <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-xs text-muted">
                © {new Date().getFullYear()} ClassFlow
            </footer>
        </div>
    );
}