import type { ComponentProps } from 'react'
import type { OnSelect, OnSelectEnd } from 'react-selecto'

import Selecto from "react-selecto"
import { useInline } from '@GBC/hooks/useInline'

export type TDragSelect = Omit<ComponentProps<typeof Selecto>, `container`> & {
  container?:HTMLElement
}

export const DragSelect = (props:TDragSelect) => {
  const {
    selectByClick=false,
    container=document.body,
    ...rest
  } = props

  const onSelect = useInline((evt:OnSelect) => {
    // console.log(`------- evt -------`)
    // console.log(evt)
    // props.onSelect?.(evt)
  })

  const onSelectStart = useInline((evt:OnSelect) => {
    // console.log(`------- on select start -------`)
    // console.log(evt)
    // props.onSelectStart?.(evt)
  })
  
  const onSelectEnd = useInline((evt:OnSelectEnd) => {
    // console.log(`------- on select end -------`)
    // console.log(evt)
    // props.onSelectEnd?.(evt)
  })
 
  return (
    <Selecto
      {...rest}
      onSelect={onSelect}
      container={container}
      onSelectEnd={onSelectEnd}
      selectByClick={selectByClick}
      onSelectStart={onSelectStart}
    />
  )
}