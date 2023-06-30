import type { TRaceBackgroundParent, TRaceBackground, TRaceStep } from '@GBR/types'

import { Steps } from '../Steps'
import { EditTitle } from '../Title/EditTitle'
import { EmptySteps } from '../Steps/EmptySteps'
import { Section, SectionHeader } from '../Section'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'
import { useSectionActions } from '@GBR/hooks/editor/useSectionActions'
import { useBackgroundActions } from '@GBR/hooks/actions/useBackgroundActions'

export type TBackground = {
  background:TRaceBackground
  parent:TRaceBackgroundParent
  onAddStep:(parentId:string) => any
  onRemove:(parentId:string) => any
  onRemoveStep:(stepId:string, parentId:string) => any
  onChangeStep:(step:TRaceStep, parentId?:string) => any
  onChange:(background:TRaceBackground, parentId:string) => any
}

export const Background = (props:TBackground) => {

  const {
    parent,
    onChange,
    background,
  } = props

  const {
    onStepMove,
    onStepChange,
    // onCopyBackground,
    onRemoveBackground,
    onAddBackgroundStep,
    onRemoveBackgroundStep,
  } = useBackgroundActions(props)

  const {
    isNamed,
    showTitle,
    onEditTitle,
    sectionTitle,
    editingTitle,
    toggleEditTitle,
  } = useEditSectionTitle({
    title: background.background,
    key: EGherkinKeys.background,
    callback: (update?:string) => {
      background.background !== update
        && onChange?.(
            {...background, background: update || background.background },
            parent.uuid
          )
    },
  })

  const actions = useSectionActions({
    editingTitle,
    toggleEditTitle,
    item: background,
    // onCopy: onCopyBackground,
    onRemove: onRemoveBackground,
    onAddStep: onAddBackgroundStep,
    type: ESectionType.background,
  })

  return (
    <Section
      parent={parent}
      actions={actions}
      id={background.uuid}
      show={Boolean(background)}
      type={ESectionType.background}
      className='gb-background-section'
      label={(
        <SectionHeader
          id={background.uuid}
          content={sectionTitle}
          type={ESectionType.background}
        />
      )}
    >

      {showTitle && (
        <EditTitle
          value={sectionTitle}
          onBlur={onEditTitle}
          uuid={background.uuid}
          type={ESectionType.background}
        />
      ) || null}

      <Steps
        gran={parent}
        showAdd={false}
        parent={background}
        onMove={onStepMove}
        onChange={onStepChange}
        onAdd={onAddBackgroundStep}
        onRemove={onRemoveBackgroundStep}
        parentType={ESectionType.background}
      >
        {isNamed && (
          <EmptySteps
            parent={background}
            onAdd={onAddBackgroundStep}
            parentType={ESectionType.background}
          />
        ) || null}
      </Steps>
    </Section>
  )
}