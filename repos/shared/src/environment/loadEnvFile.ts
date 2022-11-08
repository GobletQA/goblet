
import path from 'path'
import { loadEnvSync } from '@keg-hub/parse-config'
import { getPathFromConfig } from '../utils/getPathFromConfig'

type TLoadEnvFile = {
  file?:string
  error?:boolean
  location?:string
}

export const loadEnvFile = ({
  file,
  location,
  error=false,
}: TLoadEnvFile):Record<string, any> => {
  const environmentsDir = getPathFromConfig(`environmentsDir`)
  const loc = location || path.join(environmentsDir, file)

  return loadEnvSync({
    error,
    location: loc
  })
}