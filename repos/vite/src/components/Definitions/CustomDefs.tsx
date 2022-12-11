import type { TDefGroups } from '@types'
import type { DefinitionTabs } from '@constants'

import { DefTabPanel } from './Definitions.styled'
import { DefinitionsList } from './DefinitionsList'

export type TCustomDefs = {
  index:number
  definitions:TDefGroups
  tab:typeof DefinitionTabs[0]
}

export const CustomDefs = (props:TCustomDefs) => {
  const { tab, index, definitions, ...other } = props

  return (
    <DefTabPanel
      role="tabpanel"
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      <DefinitionsList definitions={definitions} />
    </DefTabPanel>
  );
}