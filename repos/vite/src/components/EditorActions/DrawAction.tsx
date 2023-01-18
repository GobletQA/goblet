import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { BaseAction, ModeEditIcon } from '@gobletqa/components'

const DrawComp = (props:TSidebarActionProps) => {
  return (
    <BaseAction
      disabled
      Icon={ModeEditIcon}
      onClick={props.onClick}
      className='goblet-browser-free-draw'
      tooltip=''
      disabledTooltip='COMING SOON - Free draw in the browser'
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