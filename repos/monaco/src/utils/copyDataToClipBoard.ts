import { Clipboard } from '@gobletqa/components'

export const copyDataToClipBoard = (data: string, callback?: (res: boolean) => void) => {
  Clipboard.copy({ callback, content: data })
}
