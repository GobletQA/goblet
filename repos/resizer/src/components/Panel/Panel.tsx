import { memo, isValidElement, cloneElement } from 'react'
import { usePanel } from '../../hooks/usePanel'

export const Panel = memo((props:any) =>  {
  const children = props.children
  const { mergedProps, panelProps } = usePanel(props)

  return isValidElement(children) && mergedProps
    ? cloneElement(children, panelProps)
    : (<div {...panelProps} />)
})

Panel.displayName = "Panel"
