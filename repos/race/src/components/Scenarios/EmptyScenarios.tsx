import type { TScenarioParentAst } from '@GBR/types'

import Box from '@mui/material/Box'
import { Button, PlaylistPlusIcon, useInline } from '@gobletqa/components'


export type TEmptyScenarios = {
  parent:TScenarioParentAst
  onAdd?:(parentId:string) => void
}

export const EmptyScenarios = (props:TEmptyScenarios) => {
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
        text={`Add Scenario`}
        onClick={onAddStep}
        Icon={PlaylistPlusIcon}
        textSx={{ marginLeft: `5px` }}
      />
    </Box>
  )
}