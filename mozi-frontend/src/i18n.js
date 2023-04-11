import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationHU from "./locales/hu/translationHU.json";
import translationEN from "./locales/en/translationEN.json";
import translationRO from "./locales/ro/translationRO.json";

const resources = {
  en: {
    translation: translationEN,
  },
  hu: {
    translation: translationHU,
  },
  ro: {
    translation: translationRO,
  },
};

i18n.use(initReactI18next).init({
  fallbackLng: "en",
  debug: true,
  lng: localStorage.getItem("lang") || "en",
  resources,
});

export default i18n;
