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

  const iconProps = useMemo(() => {
    return {
      className: props.className,
      width: props.width || styleRef?.current?.width || props.size,
      height: props.height || styleRef?.current?.height || props.size,
      color: props.color || styleRef?.current?.color || props.fill || styleRef?.current?.fill,
      fill: props.fill || styleRef?.current?.fill || props.color || styleRef?.current?.color
    } as TIconProps
  }, [
    props.size,
    props.fill,
    props.color,
    props.height,
    props.width,
    props.className
  ])

  iconProps.style = styleRef.current

  return useMemo(() => {
    return {
      ...iconDefs,
      ...iconProps,
      className: `goblet-monaco-icons ${iconProps.className || ''}`.trim(),
      style: {
        fill: iconProps.fill,
        color: iconProps.color,
        width: iconProps.width,
        height: iconProps.height,
        ...styleRef.current
      }
    }
  }, [
    iconProps.fill,
    iconProps.color,
    iconProps.width,
    iconProps.height,
    iconProps.className
  ])

}