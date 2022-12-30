import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { EditorAction } from './EditorAction'
import { CropSquareIcon } from '@gobletqa/components'


const SquareComp = (props:TSidebarActionProps) => {
  return (
    <EditorAction
      onClick={props.onClick}
      Icon={CropSquareIcon}
      className='goblet-browser-square-draw'
      tooltip='Draw a square in the browser'
    />
  )
}

export const SquareAction:TSidebarAction = {
  Component: SquareComp,
  name: `square-browser-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - draw a square on the page -------`)
  }
}