/**
 * Mein Deutsch Buddy — shared types and storage keys
 */

export type LangMode = 'de' | 'en' | 'both';
export type CaseId = 'nom' | 'akk' | 'dat' | 'gen';

export const STORE = {
  lang: 'de.lang',
  theme: 'de.theme',
} as const;

export const root: HTMLElement = document.documentElement;
