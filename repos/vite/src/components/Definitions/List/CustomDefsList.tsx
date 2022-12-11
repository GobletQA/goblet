import type { TDefsList } from './DefaultDefsList'

import { DefinitionList } from './DefinitionList'
import { DefTabPanel } from './DefinitionList.styled'

export type TCustomDefsList = TDefsList

export const CustomDefsList = (props:TCustomDefsList) => {
  const { tab, index, definitions, ...other } = props

  return (
    <DefTabPanel
      role="tabpanel"
      id={`goblet-defs-tabpanel-${index}`}
      className='goblet-defs-custom-tab-panel'
      aria-labelledby={`goblet-defs-tab-${index}`}
      {...other}
    >
      <DefinitionList definitions={definitions} />
    </DefTabPanel>
  );
}