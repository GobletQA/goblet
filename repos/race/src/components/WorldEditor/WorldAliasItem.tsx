import type { CSSProperties } from 'react'
import type { TWorldConfig } from '@ltipton/parkin'
import type { THAliasActions } from '@GBR/hooks/world/useAliasActions'

import { WorldAliasActions } from './WorldAliasActions'
import { useAliasItem } from '@GBR/hooks/world/useAliasItem'
import {
  AliasListItem,
  AliasItemCol,
  AliasItemGrid,
  AliasNameInput,
  AliasValueInput,
  AliasNameContainer,
  AliasItemActionsCol,
  AliasValueContainer,
} from './WorldEditor.styled'


export type TWorldAliasItem = Omit<THAliasActions, `onDelete`> & {
  name:string
  value:string
  noAlert?:boolean
  sx?:CSSProperties
  nameLabel?:string
  valueLabel?:string
  world:TWorldConfig
  containerSx?:CSSProperties
  onDelete:(name:string) => void
  onNameChange:(name:string, oName:string) => void
  onValueChange:(name:string, value:string) => void
}

export const WorldAliasItem = (props:TWorldAliasItem) => {
  const {
    sx,
    name,
    value,
    noAlert,
    nameLabel,
    valueLabel,
    containerSx
  } = props

  const {
    actions,
    nameErr,
    valueErr,
    onDelete,
    onNameChange,
    onValueChange
  } = useAliasItem(props)

  return (
    <AliasListItem
      sx={sx}
      className='gb-alias-grid-item'
    >
      <AliasItemGrid
        container
        spacing={1}
        sx={containerSx}
        className='gb-alias-grid-item-container'
      >
        <AliasItemCol xs={4} className='gb-alias-grid-item-name' >
          <AliasNameContainer
            className='gb-world-alias-name-container'
          >
            <AliasNameInput
              value={name}
              required={true}
              error={nameErr}
              label={nameLabel}
              onBlur={onNameChange}
              className='gb-alias-name-input'
            />
          </AliasNameContainer>
        </AliasItemCol>

        <AliasItemCol xs={6} className='gb-alias-grid-item-value' >
          <AliasValueContainer
            className='gb-world-alias-value-container'
          >
            <AliasValueInput
              value={value}
              required={true}
              error={valueErr}
              label={valueLabel}
              onBlur={onValueChange}
              className='gb-alias-item-value-input'
            />
          </AliasValueContainer>
        </AliasItemCol>

        <AliasItemActionsCol xs={2} className='gb-alias-grid-item-actions' >
          <WorldAliasActions actions={actions} />
        </AliasItemActionsCol>


      </AliasItemGrid>
    </AliasListItem>
  )
}