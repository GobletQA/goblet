import type { TEditorAction } from '@gobletqa/monaco'
import Box from '@mui/material/Box'

import { useCallback } from 'react'
import { IconButton } from '@components/Buttons'
import { PlayCircleOutlineIcon } from '@components/Icons'


const RunTests = () => {
  const onClick = useCallback(() => {
    console.log(`------- run tests -------`)
  }, [])
  
  
  return (
    <Box
      className='goblet-run-tests-btn-main'
    >
      <IconButton
        onClick={onClick}
        Icon={PlayCircleOutlineIcon}
      />
    </Box>
  )
}

export const RunTestsAction:TEditorAction = {
  Component: RunTests,
  name: `run-tests-action`,
}