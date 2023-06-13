
export type TDockerBuildParams = {
  cache?:boolean
  force?:boolean
  push?:boolean
}

/**
 * Gets the docker build cmd args to pass on to the build cmd call
 */
export const getDockerBuildParams = ({ cache, force, push }:TDockerBuildParams) => {
  return [
    force && `--force-rm`,
    !cache && `--no-cache`,
    push ? `--push` : `--load`,
  ].filter((arg) => arg)
}

