import type { TBrowserAction } from '@GBC/types'
import type { TActionGroupActions } from './ActionGroup'

import { ActionBarContainer } from './ActionBar.styled'
import { BarAction } from './BarAction'
import { ActionGroup } from './ActionGroup'
import { isArr, } from '@keg-hub/jsutils'

export type TActionBar = {
  actions: (TBrowserAction|TActionGroupActions)[]
}

export const ActionBar = (props:TActionBar) => {

  const {
    actions
  } = props
  
  return (
    <ActionBarContainer className='action-bar-container'>
      {actions.map(action => {
        return isArr<TBrowserAction[]>(action)
          ? (
              <ActionGroup
                id={action.id}
                name={action.name}
                groupSx={action.groupSx}
                className={action.className}
                actions={action as TBrowserAction[]}
                key={action.key || action.id || action.name}
              />
            )
          : (
              <BarAction
                key={action.key || action.id || action.name}
                {...action}
              />
            )
      })}
    </ActionBarContainer>
  )
}