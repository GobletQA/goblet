import type { TBackgroundAst, TRaceFeature } from '@GBR/types'

import { Steps } from '../Steps'
import { Section } from '../Section'
import { AddAct } from '../Actions/Add'
import { ESectionType } from '@GBR/types'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { EmptySteps } from '../Steps/EmptySteps'
import { StepAddIcon } from '@gobletqa/components'
import { copyBackground } from '@GBR/actions/background/copyBackground'

import {
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
  const onCopyBackground = () => background && copyBackground(background)

  return (
    <Section
      parent={parent}
      initialExpand={true}
      show={Boolean(background)}
      type={ESectionType.background}
      className='gr-background-section'
      id={`${parent.uuid}-background-${background?.uuid || ''}`}
      actions={[
        (
          <AddAct
            Icon={StepAddIcon}
            type={ESectionType.step}
            onClick={addBackgroundStep}
            key={`gr-background-add-step-action`}
          />
        ),
        (
          <CopyAct
            onClick={onCopyBackground}
            type={ESectionType.background}
            key={`gr-background-copy-action`}
          />
        ),
        (
          <DeleteAct
            onClick={removeBackground}
            type={ESectionType.background}
            key={`gr-background-delete-action`}
          />
        )
      ]}
    >
      {background && (
        <Steps
          showAdd={false}
          parent={background}
          onAdd={addBackgroundStep}
          onRemove={removeBackgroundStep}
        >
         <EmptySteps
          parent={background}
          onAdd={addBackgroundStep}
        />
        </Steps>
      ) || null}
    </Section>
  )
}