import type { ChangeEvent } from 'react'
import type { TChangeCB, TInputValue } from '@gobletqa/components'
import { EGherkinKeys } from '@GBR/types'

import { isBool } from '@keg-hub/jsutils'
import { useState, useCallback, useMemo } from 'react'
import { useInline } from '@gobletqa/components'

export type THEditSectionTitle = {
  title:string
  key: EGherkinKeys
  required?:boolean
  initialEdit?:boolean
  callback: (update:string) => void
}

export const useEditSectionTitle = (props:THEditSectionTitle) => {
  const {
    key,
    title,
    callback,
    required=true,
    initialEdit=false,
  } =  props

  const [editingTitle, setEditingTitle] = useState<boolean>(initialEdit)

  const toggleEditTitle = useCallback((val?:boolean) => {
    const update = isBool(val) ? val : !editingTitle
    setEditingTitle(update)
  }, [])

  const cb = useInline(callback)
  const onEditTitle:TChangeCB = useCallback((
    evt:ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    value?:TInputValue
  ) => {
    const text = `${value || evt.target.value}`.trim()
    if(!text && required) return

    cb?.(text)
    setEditingTitle(false)
  }, [key, required, cb])

  const {
    isNamed,
    showTitle,
    sectionTitle
  } = useMemo(() => {
    const isNamed = !Boolean(title.trim() == ``)

    return {
      isNamed,
      showTitle: editingTitle || !isNamed,
      sectionTitle: isNamed ? title : ``
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