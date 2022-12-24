import type { TEditorRefs } from '../../types'

import { Model } from '../Model'
import { BuilderContainer } from './Builder.styled'

export type TBuilder = TEditorRefs & {

}

export const Builder = (props:TBuilder) => {
  return (
    <BuilderContainer>
      Builder
      
      <Model
      />
    </BuilderContainer>
  )
}