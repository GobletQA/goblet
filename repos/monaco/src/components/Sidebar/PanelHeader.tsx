
import { Arrow } from '../Icons/Arrow'
import { noOpObj } from '@keg-hub/jsutils'

export type TPanelHeaderAction = {
  id?:string
  name?:string
  children?:any
  component?:any
  Component?:any
  className?:string
  iconProps?:Record<any, any>
  action?:(...args:any[]) => void
}

export type TPanelHeader = {
  title: string
  collapse: boolean
  actions?:TPanelHeaderAction[]
  onCollapse: (...args:any[]) => void
}

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
    actions,
    collapse,
    onCollapse
  } = props

  return (
    <div
      onClick={onCollapse}
      className='goblet-monaco-sidebar-panel-header'
    >
      <Arrow collapse={collapse} />
      <span style={styles.header}>{title}</span>
      {actions?.length &&  (<PanelHeaderActions {...props} />)}
    </div>
  )
}
