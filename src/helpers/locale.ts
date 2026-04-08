import { cityConfig } from '../configs/config';

function getRegionalLanguageCodes(): string[] {
  return cityConfig.supportedLanguages
    .filter(lang => lang.code !== 'en')
    .map(lang => lang.code);
}

export function isRegionalLocale(locale: string | null | undefined): boolean {
  if (!locale) return false;
  return getRegionalLanguageCodes().some(langCode =>
    locale.startsWith(langCode)
  );
}

export function getRegionalLanguageCode(
  locale: string | null | undefined
): string | null {
  if (!locale) return null;
  return (
    getRegionalLanguageCodes().find(langCode => locale.startsWith(langCode)) ||
    null
  );
}
