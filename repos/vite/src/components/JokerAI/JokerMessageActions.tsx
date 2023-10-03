import type { TJokerAction, TJokerMessage } from '@types'


import {
  JokerMessageActionText,
  JokerMessageActionContainer,
  JokerMessageActionsContainer,
} from './JokerMessage.styled'
import {cls} from '@keg-hub/jsutils'


export const JokerMessageAction = (props:TJokerAction) => {
  const {
    id,
    kind,
    label,
    variant,
} = props
  
  return (
    <JokerMessageActionContainer
      key={id}
      variant={variant || `contained`}
      className={cls(
        `gb-joker-message-action`,
        `gb-joker-message-action-${kind}`
      )}
      text={(
        <JokerMessageActionText className='gb-joker-message-action-text' >
          {label}
        </JokerMessageActionText>
      )}
    />
  )
}

export const JokerMessageActions = (props:TJokerMessage) => {
  const {
    actions
  } = props

  return actions?.length && (
    <JokerMessageActionsContainer className='gb-joker-message-actions-container' >
      {actions.map(action => <JokerMessageAction key={action.key || action.id} {...action} />)}
    </JokerMessageActionsContainer>
  ) || null
}

