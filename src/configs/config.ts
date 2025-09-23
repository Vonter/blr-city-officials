import cityConfigData from './blr.json';
import type { CityConfig, LocaleStrings } from './types';
import enLocale from '../assets/locales/en.json';
import knLocale from '../assets/locales/kn.json';

// Load city configuration
export const cityConfig: CityConfig = cityConfigData as CityConfig;

// Export locale data directly from locale files
export const locales = {
  en: enLocale as LocaleStrings,
  kn: knLocale as LocaleStrings
};
