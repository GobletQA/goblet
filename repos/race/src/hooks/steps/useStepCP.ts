
import type { TRaceStep, TAnyCB, TRaceStepParent, TRaceGran } from '@GBR/types'

import { EDndPos } from '@gobletqa/components'
import { useOperations } from '@gobletqa/race/contexts'
import { useEditor } from '@gobletqa/race/contexts/EditorContext'
import { cutOperation } from '@GBR/actions/operations/cutOperation'
import { copyOperation } from '@GBR/actions/operations/copyOperation'
import { pasteOperation } from '@gobletqa/race/actions/operations/pasteOperation'

export type THStepCP = {
  step: TRaceStep
  gran: TRaceGran
  parent: TRaceStepParent
}

export const useStepCP = (props:THStepCP) => {
  const {
    gran,
    step,
    parent,
  } = props

  const { feature } = useEditor()
  const { operations } = useOperations()

    const onPasteAfter = (
      (operations?.paste?.item as TRaceStep)?.step
        && (() => pasteOperation({
              gran,
              parent,
              index: step.index,
              pos: EDndPos.after,
              from: operations?.paste?.from,
              child: operations?.paste?.item,
            }))
    ) as TAnyCB

    const onPasteBefore = (
      (operations?.paste?.item as TRaceStep)?.step
        && (() => pasteOperation({
              gran,
              parent,
              index: step.index,
              pos: EDndPos.before,
              from: operations?.paste?.from,
              child: operations?.paste?.item,
            }))
    ) as TAnyCB

  const onCopy = () => copyOperation({ data: { item: step, parent } })
  const onCut = () => cutOperation({ data: { item: step, parent, gran, feature } })
  
  return {
    onCut,
    onCopy,
    onPasteAfter,
    onPasteBefore
  }

}