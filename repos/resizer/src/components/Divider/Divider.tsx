import { memo } from 'react'
import { useDivider } from '../../hooks/useDivider'

export const Divider = memo((props:any) => {
  const dividerProps = useDivider(props)

  return (<span {...dividerProps} />)
})

Divider.displayName = `Divider`