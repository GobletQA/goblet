import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import Box from '@mui/material/Box'
import { IconButton } from '@components/Buttons'
import { CameraAltIcon } from '@components/Icons'


const PictureComp = (props:TEditorActionProps) => {
  return (
    <Box className='goblet-run-tests-btn-main'>
      <IconButton
        onClick={props.onClick}
        Icon={CameraAltIcon}
      />
    </Box>
  )
}

export const PictureAction:TEditorAction = {
  Component: PictureComp,
  name: `picture-browser-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - Take a Picture of the page -------`)
  }
}