
import { Steps } from '../Steps'
import { AddItem } from '../AddItem'
import { ESectionType } from '../../types'
import { useFeature } from '../../contexts'
import { capitalize } from '@keg-hub/jsutils'
import { Section, SectionHeader } from '../Section'


export type TBackground = {}

export const Background = (props:TBackground) => {
  const { feature } = useFeature()
  const { background } = feature
  
  return (
    <Section
      type={ESectionType.background}
      title={background?.background}
    >
      <SectionHeader
        underline={true}
        type={ESectionType.scenario}
        title={background?.background.trim() ||capitalize(ESectionType.background)}
      />
      {
        background
          ? (<Steps parent={background} />)
          : (<AddItem parentId={feature.uuid} type={ESectionType.background} />)
      }
    </Section>
  )
}