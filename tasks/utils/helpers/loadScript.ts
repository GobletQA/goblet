import path from 'path'
import { scriptsDir } from '../../paths'

export const loadScript = async (script:string) => {
  return await import(path.join(scriptsDir, `js/${script}${script.endsWith(`.js`) ? '' : '.js' }`))
}
