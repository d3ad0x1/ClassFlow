import { Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle, LangSwitcher } from "./components/UI";

export default function App() {
  const loc = useLocation();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/10 bg-background/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
          <Link to="/" className="font-bold text-xl text-primary">{t("app.title")}</Link>
          <nav className="text-sm flex gap-4">
            <Link to="/" className={loc.pathname==="/"?"text-white":"text-muted hover:text-white"}>{t("app.timetable")}</Link>
            <Link to="/teacher" className={loc.pathname==="/teacher"?"text-white":"text-muted hover:text-white"}>{t("app.teacher")}</Link>
          </nav>
          <div className="ml-auto flex gap-3">
            <LangSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
