import { ArtifactSaveOpts } from '@GBR/constants'

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
 */
export const artifactSaveActive = (option:string|boolean) => {
  return Boolean(artifactSaveOption(option))
}
