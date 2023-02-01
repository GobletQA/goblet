import type { TStepParentAst } from '@GBR/types'

import Box from '@mui/material/Box'
import { Button, StepAddIcon, useInline } from '@gobletqa/components'

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
      paddingTop='5px'
      paddingBottom='5px'
      justifyContent='start'
    >
      <Button
        text={`Add Step`}
        Icon={StepAddIcon}
        onClick={onAddStep}
        textSx={{ marginLeft: `5px` }}
      />
    </Box>
  )
}