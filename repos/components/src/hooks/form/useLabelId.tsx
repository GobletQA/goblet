import {uuid} from "@keg-hub/jsutils/uuid"
import {useMemo} from "react"

export type THLabelId = {
  id?:string
  name?:string
  labelId?:string
  htmlFor?:string
}

export const useLabelId = (props:THLabelId) => {
  const {
    id,
    name,
    htmlFor,
    labelId
  } = props

  return useMemo(() => {
    return labelId
      || id && `${id}-label`
      || name && `${name}-label`
      || htmlFor && `${htmlFor}-label`
      || uuid()
  }, [
    id,
    name,
    htmlFor,
    labelId,
  ])
}