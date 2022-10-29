import type { TFileProps } from '../../types'

import { useState, useMemo, useRef, useEffect } from 'react'

export const useFileHooks = (props:TFileProps) => {

  const {
    file,
    root,
    currentPath = '',
  } = props

  const [showChild, setShowChild] = useState(false)
  const [editing, setEditing] = useState(false)
  const nameRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!root && !file.name) {
      nameRef.current!.focus()
    }
  }, [file, root])

  useEffect(() => {
    if (editing) {
      const dotIndex = file.name.indexOf('.')
      nameRef.current!.textContent = file.name
      nameRef.current!.focus()
      const selection = window.getSelection()
      const range = document.createRange()
      range.setStart(nameRef.current?.firstChild!, 0)
      range.setEnd(
        nameRef.current?.firstChild!,
        dotIndex > 0 ? dotIndex : file.name.length
      )
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
    if (file.ext) return []
    const children = file.children
  
    const folders = Object.keys(children)
      .filter(key => !children[key].ext)
      .sort()

    const files = Object.keys(children)
      .filter(key => children[key].ext)
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