import type { MouseEvent, KeyboardEvent } from 'react'
import type {
  TRaceFeatures,
  TOnEditGroupName,
  TRaceFeatureGroup,
  TEditorFeatureActions
} from '@GBR/types'

import { useEditor } from '@GBR/contexts/EditorContext'
import { useRef, useEffect, useState, useCallback } from 'react'
import { useOnKeyDown, useOnBlur } from './useFeatureGroupEvents'

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

  const onEditGroupName = useCallback<TOnEditGroupName>((event, name, cancel) => {
    // TODO: make call to save change to group name here
    console.log(`------- name -------`)
    console.log(name)

  }, [editingName])


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
    onEditGroupName,
    setNameConflict
  })

  const onKeyDown = useOnKeyDown({
    onBlur,
    editingName,
    nameConflict,
    featureGroups,
    onEditGroupName,
    setNameConflict
  })

  return {
    onBlur,
    nameRef,
    editing,
    onKeyDown,
    setEditing,
    editingName,
    nameConflict,
    setEditingName,
  }
}