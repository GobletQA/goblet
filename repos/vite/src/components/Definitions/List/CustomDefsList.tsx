import type { TDefsList } from './DefaultDefsList'

import { DefinitionList } from './DefinitionList'
import { DefTabPanel } from './DefinitionList.styled'

export type TCustomDefsList = TDefsList

export const CustomDefsList = (props:TCustomDefsList) => {
  const { tab, index, definitions, ...other } = props

  return (
    <DefTabPanel
      role="tabpanel"
      id={`gb-defs-tabpanel-${index}`}
      className='gb-defs-custom-tab-panel'
      aria-labelledby={`gb-defs-tab-${index}`}
      {...other}
    >
      <DefinitionList definitions={definitions} />
    </DefTabPanel>
  );
}