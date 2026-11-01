export type SceneId = 'elven' | 'celestial';
export const sceneNames = {elven:'精灵场景',celestial:'天宫场景'} as const;
const validScene = (value: unknown): value is SceneId => value === 'elven' || value === 'celestial';

/** Policy only, not payment verification. Execute inside a server transaction using
 * verified cumulative USD cents and the persisted, already-redeemed first choice.
 * Returns the desired entitlement SET, never an instruction to grant again.
 */
export function resolveSceneEntitlements(verifiedCents:number, lockedChoice:SceneId|null, requestedChoice:SceneId|null){
 if(!Number.isSafeInteger(verifiedCents)||verifiedCents<0)throw new Error('Invalid verified amount');
 if(lockedChoice!==null&&!validScene(lockedChoice))throw new Error('Invalid stored choice');
 if(requestedChoice!==null&&!validScene(requestedChoice))throw new Error('Invalid requested choice');
 if(verifiedCents>=1000)return {scenes:['elven','celestial'] as SceneId[],needsChoice:false};
 if(verifiedCents<500)return {scenes:[] as SceneId[],needsChoice:false};
 const choice=lockedChoice??requestedChoice;
 return {scenes:choice?[choice]:[],needsChoice:choice===null};
}
