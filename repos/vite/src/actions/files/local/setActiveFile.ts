
import { filesDispatch } from '@store'

export const setActiveFile = (location:string) => {
  filesDispatch.setActiveFile(location)
  return location
}
