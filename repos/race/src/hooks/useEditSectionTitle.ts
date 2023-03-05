import type { ChangeEvent } from 'react'
import type { TStepAst, TRuleAst } from '@ltipton/parkin'
import type { TChangeCB, TInputValue } from '@gobletqa/components'
import { EGherkinKeys } from '@GBR/types'

import { isBool } from '@keg-hub/jsutils'
import { useState, useCallback, useMemo } from 'react'
import { useInline } from '@gobletqa/components'

export type THEditSectionTitle = {
  title:string
  key: EGherkinKeys
  initialEdit?:boolean
  callback: (update:string) => void
}

export const useEditSectionTitle = (props:THEditSectionTitle) => {
  const {
    key,
    title,
    callback,
    initialEdit=false,
  } =  props
 
  const [editingTitle, setEditingTitle] = useState(initialEdit)
  
  const toggleEditTitle = useCallback((val?:boolean) => {
    const update = isBool(val) ? val : !editingTitle
    setEditingTitle(update)
  }, [])

  const cb = useInline(callback)
  const onEditTitle:TChangeCB = useCallback((
    evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?:TInputValue
  ) => cb(`${key}: ${value || evt.target.value}`), [
    key,
    cb
  ])
  
  const {
    isNamed,
    showTitle,
    sectionTitle
  } = useMemo(() => {
    const isNamed = !Boolean(title.trim() == `${key}:`)

    return {
      isNamed,
      showTitle: editingTitle || !isNamed,
      sectionTitle: isNamed ? title.replace(`${key}:`, ``) : ``
    }
  }, [
    key,
    title,
    editingTitle
  ])

  return {
    isNamed,
    showTitle,
    onEditTitle,
    sectionTitle,
    editingTitle,
    toggleEditTitle,
    setEditingTitle,
  }
}