import type { TBrowserAction } from '@GBC/types'
import type { TActionGroupActions } from './ActionGroup'

import { BarAction } from './BarAction'
import { isArr } from '@keg-hub/jsutils'
import { ActionGroup } from './ActionGroup'
import { ActionBarContainer } from './ActionBar.styled'

export type TActionBar = {
  actions: (TBrowserAction|TActionGroupActions)[]
}

const getKey = (action:TBrowserAction|TActionGroupActions) => {
  const key = action.key || action.id || action.name
  if(key) return key

  const item = (action as TActionGroupActions)?.[0]
  return item.key || item.id || item.name
}

export const ActionBar = (props:TActionBar) => {

  const {
    actions
  } = props

  return (
    <ActionBarContainer className='action-bar-container'>
      {actions.map(action => {
        const key = getKey(action)

        return isArr<TBrowserAction[]>(action)
          ? (
              <ActionGroup
                key={key}
                id={action.id}
                name={action.name}
                groupSx={action.groupSx}
                className={action.className}
                actions={action as TBrowserAction[]}
              />
            )
          : (<BarAction key={key} {...action} />)

      })}
    </ActionBarContainer>
  )
}