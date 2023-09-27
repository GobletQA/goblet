import {TBrowserAction} from '@GBC/types'
import { useMemo } from 'react'
import { nanoid } from '@keg-hub/jsutils'

export type THRefText = {
  id?: string
  name:string
  actions?:TBrowserAction[]
}

export const useRefText = ({ id, name, actions }:THRefText) => {
  return useMemo(() => {
    const ref = id || name || actions?.length && actions[0].name || nanoid()
    return ref.replace(` `, `-`).toLowerCase()
  }, [id, name, actions])
}