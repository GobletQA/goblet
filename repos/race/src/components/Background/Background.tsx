import type { MouseEvent } from 'react'
import type { TBackgroundAst, TRaceFeature } from '@GBR/types'

import { Steps } from '../Steps'
import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'
import { Delete } from '../Actions/Delete'
import { stopEvent, useInline } from '@gobletqa/components'
import { addBackground, addBackgroundStep } from '@GBR/actions/background'

export type TBackground = {
  parent:TRaceFeature
  background?:TBackgroundAst
}

export const Background = (props:TBackground) => {

  const { background, parent } = props
  const onClick = useInline(() => addBackground())
  const onTrash = useInline((evt:MouseEvent) => {
    stopEvent(evt)
  })

  return (
    <Section
      onAdd={onClick}
      parent={parent}
      initialExpand={true}
      show={Boolean(background)}
      type={ESectionType.background}
      className='gr-background-section'
      id={`${parent.uuid}-background-${background?.uuid || ''}`}
      actions={[
        Delete({
          onClick: onTrash,
          type: ESectionType.background,
        })
      ]}
    >
      {background && (
        <Steps
          parent={background}
          onAdd={addBackgroundStep}
        />
      ) || null}
    </Section>
  )
}