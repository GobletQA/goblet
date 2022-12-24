import type { TEditorRefs } from '@GBR/types'

import { Text } from '../Text'
import { FeaturesPanel } from './FeaturesPanel'
import { SidebarContainer } from './Sidebar.styled'

export type TSidebar = TEditorRefs & {

}

export const Sidebar = (props:TSidebar) => {


  return (
    <SidebarContainer className='goblet-race-sidebar' >
      <FeaturesPanel {...props} />
    </SidebarContainer>
  )
  
}