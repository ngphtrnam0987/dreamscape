import { en, TranslationKey } from './en';
import { vi } from './vi';

export type { TranslationKey };
export type Language = 'en' | 'vi';

export const translations = {
  en,
  vi,
};

export const getTranslation = (lang: Language, key: TranslationKey, params?: Record<string, string | number>): string => {
  const dict = translations[lang] || translations.en;
  let text = dict[key] || translations.en[key] || key;
  if (params) {
    Object.entries(params).forEach(([paramKey, paramVal]) => {
      text = text.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
    });
  }
  return text;
};
