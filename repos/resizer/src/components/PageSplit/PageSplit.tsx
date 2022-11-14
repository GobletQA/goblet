import React, { Children, Fragment } from 'react'
import { clone } from '../../utils/clone'
import { usePageSplit } from '../../hooks/usePageSplit'
import { PageSplitStateContext, PageSplitDispatchContext } from '../../context/pageSplitContext'
const { Provider:PageSplitDispatchProvider } = PageSplitDispatchContext
const { Provider:PageSplitStateProvider } = PageSplitStateContext

export const PageSplit = (props:any) => {
  const node = usePageSplit(props)
  const {
    state,
    dispatch,
    children,
    panel:Panel,
    divider:Divider
  } = node

  const params = clone(node, ["children", "panel", "divider", "state", "dispatch"])

  return (
    <div {...params} >
      <PageSplitStateProvider value={state} >
        <PageSplitDispatchProvider value={dispatch} >
          {
            Children.map(children, (contextMenu:any, index:any) => {
              return (
                <Fragment>
                  <Panel index={index} >
                    {contextMenu}
                  </Panel>
                  <Divider index={index} />
                </Fragment>
              )
            })
          }
        </PageSplitDispatchProvider>
      </PageSplitStateProvider>
    </div>
  )
}
