import {
  EFileType,
  ELatentEnv
} from '@GLT/types'


export const generateFileNames = (
  env:ELatentEnv,
  type:EFileType
) => {
  return [
    `${type}.env`,
    `${type}.${env}.env`,
    `${env}.${type}.env`,
  ]
}
