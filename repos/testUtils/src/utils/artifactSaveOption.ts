import { ArtifactSaveOpts } from '@gobletqa/environment/constants'

/**
 * Checks the value of the passed in option to define when an artifact should be saved
 */
export const artifactSaveOption = (option:string|boolean) => {
  return !option || option === ArtifactSaveOpts.never
    ? false
    : option === ArtifactSaveOpts.always
      ? ArtifactSaveOpts.always
      : ArtifactSaveOpts.failed
}

/**
 * Checks if the passed in option should be saved or not
 */
export const shouldSaveArtifact = (
  option:string|boolean,
  testStatus:string|boolean
) => {
  const status = artifactSaveOption(option)

  if(!status || status === ArtifactSaveOpts.never) return false

  return (status === ArtifactSaveOpts.always) ||
      (testStatus === ArtifactSaveOpts.failed && status === ArtifactSaveOpts.failed)
}

/**
 * Checks the value of the passed in option to define when an artifact should be saved
 * Checks if a feature is enabled to know if the feature options should be set
 * For example, tracing options are only set when tracing is active
 */
export const artifactSaveActive = (option:string|boolean) => {
  return Boolean(artifactSaveOption(option))
}
