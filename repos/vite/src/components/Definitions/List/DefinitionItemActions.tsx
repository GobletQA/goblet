import type { TDefGroupItem } from '@types'

import Box from '@mui/material/Box'
import { DefButton } from './DefinitionList.styled'


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