import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

import { getFileModel } from '@utils/files/getFileModel'
import { BaseAction, RadioButtonCheckedIcon, gutter } from '@gobletqa/components'

const RecordBrowser = (props:TBrowserActionProps) => {
  return (
    <BaseAction
      disabled
      tooltip=''
      as='button'
      loc='bottom'
      text='Record'
      variant='outlined'
      onClick={props.onClick}
      Icon={RadioButtonCheckedIcon}
      className='goblet-browser-record'
      disabledTooltip='COMING SOON - Record browser actions'
    />
  )
}

export const RecordAction:TBrowserAction = {
  Component: RecordBrowser,
  containerSx: {
    marginLeft: gutter.margin.hpx,
  },
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