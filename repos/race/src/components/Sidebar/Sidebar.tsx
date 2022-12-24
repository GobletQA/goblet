import type { TEditorRefs } from '@GBR/types'

import Box from '@mui/material/Box'
import { ModelsList } from './ModelsList'
import { useModel } from '../../contexts'
import { SidebarContainer } from './Sidebar.styled'

export type TSidebar = TEditorRefs & {

}

export const Sidebar = (props:TSidebar) => {
  const { modelsRef } = props

  return (
    <SidebarContainer className='goblet-race-sidebar' >
      <span>Sidebar</span>
      <ModelsList
        modelsRef={modelsRef}
      />
    </SidebarContainer>
  )
  
}