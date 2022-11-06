import type { TSetting, TSettingsConfig, CSSObj } from '@types'
import type { ChangeEvent, FocusEvent, FocusEventHandler } from 'react'

import { useCallback } from 'react'
import Grid from '@mui/material/Unstable_Grid2'
import { noOpObj, exists } from '@keg-hub/jsutils'
import { Input, Switch, Text } from './SettingsInputs'
import { updateSettingValue } from '@actions/settings/updateSettingValue'
import { toggleSettingActive } from '@actions/settings/toggleSettingActive'

export type TSettingsListItem = {
  value:any
  sx?: CSSObj
  colSx?: CSSObj
  item: TSetting
  colKey:string
  header?: boolean
  className?:string
  width: number|boolean
  align: `left`|`right`
  config: TSettingsConfig
}

const RenderByType = (props:TSettingsListItem) => {
  const {
    sx,
    item,
    align,
    value,
    header,
    config,
    colKey,
  } = props

  const onChangeValue = useCallback((evt:ChangeEvent<HTMLInputElement>|FocusEvent<HTMLInputElement>) => {
    const value = evt?.target?.type === `checkbox`
      ? evt?.target?.checked
      : evt?.target?.value

    item.value !== value
      && updateSettingValue({ value, setting: `${item.group}.${item.key}` })
  }, [value, item])

  const onChangeActive = useCallback((evt:ChangeEvent<HTMLInputElement>) => {
    const value = evt?.target?.checked
    item.active !== value
      && toggleSettingActive({ setting: `${item.group}.${item.key}` })
  }, [value, item])

  // Handel all headers keys and non-editable fields
  if(header || !config.editKeys.includes(colKey))
    return (
      <Text
        align={align}
        value={value}
        sx={sx as CSSObj}
      />
    )

  // Handel the active column, always a boolean
  if(colKey === `active`)
    return (
      <Switch
        size='small'
        color='primary'
        checked={item.active}
        onChange={onChangeActive}
        value={item.active ? `on` : `off`}
      />
    )

  // Handel the editable field based on the type
  switch(item.type){
    case `boolean`:
      return (
        <Switch
          size='small'
          color='primary'
          checked={value}
          disabled={!item.active}
          onChange={onChangeValue}
          value={value ? `on` : `off`}
        />
      )
    case `number`:
      return (
        <Input
          size='small'
          type='number'
          value={value}
          align={align}
          margin='normal'
          name={item.key}
          placeholder={`#`}
          fullWidth={false}
          variant='outlined'
          prefix={item.prefix}
          postfix={item.postfix}
          disabled={!item.active}
          required={!exists(item?.default)}
          onBlur={onChangeValue as FocusEventHandler<HTMLInputElement>}
        />
      )
    default:
      return (
        <Input
          size='small'
          value={value}
          align={align}
          margin='normal'
          name={item.key}
          fullWidth={false}
          variant='outlined'
          prefix={item.prefix}
          postfix={item.postfix}
          disabled={!item.active}
          onChange={onChangeValue}
          placeholder={`${item?.key}`}
          required={!exists(item?.default)}
        />
      )
  }

}


export const SettingsListItem = (props:TSettingsListItem) => {

  const {
    colSx,
    width,
    colKey,
    align,
    className=``,
    item=noOpObj as TSetting,
  } = props
  
  return (
    <Grid
      xs={width}
      sx={[{
        alignItems: `baseline`,
        justifyContent: align == `left` ? `flex-start` : `flex-end`,
      }, colSx || false]}
      display='flex'
      key={`${item.key || `setting`}-${colKey}`}
      className={`settings-list-item-${colKey} ${className}`.trim()}
    >
      <RenderByType {...props} />
    </Grid>
  )
  
}
