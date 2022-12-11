import type { TDefGroupItem } from '@types'


import { EStepKey } from '@types'
import {
  DefText,
  DefIcon,
  DefButton,
  DefItem
} from './Definitions.styled'
import { ArrowRightIcon, AddCircleIcon } from '@components/Icons'

export type TDefinitionListItem = {
  type:EStepKey
  item:TDefGroupItem
}

export const DefinitionListItem = (props:TDefinitionListItem) => {
  const {
    type,
    item,
  } = props
  
  return (
    <DefItem
      className='goblet-def-item'
      key={`item-${type}-${item.uuid}`}
      secondaryAction={
        <DefButton
          aria-label="goblet-add-def-to-feature"
          sx={{ padding: `4px 10px` }}
        >
          <AddCircleIcon sx={{ fontSize: `16px`, marginRight: `5px` }} />
          Add
        </DefButton>
      }
    >
      <DefButton className='goblet-def-item-meta-toggle' >
        <DefIcon className='goblet-def-item-meta-toggle-icon' >
          <ArrowRightIcon />
        </DefIcon>
      </DefButton>
    
      <DefText className='goblet-def-item-text' primary={item.title} />
    </DefItem>
  )
}