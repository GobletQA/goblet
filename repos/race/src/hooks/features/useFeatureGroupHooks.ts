import type {
  TRaceFeatures,
  TRaceFeatureGroup,
  TEditorFeatureActions
} from '@GBR/types'

import { stopPropagation } from '@gobletqa/components'
import { useRef, useEffect, useState, useCallback } from 'react'
import {
  useOnBlur,
  useOnKeyDown,
  useSaveGroupName,
  useOnDeleteGroup,
  useOnAddSubFolder,
  useOnCreateFeature,
} from './useFeatureGroupEvents'


export type THFeatureItemHooks = TEditorFeatureActions & {
  featureGroups:TRaceFeatures
  featureGroup:TRaceFeatureGroup
}

export const useFeatureGroupHooks = (props:THFeatureItemHooks) => {
  const {
    featureGroup,
    featureGroups,
  } = props

  const nameRef = useRef<HTMLDivElement>(null)
  const [editing, setEditing] = useState<boolean>(false)
  const [editingName, setEditingName] = useState<string>(featureGroup.title)

  const onSaveGroupName = useSaveGroupName({
    editingName
  })

  const onEditName = useCallback((evt: Event) => {
    stopPropagation(evt)
    setEditing?.(true)
  }, [setEditing])


  useEffect(() => {
    if(!nameRef.current || !editing || !editingName) return

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

  }, [
    editing,
    editingName,
  ])

  const [nameConflict, setNameConflict] = useState(false)

  const onBlur = useOnBlur({
    nameRef,
    editingName,
    nameConflict,
    featureGroups,
    setNameConflict,
    onSaveGroupName,
  })

  const onKeyDown = useOnKeyDown({
    onBlur,
    editingName,
    nameConflict,
    featureGroups,
    onSaveGroupName,
    setNameConflict,
  })
  
  const onAddFolder = useOnAddSubFolder({
    featureGroup,
  })
  
  const onCreateFeature = useOnCreateFeature({
    featureGroup,
  })
  
  const onDeleteGroup = useOnDeleteGroup({
    featureGroup,
  })

  return {
    onBlur,
    nameRef,
    editing,
    onKeyDown,
    onEditName,
    setEditing,
    editingName,
    onAddFolder,
    nameConflict,
    onDeleteGroup,
    setEditingName,
    onCreateFeature,
  }
}