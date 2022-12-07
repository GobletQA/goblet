import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import Box from '@mui/material/Box'

import { IconButton } from '@components/Buttons'
import { runTests } from '@actions/runner/runTests'
import { getFileModel } from '@utils/files/getFileModel'

import { PlayCircleOutlineIcon } from '@components/Icons'


const RunTests = (props:TEditorActionProps) => {
  return (
    <Box className='goblet-run-tests-btn-main'>
      <IconButton
        onClick={props.onClick}
        Icon={PlayCircleOutlineIcon}
      />
    </Box>
  )
}

export const RunTestsAction:TEditorAction = {
  Component: RunTests,
  name: `run-tests-action`,
  onClick: async (event, editor, loc, content) => {
    if(!loc) return console.warn(`Can not run tests, no active file.`)

    const fileModel = getFileModel(loc)
    
    if(!fileModel)
      return console.warn(`Can not run tests, File model could not be found.`, loc)

    await runTests(fileModel, `feature`)
  }
}