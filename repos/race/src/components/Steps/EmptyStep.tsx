import type { CSSProperties, ComponentProps, ReactNode } from 'react'

import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { EmptyItem } from './Steps.styled'
import { Tooltip, gutter } from '@gobletqa/components'

export type TEmptyItem = Omit<ComponentProps<typeof AddItem>, `parentId`> & {
  description?:ReactNode
  parent:Record<`uuid`, string>
}

const tooltipProps = {
  PopperProps: {
    modifiers: [{
      name: `offset`,
      options: {offset: [20, -20]},
    }],
  },
  sx: {
    [`& .MuiTooltip-tooltip`]: {
      padding: gutter.padding.px,
      color: `var(--goblet-editor-foreground)`,
      backgroundColor: `var(--goblet-editor-background)`,
    },
  }
}

const styles:Record<string, CSSProperties> = {
  container: {
    paddingTop: `0px`,
    padding: gutter.padding.px,
  },
  item: {
    marginBottom: gutter.margin.px,
  },
  add: {
    width: `100%`,
    minWidth: `205px`,
    marginBottom: gutter.margin.hpx,
    borderBottom: `1px solid var(--goblet-list-focusBackground)`,
  }
}

export const EmptyStep = (props:TEmptyItem) => {
  const {
    parent,
    description,
    ...item
  } = props
  
  return (
    <Tooltip
      {...tooltipProps}
      title={description}
    >
      <EmptyItem
        sx={styles.item}
        className={`empty-item empty-item-${item.type}`}
      >
        <AddItem
          {...item}
          variant='text'
          sx={styles.add}
          parentId={parent.uuid}
          type={ESectionType.background}
        />
      </EmptyItem>
    </Tooltip>
  )
}
