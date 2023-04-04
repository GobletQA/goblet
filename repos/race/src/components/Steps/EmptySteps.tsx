import type { CSSProperties } from 'react'
import type { TRaceStepParent } from '@GBR/types'


import { ESectionType } from '@GBR/types'
import { gutter } from '@gobletqa/components'
import { StepItem } from '../Feature/FeatureItems'
import { EmptyItem } from '../EmptyItem/EmptyItem'

export type TEmptySteps = {
  text?:string
  sx?:CSSProperties
  addSx?:CSSProperties
  parent:TRaceStepParent
  buttonSx?:CSSProperties
  parentType: ESectionType
  variant?:`text`|`outlined`
  containerSx?: CSSProperties
  onAdd?:(parentId:string) => void
}

const styles = {
  containerSx: {
    marginTop: `0px`,
    justifyContent: `flex-start`,
    paddingTop: gutter.padding.px,
    paddingBottom: gutter.padding.px,
  },
  sx: {
    width: `initial`,
    paddingBottom: `0px`,
  },
  addSx: {
    minWidth: `initial`,
  },
  buttonSx: {}
}

export const EmptySteps = (props:TEmptySteps) => {
  const {
    sx,
    text,
    addSx,
    onAdd,
    parent,
    variant,
    buttonSx,
    parentType,
    containerSx,
  } = props
  const onAddStep = () => onAdd?.(parent.uuid)

  return (
    <EmptyItem
      {...StepItem}
      text={text}
      variant={variant}
      onClick={onAddStep}
      sx={sx || styles.sx}
      type={StepItem.type}
      parentId={parent.uuid}
      parentType={parentType}
      addSx={addSx || styles.addSx}
      buttonSx={buttonSx || styles.buttonSx}
      containerSx={containerSx || styles.containerSx}
    />
  )
}