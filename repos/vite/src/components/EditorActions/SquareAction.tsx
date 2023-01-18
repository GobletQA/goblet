import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { BaseAction, CropSquareIcon } from '@gobletqa/components'


const SquareComp = (props:TSidebarActionProps) => {
  return (
    <BaseAction
      disabled
      Icon={CropSquareIcon}
      onClick={props.onClick}
      className='goblet-browser-square-draw'
      tooltip=''
      disabledTooltip='COMING SOON - Draw a square in the browser'
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