import type {
  MouseEvent,
  CSSProperties,
  ComponentType,
  SyntheticEvent,
} from 'react'
import type { TIconProps } from '../Icons/Icon'

import {cls, emptyObj} from '@keg-hub/jsutils'
import { TooltipHoc } from '@GBC/hocs/TooltipHoc'
import { DrawerSliderAction } from './BottomDrawer.styled'
import {
  BottomHeaderTabs,
  BottomDrawerHeaderTab
} from './BottomDrawerHeader.styled'


export type TBottomDrawerTab = {
  idx?:number
  name?:string
  active?:number
  action?:boolean
  tooltip?:string
  id?:string|number
  sx?:CSSProperties
  className?:string
  showText?:boolean
  actionAmount?:number
  iconProps?:TIconProps
  actionActive?:boolean
  Icon?:ComponentType<any>
  OnIcon?:ComponentType<any>
  OffIcon?:ComponentType<any>
  onAction?:(event:MouseEvent<any>) => void
  onClick?:(event:MouseEvent<any>, tab?:number) => void
}

type TBottomDrawerTabAndAmt = TBottomDrawerTab & {
  tabAmount:number
}

export type TBottomDrawerHeader = {
  active?:number
  label?:string
  className?:string
  sx?:CSSProperties
  tabs?:TBottomDrawerTab[]
  onTabClick?:(event:MouseEvent<any>, tab?:number) => void
  indicatorColor?:`secondary` | `primary` | undefined
  onChange?:(event: SyntheticEvent, value:number) => any
  textColor?:`inherit` | `secondary` | `primary` | undefined
  variant?:`fullWidth` | `standard` | `scrollable` | undefined
}

const a11yProps = (id?:string|number) => {
  return id ?
    { id: `full-width-tab-${id}`, [`aria-controls`]: `full-width-tabpanel-${id}`}
    : emptyObj
}

const styles = {
  icon: {
    marginRight: `5px`,
    marginBottom: `0px !important`,
  }
}

export const BottomDrawerTab = TooltipHoc((props:TBottomDrawerTabAndAmt) => {
  const {
    id,
    sx,
    idx,
    name,
    OnIcon,
    action,
    active,
    OffIcon,
    onClick,
    showText,
    onAction,
    tabAmount,
    iconProps,
    className,
    Icon=OnIcon,
    actionActive,
    actionAmount,
  } = props

  return action
    ? (
        <DrawerSliderAction
          sx={sx}
          onClick={onAction}
          Icon={actionActive ? OnIcon : (OffIcon || OnIcon)}
        />
      )
    : (
      <BottomDrawerHeaderTab
        sx={sx}
        onClick={(evt:MouseEvent) => onClick?.(evt, idx)}
        {...a11yProps(id)}
        id={id?.toString?.()}
        tabAmount={tabAmount}
        actionAmount={actionAmount}
        label={showText === false ? `` : name}
        icon={
          Icon
          ? (
              <Icon
                {...iconProps}
                sx={{
                  ...styles.icon,
                  ...iconProps?.sx
                }}
              />
            )
          : undefined
        }
        className={cls(
          className,
          `gb-bottom-drawer-tab`,
          idx === active && `Mui-selected`,
          name && `gb-bottom-drawer-tab-${name}`,
        )}
      />
  )
})


export const BottomDrawerHeader = (props:TBottomDrawerHeader) => {
  const {
    tabs=[],
    label,
    active,
    variant,
    onChange,
    textColor,
    className,
    onTabClick,
    indicatorColor,
  } = props

  const tabAmt = tabs?.filter?.(tab => !tab.action)?.length
  const actAmt = tabs?.length - tabAmt

  return (
    <BottomHeaderTabs
      variant={variant}
      aria-label={label}
      onChange={onChange}
      value={active || 0}
      textColor={textColor}
      indicatorColor={indicatorColor}
      className={cls(`gb-bottom-drawer-header-tabs`, className)}
    >
      {tabs?.map?.((tab, idx:number) => {
        return (
          <BottomDrawerTab
            active={active}
            onClick={onTabClick}
            tabAmount={tabAmt || 0}
            actionAmount={actAmt || 0}
            key={tab.id || tab.name || tab.tooltip}
            {...tab}
            idx={idx}
          />
        )
      }) || (<></>)}
    </BottomHeaderTabs>
  )
}