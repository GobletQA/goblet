import type { TDefGroups } from '@types'
import type { DefinitionTabs } from '@constants'

import { DefinitionList } from './DefinitionList'
import { DefTabPanel } from './DefinitionList.styled'

export type TCustomDefsList = {
  index:number
  definitions:TDefGroups
  tab:typeof DefinitionTabs[0]
}

export const CustomDefsList = (props:TCustomDefsList) => {
  const { tab, index, definitions, ...other } = props

  return (
    <DefTabPanel
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <DefinitionList definitions={definitions} />
    </DefTabPanel>
  );
}