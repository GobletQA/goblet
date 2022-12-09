import type { TooltipProps } from '@mui/material/Tooltip'

import Box from '@mui/material/Box'
import { ComponentType } from 'react'
import { cls } from '@keg-hub/jsutils'
import { Tooltip } from '@components/Tooltip'
import { IconButton } from '@components/Buttons'

export type TEditorActionProps = {
  loc?:TooltipProps['placement']
  tooltip:string
  fontSize?:string
  className?:string
  enterDelay?:number
  Icon:ComponentType<any>
  onClick?:(...args:any[]) => any
}

export const EditorAction = (props:TEditorActionProps) => {
  const {
    Icon,
    tooltip,
    onClick,
    className,
    loc=`right`,
    enterDelay=500,
    fontSize=`10px`,
  } = props

  return (
    <Box className={cls('goblet-editor-action', className)}>
      <Tooltip
        loc={loc}
        describeChild
        title={tooltip}
        fontSize={fontSize}
        enterDelay={enterDelay}
      >
        <IconButton
          Icon={Icon}
          onClick={onClick}
        />
      </Tooltip>
    </Box>
  )
  
}