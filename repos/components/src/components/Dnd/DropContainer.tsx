import type { TDndCallbacks } from '@GBC/types'

import { emptyArr, cls, ensureArr } from '@keg-hub/jsutils'
import { DropContainer as DrpContainer } from './Dnd.styled'

export type TDropContainer = Pick<TDndCallbacks, `onDragOver`|`onDragLeave`|`onDragEnter`|`onDrop`> & {
  className?:string
  parentTypes?:string|string[]
  onDrop:(evt: any, ...args: any[]) => void
}

export const DropContainer = (props:TDropContainer) => {

  const {
    onDrop,
    className,
    onDragOver,
    onDragLeave,
    onDragEnter,
    parentTypes=emptyArr,
  } = props

  return (
    <DrpContainer
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      className={cls(`gb-dnd-drop-container`, className)}
      data-parent-types={ensureArr<string>(parentTypes).join(',')}
    />
  )
}