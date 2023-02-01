import type { TBackgroundAst, TRaceFeature } from '@GBR/types'

import { Steps } from '../Steps'
import { Section } from '../Shared'
import { Add } from '../Actions/Add'
import { ESectionType } from '@GBR/types'
import { Delete } from '../Actions/Delete'

import {
  addBackground,
  removeBackground,
  addBackgroundStep,
  removeBackgroundStep,
} from '@GBR/actions/background'

export type TBackground = {
  parent:TRaceFeature
  background?:TBackgroundAst
}

export const Background = (props:TBackground) => {

  const { background, parent } = props

  return (
    <Section
      parent={parent}
      initialExpand={true}
      onAdd={addBackground}
      show={Boolean(background)}
      type={ESectionType.background}
      className='gr-background-section'
      id={`${parent.uuid}-background-${background?.uuid || ''}`}
      actions={[
        Add({
          onClick: addBackgroundStep,
          type: ESectionType.background,
        }),
        Delete({
          onClick: removeBackground,
          type: ESectionType.background,
        })
      ]}
    >
      {background && (
        <Steps
          parent={background}
          onAdd={addBackgroundStep}
          onRemove={removeBackgroundStep}
        />
      ) || null}
    </Section>
  )
}