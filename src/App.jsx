import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LangSwitcher, ThemeToggle, LogoutBadge } from "./components/UI";
import { getAuth } from "./lib/auth";

export default function App() {
  const loc = useLocation();
  const { t } = useTranslation();
  const auth = getAuth();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-default bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to="/" className="font-bold text-xl text-primary">{t("app.title")}</Link>
          <nav className="text-sm flex gap-4">
            <Link to="/" className={loc.pathname==="/"?"text-current":"text-muted hover:text-current"}>{t("app.timetable")}</Link>
            <Link to="/teacher" className={loc.pathname==="/teacher"?"text-current":"text-muted hover:text-current"}>{t("app.teacher")}</Link>
            {auth.role === 'director' && (
              <Link to="/admin" className={loc.pathname==="/admin"?"text-current":"text-muted hover:text-current"}>{t("app.admin")}</Link>
            )}
          </nav>
          <div className="ml-auto flex gap-3">
            <LangSwitcher />
            <ThemeToggle />
            <LogoutBadge />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
