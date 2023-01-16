import type { TBrowserAction } from '../../types'

import { ActionContainer } from './ActionBar.styled'
import { useJoinSx } from '@GBC/hooks/theme/useJoinSx'

export const BarAction = (props:TBrowserAction) => {
  const {
    sx,
    style,
    Component,
    ...rest
  } = props
  const styles = useJoinSx(sx, style)

  return (
    <ActionContainer
      className='gb-bar-action-container'
      id={`gb-bar-action-container-${props.id || props.name.replace(` `, `-`)}`}
    >
      <Component
        {...rest}
        sx={styles}
      />
    </ActionContainer>
  )
}