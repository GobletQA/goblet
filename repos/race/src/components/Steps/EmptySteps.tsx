import type { TStepParentAst } from '@GBR/types'
import type { CSSProperties, ComponentProps, ReactNode } from 'react'

import Box from '@mui/material/Box'
import { StepItem } from '../Feature/FeatureItems'
import { useInline } from '@gobletqa/components'

import { AddItem } from '../AddItem'
import { ESectionType } from '@GBR/types'
import { EmptyItem } from './Steps.styled'
import { Tooltip, gutter } from '@gobletqa/components'

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


export type TEmptySteps = {
  parent:TStepParentAst
  onAdd?:(parentId:string) => void
}

export const EmptySteps = (props:TEmptySteps) => {
  const { onAdd, parent } = props
  const onAddStep = useInline(() => onAdd?.(parent.uuid))

  return (
    <Box
      display='flex'
      justifyContent='start'
      marginTop={gutter.margin.hpx}
      paddingTop={gutter.padding.qpx}
      paddingBottom={gutter.padding.qpx}
    >
    <Tooltip
      {...tooltipProps}
      title={StepItem.description}
    >
      <EmptyItem
        sx={styles.item}
        className={`empty-item empty-item-${StepItem.type}`}
      >
        <AddItem
          {...StepItem}
          variant='text'
          sx={styles.add}
          onClick={onAddStep}
          parentId={parent.uuid}
          type={ESectionType.background}
        />
      </EmptyItem>
    </Tooltip>
    </Box>
  )
}