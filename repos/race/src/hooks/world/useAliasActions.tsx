import { TAnyCB } from '@GBR/types'
import type { TWorldAliasAction } from '@GBR/components/WorldEditor/WorldAliasActions'

import { useMemo } from 'react'
import { noOp, isObj, isFunc } from '@keg-hub/jsutils'
import {
  CheckIcon,
  TrashIcon,
  RestartIcon,
} from '@gobletqa/components'

const actionTypes:Record<string, TWorldAliasAction> = {
  reset: {
    type: `reset`,
    onClick: noOp,
    color: `primary`,
    Icon: RestartIcon,
    text: `Reset Alias`,
  },
  delete: {
    type: `delete`,
    color: `error`,
    onClick: noOp,
    Icon: TrashIcon,
    text: `Delete Alias`,
  },
  save: {
    type: `save`,
    onClick: noOp,
    color: `success`,
    Icon: CheckIcon,
    text: `Save Alias`,
  }
}

export type THAliasActions = {
  onSave?: TAnyCB
  onReset?: TAnyCB
  onDelete?: TAnyCB
  save?:Partial<TWorldAliasAction>
  reset?:Partial<TWorldAliasAction>
  delete?:Partial<TWorldAliasAction>
}

export const useAliasActions = (props:THAliasActions) => {
  
  const {
    save,
    reset,
    onSave,
    onReset,
    onDelete,
    delete:remove,
  } = props
  
  return useMemo(() => {
    const actions:TWorldAliasAction[] = []

    ;(isFunc(onSave) || isObj(save))
      && actions.push({
          ...actionTypes.save,
          onClick: onSave,
          ...save,
        })

    ;(isFunc(onDelete) || isObj(remove))
      && actions.push({
          ...actionTypes.delete,
          onClick: onDelete,
          ...remove,
        })

    ;(isFunc(onReset) || isObj(reset))
      && actions.push({
          ...actionTypes.reset,
          onClick: onReset,
          ...reset,
        })

    return actions
  }, [
    save,
    reset,
    remove,
    onSave,
    onReset,
    onDelete
  ])
  
  
}