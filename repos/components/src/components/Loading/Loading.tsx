import { useMemo } from 'react'
import { emptyArr, exists } from '@keg-hub/jsutils'

type TLoading = {
  size?: string | number
  heigh?: string | number
  width?: string | number
  alpha?: string | number
  color?: string
}

const hex2rgba = (hex:string=``, alpha:string|number = .3) => {
  const [r, g, b] = hex.match(/\w\w/g)?.map(x => parseInt(x, 16)) || emptyArr
  return exists(r) ? `rgba(${r},${g},${b},${alpha})` : ``
}

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


  return <div className="gb-loading-icon" style={style} />
}
