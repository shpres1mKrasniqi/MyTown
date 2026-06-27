import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  return (
    <div className="flex items-center gap-1 bg-white/10 rounded-full p-1">
      {["sq", "en"].map((lng) => (
        <button
          key={lng}
          onClick={() => i18n.changeLanguage(lng)}
          className={`px-3 py-1 rounded-full text-sm font-semibold transition ${
            current === lng
              ? "bg-white text-purple-700"
              : "text-white hover:bg-white/20"
          }`}
        >
          {lng.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
