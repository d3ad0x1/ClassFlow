import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { getAuth, setAuth } from "../lib/auth";

export function LangSwitcher() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  function changeLanguage(l) {
    i18n.changeLanguage(l);
    setLang(l);
  }

  return (
    <select
      value={lang}
      onChange={(e) => changeLanguage(e.target.value)}
      className="px-2 py-1 rounded bg-black/20 dark:bg-white/10 border border-default text-sm"
    >
      <option value="en">EN</option>
      <option value="ru">RU</option>
      <option value="uz">UZ</option>
    </select>
  );
}

export function ThemeToggle() {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  const initial = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
  const [theme, setTheme] = useState(initial);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-1 rounded border border-default text-sm"
      title="Toggle theme"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}

export function LogoutBadge() {
  const auth = getAuth();
  if (auth.role === 'viewer') return null;
  return (
    <button
      onClick={()=>{ setAuth({role:'viewer'}); window.location.reload(); }}
      className="px-3 py-1 rounded border border-default text-sm"
      title={`Signed in as ${auth.role}`}
    >
      {`↩ ${auth.role}`}
    </button>
  );
}
