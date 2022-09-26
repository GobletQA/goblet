import { useMemo, useRef, CSSProperties } from 'react'
import { TIcon } from '../types'

export type TIconProps = {
  height?: string
  width?: string
  fill?: string
  color?: string
  className?:string
  style?: CSSProperties
}

const iconDefs = {
  height: '14px',
  width: '14px',
  color: `#ffffff`,
  fill: `#ffffff`
}

export const useIcon = (props:TIcon) => {
  const styleRef = useRef(props.style)
  if(props.style && props.style !== styleRef.current) styleRef.current = props.style

  return useMemo(() => {
    const iconProps = {
      className: `goblet-monaco-icons ${props.className || ''}`.trim(),
      width: props.width || styleRef?.current?.width || props.size || iconDefs.width,
      height: props.height || styleRef?.current?.height || props.size || iconDefs.height,
      color: props.color || styleRef?.current?.color || props.fill || styleRef?.current?.fill || iconDefs.fill,
      fill: props.fill || styleRef?.current?.fill || props.color || styleRef?.current?.color || iconDefs.color,
    } as TIconProps
    
    iconProps.style = {
      fill: iconProps.fill,
      color: iconProps.color,
      width: iconProps.width,
      height: iconProps.height,
      ...styleRef.current
    }

    return iconProps
  }, [
    props.size,
    props.fill,
    props.color,
    props.height,
    props.width,
    props.className
  ])

}