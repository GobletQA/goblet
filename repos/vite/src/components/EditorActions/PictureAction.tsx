import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { EditorAction } from './EditorAction'
import { CameraAltIcon } from '@components/Icons'


const PictureComp = (props:TSidebarActionProps) => {
  return (
    <EditorAction
      Icon={CameraAltIcon}
      onClick={props.onClick}
      className='goblet-browser-picture'
      tooltip='Take a picture of the browser'
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