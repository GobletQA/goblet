import { EEditorType } from '@types'
import { EE } from '@services/sharedService'
import { GetActiveFileEvent } from '@gobletqa/components'

export type TActiveFile = {
  content: string
  location: string
  editor:EEditorType
  ast?:Record<any, any>
}

export type TGetActiveFile = (props:TActiveFile) => void

/**
 * Helper to get the currently active feature from the currently active editor
 * Returns a promise that resolves to the active file
 */
export const getActiveFile = async ():Promise<TActiveFile> => {
  return await new Promise<TActiveFile>((res) => EE.emit(
    GetActiveFileEvent,
    {cb:(activeFile:TActiveFile) => res(activeFile)}
  ))
}
