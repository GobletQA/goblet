import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import Box from '@mui/material/Box'
import { IconButton } from '@components/Buttons'
import { CropSquareIcon } from '@components/Icons'


const SquareComp = (props:TEditorActionProps) => {
  return (
    <Box className='goblet-run-tests-btn-main'>
      <IconButton
        onClick={props.onClick}
        Icon={CropSquareIcon}
      />
    </Box>
  )
}

export const SquareAction:TEditorAction = {
  Component: SquareComp,
  name: `square-browser-action`,
  onClick: async (event, editor, loc, content) => {
    console.log(`------- TODO - draw a square on the page -------`)
  }
}