import {exists} from "@keg-hub/jsutils/exists"

export const addFlag = (...args:[string, any]) => {
  const name = args[0]

  return !name || (args.length == 2 && !args[1])
    ? ''
    : `--${name}`
}


export const addParam = (
  name:string,
  value?:any,
  ident=`--`
) => name && exists(value)
  ? `${ident}${name} ${value}`
  : ''