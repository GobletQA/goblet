import type { TDefGroupItem } from '@types'

import { useCallback, useState } from 'react'
import { cls } from '@keg-hub/jsutils'
import { EStepKey } from '@ltipton/parkin'
import { ArrowRightIcon } from '@gobletqa/components'
import { DefinitionItemMeta } from './DefinitionItemMeta'
import { DefinitionItemActions } from './DefinitionItemActions'
import {
  DefItem,
  DefText,
  DefIcon,
  DefButton,
  DefItemRow,
  DefItemDivider,
  DefMetaCollapse,
} from './DefinitionList.styled'

export type TDefinitionListItem = {
  type:EStepKey
  item:TDefGroupItem
}

const styles = {
  arrow: {
    open: {
      transform: `rotate(90deg)`,
    },
    closed: {
      transform: `rotate(0)`,
    }
  }
}

export const DefinitionListItem = (props:TDefinitionListItem) => {
  const {
    type,
    item,
  } = props

  const [open, setOpen] = useState<boolean>(false)

  const onToggleMeta = useCallback(() => {
    setOpen(!open)
  }, [open])

  return (
    <DefItem
      className={cls(`gb-def-item`, open ? `item-open` : ``)}
      key={`item-${type}-${item.uuid}`}
    >
      <DefItemRow onClick={onToggleMeta} className='gb-def-item-row' >

        <DefButton
          className='gb-def-item-meta-toggle'
        >
          <DefIcon className='gb-def-item-meta-toggle-icon' >
            <ArrowRightIcon 
              sx={open ? styles.arrow.open : styles.arrow.closed}
            />
          </DefIcon>
        </DefButton>

        <DefText className='gb-def-item-text' primary={item.title} />
        <DefinitionItemActions item={item} />
      </DefItemRow>

      <DefMetaCollapse
        in={open}
        timeout="auto"
        unmountOnExit
      >
        <DefItemDivider className='gb-def-item-divider' />
        <DefinitionItemMeta item={item} />
      </DefMetaCollapse>
    </DefItem>
  )
}