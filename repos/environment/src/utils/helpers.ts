export const isFunc = <T=(...args:any[])=>any>(func:any):func is T => typeof func === 'function'
export const isStr = <T=string>(str:any):str is T => typeof str === 'string'

export const isBool = <T=boolean>(val:any):val is T => typeof val === 'boolean'

export const isStrBool = <T=string>(val:any):val is T => val === 'false' || val === 'true'

export const equalsNaN = (val:any):boolean => typeof val === 'number' && val != val
export const isNum = <T=number>(val:any):val is T => typeof val === 'number' && !equalsNaN(val)
export const exists = (value:any) => value === value && value !== undefined && value !== null

export const getNums = (val:any) => (toStr(val) as string).replace(/([^.\d])/gm, '');
export const toNum = <T=number>(val:any):number => isNum(val) ? val : val && !equalsNaN(val) && Number(getNums(val)) || 0;

export const toBool = (val:any):boolean => isStrBool(val)
  ? val === 'true'
  : convertToStrBool(val) === 'true'

export const toStr = (val:any):string => val === null || val === undefined ? ''
  : isStr(val) ? val
  : JSON.stringify(val)

export const convertToStrBool = (val:any) => isBool(val)
  ? toStr(val)
  : !val || val === 'false' || val === '0' ? 'false' : 'true'

export const deepFreeze = <T extends Record<any, any>=Record<any, any>>(obj:T):T => {
  Object.freeze(obj);
  Object.getOwnPropertyNames(obj).map(prop => {
    obj.hasOwnProperty(prop) && obj[prop] !== null && (typeof obj[prop] === 'object' || isFunc(obj[prop])) && !Object.isFrozen(obj[prop]) && deepFreeze(obj[prop]);
  });
  return obj;
}