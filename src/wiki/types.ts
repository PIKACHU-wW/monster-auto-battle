import type {Language} from '../i18n';
export type Localized=readonly [string,string,string,string]; // zh, en, ja, ko
export type WikiCategory='quests'|'monsters'|'traits'|'equipment';
export interface WikiEntry {
 id:string;category:WikiCategory;title:Localized;summary:Localized;description:Localized;
 image?:string;group:Localized;facts:{label:string;value:string|Localized}[];related:string[];
 stars?:{star:number;stats:{label:string;value:string}[];description:Localized}[];
 skillName?:Localized;
 baseStats?:{label:string;value:string|Localized}[];
 sigilEffects?:{normal:Localized;awakened:Localized};
 traitTiers?:{count:number;description:Localized}[];
}
export const localize=(value:Localized,language:Language)=>value[{zh:0,en:1,ja:2,ko:3}[language]];
