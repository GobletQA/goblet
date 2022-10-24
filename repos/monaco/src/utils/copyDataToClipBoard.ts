import type { TCCBOpts } from '../../../shared/src/frontend/dom'
import { Clipboard } from '../../../shared/src/frontend/dom'

export const copyDataToClipBoard = (data: string, callback?: (res: boolean) => void) => {
  Clipboard.copy(data, { callback } as TCCBOpts)
}
