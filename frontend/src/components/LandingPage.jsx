import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function LandingPage() {
  const { t } = useTranslation("common");

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-800 from-blue-700 to-blue-500 flex items-center justify-center py-12">
      <div className="absolute top-4 right-6">
        <LanguageSwitcher />
      </div>

      <div className="max-w-6xl mx-auto px-6 sm:px-8 w-full flex justify-center">
        <div className="max-w-xl text-white text-center md:text-left w-full">
          <p className="tracking-widest text-xs sm:text-sm text-white/70 mb-4">
            {t("landing.subtitle")}
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            {t("landing.title")}
          </h1>
          <p className="text-white/80 mb-8 text-base sm:text-lg">
            {t("landing.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link
              to="/login"
              className="bg-yellow-400 text-white px-6 py-3 rounded-full font-semibold hover:bg-yellow-500 transition text-center"
            >
              {t("landing.login")}
            </Link>
            <Link
              to="/create-citizen"
              className="border border-white text-white px-6 py-3 rounded-full hover:bg-white hover:text-purple-700 transition text-center"
            >
              {t("landing.register")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
