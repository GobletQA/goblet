import type { TRaceFeature } from '@GBR/types'

import { P } from '@gobletqa/components'
import FeatureInfoImg from '@GBR/assets/empty-feature.png'
import {
  FeatureInfoGrid,
  FeatureInfoGridLeft,
  FeatureInfoGridRight,
  FeatureInfoTextContainer
} from './Feature.styled'

export type TFeatureInfo = {
  parent:TRaceFeature
}

export const FeatureInfo = (props:TFeatureInfo) => {
  const { parent } = props

  return (
    <FeatureInfoGrid
      container
      spacing={2}
      padding='20px'
    >

      <FeatureInfoGridLeft
        sm={4}
        padding='20px'
      >
        <img
          width={`100%`}
          src={FeatureInfoImg}
        />
      </FeatureInfoGridLeft>

      <FeatureInfoGridRight
        sm={8}
        display='flex'
        padding='20px'
        paddingTop="30px"
        alignItems='start'
        justifyContent='start'
      >
        <FeatureInfoTextContainer>
          <P>
            Feature files are a way to define instructions that can then be translated into a set steps a computer can understand. They contain high level description of the steps in a simple language format known as Gherkin.
          </P>
          <br/>
          <P>
            The Gherkin language is a combination of natural language and special keywords to give structure and meaning to the feature steps.
          </P>
        </FeatureInfoTextContainer>
      </FeatureInfoGridRight>
    </FeatureInfoGrid>
  )
  
}