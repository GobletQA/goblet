import type { TRaceBackgroundParent, TRaceBackground, TRaceStep } from '@GBR/types'

import { useMemo } from 'react'
import { copyBackground } from '@GBR/actions/background/copyBackground'
import { updateBackgroundStepPos } from '@GBR/actions/background/updateBackgroundStepPos'

export type THBackgroundActions = {
  background:TRaceBackground
  parent:TRaceBackgroundParent
  onAddStep:(parentId:string) => any
  onRemove:(parentId:string) => any
  onRemoveStep:(stepId:string, parentId:string) => any
  onChangeStep:(step:TRaceStep, parentId?:string) => any
}

export const useBackgroundActions = (props:THBackgroundActions) => {

  const {
    parent,
    onRemove,
    onAddStep,
    background,
    onRemoveStep,
    onChangeStep
  } = props

  return useMemo(() => {

    const onPlay = () => {}
    const onRemoveBackground = () => onRemove?.(parent.uuid)
    const onAddBackgroundStep = () => onAddStep?.(parent.uuid)
    const onCopyBackground = () => copyBackground({
      background,
      parentId: parent.uuid
    })
    const onStepChange = (updated:TRaceStep) => onChangeStep?.(updated, parent.uuid)
    const onRemoveBackgroundStep = (stepId:string) => onRemoveStep?.(stepId, parent.uuid)
    const onStepMove = (parentId:string, oldIdx:number, newIdx:number) => updateBackgroundStepPos({
      newIdx,
      oldIdx,
      backgroundParentId: parentId,
    })

    return {
      onPlay,
      onStepMove,
      onStepChange,
      onCopyBackground,
      onRemoveBackground,
      onAddBackgroundStep,
      onRemoveBackgroundStep,
    }

  }, [
    parent,
    onRemove,
    onAddStep,
    background,
    onRemoveStep,
    onChangeStep,
  ])
}