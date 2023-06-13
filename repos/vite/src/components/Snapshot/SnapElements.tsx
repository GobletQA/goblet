import type { TSnapEl } from "@types"
import type { MouseEvent, ChangeEvent } from "react"

import { SnapElement } from "./SnapElement"


type TRemove = (event: MouseEvent<HTMLButtonElement>) => void
type TTextChange = (event: ChangeEvent<HTMLInputElement>, index: number) => void


export type TSnapCanvas = {
  elements:TSnapEl[]
  onRemove:TRemove
  selected?:number|null
  onTextChange:TTextChange
}

export const SnapElements = (props:TSnapCanvas) => {

  const {
    elements,
    onRemove,
    selected,
    onTextChange,
  } = props

  return (
    <>
      {elements.map((element, index) => {
        return (
          <SnapElement
            index={index}
            element={element}
            onRemove={onRemove}
            selected={selected}
            onTextChange={onTextChange}
          />
        )
      })}
    </>
  )
}

