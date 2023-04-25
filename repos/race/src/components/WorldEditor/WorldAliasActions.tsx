
import type { ReactNode, CSSProperties } from 'react'

import { AliasListActions } from './WorldEditor.styled'
import { Tooltip, CloseIcon, IconButton } from '@gobletqa/components'

export type TWorldAliasActions = {
  text?:ReactNode
  Icon?:ReactNode
  sx?:CSSProperties
  onClick?:(evt:any) => void
}

export const WorldAliasActions = (props:TWorldAliasActions) => {
  const {
    sx,
    Icon,
    onClick,
    text=`Delete Alias`
  } = props
  
  return (
    <AliasListActions>
      <Tooltip
        loc='top'
        describeChild
        enterDelay={500}
        key={`delete-action`}
        title={text}
      >
        <IconButton
          sx={sx}
          iconProps={{
            sx: {
              width: `20px`,
              height: `20px`,
            }
          }}
          color={`error`}
          onClick={onClick}
          Icon={Icon || CloseIcon}
        />
      </Tooltip>
    </AliasListActions>
  )
}