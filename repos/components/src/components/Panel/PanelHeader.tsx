import type { TPanelHeader } from '../../types'

import { ExpandIcon } from '@GBC/components/Icons'
import { noOpObj, cls, isStr, isFunc, isObj } from '@keg-hub/jsutils'
import { PanelHeaderText, PanelHeader as Container } from './Panel.styled'


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
              className={`gb-panel-header-action ${className}`.trim()}
              {...iconProps}
            />
          )
        }).filter(Boolean)
      }
    </>
  )
}

const PanelTitle = (props:TPanelHeader):any => {
  const {title:Title} = props

  return (
    isStr(Title)
      ? (<PanelHeaderText>{Title}</PanelHeaderText>)
      : isFunc(Title)
        ? (<Title {...props} />)
        : isObj(Title) ? Title : null
  )
}

export const PanelHeader = (props:TPanelHeader) => {
  const {
    title,
    closed,
    actions,
    onCollapse,
    hasBody=true,
    headerHover=true,
  } = props

  return (
    <Container
      onClick={onCollapse}
      className={cls(
        !hasBody && `no-click`,
        !headerHover && `no-hover`,
        closed ? `closed` : `open`,
        `gb-sidebar-panel-header`,
      )}
    >
      {hasBody && (
        <ExpandIcon
          expand={!closed}
          noIconTransform={true}
          className={`gb-panel-toggle-icon`}
        />
      )}
      {title && (<PanelTitle {...props} />)}
      {actions?.length ? (<PanelHeaderActions {...props} />) : null}
    </Container>
  )
}
