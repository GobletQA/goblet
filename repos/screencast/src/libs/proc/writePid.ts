import path from 'path'
import { writeFileSync, rmSync } from 'fs'
import { aliases } from '@GConfigs/aliases.config'

export const writePid = (name:string, pid:string|number) => {
  const loc = path.join(aliases[`@GLogs`], `${name}.pid`)
  try { rmSync(loc) }
  catch(err){}

  writeFileSync(loc, `${pid}`)

  return loc
}