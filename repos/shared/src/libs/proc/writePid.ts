import path from 'path'
import { writeFileSync, rmSync } from 'fs'
import { aliases } from '@gobletqa/configs/aliases.config'

const logDir = path.join(aliases.GobletRoot, `logs`)

export const writePid = (name:string, pid:string|number) => {
  if(process.env.EXAM_ENV) return ``

  const loc = path.join(logDir, `${name}.pid`)
  try { rmSync(loc) }
  catch(err){}

  try { writeFileSync(loc, `${pid}`) }
  catch(err){}

  return loc
}