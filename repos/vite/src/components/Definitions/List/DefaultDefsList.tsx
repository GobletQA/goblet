import type { TDefGroups } from '@types'
import type { DefinitionTabs } from '@constants'

import { DefTabPanel } from './DefinitionList.styled'
import { DefinitionList } from './DefinitionList'

export type TDefaultDefsList = {
  index:number
  definitions:TDefGroups
  tab:typeof DefinitionTabs[0]
}

export const DefaultDefsList = (props:TDefaultDefsList) => {
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