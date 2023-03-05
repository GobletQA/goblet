import type { TRaceFeature } from '@GBR/types'
import type { TBackgroundAst } from '@ltipton/parkin'

import { Steps } from '../Steps'
import { AddAct } from '../Actions/Add'
import { PlayAct } from '../Actions/Play'
import { CopyAct } from '../Actions/Copy'
import { DeleteAct } from '../Actions/Delete'
import { EditTitle } from '../General/EditTitle'
import { EmptySteps } from '../Steps/EmptySteps'
import { StepAddIcon } from '@gobletqa/components'
import { EditTitleAct } from '../Actions/EditTitle'
import { Section, SectionHeader } from '../Section'
import { ESectionType, EGherkinKeys } from '@GBR/types'
import { useEditSectionTitle } from '@GBR/hooks/useEditSectionTitle'
import { copyBackground } from '@GBR/actions/background/copyBackground'
import { updateBackground } from '@GBR/actions/background/updateBackground'

import {
  removeBackground,
  addBackgroundStep,
  removeBackgroundStep,
  changeBackgroundStep
} from '@GBR/actions/background'

export type TBackground = {
  parent:TRaceFeature
  background:TBackgroundAst
}

const styles = {
  title: {
    marginTop:`10px`,
    marginBottom:`30px`,
    padding: `0px 10px`,
  }
}

export const Background = (props:TBackground) => {

  const { background, parent } = props
  const onCopyBackground = () => background && copyBackground(background)

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
        && updateBackground(background.uuid, { background: update })
    },
  })

  const onPlay = () => {}

  return (
    <Section
      parent={parent}
      initialExpand={true}
      show={Boolean(background)}
      type={ESectionType.background}
      className='gr-background-section'
      id={`${parent.uuid}-background-${background?.uuid || ''}`}
      label={
        isNamed
          ? (
              <SectionHeader
                content={sectionTitle}
                type={ESectionType.background}
              />
            )
          : undefined
      }
      actions={[
        (
          <EditTitleAct
            label={`Description`}
            editing={editingTitle}
            onClick={toggleEditTitle}
            type={ESectionType.background}
            key={`gr-background-edit-title-action`}
          />
        ),
        (
          <AddAct
            Icon={StepAddIcon}
            type={ESectionType.step}
            onClick={addBackgroundStep}
            key={`gr-background-add-step-action`}
          />
        ),
        (
          <DeleteAct
            onClick={removeBackground}
            type={ESectionType.background}
            key={`gr-background-delete-action`}
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
          <PlayAct
            onClick={onPlay}
            type={ESectionType.background}
            key={`gr-background-play-action`}
          />
        ),
      ]}
    >

      {showTitle && (
        <EditTitle
          sx={styles.title}
          value={sectionTitle}
          label={`Description`}
          onChange={onEditTitle}
          uuid={background.uuid}
          type={ESectionType.background}
        />
      )}

      <Steps
        showAdd={false}
        parent={background}
        onAdd={addBackgroundStep}
        onChange={changeBackgroundStep}
        onRemove={removeBackgroundStep}
      >
        <EmptySteps
        parent={background}
        onAdd={addBackgroundStep}
      />
      </Steps>
    </Section>
  )
}