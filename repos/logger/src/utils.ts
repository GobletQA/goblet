export const identity = (input:any) => (input)
export const isStr = <T=string>(str:any):str is T => typeof str === 'string'
export const equalsNaN = (val:unknown) => typeof val === 'number' && val != val
export const isNum = <T=number>(val:any):val is T => typeof val === 'number' && !equalsNaN(val)
export const exists = (value:unknown) => value === value && value !== undefined && value !== null