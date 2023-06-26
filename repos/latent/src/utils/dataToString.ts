import type { TEnvObj } from "@GLT/types"

import {exists} from "@keg-hub/jsutils"
import { env } from '@keg-hub/parse-config'

export type TContentToStr = {
  patch?:boolean
  data:TEnvObj
  rekey?:boolean
  force?:boolean
  current:TEnvObj
}

const EXPAND_MATCH = /(.?\${?(?:[a-zA-Z0-9_]+)?}?)/g
const currIsEnv = (val:string) => Boolean(val.match(EXPAND_MATCH))

export const dataToString = ({
  data,
  patch,
  rekey,
  force,
  current,
}:TContentToStr) => {

  const failed:string[] = []

  if(rekey)
    return {
      failed,
      content: env.stringify(current) as string
    }

  const joined = Object.entries(data)
    .reduce((acc, [key, val]) => {

      if(!exists(acc[key])){
        patch && (acc[key] = val)
        return acc
      }

      !patch && !force && currIsEnv(acc[key])
        ? failed.push(key)
        : (acc[key] = val)

      return acc
    }, {...current} as TEnvObj)

  return {
    failed,
    content: env.stringify(joined) as string
  }

}
