import type { TBrowserAction, TBrowserActionProps } from '@gobletqa/components'

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
  name: `record-browser-action`,
  containerSx: {
    marginLeft: gutter.margin.hpx,
  },
}