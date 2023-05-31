import type { ComponentProps } from 'react'

import { useMemo } from 'react'
import {
  HDivider,
  VDivider,
} from './Divider.styled'

export type TDivider = ComponentProps<typeof VDivider> & {
  type?: string
  vertical?:boolean
  horizontal?:boolean
}

const useDividerType = (props:TDivider) => {
  const {
    type,
    vertical,
  } = props

  return useMemo(() => {
    return (type === `vertical` || vertical) ? `vertical` : `horizontal`
  }, [
    type,
    vertical,
  ])
}

export const Divider = (props:TDivider) => {
  const {
    type,
    vertical,
    horizontal,
    ...rest
  } = props

  const dType = useDividerType(props)
  const Component = dType === `vertical` ? VDivider : HDivider

  return (<Component {...rest}/>)
}
