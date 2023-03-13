import type { TBackgroundParentAst } from '@GBR/types'
import type { TStepAst, TBackgroundAst } from '@ltipton/parkin'

import { Steps } from '../Steps'
import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { EditTitle } from '../Title/EditTitle'
import { EmptySteps } from '../Steps/EmptySteps'
import { StepAddIcon } from '@gobletqa/components'
import { EditTitleAct } from '../Actions/EditTitle'
import { Section, SectionHeader } from '../Section'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'
import { copyBackground } from '@GBR/actions/background/copyBackground'

export type TBackground = {
  background:TBackgroundAst
  parent:TBackgroundParentAst
  onAddStep:(parentId:string) => any
  onRemove:(parentId:string) => any
  onRemoveStep:(stepId:string, parentId:string) => any
  onChangeStep:(step:TStepAst, parentId?:string) => any
  onChange:(background:TBackgroundAst, parentId:string) => any
}

const styles = {
  title: {
    marginTop:`10px`,
    marginBottom:`30px`,
    padding: `0px 10px`,
  }
}

export const Background = (props:TBackground) => {

  const {
    parent,
    onChange,
    onRemove,
    onAddStep,
    background,
    onRemoveStep,
    onChangeStep
  } = props
  
  const onPlay = () => {}
  const onRemoveBackground = () => onRemove?.(parent.uuid)
  const onAddBackgroundStep = () => onAddStep?.(parent.uuid)
  const onCopyBackground = () => background && copyBackground(background)
  const onStepChange = (updated:TStepAst) => onChangeStep?.(updated, parent.uuid)
  const onRemoveBackgroundStep = (stepId:string) => onRemoveStep?.(stepId, parent.uuid)

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


  return (
    <Section
      parent={parent}
      initialExpand={false}
      show={Boolean(background)}
      type={ESectionType.background}
      className='gb-background-section'
      id={`${parent.uuid}-background-${background?.uuid || ''}`}
      label={(
        <SectionHeader
          content={' '}
          type={ESectionType.background}
        />
      )}
      actions={[
        (
          <EditTitleAct
            label={`Description`}
            editing={editingTitle}
            onClick={toggleEditTitle}
            type={ESectionType.background}
            key={`gb-background-edit-title-action`}
          />
        ),
        (
          <AddAct
            Icon={StepAddIcon}
            onClick={onAddBackgroundStep}
            type={ESectionType.step}
            key={`gb-background-add-step-action`}
          />
        ),
        (
          <DeleteAct
            onClick={onRemoveBackground}
            type={ESectionType.background}
            key={`gb-background-delete-action`}
          />
        ),
        (
          <CopyAct
            onClick={onCopyBackground}
            type={ESectionType.background}
            key={`gb-background-copy-action`}
          />
        ),
        (
          <PlayAct
            onClick={onPlay}
            type={ESectionType.background}
            key={`gb-background-play-action`}
          />
        ),
      ]}
    >

      {showTitle && (
        <EditTitle
          sx={styles.title}
          value={sectionTitle}
          label={`Description`}
          onBlur={onEditTitle}
          uuid={background.uuid}
          type={ESectionType.background}
        />
      ) || null}

      <Steps
        showAdd={false}
        onAdd={onAddBackgroundStep}
        parent={background}
        onChange={onStepChange}
        onRemove={onRemoveBackgroundStep}
        parentType={ESectionType.background}
      />

      {isNamed && (
        <EmptySteps
          onAdd={onAddBackgroundStep}
          parent={background}
          parentType={ESectionType.background}
        />
      ) || null}
    </Section>
  )
}