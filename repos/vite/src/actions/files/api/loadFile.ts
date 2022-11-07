
import { loadApiFile } from '@utils/api'
import { setFile } from '../local/setFile'
import { addToast } from '../../toasts/addToast'


/**
 * Sets a test file as the activeFile, after loading it's fileModel from the backend
 * Then calls setActiveFileFromType to set the file Active
 */
export const loadFile = async (
  location:string,
) => {

  if (!location)
    return addToast({
      type: `warn`,
      message: `A File location is required to load a file`,
    })

  const resp = await loadApiFile({ location })

  if(!resp)
    return addToast({
      type: `warn`,
      message: `Could not load file ${location} from the API!`,
    })

  const file = resp?.data?.file

  setFile(file)

  return file
}
