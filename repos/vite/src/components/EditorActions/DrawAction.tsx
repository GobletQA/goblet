import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { EditorAction } from './EditorAction'
import { ModeEditIcon } from '@gobletqa/components'

const DrawComp = (props:TSidebarActionProps) => {
  return (
    <EditorAction
      Icon={ModeEditIcon}
      onClick={props.onClick}
      className='goblet-browser-free-draw'
      tooltip='Free draw in the browser'
    />
  )
}

export const DrawAction:TSidebarAction = {
  Component: DrawComp,
  name: `draw-browser-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - Draw a line on the page -------`)
  }
}