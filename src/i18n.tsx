import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {messages} from './messages';

export const languages = ['zh', 'ja', 'ko', 'en'] as const;
export type Language = typeof languages[number];
export const languageNames: Record<Language, string> = {zh:'中文', ja:'日本語', ko:'한국어', en:'English'};
const storageKey = 'mab.website.language';
export function isLanguage(value: unknown): value is Language {
 return typeof value === 'string' && languages.includes(value as Language);
}
export function translate(language: Language, source: string): string {
 if (language === 'zh') return source;
 const index = {en:0, ja:1, ko:2}[language];
 return messages[source]?.[index] ?? source;
}
function initialLanguage(): Language {
 try { const value = localStorage.getItem(storageKey); if (isLanguage(value)) return value; } catch { /* Storage may be disabled. */ }
 return 'zh';
}
const LanguageContext = createContext<{language:Language;setLanguage:(language:Language)=>void;t:(source:string)=>string}|null>(null);
export function LanguageProvider({children}:{children:ReactNode}) {
 const [language,setLanguage] = useState<Language>(initialLanguage);
 useEffect(()=>{
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
  document.title = 'Monster Auto Battle';
  try { localStorage.setItem(storageKey,language); } catch { /* Switching still works without persistence. */ }
 },[language]);
 return <LanguageContext.Provider value={{language,setLanguage,t:source=>translate(language,source)}}>{children}</LanguageContext.Provider>;
}
export function useI18n(){
 const value=useContext(LanguageContext);
 if(!value)throw new Error('LanguageProvider is required');
 return value;
}
export function LanguageSelector(){
 const {language,setLanguage,t}=useI18n();
 return <label className="language-select"><span aria-hidden="true">◎</span><span className="sr-only">{t('选择语言')}</span><select value={language} onChange={e=>{if(isLanguage(e.target.value))setLanguage(e.target.value);}} aria-label={t('选择语言')}>{languages.map(code=><option key={code} value={code} lang={code}>{languageNames[code]}</option>)}</select></label>;
}



