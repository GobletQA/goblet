
import { Arrow } from '../Icons/Arrow'
import { noOpObj, cls } from '@keg-hub/jsutils'
import { ExpandIcon } from '@GBC/components/Icons'
import {
  PanelHeaderText,
  PanelHeader as Container
} from './Panel.styled'

import type { TPanelHeader } from '../../types'

export const PanelHeaderActions = (props:TPanelHeader) => {
  const { title, actions } = props

  return (
    <>
      {
        actions?.map(act => {
          const {
            id,
            name,
            action,
            children,
            Component,
            component,
            className=``,
            iconProps=noOpObj
          } = act
          
          const ActionComp = Component ?? component

          if(!ActionComp && !children) return
          else if(!ActionComp) return (<>{children}</>)

          return (
            <ActionComp
              onClick={action}
              children={children}
              key={`${title}-${id ?? name}`}
              className={`goblet-panel-header-icon ${className}`.trim()}
              {...iconProps}
            />
          )
        }).filter(Boolean)
      }
    </>
  )
}

export const PanelHeader = (props:TPanelHeader) => {
  const {
    title,
    closed,
    actions,
    onCollapse
  } = props

  return (
    <Container
      onClick={onCollapse}
      className={cls(`goblet-editor-sidebar-panel-header`, closed ? `closed` : `open`)}
    >
      <ExpandIcon
        expand={!closed}
        noIconTransform={true}
        className={`goblet-editor-panel-toggle-icon`}
      />
      <PanelHeaderText>{title}</PanelHeaderText>
      {actions?.length ? (<PanelHeaderActions {...props} />) : null}
    </Container>
  )
}
