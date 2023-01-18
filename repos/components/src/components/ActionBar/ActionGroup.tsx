import { CSSProperties } from 'react'
import type { TBrowserAction } from '@GBC/types'

import { cls } from '@keg-hub/jsutils'
import { BarAction } from './BarAction'
import { ActionGroupContainer } from './ActionBar.styled'
import { useRefText } from '@GBC/hooks/actions/useRefText'

export type TActionGroupActions = TBrowserAction[] & {
  id?:string
  key?:string
  name:string
  className?:string
  groupSx?:CSSProperties
}

export type TActionGroup = {
  id?:string
  key?:string
  name:string
  className?:string
  groupSx?: CSSProperties
  actions: TBrowserAction[]
}

export const ActionGroup = (props:TActionGroup) => {
  const {
    actions,
    groupSx,
    className,
  } = props

  const refText = useRefText(props)

  return (
    <ActionGroupContainer
      sx={groupSx}
      id={`gb-bar-action-group-container-${refText}`}
      className={cls(
        `gb-bar-action-group-container`,
        `gb-bar-action-group-container-${refText}`,
        className
      )}
    >
      {actions.map(action => {
        return (
          <BarAction
            key={action.key || action.id || action.name}
            {...action}
          />
        )
      })}
    </ActionGroupContainer>
  )
}