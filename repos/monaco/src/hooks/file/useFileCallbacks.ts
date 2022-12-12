import type {
  TFile,
  TFolder,
  TFileItem,
  TFilelist,
  TFileCallback
} from '../../types'
import type { SyntheticEvent, Dispatch, RefObject, SetStateAction, MutableRefObject } from 'react'

import { useCallback, useState } from 'react'
import { isStr } from '@keg-hub/jsutils'

export type THFileCallbacks = {
  editing:boolean
  file: TFileItem
  parent: TFolder
  abortAddFile: TFileCallback
  abortAddFolder: TFileCallback
  onEditFileName: TFileCallback
  onEditFolderName: TFileCallback
  onConfirmAddFile: TFileCallback
  onConfirmAddFolder: TFileCallback
  nameRef:RefObject<HTMLDivElement>,
  onPathChange: (key: string) => void
  filesRef: MutableRefObject<TFilelist>
  setEditing:Dispatch<SetStateAction<boolean>>
  setShowChild:Dispatch<SetStateAction<boolean>>
}

const checkNameConflict = (
  name:string,
  file:Record<'path', string>,
  filesRef:MutableRefObject<TFilelist>
) => {
  const pathName = `${file.path}${name}`.trim()
  const value = filesRef.current[pathName]

  return isStr(value) || value === null
    ? true
    : false
}

export const useFileCallbacks = (props:THFileCallbacks) => {

  const {
    file,
    parent,
    nameRef,
    editing,
    filesRef,
    setEditing,
    setShowChild,
    onPathChange,
    abortAddFile,
    abortAddFolder,
    onEditFileName,
    onEditFolderName,
    onConfirmAddFile,
    onConfirmAddFolder,
  } = props

  const fileClick = useCallback(() => setShowChild((pre:boolean) => !pre), [])
  const [nameConflict, setNameConflict] = useState(false)

  const filePathChange = useCallback(
    (e:SyntheticEvent<HTMLDivElement>) => {
      const key = e.currentTarget.dataset.src!
      onPathChange?.(key)
    },
    [onPathChange]
  )

  const fileBlur = useCallback(
    (event: any) => {
      const name = nameRef.current?.textContent as string

      if(nameConflict || checkNameConflict(name, file, filesRef)){
        !nameConflict && setNameConflict(true)
        return
      }

      if (editing) {
        setEditing(false)
        if ((file as TFolder).name !== name)
          (file as TFolder)._isDirectory
            ? onEditFolderName(file.path, name)
            : onEditFileName(file.path, name)

        return
      }

      (file as TFolder)._isDirectory
        ? onConfirmAddFolder({ ...file, name, } as TFolder)
        : onConfirmAddFile({ ...file, name, } as TFile)
    },
    [
      file,
      editing,
      nameConflict,
      onEditFileName,
      onConfirmAddFile,
      onEditFolderName,
      onConfirmAddFolder,
    ]
  )

  const fileKeyDown = useCallback((event: any) => {
    // Check if the enter key was pressed
    if(event.keyCode === 13){
      event.preventDefault()
      fileBlur(event)
      return
    }

    if(event.keyCode === 27){
      event.preventDefault()

      const childRef = parent.children['']
      if(!childRef)
        return console.warn(`Child path reference can not be found`, parent)

      ;(childRef as TFolder)._isDirectory
        ? abortAddFolder(childRef)
        : abortAddFile(childRef)

      return
    }

    const name = `${event?.target?.textContent}${event.key}`
    const hasConflict = checkNameConflict(name, file, filesRef)

    ;((hasConflict && !nameConflict) || (!hasConflict && nameConflict))
      && setNameConflict(hasConflict)

  },[
    file,
    parent,
    fileBlur,
    abortAddFile,
    abortAddFolder,
  ])

  return {
    fileBlur,
    fileClick,
    fileKeyDown,
    nameConflict,
    filePathChange,
  }

}