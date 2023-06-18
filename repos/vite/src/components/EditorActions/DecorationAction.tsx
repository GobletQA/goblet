import type { TMenuItem } from '@gobletqa/components'

import { BackspaceTagIcon } from '@gobletqa/components'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'

export const DecorationAction:TMenuItem = {
  closeMenu:true,
  Icon: BackspaceTagIcon,
  text: `Clear Test Decorations`,
  id:`decoration-editor-action`,
  key:`decoration-editor-action`,
  tooltip: {
    loc: `right`,
    describeChild: true,
    title: `Clear test result decorations from the editor`,
  },
  onClick: async (event, editor, loc, content) => {
    if(!loc) return console.warn(`Can not clear decorations, no active file.`)
    clearEditorDecorations(loc)
  },
}