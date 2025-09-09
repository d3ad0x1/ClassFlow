import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

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
      className="px-2 py-1 rounded bg-black/20 border border-white/10 text-sm"
    >
      <option value="en">EN</option>
      <option value="ru">RU</option>
      <option value="uz">UZ</option>
    </select>
  );
}

export function ThemeToggle() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-3 py-1 rounded border border-white/10 text-sm"
    >
      {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
}
