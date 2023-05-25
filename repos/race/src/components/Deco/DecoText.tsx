import type { ReactNode, CSSProperties } from 'react'

import { DecoTypes } from './DecoTypes'
import { useDecoId } from '@GBR/hooks/decorations/useDecoId'
import { DecoContainer, DecoLineHighlight } from './Deco.styled'
import {
  Tooltip
} from '@gobletqa/components'

export type TDecoText = {
  id?:string
  sx?:CSSProperties
  children:ReactNode
  containerSx?:CSSProperties
}

export const DecoText = (props:TDecoText) => {
  const {
    sx,
    children,
    containerSx
  } = props
  const deco = useDecoId(props)
  const Component = deco && DecoTypes[deco.decoType as keyof typeof DecoTypes]
  if(!deco || !Component)
    return (<>{children}</>)

  const {
    className,
    glyphMarginHoverMessage
  } = deco.options

  return (
    <>
      <DecoLineHighlight className={`gb-deco-line-highlight bottom ${className}`} />
      <DecoContainer
        sx={containerSx}
        className={`gb-deco-container ${className}`}
      >
        <Tooltip
          loc='bottom'
          describeChild
          enterDelay={300}
          title={glyphMarginHoverMessage.value}
        >
          <Component sx={sx} deco={deco} >
            {children}
          </Component>
        </Tooltip>
      </DecoContainer>
    </>
  )
}