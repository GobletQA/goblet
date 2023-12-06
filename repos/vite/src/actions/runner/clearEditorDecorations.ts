import { EE } from '@services/sharedService'
import { PlayerClearDecorationEvt } from '@constants'

/**
 * Emits a PlayerClearDecorationEvt event to clear decorations from the monaco editor
 */
export const clearEditorDecorations = (location:string) => {
  EE.emit(PlayerClearDecorationEvt, { location })
}