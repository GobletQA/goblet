import './loading.css'
import { useMemo } from 'react'

type TLoading = {
  size?: string | number
  heigh?: string | number
  width?: string | number
  alpha?: string | number
  color?: string
}

const hex2rgba = (hex:string=``, alpha:string|number = .3) => {
  // @ts-ignore
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16))
  return `rgba(${r},${g},${b},${alpha})`
};

export const Loading = (props:TLoading) => {
  const style = useMemo(() => {
    const color = props.color || `#ffffff`

    return {
      borderTopColor: color,
      height: props.heigh || props.size || `22px`,
      width: props.width || props.size || `22px`,
      border: `3px solid ${hex2rgba(color, props.alpha)}`,
    }
  }, [props.size, props.heigh, props.width, props.color, props.alpha])


  return <div id="gb-monaco-loading-icon" style={style} />
}
