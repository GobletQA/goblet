import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { BaseAction, CameraAltIcon } from '@gobletqa/components'


const PictureComp = (props:TSidebarActionProps) => {
  return (
    <BaseAction
      disabled
      Icon={CameraAltIcon}
      onClick={props.onClick}
      className='goblet-browser-picture'
      tooltip=''
      disabledTooltip='COMING SOON - Take a picture of the browser'
    />
  )
}

export const PictureAction:TSidebarAction = {
  Component: PictureComp,
  name: `picture-browser-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - Take a Picture of the page -------`)
  }
}