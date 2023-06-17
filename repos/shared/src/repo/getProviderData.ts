import {get, isStr} from "@keg-hub/jsutils"

const {
  GB_GIT_PROVIDER_DATA=``
} = process.env

export type TProviderData = {
  token:string
  user?:string
  provider?:string
  username?:string
  [key:string]:any
}


const providerData = GB_GIT_PROVIDER_DATA.split(`,`).reduce((acc, part:string) => {
  if(!part || !isStr(part)) return acc

  const [user, provider, ...rest] = part.trim().split(`|`)
  acc[user] = acc[user] || {}
  acc[user][provider] = { token: rest.join(`|`).trim() }

  return acc
}, {})


export const getProviderData = (opts:TProviderData) => {
  const fallback = { token: opts.token }
  const user = opts?.username || opts?.user
  const provider = (opts?.provider || ``)
    .replace(`https://`, ``)
    .replace(`http://`, ``)
    .replace(`.com`, ``)

  return get(providerData, [user, provider], fallback)
}