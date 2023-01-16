
import { setFile } from '../local/setFile'
import { filesApi } from '@services/filesApi'
import { addToast } from '../../toasts/addToast'

/**
 * Sets a test file as the activeFile, after loading it's fileModel from the backend
 * Then calls setActiveFileFromType to set the file Active
 */
export const loadFile = async (
  location:string,
  cache:boolean=true
) => {

  if (!location)
    return addToast({
      type: `warn`,
      message: `A File location is required to load a file`,
    })

  const resp = await filesApi.loadFile(location)

  if(!resp)
    return addToast({
      type: `warn`,
      message: `Could not load file ${location} from the API!`,
    })

  const file = resp?.data?.file

  cache && setFile(file)

  return file
}
