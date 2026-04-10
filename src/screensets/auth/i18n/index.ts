/**
 * Auth screenset translations
 */

import { I18nRegistry, Language } from '@hai3/react';

export const authTranslations = I18nRegistry.createLoader({
  [Language.English]: () => import('./en.json'),
  [Language.Spanish]: () => import('./es.json'),
  // Use English as fallback for other languages
  [Language.Arabic]: () => import('./en.json'),
  [Language.Bengali]: () => import('./en.json'),
  [Language.Czech]: () => import('./en.json'),
  [Language.Danish]: () => import('./en.json'),
  [Language.German]: () => import('./en.json'),
  [Language.Greek]: () => import('./en.json'),
  [Language.Persian]: () => import('./en.json'),
  [Language.Finnish]: () => import('./en.json'),
  [Language.French]: () => import('./en.json'),
  [Language.Hebrew]: () => import('./en.json'),
  [Language.Hindi]: () => import('./en.json'),
  [Language.Hungarian]: () => import('./en.json'),
  [Language.Indonesian]: () => import('./en.json'),
  [Language.Italian]: () => import('./en.json'),
  [Language.Japanese]: () => import('./en.json'),
  [Language.Korean]: () => import('./en.json'),
  [Language.Malay]: () => import('./en.json'),
  [Language.Dutch]: () => import('./en.json'),
  [Language.Norwegian]: () => import('./en.json'),
  [Language.Polish]: () => import('./en.json'),
  [Language.Portuguese]: () => import('./en.json'),
  [Language.Romanian]: () => import('./en.json'),
  [Language.Russian]: () => import('./en.json'),
  [Language.Swedish]: () => import('./en.json'),
  [Language.Swahili]: () => import('./en.json'),
  [Language.Tamil]: () => import('./en.json'),
  [Language.Thai]: () => import('./en.json'),
  [Language.Tagalog]: () => import('./en.json'),
  [Language.Turkish]: () => import('./en.json'),
  [Language.Ukrainian]: () => import('./en.json'),
  [Language.Urdu]: () => import('./en.json'),
  [Language.Vietnamese]: () => import('./en.json'),
  [Language.ChineseSimplified]: () => import('./en.json'),
  [Language.ChineseTraditional]: () => import('./en.json'),
});
