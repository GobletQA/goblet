import type { TEditorRefs } from '../../types'

import { Feature } from '../Feature'
import { BuilderContainer } from './Builder.styled'

export type TBuilder = TEditorRefs & {

}

export const Builder = (props:TBuilder) => {
  return (
    <BuilderContainer>
      <Feature />
    </BuilderContainer>
  )
}