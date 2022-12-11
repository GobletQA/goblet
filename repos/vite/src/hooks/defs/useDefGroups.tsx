import type {
  TDefGroups,
  TDefinitionAst,
  TDefGroupItem,
  TDefGroupType,
} from '@types'

import { useDefs } from '@store'
import { useMemo } from 'react'
import { capitalize } from '@keg-hub/jsutils'
import { FileOpenIcon, AddCircleIcon } from '@components/Icons'

// TODO: investigate moving this to an action, when the definitions are loaded
// Also need to sort be default vs custom. Can use the file path vs repo path to figure it out

/**
 * Default group object for splitting up step definitions
 */
const getGroupsObj = ():TDefGroups => ({
  lookup: {},
  all: { type: 'all', group: 'All Steps', toggled: false, items: [] },
  given: { type: 'given', group: 'Given Steps', toggled: true, items: [] },
  when: { type: 'when', group: 'When Steps', toggled: false, items: [] },
  then: { type: 'then', group: 'Then Steps', toggled: false, items: [] },
})

/**
 * Sorts the passed in array of items alphabetically based on each items title property
 */
const alphaSort = (items:TDefGroupItem[]) => {
  items.sort((a, b) => {
    const textA = a.title.toLowerCase()
    const textB = b.title.toLowerCase()
    return textA < textB ? -1 : textA > textB ? 1 : 0
  })

  return items
}

/**
 * Sorts each definition group type alphabetically
 * Also sorts the all group by definition type
 */
const sortDefinitions = (grouped:TDefGroups) => {
  grouped.all.items.sort((a, b) => {
    const textA = a.title.toLowerCase()
    const textB = b.title.toLowerCase()
    const aWhen = textA.startsWith('when')
    const bThen = textB.startsWith('then')
    const aThen = textA.startsWith('then')
    const bWhen = textB.startsWith('when')

    if (aWhen && bThen) return -1
    if (aThen && bWhen) return 1

    return textA < textB ? -1 : textA > textB ? 1 : 0
  })

  grouped.given.items = alphaSort(grouped.given.items)
  grouped.when.items = alphaSort(grouped.when.items)
  grouped.then.items = alphaSort(grouped.then.items)

  return grouped
}


function onAdd(item:TDefGroupItem|TDefinitionAst) {
  console.log(`------- onAdd item -------`)
  console.log(item)
}

function onOpen(item:TDefGroupItem|TDefinitionAst) {
  console.log(`------- onOpen item -------`)
  console.log(item)
}

/**
 * Maps the definitions to a format that can be loaded by the SimpleList Component
 * Separates them by type, and creates a lookup map
 */
export const useDefGroups = () => {
  const { definitionTypes } = useDefs()

  return useMemo(() => {
    const defGroups = getGroupsObj()

    return definitionTypes
      ? Object.entries(definitionTypes).reduce((grouped, [key, defs]) => {
            defs.map(def => {
              const itemProps:TDefGroupItem = {
                title: `${capitalize(def.type)} ${def.name}`,
                uuid: def.uuid,
                meta: def.meta,
                actions: [
                  {
                    name: `Add`,
                    key: `def-add-to-feature`,
                    action: onAdd.bind(null, def),
                    Component: AddCircleIcon,
                  },
                  {
                    name: `Open`,
                    key: `def-open-file`,
                    action: onOpen.bind(null, def),
                    Component: FileOpenIcon,
                  },
                ],
              }
      
              grouped[key as TDefGroupType].items.push(itemProps)
              grouped.all.items.push(itemProps)
              grouped.lookup[def.uuid] = def

            })

          return sortDefinitions(grouped)
        }, defGroups)
      : defGroups

  }, [definitionTypes])
}

