import type { ReactNode } from 'react'

import { DecoTypes } from './DecoTypes'
import { DecoContainer } from './Deco.styled'
import { useDecoId } from '@GBR/hooks/decorations/useDecoId'
import {
  Tooltip
} from '@gobletqa/components'

export type TDecoText = {
  id?:string
  children:ReactNode
}

export const DecoText = (props:TDecoText) => {
  const { children } = props
  const deco = useDecoId(props)
  const Component = deco && DecoTypes[deco.decoType as keyof typeof DecoTypes]
  if(!deco || !Component)
    return (<>{children}</>)

  const {
    className,
    glyphMarginHoverMessage
  } = deco.options

  return (
    <DecoContainer className={`gb-deco-container ${className}`} >
      <Tooltip
        loc='bottom'
        describeChild
        enterDelay={300}
        title={glyphMarginHoverMessage.value}
      >
        <Component deco={deco} >
          {children}
        </Component>
      </Tooltip>
    </DecoContainer>
  )
}