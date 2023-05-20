import type {
  TRaceFeatures,
  TRaceFeatureGroup,
  TEditorFeatureActions
} from '@GBR/types'

import { useRef, useEffect, useState } from 'react'
import {
  useOnBlur,
  useOnKeyDown,
  useSaveGroupName,
} from './useFeatureGroupEvents'


export type THEditingFeatureGroup = TEditorFeatureActions & {
  featureGroups:TRaceFeatures
  featureGroup:TRaceFeatureGroup
}

export const useEditingFeatureGroup = (props:THEditingFeatureGroup) => {
  const {
    featureGroup,
    featureGroups,
  } = props

  const nameRef = useRef<HTMLDivElement>(null)
  const [nameConflict, setNameConflict] = useState(false)

  const onSaveGroupName = useSaveGroupName({
    nameRef,
    featureGroup,
  })

  useEffect(() => {

    if(!nameRef.current) return

    nameRef.current.textContent = featureGroup.title
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
    range.setEnd(firstChild, featureGroup.title.length)
    selection?.removeAllRanges()
    selection?.addRange(range)

  }, [])

  const onBlur = useOnBlur({
    nameRef,
    nameConflict,
    featureGroups,
    setNameConflict,
    onSaveGroupName,
  })

  const onKeyDown = useOnKeyDown({
    onBlur,
    featureGroup,
    nameConflict,
    featureGroups,
    onSaveGroupName,
    setNameConflict,
  })

  return {
    onBlur,
    nameRef,
    onKeyDown,
    nameConflict,
  }
}

