import type {
  RefObject,
  MouseEvent,
  KeyboardEvent,
  MouseEventHandler,
  KeyboardEventHandler
} from 'react'
import type {
  TRaceFeatures,
  TOnEditGroupName,
} from '@GBR/types'

import { useCallback } from 'react'
import { preventDefault } from '@gobletqa/components'
import {exists} from '@keg-hub/jsutils'


type TOnSharedProps = {
  nameConflict:boolean,
  featureGroups:TRaceFeatures
  editingName:string|undefined
  onEditGroupName:TOnEditGroupName
  setNameConflict: (state:boolean) => void
}

export type TOnKeyDown = TOnSharedProps & {
  onBlur:(event:any) => void
}

export type TOnBlur = TOnSharedProps & {
  nameRef:RefObject<HTMLDivElement>
}

const checkNameConflict = (
  name:string,
  featureGroups:TRaceFeatures
):boolean => exists<boolean>(featureGroups[name])

export const useOnKeyDown = (props:TOnKeyDown) => {
  const {
    onBlur,
    editingName,
    nameConflict,
    featureGroups,
    onEditGroupName,
    setNameConflict
  } = props
  
  return useCallback<KeyboardEventHandler<HTMLDivElement>>((event) => {
    if(!editingName) return
    
    const name = `${(event?.target as HTMLDivElement)?.textContent}${event.key}`

    /**
     * Pressing Enter key 
     */
    if(event.keyCode === 13){
      preventDefault(event)
      onBlur(event)
      return
    }

    /**
     * Pressing Escape key 
     */
    if(event.keyCode === 27){
      preventDefault(event)
      onEditGroupName?.(event, ``, true)
      return
    }


    const hasConflict = checkNameConflict(name, featureGroups)

    ;((hasConflict && !nameConflict) || (!hasConflict && nameConflict))
      && setNameConflict(hasConflict)

  },[
    onBlur,
    editingName,
    nameConflict,
    featureGroups,
    onEditGroupName,
  ])
}

export const useOnBlur = (props:TOnBlur) => {
  const {
    nameRef,
    editingName,
    nameConflict,
    onEditGroupName,
    featureGroups,
    setNameConflict
  } = props
  
  return useCallback<MouseEventHandler>(
    (event) => {
      if(!editingName) return

      const name = nameRef.current?.textContent as string

      if(nameConflict || checkNameConflict(name, featureGroups)){
        !nameConflict && setNameConflict(true)
        return
      }

      onEditGroupName?.(event, name)
    },
    [
      editingName,
      nameConflict,
      featureGroups,
      onEditGroupName,
    ]
  )
}
