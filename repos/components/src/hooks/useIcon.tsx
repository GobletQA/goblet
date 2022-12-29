import { useMemo, useRef, CSSProperties } from 'react'
import { TIcon } from '../types'
import { omitKeys } from '@keg-hub/jsutils'

export type TIconProps = {
  height?: string
  width?: string
  fill?: string
  color?: string
  className?:string
  style?: CSSProperties
  svgStyle?: CSSProperties
}


export const useIcon = (props:TIcon) => {
  const styleRef = useRef(props.style)
  if(props.style && props.style !== styleRef.current) styleRef.current = props.style

  return useMemo(() => {
    const iconProps = {
      className: `goblet-editor-icons ${props.className || ''}`.trim(),
      color: props.color || styleRef?.current?.color || props.fill || styleRef?.current?.fill,
      fill: props.fill || styleRef?.current?.fill || props.color || styleRef?.current?.color,
      svgStyle: {
        ...props.svgStyle,
        ...omitKeys(styleRef.current || {}, [`fill`, `color`, `width`, `height`]),
      }
    } as TIconProps
    
    const width = props.width || styleRef?.current?.width || props.size
    if(width) iconProps.width = `${width}`
    const height = props.height || styleRef?.current?.height || props.size
    if(height) iconProps.height = `${height}`

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
    props.className,
    props.svgStyle
  ])

}
