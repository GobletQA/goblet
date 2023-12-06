import type { TExpPart } from '@GBR/types'
import type { TSelectOption } from '@gobletqa/components'

import {useMemo, useState} from "react"
import { flatUnion } from '@keg-hub/jsutils'

export type TExpMergeOpts = {
  options?:string[]|number[]|TSelectOption[]
  expression:TExpPart
}

export const useExpMergeOpts = (props:TExpMergeOpts) => {

  const { expression } = props

  const [remoteOptions, setRemoteOptions] = useState<string[]>()
  const options = useMemo(() => {
    return remoteOptions
      ? flatUnion(props?.options, expression.options, remoteOptions)
      : expression.options
        ? flatUnion(props?.options, expression.options)
        : props?.options || []
  }, [
    remoteOptions,
    props.options,
    expression.options
  ])

  return {
    options,
    setRemoteOptions
  }
}



