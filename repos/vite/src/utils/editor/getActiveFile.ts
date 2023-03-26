import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { GetActiveFileEvent } from '@gobletqa/components'

export type TActiveFile = {
  content: string
  location: string
}

export type TGetActiveFile = (props:TActiveFile) => void

/**
 * Helper to get the currently active feature from the context
 * Accepts a callback that will be called with the current feature context
 */
const withFile = (cb:TGetActiveFile) => {
  EE.emit(GetActiveFileEvent, { cb })
}

export const getActiveFile = async ():Promise<TActiveFile> => {
  return await new Promise<TActiveFile>((res) => withFile(
    ({ content, location }) => res({ content, location }))
  )
}