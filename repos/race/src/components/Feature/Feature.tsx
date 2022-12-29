import { Section } from '../Section'
import { Scenarios } from '../Scenarios'
import { TSectionType } from '../../types'
import { useFeature } from '../../contexts'
import { EmptyFeature } from './EmptyFeature'

export type TFeature = {
  
}

export const Feature = (props:TFeature) => {
  const { feature } = useFeature()
  const name = feature?.feature || `Select a feature from the right`

  return !feature || !feature?.uuid
    ? (<EmptyFeature />)
    : (
        <Section
          title={name}
          type={TSectionType.feature}
        >
          <Scenarios />
        </Section>
      )
}