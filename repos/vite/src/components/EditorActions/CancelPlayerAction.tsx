import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { BaseAction, ModeEditIcon } from '@gobletqa/components'

const CancelPlayerComp = (props:TSidebarActionProps) => {
  return (
    <BaseAction
      disabled
      Icon={ModeEditIcon}
      onClick={props.onClick}
      className='goblet-browser-cancel-player'
      tooltip=''
      disabledTooltip='COMING SOON - Cancel a running test'
    />
  )
}

export const CancelPlayerAction:TSidebarAction = {
  Component: CancelPlayerComp,
  name: `cancel-player-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - Cancel Player -------`)
  }
}