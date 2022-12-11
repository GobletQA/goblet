import type { TDefGroups } from '@types'
import type { DefinitionTabs } from '@constants'

import { DefTabPanel } from './DefinitionList.styled'
import { DefinitionList } from './DefinitionList'

export type TDefsList = {
  index:number
  definitions:TDefGroups
  tab:typeof DefinitionTabs[0]
}

export const DefaultDefsList = (props:TDefsList) => {
  const { tab, index, definitions, ...other } = props

  return (
    <DefTabPanel
      role="tabpanel"
      id={`goblet-defs-tabpanel-${index}`}
      className='goblet-defs-default-tab-panel'
      aria-labelledby={`goblet-defs-tab-${index}`}
      {...other}
    >
      <DefinitionList definitions={definitions} />
    </DefTabPanel>
  );
}