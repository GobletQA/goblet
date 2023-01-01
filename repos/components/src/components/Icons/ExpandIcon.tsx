import type { CSSProperties, ComponentType } from 'react'

import { useMemo } from 'react'
import { emptyObj } from '@keg-hub/jsutils'
import { ExpandMoreIcon } from '@GBC/components/Icons'

export type TExpandIcon = {
  expand?:boolean
  className?:string
  sx?:CSSProperties
  noIconTransform?:boolean
}


export const ExpandIcon = (props:TExpandIcon) => {
  const {
    sx,
    expand,
    className,
    noIconTransform
  } = props

  const style = useMemo(() => {
    return !noIconTransform
      ? emptyObj
      : expand || className?.split(' ').includes(`expanded`)
        ? { transform: 'rotate(-1800deg) !important', }
        : { transform: 'rotate(-90deg) !important' }
  }, [expand, className, noIconTransform])

  return (
    <ExpandMoreIcon
      className={className}
      sx={[sx as CSSProperties, style]}
    />
  )
}