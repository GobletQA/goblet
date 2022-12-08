import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import Box from '@mui/material/Box'

import { IconButton } from '@components/Buttons'
import { getFileModel } from '@utils/files/getFileModel'
import { RadioButtonCheckedIcon } from '@components/Icons'


const RecordBrowser = (props:TEditorActionProps) => {
  return (
    <Box className='goblet-run-tests-btn-main'>
      <IconButton
        onClick={props.onClick}
        Icon={RadioButtonCheckedIcon}
      />
    </Box>
  )
}

export const RecordBrowserAction:TEditorAction = {
  Component: RecordBrowser,
  name: `record-browser-action`,
  onClick: async (event, editor, loc, content) => {
    if(!loc) return console.warn(`Can not record browser, no active file.`)

    const fileModel = getFileModel(loc)
    
    if(!fileModel)
      return console.warn(`Can not record browser, File model could not be found.`, loc)

    console.log(`------- TODO - Record Browser -------`)
    // await recordBrowser(fileModel, `feature`)
  }
}