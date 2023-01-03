import type { TBackgroundAst, TRaceFeature } from '@GBR/types'

import { Steps } from '../Steps'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
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
            type={ESectionType.background}
            title={background?.background}
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