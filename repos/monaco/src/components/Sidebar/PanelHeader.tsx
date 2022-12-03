
import { Arrow } from '../Icons/Arrow'
import { noOpObj } from '@keg-hub/jsutils'
import type { TPanelHeader } from '../../types'

const styles = {
  header: {
    flex: 1,
    paddingLeft: `5px`,
  }
}

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
              className={`goblet-monaco-panel-header-icon ${className}`.trim()}
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
    <div
      onClick={onCollapse}
      className={`goblet-monaco-sidebar-panel-header ${closed ? 'closed' : '' }`}
    >
      <Arrow collapse={closed} />
      <span style={styles.header}>{title}</span>
      {actions?.length ? (<PanelHeaderActions {...props} />) : null}
    </div>
  )
}
