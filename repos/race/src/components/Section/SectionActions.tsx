
import { Actions, Action } from './Section.styled'

export type TSectionActions = {
  type:string
  actions:Record<string, any>[]
}

export type THeaderAction = {
  type:string
  action: Record<string, any>
}

const HeaderAction = (props:THeaderAction) => {
  const { action, type } = props

  return (
    <Action className='goblet-race-section-header-action' >
      Action
    </Action>
  )
}

export const SectionActions = (props:TSectionActions) => {
  const { actions, type }  = props
  
  return (
    <Actions className='goblet-race-section-header-actions' >
      {actions?.map(action => {
        return (<HeaderAction action={action} type={type} />)
      })}
    </Actions>
  )
  
}