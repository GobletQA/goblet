import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { EditorAction } from './EditorAction'
import { BackspaceTagIcon } from '@gobletqa/components'
import { clearEditorDecorations } from '@actions/runner/clearEditorDecorations'


const DecorationComp = (props:TSidebarActionProps) => {
  return (
    <EditorAction
      Icon={BackspaceTagIcon}
      onClick={props.onClick}
      className='goblet-decoration-action'
      tooltip='Clear test results from the editor'
    />
  )
}

export const DecorationAction:TSidebarAction = {
  Component: DecorationComp,
  name: `decoration-editor-action`,
  onClick: async (event, editor, loc, content) => {
    if(!loc) return console.warn(`Can not clear decorations, no active file.`)
    clearEditorDecorations(loc)
  }
}