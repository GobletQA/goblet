import type { ReactNode } from 'react'

import { DecoTypes } from './DecoTypes'
import { DecoContainer } from './Deco.styled'
import { useDecoId } from '@GBR/hooks/decorations/useDecoId'

export type TDecoText = {
  id?:string
  children:ReactNode
}

export const DecoText = (props:TDecoText) => {
  const { children } = props
  const deco = useDecoId(props)
  const Component = deco && DecoTypes[deco.type]

    return !Component
      ? (<>{children}</>)
      : (
          <DecoContainer className='gb-deco-container' >
            <Component deco={deco} >
              {children}
            </Component>
          </DecoContainer>
        )
}