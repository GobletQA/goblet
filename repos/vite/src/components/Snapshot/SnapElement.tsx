import type { TSnapEl } from "@types"
import type { MouseEvent, ChangeEvent, CSSProperties } from "react"

import { useMemo } from "react"
import { ESnapTool } from "@types"
import { IconButton, CloseIcon } from '@gobletqa/components'

import {
  SnapshotElement,
  SnapshotElTools,
} from './Snapshot.styled'

type TRemove = (event: MouseEvent<HTMLButtonElement>) => void
type TTextChange = (event: ChangeEvent<HTMLInputElement>, index: number) => void


export type TSnapElement = {
  index:number
  element:TSnapEl
  onRemove:TRemove
  sx?:CSSProperties
  selected?:number|null
  onTextChange:TTextChange
}

export type TSnapElTools = {
  index:number
  element:TSnapEl
  onRemove:TRemove
}

const SnapElTools = (props:TSnapElTools) => {
  
  const {
    onRemove
  } = props
  
  return (
    <SnapshotElTools>
      <IconButton onClick={onRemove}>
        <CloseIcon />
      </IconButton>
    </SnapshotElTools>
  )
  
}

export const SnapElement = (props:TSnapElement) => {

  const {
    sx,
    index,
    element,
    selected,
    onRemove,
    onTextChange
  } = props

  const pos = useMemo(() => {
    return {
      top: element.startY,
      left: element.startX,
    }
  }, [element.startY, element.startX])

  return (
      <SnapshotElement
        key={index}
        sx={[pos, sx] as CSSProperties[]}
      >
        {element.type === ESnapTool.text
          ? (
              <input
                type="text"
                value={element.text}
                style={{ position: 'relative', zIndex: 1 }}
                onChange={(event) => onTextChange(event, index)}
              />
            )
          : null
        }

        {selected === index
          ? (
              <SnapElTools
                index={index}
                element={element}
                onRemove={onRemove}
              />
            )
          : null
        }
      </SnapshotElement>
  )

}