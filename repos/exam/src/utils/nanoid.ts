import { uuid, doIt, emptyObj, isObj, isStr } from '@keg-hub/jsutils'

export type TNanoidOpts = {
  joiner?:string
  parts?:number
  prefix?:string
}

const sudoRandomStr = (str:string) => {
  const times = Math.floor(str.length / 2)
  // @ts-ignore
  return doIt(times, {}, () => str.charAt(Math.floor(Math.random() * str.length))).join(``)
}

const sudoRandomNum = () => {
  return Math.floor((Math.floor(Math.random() * Date.now())))
}

const sudoRandom = (radix=36) => {
  return sudoRandomNum().toString(radix)
}

export const nanoid = (base?:string|TNanoidOpts, opts?:TNanoidOpts) => {
  if(!isObj(opts)){
    if(isObj<TNanoidOpts>(base)){
      opts = base
      base = undefined
    }
    else opts = emptyObj
  }

  const {
    parts=2,
    prefix=``,
    joiner=`.`
  } = opts

  const seed =  isStr(base) && base || sudoRandom(16)
  const salt = uuid().split(`-`)

  let count = 0
  const gen = () => {
    count++
    const even = count % 2 === 0
    return sudoRandomStr(even && salt.pop() || seed)
  }

  return `${prefix ? `${prefix}${joiner}` : ``}${doIt(parts, {}, gen).join(joiner)}`
}