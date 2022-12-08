import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import Box from '@mui/material/Box'
import { IconButton } from '@components/Buttons'
import { ModeEditIcon } from '@components/Icons'

const DrawComp = (props:TEditorActionProps) => {
  return (
    <Box className='goblet-run-tests-btn-main'>
      <IconButton
        onClick={props.onClick}
        Icon={ModeEditIcon}
      />
    </Box>
  )
}

export const DrawAction:TEditorAction = {
  Component: DrawComp,
  name: `draw-browser-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - Draw a line on the page -------`)
  }
}