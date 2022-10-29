import type { TFileCallback } from '../../types'
import type { Dispatch, RefObject, SetStateAction } from 'react'

import { useCallback } from 'react'

export type THFileCallbacks = {
  file: any
  editing:boolean
  onEditFileName: TFileCallback
  onEditFolderName: TFileCallback
  onConfirmAddFile: TFileCallback
  onConfirmAddFolder: TFileCallback
  nameRef:RefObject<HTMLDivElement>,
  onPathChange: (key: string) => void
  setEditing:Dispatch<SetStateAction<boolean>>
  setShowChild:Dispatch<SetStateAction<boolean>>
}

export const useFileCallbacks = (props:THFileCallbacks) => {

  const {
    file,
    nameRef,
    editing,
    setEditing,
    setShowChild,
    onPathChange,
    onEditFileName,
    onEditFolderName,
    onConfirmAddFile,
    onConfirmAddFolder,
  } = props

  const fileClick = useCallback(() => setShowChild((pre:boolean) => !pre), [])

  const filePathChange = useCallback(
    (e:any) => {
      const key = e.currentTarget.dataset.src!
      onPathChange?.(key)
    },
    [onPathChange]
  )

  const fileBlur = useCallback(
    (event: any) => {
      const name = nameRef.current?.textContent
      if (editing) {
        setEditing(false)
        if (file.name !== name)
          file._isDirectory
            ? onEditFolderName(file.path, name)
            : onEditFileName(file.path, name)

        return
      }
      
      file._isDirectory
        ? onConfirmAddFolder({ ...file, name, })
        : onConfirmAddFile({ ...file, name, })
    },
    [
      file,
      editing,
      onEditFileName,
      onConfirmAddFile,
      onConfirmAddFolder,
      onEditFolderName,
    ]
  )

  const fileKeyDown = useCallback((e: any) => {
      if(e.keyCode !== 13) return

      e.preventDefault()
      fileBlur(e)
    },
    [fileBlur]
  )

  return {
    fileBlur,
    fileClick,
    fileKeyDown,
    filePathChange,
  }

}