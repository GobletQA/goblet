import type { TEditorRefs } from '@GBR/types'

import { Text } from '../Text'
import { ModelsList } from './ModelsList'
import { SidebarContainer } from './Sidebar.styled'

export type TSidebar = TEditorRefs & {

}

export const Sidebar = (props:TSidebar) => {
  const { modelsRef } = props

  return (
    <SidebarContainer className='goblet-race-sidebar' >
      <Text>Features</Text>
      <ModelsList
        modelsRef={modelsRef}
      />
    </SidebarContainer>
  )
  
}