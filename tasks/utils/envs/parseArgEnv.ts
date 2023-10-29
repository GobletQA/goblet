import tskConf from '../../../configs/tasks.config.js'

type TEnvironment = {
  options: string[]
  map: Record<string, string[]>
}

const environment = tskConf.environment as TEnvironment
let __FOUND_ENV:string


const findEnvArg = (args:string[], refs:string[]) => {
  return args.reduce((matching, arg, idx) => {
    if(matching.length) return matching

    const cleaned = arg.split(`=`).shift()

    const match = refs.find(ref => cleaned === ref)
    return match ? [arg, idx] : matching
  }, [] as []|[string, number])
}

/**
 * Helper to parse the passed in args and find the environment
 * Should really be moved to args-parse
 */
export const parseArgEnv = () => {
  if(__FOUND_ENV) return __FOUND_ENV

  const args = process.argv.slice(2)

  __FOUND_ENV = environment.options.reduce((found, opt) => {
    if(found) return found

    const refs = [opt, `--${opt}`]
    // Only add the single `-` for the short env option
    opt.length === 1 && refs.push(`-${opt}`)

    const [envArg, idx] = findEnvArg(args, refs) as [string, number]
    if(!envArg) return found

    const [equalsEnv, equalsVal] = envArg.split(`=`)
    const alias = equalsEnv === opt ? equalsVal.trim() : args[(idx as number) + 1]
    
    return Object.entries(environment.map).reduce((final, [key, aliases]) => {
      return !final && (key === alias || aliases.includes(alias)) ? key : final
    }, ``)

  }, ``)

  if(__FOUND_ENV) process.env.NODE_ENV = __FOUND_ENV

  return __FOUND_ENV
}