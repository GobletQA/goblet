import type { TEnvObject } from '../../types'
import { loadScript } from '../helpers/loadScript'

/**
 * Converts all the envs to docker cli format so they are passed on to the docker container
 */
export const addRunEnvs = async (docFileCtx:string, currentEnvs:TEnvObject) => {
  const { filterExistingEnvs } = await loadScript(`filterEnvs`)
  const filteredEnvs = filterExistingEnvs(docFileCtx, currentEnvs)

  return Object.entries(filteredEnvs)
    .reduce((buildArgs, [key, value]) => {
      key && value && buildArgs.push(`-e`, `${key}=${value}`)

      return buildArgs
    }, [])
}
