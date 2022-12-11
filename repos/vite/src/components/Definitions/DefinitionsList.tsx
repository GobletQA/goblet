import type { TDefGroups } from '@types'
import {
  DefText,
  DefsList,
  DefsListItem,
  DefListSubheader,
} from './Definitions.styled'

export type TDefinitionsList = {
  definitions: TDefGroups
}

export const DefinitionsList = (props:TDefinitionsList) => {
  const { definitions } = props
  const { lookup, all, ...defTypes } = definitions
  
  console.log(`------- defTypes -------`)
  console.log(defTypes)
  
  return (
    <DefsList subheader={<li />}>

      {Object.entries(defTypes).map(([type, group]) => {

        return (
          <li key={`section-${type}`}>

            <ul>
              <DefListSubheader>
                {group.group}
              </DefListSubheader>

              {group.items.map((item) => (
                <DefsListItem key={`item-${type}-${item.uuid}`}>
                  <DefText primary={item.title} />
                </DefsListItem>
              ))}

            </ul>

          </li>
        )

      })}


    </DefsList>
  )
}
