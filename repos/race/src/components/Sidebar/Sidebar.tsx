import type { TEditorRefs } from '@GBR/types'

import { Text } from '../Text'
import { FeaturesList } from './FeaturesList'
import { SidebarContainer } from './Sidebar.styled'

export type TSidebar = TEditorRefs & {

}

export const Sidebar = (props:TSidebar) => {
  const { featuresRef } = props

  return (
    <SidebarContainer className='goblet-race-sidebar' >
      <Text>Features</Text>
      <FeaturesList
        featuresRef={featuresRef}
      />
    </SidebarContainer>
  )
  
}