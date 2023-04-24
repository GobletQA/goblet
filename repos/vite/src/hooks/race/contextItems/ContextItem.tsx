import type { CSSProperties } from 'react'
import {
  ContextItemKey,
  ContextItemVal,
  ContextItemBreak,
  ContextItemValWrap,
  ContextItemContainer,
} from './ContextItem.styled'

export type TContextItem = {
  name?:string|number
  value?:string|number
  valuePrefix?:string
  valuePostfix?:string
  sx?:CSSProperties
  sepSx?:CSSProperties
  nameSx?:CSSProperties
  valueSx?:CSSProperties
  valuePrefixSx?:CSSProperties
  valuePostfixSx?:CSSProperties
}

export const ContextItem = (props:TContextItem) => {
  const {
    sx,
    name,
    value,
    sepSx,
    nameSx,
    valueSx,
    valuePrefix,
    valuePostfix,
    valuePrefixSx,
    valuePostfixSx,
  } = props
  
  return (
    <ContextItemContainer
      sx={sx}
      className='gb-context-item-container'
    >

      {name && (
        <>
          <ContextItemKey
            sx={nameSx}
            className='gb-context-item-name'
          >
            {name}
          </ContextItemKey>
          <ContextItemBreak
            sx={sepSx}
            className='gb-context-item-break'
          >
            - 
          </ContextItemBreak>
        </>
      ) || null}

      <ContextItemValWrap>
        {valuePrefix && (
          <ContextItemVal
            sx={valuePrefixSx}
            className='gb-context-item-value-prefix'
          >
          { valuePrefix}
          </ContextItemVal>
        ) || null}
        
        {value && (
          <ContextItemVal
            sx={valueSx}
            className='gb-context-item-value'
          >
            {value}
          </ContextItemVal>
        ) || null}
        
        {valuePostfix && (
          <ContextItemVal
            sx={valuePostfixSx}
            className='gb-context-item-value-postfix'
          >
          { valuePostfix}
          </ContextItemVal>
        ) || null}
      </ContextItemValWrap>
    </ContextItemContainer>
  )
  
}