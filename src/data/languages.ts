import type { LocalizedString } from "@/lib/i18n";

export interface LanguageEntry {
  name: LocalizedString;
  level: LocalizedString;
}

export const languages: LanguageEntry[] = [
  {
    name: { en: "Swedish", sv: "Svenska" },
    level: { en: "native", sv: "modersmål" },
  },
  {
    name: { en: "English", sv: "Engelska" },
    level: { en: "fluent", sv: "flytande" },
  },
  {
    name: { en: "German", sv: "Tyska" },
    level: { en: "basic", sv: "grundläggande" },
  },
];
