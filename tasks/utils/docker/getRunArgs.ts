
export type TDockerPullType = `missing` | `never` | `always`

export type TDockerRunArgs = {
  name: string
  remove: boolean
  attach: boolean
  privileged: boolean
  pull: TDockerPullType
}

/**
 * Gets the arguments to pass to the docker cli run command
 *
 */
export const getRunArgs = ({ remove, attach, name, pull, privileged }:TDockerRunArgs) => {
  const args = []
  remove && args.push(`--rm`)
  attach && args.push(`-it`)
  name && args.push(`--name`, name)
  privileged && args.push(`--privileged`)

  ;([`missing`, `never`, `always`]).includes(pull)
    ? args.push(`--pull=${pull}`)
    : args.push(`--pull=never`)

  return args
}