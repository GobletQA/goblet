import path from 'path'
import { containerDir } from '../../paths'

export const loadScript = async (script:string) => {
  return await import(path.join(containerDir, `scripts/ds/${script}${script.endsWith(`.js`) ? '' : '.js' }`))
}
