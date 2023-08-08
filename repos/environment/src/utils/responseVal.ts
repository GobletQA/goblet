import type { TEnvConvertOpts } from '@GENV/types'

export const responseVal = <T=any>(
  val:T,
  validator:(val:any) => boolean,
  opts:TEnvConvertOpts<T>={},
) => {
  return opts.force && !validator(val)
    ? opts?.default
    : val
}