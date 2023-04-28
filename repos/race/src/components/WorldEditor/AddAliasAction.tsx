import type { FocusEventHandler, ComponentProps } from 'react'
import type { TWorldConfig } from '@ltipton/parkin'

import { useCallback, useState } from 'react'
import { WorldAliasItem } from './WorldAliasItem'
import { useAddAlias } from '@GBR/hooks/world/useAddAlias'
import {
  AddCircleIcon,
  RemoveCircleIcon,
} from '@gobletqa/components'

import {
  AddAliasButton,
  AddAliasContainer,
} from './WorldEditor.styled'

export type TAddAliasAction = {
  world:TWorldConfig
}

const buttonProps:Record<string, Partial<ComponentProps<typeof AddAliasButton>>> = {
  shared: {
    text: `Alias`,
    variant: `contained`,
    iconProps: {
      sx: {
        height: `18px`,
        width: `18px`,
      }
    }
  },
  add: {
    color: `success`,
    Icon: AddCircleIcon,
    className: `gb-add-alias-button gb-add-alias-button-adding`,
  },
  cancel: {
    color: `error`,
    Icon: RemoveCircleIcon,
    className: `gb-add-alias-button gb-add-alias-button-cancel`,
  }
}

const styles = {
  item: {
    height: `105px`
  }
}

export const AddAliasAction = (props:TAddAliasAction) => {

  const {
    name,
    save,
    value,
    adding,
    onSave,
    onDelete,
    onAddAlias,
    onNameChange,
    onValueChange,
  } = useAddAlias(props)

  const btnProps = adding ? buttonProps.cancel : buttonProps.add
  
  return (
    <AddAliasContainer className='gb-add-alias-container' >

      {adding && (
          <WorldAliasItem
            save={save}
            name={name}
            value={value}
            noAlert={true}
            onSave={onSave}
            sx={styles.item}
            world={props.world}
            onDelete={onDelete}
            onNameChange={onNameChange}
            nameLabel={`New Alias Name`}
            onValueChange={onValueChange}
            valueLabel={`New Alias Value`}
          />
      ) || (
        <AddAliasButton
          {...buttonProps.shared}
          {...btnProps}
          onClick={onAddAlias}
        />
      )}
    </AddAliasContainer>
  )
  
}