import type { TDefGroupItem } from '@types'

import Box from '@mui/material/Box'
import { cls } from '@keg-hub/jsutils'
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
        <Box
          display='flex'
          className='goblet-defs-item-actions-wrapper'
        >
          {item?.actions.map((action, idx) => {
            const strRef = `goblet-${action.key}`

            return (
              <DefButton
                key={action.key}
                sx={styles.button}
                className={cls(`goblet-def-item-action`, strRef)}
                aria-label={strRef}
                onClick={action.action as any}
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