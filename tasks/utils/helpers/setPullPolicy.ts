import { exists, isBool, isStr } from '@keg-hub/jsutils'

/**
 * Set a custom pull policy for all of the docker images used
 * Set pull to `false || never` to use a locally built image
 */
export const setPullPolicy = (pull:boolean|string) => {
  if (isBool(pull) as boolean)
    return (process.env.IMAGE_PULL_POLICY = pull === false ? `Never` : `Always`)

  if (!exists(pull) || !isStr(pull)) return

  const compare = (pull as string).toLowerCase()
  const policy =
    compare === 'present' || compare === 'exists' ? `IfNotPresent` : undefined
  exists(policy) && (process.env.IMAGE_PULL_POLICY = policy)
}
