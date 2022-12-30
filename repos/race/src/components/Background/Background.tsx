import type { TBackgroundAst, TRaceFeature } from '@GBR/types'

import { Steps } from '../Steps'
import { AddItem } from '../AddItem'
import { ESectionType } from '../../types'
import { capitalize } from '@keg-hub/jsutils'
import { Section, SectionHeader } from '../Section'


export type TBackground = {
  parent:TRaceFeature
  background?:TBackgroundAst
}

export const Background = (props:TBackground) => {

  const { background, parent } = props

  return background
    ? (
        <Section type={ESectionType.background} >
          <SectionHeader
            underline={true}
            type={ESectionType.scenario}
            title={background?.background?.trim() ||capitalize(ESectionType.background)}
          />
          <Steps parent={background} />
        </Section>
      )
    : (
        <AddItem
          parentId={parent.uuid}
          type={ESectionType.background}
        />
      )
  
  
}