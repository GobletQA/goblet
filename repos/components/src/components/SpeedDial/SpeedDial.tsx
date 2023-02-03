import type { MouseEvent, ComponentType, ReactNode, ComponentProps } from 'react'
import MuiSpeedDial from '@mui/material/SpeedDial'

import Box from '@mui/material/Box'
import { RenderType } from '../RenderType'
import { emptyArr } from '@keg-hub/jsutils'
import { Dial, DialIcon, DialAction } from './SpeedDial.styled'


export type TSpeedDialAct = {
  name: string
  label?:string
  iconProps?:ComponentProps<any>
  Icon: ReactNode|ComponentType<any>
  onClick:(e:MouseEvent<HTMLDivElement>) => void
}

export type TSpeedDial = Omit<ComponentProps<typeof MuiSpeedDial>, `ariaLabel`> & {
  ariaLabel?:string
  actions?:TSpeedDialAct[]
  iconProps?:ComponentProps<any>
  Icon?:ReactNode|ComponentType<any>
}

export const SpeedDial = (props:TSpeedDial) => {
  const {
    iconProps,
    Icon=DialIcon,
    ariaLabel=`Goblet Speed Dial`,
    actions=emptyArr as TSpeedDialAct[],
    ...rest
  } = props

  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <Dial
        {...rest}
        icon={<RenderType Component={Icon} props={iconProps} />}
        ariaLabel={ariaLabel}
      >
        {actions.map((action) => (
          <DialAction
            key={action.name}
            onClick={action.onClick}
            tooltipTitle={action.label || action.name}
            icon={<RenderType Component={action.Icon} props={action.iconProps} />}
          />
        ))}
      </Dial>
    </Box>
  )
}