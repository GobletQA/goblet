import type { TEditorAction, TEditorActionProps } from '@gobletqa/monaco'

import { EditorAction } from './EditorAction'
import { getFileModel } from '@utils/files/getFileModel'
import { RadioButtonCheckedIcon } from '@components/Icons'

const RecordBrowser = (props:TEditorActionProps) => {
  return (
    <EditorAction
      onClick={props.onClick}
      Icon={RadioButtonCheckedIcon}
      className='goblet-browser-record'
      tooltip='Record actions from the browser'
    />
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