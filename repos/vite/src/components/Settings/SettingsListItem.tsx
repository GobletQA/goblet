import type { TSetting, TSettingsConfig, CSSObj } from '@types'
import type { ChangeEvent, FocusEvent, ChangeEventHandler, FocusEventHandler } from 'react'

import { useCallback } from 'react'
import Grid from '@mui/material/Unstable_Grid2'

import { noOpObj, exists } from '@keg-hub/jsutils'
import { RestartIcon, Button } from '@gobletqa/components'
import { Input, Switch, Text, Select } from './SettingsInputs'
import { updateSettingValue } from '@actions/settings/updateSettingValue'
import { toggleSettingActive } from '@actions/settings/toggleSettingActive'

type SelectRecord = Record<'value', any>
type TInputChangeEvt = ChangeEvent<HTMLInputElement>
  | FocusEvent<HTMLInputElement>
  | SelectRecord

export type TSettingsListItem = {
  value:any
  sx?: CSSObj
  colSx?: CSSObj
  colKey:string
  item?: TSetting
  header?: boolean
  className?:string
  disabled?:boolean
  width: number|boolean
  align: `left`|`right`
  config: TSettingsConfig
}

const styles = {
  bold: { fontWeight: `bold` },
  button: { paddingTop: `0px`, paddingBottom: `0px` },
  icon: { height: `22px`, width: `22px`, paddingRight: `5px` }
}

const RenderByType = (props:TSettingsListItem) => {
  const {
    sx,
    align,
    value,
    header,
    config,
    colKey,
    item=noOpObj as TSetting,
  } = props

  const disabled = props.disabled || item?.enabled === false

  const onChangeValue = useCallback((event:TInputChangeEvt) => {
    if(disabled) return

    let value:any
    if((event as any)?.target){
      const evt = event as ChangeEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>
      value = evt?.target?.type === `checkbox`
        ? evt?.target?.checked
        : evt?.target?.value
    }
    else {
      value = (event as SelectRecord).value
      // If the selected value is the empty option
      // Reset the value to the default
      if(value === item.emptyOption) value = item.default
    }

    item.value !== value
      && updateSettingValue({ value, setting: `${item.group}.${item.key.replace(`.`, `-`)}` })

  }, [value, item, disabled])

  const onChangeActive = useCallback((evt:ChangeEvent<HTMLInputElement>) => {
    if(disabled) return
    
    const value = evt?.target?.checked
    item.active !== value
      && toggleSettingActive({ setting: `${item.group}.${item.key.replace(`.`, `-`)}` })
  }, [value, item])

  // Handel all headers keys and non-editable fields
  if(header || !config.editKeys.includes(colKey)){
    return colKey === `reset`
      ? (
          <Button
            disabled={disabled}
            onClick={item?.onReset}
            sx={[
              styles.button,
              header && styles.bold as any
            ]}
          >
            <RestartIcon sx={styles.icon} />
            {value}
          </Button>
        )
      : (
          <Text
            align={align}
            value={value}
            sx={sx as CSSObj}
            disabled={disabled}
          />
        )
  }

  // Handel the active column, always a boolean
  if(colKey === `active`)
    return (
      <Switch
        size='small'
        color='primary'
        disabled={disabled}
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
          disabled={disabled || !item.active}
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
          required={!exists(item?.default)}
          disabled={disabled || !item.active}
          onBlur={onChangeValue as FocusEventHandler<HTMLInputElement>}
        />
      )
    default:
      return item?.options?.length
        ? (
            <Select
              item={item}
              value={value}
              onChange={onChangeValue}
            />
          )
        : (
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
            placeholder={`${item?.key}`}
            required={!exists(item?.default)}
            disabled={disabled || !item.active}
            onChange={onChangeValue as ChangeEventHandler<HTMLInputElement>}
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
