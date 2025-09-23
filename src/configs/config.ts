import type { CityConfig, LocaleStrings } from './types';

import blrConfigData from './blr.json';
import mumbaiConfigData from './mumbai.json';

import enLocale from '../assets/locales/en.json';
import knLocale from '../assets/locales/kn.json';
import hiLocale from '../assets/locales/hi.json';
import mrLocale from '../assets/locales/mr.json';

// Get city from environment variable
const CITY = import.meta.env['VITE_CITY'];

// Load city configuration based on environment variable
function loadCityConfig(): CityConfig {
  switch (CITY) {
    case 'mumbai':
      return mumbaiConfigData as unknown as CityConfig;
    case 'blr':
      return blrConfigData as unknown as CityConfig;
    default:
      return blrConfigData as unknown as CityConfig;
  }
}

export const cityConfig: CityConfig = loadCityConfig();

// All available locale data
const allLocales = {
  en: enLocale as LocaleStrings,
  kn: knLocale as LocaleStrings,
  hi: hiLocale as LocaleStrings,
  mr: mrLocale as LocaleStrings
};

// Export only locales supported by the current city configuration
export const locales = cityConfig.supportedLanguages.reduce(
  (acc, lang) => {
    if (lang.code in allLocales) {
      acc[lang.code] = allLocales[lang.code as keyof typeof allLocales];
    }
    return acc;
  },
  {} as Record<string, LocaleStrings>
);
