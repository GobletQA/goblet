import type { ComponentType, SyntheticEvent, MouseEvent, CSSProperties } from 'react'

import {
  BottomHeaderTabs,
  BottomDrawerHeaderTab
} from './BottomDrawerHeader.styled'
import { TooltipHoc } from '@gobletqa/components'
import {cls, emptyObj} from '@keg-hub/jsutils'

export type TBottomDrawerTab = {
  idx?:number
  name?:string
  tooltip?:string
  id?:string|number
  sx?:CSSProperties
  className?:string
  Icon?:ComponentType<any>
  onClick?:(event:MouseEvent<HTMLDivElement>) => void
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
  indicatorColor?:`secondary` | `primary` | undefined
  onChange?:(event: SyntheticEvent, value: number) => any
  onTabClick:(event:MouseEvent<HTMLDivElement>) => void
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
    name,
    Icon,
    onClick,
    tabAmount,
    className,
  } = props

  return (
      <BottomDrawerHeaderTab
        sx={sx}
        label={name}
        onClick={onClick}
        {...a11yProps(id)}
        id={id?.toString?.()}
        tabAmount={tabAmount}
        icon={(Icon && <Icon sx={styles.icon} />) || undefined}
        className={cls(
          className,
          `gb-bottom-drawer-tab`,
          name && `gb-bottom-drawer-tab-${name}`,
        )}
      />
  )
})


export const BottomDrawerHeader = (props:TBottomDrawerHeader) => {
  const {
    tabs,
    label,
    active,
    variant,
    onChange,
    textColor,
    className,
    onTabClick,
    indicatorColor,
  } = props

  const tabAmt = tabs?.length

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
            idx={idx}
            key={tab.id || tab.name || tab.tooltip}
            onClick={onTabClick}
            {...tab}
            tabAmount={tabAmt || 0}
          />
        )
      }) || (<></>)}
    </BottomHeaderTabs>
  )
}