import type { TDefGroupItem } from '@types'

import { useCallback, useState } from 'react'

import { EStepKey } from '@types'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import { ArrowRightIcon } from '@components/Icons'
import { DefinitionItemMeta } from './DefinitionItemMeta'
import { DefinitionItemActions } from './DefinitionItemActions'
import {
  DefItem,
  DefText,
  DefIcon,
  DefButton,
  DefItemRow,
  DefItemMeta,
} from './Definitions.styled'

export type TDefinitionListItem = {
  type:EStepKey
  item:TDefGroupItem
}

const styles = {
  collapse: { width: `100%` },
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
      className='goblet-def-item'
      key={`item-${type}-${item.uuid}`}
    >
      <DefItemRow className='goblet-def-item-row' >

        <DefButton
          onClick={onToggleMeta}
          className='goblet-def-item-meta-toggle'
        >
          <DefIcon className='goblet-def-item-meta-toggle-icon' >
            <ArrowRightIcon />
          </DefIcon>
        </DefButton>

        <DefText className='goblet-def-item-text' primary={item.title} />
        <DefinitionItemActions item={item} />
      </DefItemRow>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={styles.collapse}
      >
        <Divider />
        <DefinitionItemMeta item={item} />
      </Collapse>
    </DefItem>
  )
}