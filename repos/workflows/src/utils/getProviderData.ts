import {get} from "@keg-hub/jsutils/get"
import {isStr} from "@keg-hub/jsutils/isStr"

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

let __PROVIDER_DATA = {}

/**
 * Wrap in a try catch, so we don't leak provider information
 */
try {
  __PROVIDER_DATA = GB_GIT_PROVIDER_DATA.split(`,`)
    .reduce((acc, part:string) => {
      if(!part || !isStr(part)) return acc

      const [part1, part2, ...rest] = part.trim().split(`::`)
      const user = (part1 || ``).toLowerCase().trim()
      const provider = (part2 || ``).toLowerCase().trim()
      const token = rest.join(`::`).trim()

      if(!user || !provider || !token) return acc

      acc[user] = acc[user] || {}
      acc[user][provider] = { token }

      return acc
    }, {})
}
catch(err){
  /**
   * Don't log the error because we don't want to leak git provider information
   */
  console.error(`The "__PROVIDER_DATA" cache could not be set. Error parsing "GB_GIT_PROVIDER_DATA" env`)
}
finally {
  /**
   * Delay to ensure the conductor config has time to load it
   * So it can be passed on to the session container as an ENV
   */
  setTimeout(() => {
    process.env.GB_GIT_PROVIDER_DATA = undefined
    delete process.env.GB_GIT_PROVIDER_DATA
  }, 4000)
}

export const getProviderData = (opts:TProviderData) => {
  const fallback = { token: opts.token }
  try {
    const user = (opts?.username || opts?.user || ``).toLowerCase().trim()
    const provider = (opts?.provider || ``).replace(`.com`, ``).toLowerCase().trim()

    return get(__PROVIDER_DATA, [user, provider], fallback)
  }
  catch(err){
    return fallback
  }
}