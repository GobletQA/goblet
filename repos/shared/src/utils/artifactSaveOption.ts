import { ARTIFACT_SAVE_OPTS } from '@GSH/constants'

/**
 * Checks the value of the passed in option to define when an artifact should be saved
 */
export const artifactSaveOption = (option:string|boolean) => {
  return !option || option === ARTIFACT_SAVE_OPTS.never
    ? false
    : option === ARTIFACT_SAVE_OPTS.always
      ? ARTIFACT_SAVE_OPTS.always
      : ARTIFACT_SAVE_OPTS.failed
}

/**
 * Checks if the passed in option should be saved or not
 */
export const shouldSaveArtifact = (
  option:string|boolean,
  testStatus:string|boolean
) => {
  const status = artifactSaveOption(option)

  if(!status || status === ARTIFACT_SAVE_OPTS.never) return false

  return (status === ARTIFACT_SAVE_OPTS.always) ||
      (testStatus === ARTIFACT_SAVE_OPTS.failed && status === ARTIFACT_SAVE_OPTS.failed)
}

/**
 * Checks the value of the passed in option to define when an artifact should be saved
 */
export const artifactSaveActive = (option:string|boolean) => {
  return Boolean(artifactSaveOption(option))
}
