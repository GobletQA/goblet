import type { TBrowserAction } from '../../types'

import { cls } from '@keg-hub/jsutils'
import { ActionContainer } from './ActionBar.styled'
import { useJoinSx } from '@GBC/hooks/theme/useJoinSx'
import { useRefText } from '@GBC/hooks/actions/useRefText'

export const BarAction = (props:TBrowserAction) => {
  const {
    sx,
    style,
    Component,
    containerSx,
    containerClassName,
    ...rest
  } = props

  const refText = useRefText(props)
  const styles = useJoinSx(sx, style)

  return (
    <ActionContainer
      sx={containerSx}
      className={cls(
        `gb-bar-action-container`,
        `gb-bar-action-container-${refText}`,
        containerClassName
      )}
      id={`gb-bar-action-container-${refText}`}
    >
      {Component && (
        <Component
          {...rest}
          sx={styles}
        />
      ) || null}
    </ActionContainer>
  )
}