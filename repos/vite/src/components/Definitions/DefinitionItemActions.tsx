import type { SyntheticEvent } from 'react'
import type { TDefGroupItem } from '@types'

import { useCallback, useState } from 'react'

import { EStepKey } from '@types'
import Box from '@mui/material/Box'
import { Text } from '@components/Text'
import { noOpArr } from '@keg-hub/jsutils'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import { AddCircleIcon } from '@components/Icons'
import { DefButton } from './Definitions.styled'


const styles = {
  collapse: { width: `100%` },
  button: { padding: `4px 10px` },
  icon: { fontSize: `16px`, marginRight: `5px` },
}

export type TDefinitionItemActions = {
  item:TDefGroupItem
}

export const DefinitionItemActions = (props:TDefinitionItemActions) => {
  const { item } = props

  return item?.actions?.length
    ? (
        <Box display='flex' >
          {item?.actions.map((action, idx) => {
            const strRef = `goblet-${action.key}`

            return (
              <DefButton
                key={action.key}
                sx={styles.button}
                onClick={action.action as any}
                className={strRef}
                aria-label={strRef}
              >
                {action.Component && (<action.Component sx={styles.icon} />)}
                {action.name}
              </DefButton>
            )
          })}
        </Box>
      )
    : null
}