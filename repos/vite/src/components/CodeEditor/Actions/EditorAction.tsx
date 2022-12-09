import type { TooltipProps } from '@mui/material/Tooltip'
import type { ComponentType } from 'react'

import { useMemo } from 'react'
import Box from '@mui/material/Box'
import { cls, isStr } from '@keg-hub/jsutils'
import { Tooltip } from '@components/Tooltip'
import { IconButton } from '@components/Buttons'

export type TEditorActionProps = {
  loc?:TooltipProps['placement']
  tooltip:string
  fontSize?:string
  disabled?:boolean
  className?:string
  enterDelay?:number
  disabledTooltip?:string
  Icon:ComponentType<any>
  onClick?:(...args:any[]) => any
}

const useToolTipText = (props:TEditorActionProps) => {
  const {
    tooltip,
    disabled,
    disabledTooltip
  } = props

  return useMemo(() => {
    return !disabled
      ? tooltip
      : isStr(disabledTooltip)
        ? disabledTooltip
        : isStr(tooltip)
          ? `DISABLED - ${tooltip}`
          : tooltip
  }, [
    tooltip,
    disabled,
    disabledTooltip
  ])
}

export const EditorAction = (props:TEditorActionProps) => {
  const {
    Icon,
    onClick,
    disabled,
    className,
    loc=`right`,
    enterDelay=500,
    fontSize=`12px`,
  } = props

  const title = useToolTipText(props)
  const sx = useMemo(() => ({ cursor: disabled ? `not-allowed` : `auto` }), [disabled])

  return (
    <Tooltip
      loc={loc}
      describeChild
      title={title}
      fontSize={fontSize}
      enterDelay={enterDelay}
    >
      <Box
        sx={sx}
        className={cls('goblet-editor-action', className)}
      >
        <IconButton
          Icon={Icon}
          onClick={onClick}
          disabled={disabled}
        />
      </Box>
    </Tooltip>
  )
  
}