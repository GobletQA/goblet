import type { TBrowserAction } from '../../types'
import { ActionBarContainer } from './ActionBar.styled'
import { BarAction } from './BarAction'

export type TActionBar = {
  actions: TBrowserAction[]
}

export const ActionBar = (props:TActionBar) => {

  const {
    actions
  } = props
  
  return (
    <ActionBarContainer
      className='action-bar-container'
    >
      {actions.map(action => {
        return (
          <BarAction
            key={action.key || action.id || action.name}
            {...action}
          />
        )
      })}
    </ActionBarContainer>
  )
}