import { PlayerClearDecorationEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'

/**
 * Emits a PlayerClearDecorationEvt event to clear decorations from the monaco editor
 */
export const clearEditorDecorations = (location:string) => {
  EE.emit(PlayerClearDecorationEvt, { location })
}