import { TFileModel } from '@types'
import { filesDispatch } from '@store'

/**
 * sets the currently activeFile as an item in pendingFiles. given a valid pendingContent
 */
export const setPendingFile = (pendingContent:string, activeFile:TFileModel) => {
  activeFile &&
    activeFile?.content !== pendingContent &&
    filesDispatch.setPending({ [activeFile.location]: pendingContent })
}
