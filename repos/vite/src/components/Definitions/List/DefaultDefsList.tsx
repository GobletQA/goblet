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
      id={`gb-defs-tabpanel-${index}`}
      className='gb-defs-default-tab-panel'
      aria-labelledby={`gb-defs-tab-${index}`}
      {...other}
    >
      <DefinitionList definitions={definitions} />
    </DefTabPanel>
  );
}