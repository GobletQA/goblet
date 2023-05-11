import type { MouseEventHandler } from 'react'
import type {
  TRaceFeature,
  TRaceFeatures,
  TEditorFeatureActions
} from '@GBR/types'

import { useCallback, useRef, useEffect, useState } from 'react'
import { useOnKeyDown, useOnBlur } from './useFeatureItemEvents'

export type THFeatureItemHooks = TEditorFeatureActions & {
  active:TRaceFeature
  feature:TRaceFeature
  featureGroups:TRaceFeatures
}

export const useFeatureItemHooks = (props:THFeatureItemHooks) => {
  const {
    active,
    feature,
    editingName,
    featureGroups,
    onEditFeature,
    onActiveFeature,
  } = props

  const onClick = useCallback<MouseEventHandler<HTMLDivElement>>(
    (evt) => onActiveFeature?.(evt, feature),
    [feature, onActiveFeature]
  )

  const isActive = feature?.uuid === active?.uuid
  const nameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(!nameRef.current || !editingName) return

    nameRef.current.textContent = feature.feature
    nameRef.current?.focus()
    const selection = window.getSelection()
    const range = document.createRange()

    let firstChild = nameRef?.current?.firstChild
    if(!firstChild){
      const textNode = document.createTextNode(``)
      nameRef?.current?.appendChild(textNode)
      firstChild = textNode
    }

    range.setStart(firstChild, 0)
    range.setEnd(firstChild, feature.feature.length)
    selection?.removeAllRanges()
    selection?.addRange(range)

  }, [editingName, feature])

  const [nameConflict, setNameConflict] = useState(false)

  const onBlur = useOnBlur({
    nameRef,
    feature,
    editingName,
    nameConflict,
    onEditFeature,
    featureGroups,
    setNameConflict
  })

  const onKeyDown = useOnKeyDown({
    onBlur,
    editingName,
    nameConflict,
    featureGroups,
    onEditFeature,
    setNameConflict
  })

  return {
    onBlur,
    onClick,
    nameRef,
    isActive,
    onKeyDown,
    nameConflict
  }
}