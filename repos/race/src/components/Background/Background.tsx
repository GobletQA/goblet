import type { TBackgroundAst, TRaceFeature } from '@GBR/types'

import { Steps } from '../Steps'
import { Section } from '../Shared'
import { ESectionType } from '@GBR/types'
import { addBackground } from '@GBR/actions/background'
import { stopEvent, IconButton, TrashIcon, useInline } from '@gobletqa/components'

export type TBackground = {
  parent:TRaceFeature
  background?:TBackgroundAst
}

export const Background = (props:TBackground) => {

  const { background, parent } = props
  const onClick = useInline(() => addBackground())

  return (
    <Section
      onAdd={onClick}
      parent={parent}
      initialExpand={true}
      show={Boolean(background)}
      type={ESectionType.background}
      className='gr-background-section'
      id={`${parent.uuid}-background-${background?.uuid || ''}`}
      // actions={[
      //   <IconButton
      //     key='trash-story'
      //     Icon={TrashIcon}
      //     onClick={onTrash}
      //   />
      // ]}
    >
      {background && <Steps parent={background} />}
    </Section>
  )
}