import type { TFile, TFolder, TFileProps } from '../../types'

import { useState, useMemo, useRef, useEffect } from 'react'

export const useFileHooks = (props:TFileProps) => {

  const {
    root,
    file,
    currentPath = '',
  } = props

  const [showChild, setShowChild] = useState(false)
  const [editing, setEditing] = useState(false)
  const nameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    !root
      && !(file as TFile).name
      && nameRef?.current?.focus?.()
  }, [file, root])

  useEffect(() => {
    if (editing) {
      const dotIndex = (file as TFile).name.indexOf('.')
      nameRef.current!.textContent = (file as TFile).name
      nameRef.current!.focus()
      const selection = window.getSelection()
      const range = document.createRange()

      let firstChild = nameRef?.current?.firstChild
      if(!firstChild){
        const textNode = document.createTextNode(``)
        nameRef?.current?.appendChild(textNode)
        firstChild = textNode
      }

      range.setStart(firstChild, 0)
      range.setEnd(firstChild, dotIndex > 0 ? dotIndex : (file as TFile).name.length)
      selection?.removeAllRanges()
      selection?.addRange(range)
    }
  }, [editing, file])

  useEffect(() => {
    currentPath
      && currentPath.startsWith(file.path + '/')
      && setShowChild(true)
  }, [currentPath, file.path])

  const keys = useMemo(() => {
    if ((file as TFile).ext) return []
    const children = (file as TFolder).children
  
    const folders = Object.keys(children)
      .filter(key => !(children[key] as TFile).ext)
      .sort()

    const files = Object.keys(children)
      .filter(key => (children[key] as TFile).ext)
      .sort()

    return folders.concat(files)
  }, [file])

  return {
    keys,
    editing,
    nameRef,
    showChild,
    setEditing,
    setShowChild,
  }

}