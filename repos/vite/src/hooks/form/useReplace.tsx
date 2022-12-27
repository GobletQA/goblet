import type { TOptFunc, TBuildFormOpts, TBuiltForm } from '@types'
import { useMemo } from 'react'
import { FormComponents } from '@components/Form'
import {
  set,
  get,
  isStr,
  isObj,
  isArr,
  exists,
  toBool,
} from '@keg-hub/jsutils'

const Options = {
  exists: (val:any) => exists(val),
  is: (val:any) => toBool(val) === true,
  no: (val:any) => toBool(val) === false,
  not: (val:any) => toBool(val) === false,
}

const validateOption = (option:string, loc:string[]) => {
  const found = Options[option as keyof typeof Options]
  return found
    ? [found, loc]
    : [undefined, [option, ...loc]]
  
}

const replace$ = (
  parent:Record<string, any>,
  values:Record<string, any>,
  key:string,
  value:any
) => {

  if(isStr(value) && value.startsWith(`$`) && value.includes(`.`)){

    const [type, option, ...loc] = value.split(`.`)
    const [modifier, locArr] = validateOption(option, loc) as [TOptFunc|undefined, string[]]

    if(type === `$component`){
      const name = locArr.pop()
      const Component = FormComponents[name as keyof typeof FormComponents]
      if(Component){
        set(parent, key, Component)
        return true
      }
    }
    else {
      const found = get(values, locArr)
      set(parent, key, modifier ? modifier(found) : found)
      return true
    }
  }

  return false
}

const loopReplace = (
  original:Record<any, any>,
  parent:Record<any, any>,
  values:Record<string, any>,
) => {

  let currOrg = original
  return Object.entries(parent)
    .reduce((replaced, [key, value]) => {
      if(key === `form` || key === `$root` || key === `$actions`) return replaced

      if(!replace$(parent, values, key, currOrg[key]) && (isObj(value) || isArr(value)))
        replaced[key] = loopReplace(currOrg[key], value, values)

      return replaced
    }, parent)
}

export const useDynReplace = (
  parent:TBuiltForm,
  options:TBuildFormOpts,
  original?:Record<any, any>,
  key?: string
):TBuiltForm => {

  const { values } = options
  
  return useMemo(() => {
    if(!exists(original)) return parent

    const loopFrom = key ? parent[key] : parent
    // @ts-ignore
    const looped = loopReplace(original, loopFrom, values)

    return key ? {...parent, [key]: looped} : looped
  }, [
    key,
    values,
    parent,
    original,
  ])

}


export const useHardReplace = (
  parent:Record<any, any>,
  options:TBuildFormOpts
) => {

  const { values, pathValues } = options

  return useMemo(() => {
    return Object.entries(pathValues)
      .reduce((acc, [loc, value]) => {
        !replace$(acc, values, loc, value)
          && set(acc, loc, value)

        return acc
      }, parent)
  }, [
    values,
    parent,
    pathValues,
  ])

}
