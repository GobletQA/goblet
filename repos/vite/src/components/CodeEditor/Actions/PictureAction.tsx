import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import { EditorAction } from './EditorAction'
import { CameraAltIcon } from '@components/Icons'


const PictureComp = (props:TEditorActionProps) => {
  return (
    <EditorAction
      Icon={CameraAltIcon}
      onClick={props.onClick}
      className='goblet-browser-picture'
      tooltip='Take a picture of the browser'
    />
  )
}

export const PictureAction:TEditorAction = {
  Component: PictureComp,
  name: `picture-browser-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - Take a Picture of the page -------`)
  }
}