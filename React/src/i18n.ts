import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import idJSON from "./locales/id.json";
import enJSON from "./locales/en.json";

const savedLanguage = localStorage.getItem("pyduiten_lng") || "id";

i18n.use(initReactI18next).init({
  resources: {
    id: { translation: idJSON },
    en: { translation: enJSON },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
