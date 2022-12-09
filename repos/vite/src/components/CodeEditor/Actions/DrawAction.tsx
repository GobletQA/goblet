import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import { EditorAction } from './EditorAction'
import { ModeEditIcon } from '@components/Icons'

const DrawComp = (props:TEditorActionProps) => {
  return (
    <EditorAction
      Icon={ModeEditIcon}
      onClick={props.onClick}
      className='goblet-browser-free-draw'
      tooltip='Free draw on top of the browser'
    />
  )
}

export const DrawAction:TEditorAction = {
  Component: DrawComp,
  name: `draw-browser-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - Draw a line on the page -------`)
  }
}