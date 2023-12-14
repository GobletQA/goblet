import path from 'path'
import { writeFileSync, rmSync } from 'fs'
import { aliases } from '@gobletqa/configs/aliases.config'

export const writePid = (name:string, pid:string|number) => {
  if(process.env.EXAM_ENV) return ``

  const loc = path.join(aliases[`@GLogs`], `${name}.pid`)
  try { rmSync(loc) }
  catch(err){}

  try { writeFileSync(loc, `${pid}`) }
  catch(err){}

  return loc
}