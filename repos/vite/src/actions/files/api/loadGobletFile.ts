import { setFile } from '../local/setFile'
import { filesApi } from '@services/filesApi'
import { addToast } from '../../toasts/addToast'

/**
 * Loads a goblet default file ( step definition ) from the backend
 */
export const loadGobletFile = async (
  location:string,
  cache:boolean=true
) => {

  if (!location)
    return addToast({
      type: `warn`,
      message: `A File location is required to load a file`,
    })

  const resp = await filesApi.loadGobletFile(location)

  if(!resp)
    return addToast({
      type: `warn`,
      message: `Could not load file ${location} from the API!`,
    })

  const file = resp?.data?.file

  cache && setFile(file)

  return file
}
