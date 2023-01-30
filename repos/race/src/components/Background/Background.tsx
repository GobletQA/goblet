import type { TBackgroundAst, TRaceFeature } from '@GBR/types'

import { Steps } from '../Steps'
import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { Container, Dropdown } from '../Shared'
import { Section, SectionHeader } from '../Section'
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
    <Container
      elevation={0}
      className='gr-background-container'
    >
      { background 
          ? (
              <Dropdown
                id={parent.uuid}
                initialExpand={false}
                headerText={`BACKGROUND`}
                className='gr-background-dropdown'
                // actions={[
                //   <IconButton
                //     key='trash-story'
                //     Icon={TrashIcon}
                //     onClick={onTrash}
                //   />
                // ]}
              >
                <Section
                  stack={2}
                  type={ESectionType.background}
                >
                  <Steps parent={background} />
                </Section>
              </Dropdown>
            )
          : (
              <AddItem
                onClick={onClick}
                parentId={parent.uuid}
                type={ESectionType.background}
              />
            )
      }
    </Container>
  )
}