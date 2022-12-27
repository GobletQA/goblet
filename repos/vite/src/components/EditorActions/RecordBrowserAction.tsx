import type { TSidebarAction, TSidebarActionProps } from '@gobletqa/components'

import { EditorAction } from './EditorAction'
import { getFileModel } from '@utils/files/getFileModel'
import { RadioButtonCheckedIcon } from '@components/Icons'

const RecordBrowser = (props:TSidebarActionProps) => {
  return (
    <EditorAction
      onClick={props.onClick}
      Icon={RadioButtonCheckedIcon}
      className='goblet-browser-record'
      tooltip='Record browser actions'
    />
  )
}

export const RecordBrowserAction:TSidebarAction = {
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