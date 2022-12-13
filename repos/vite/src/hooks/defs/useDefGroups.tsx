import type {
  TDefGroup,
  TDefLookupMap,
  TDefTypeGroup,
  TAllDefGroup,
  TDefinitionAst,
  TDefGroupItem,
  TDefGroupType,
  TDefGroupTypes,
} from '@types'

import { useMemo } from 'react'
import { useDefs, useRepo } from '@store'
import { capitalize } from '@keg-hub/jsutils'
import { OpenEditorFileEvt } from '@constants'
import { EE } from '@gobletqa/shared/libs/eventEmitter'
import { FileOpenIcon, AddCircleIcon } from '@components/Icons'
import { addStepFromDefinition } from '@actions/features/local'


// TODO: investigate moving this to an action, when the definitions are loaded
// Also need to sort be default vs custom. Can use the file path vs repo path to figure it out

const getDefGroupObj = (type:string):TDefGroup => ({
  type,
  items: [],
  toggled: false,
  group: `${capitalize(type)} Steps`,
})

/**
 * Default group object for splitting up step definitions
 */
const getGroupsObj = ():TDefTypeGroup => ({
  given: getDefGroupObj('given'),
  when: getDefGroupObj('when'),
  then: getDefGroupObj('then'),
})

const getDefGroupTypes = () => ({
  customDefs: getGroupsObj(),
  lookup: {} as TDefLookupMap,
  defaultDefs: getGroupsObj(),
  allDefs: { all: getDefGroupObj('all') } as TAllDefGroup,
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

const sortAllDefs = (allDefs:TAllDefGroup) => {
  allDefs?.all?.items?.sort((a, b) => {
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

  return allDefs
}

/**
 * Sorts each definition group type alphabetically
 * Also sorts the all group by definition type
 */
const sortDefinitions = (grouped:TDefTypeGroup) => {
  grouped.given.items = alphaSort(grouped.given.items)
  grouped.when.items = alphaSort(grouped.when.items)
  grouped.then.items = alphaSort(grouped.then.items)

  return grouped
}


function onAdd(item:TDefGroupItem|TDefinitionAst) {
  addStepFromDefinition({ clipboard: true, definition: item as TDefinitionAst})
}

function onOpen(item:TDefinitionAst) {
  EE.emit(OpenEditorFileEvt, item)
}

const buildItem = (def:TDefinitionAst) => {
  return {
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
  } as TDefGroupItem
}

/**
 * Maps the definitions to a format that can be loaded by the SimpleList Component
 * Separates them by type, and creates a lookup map
 */
export const useDefGroups = () => {
  const { definitionTypes } = useDefs()
  const repo = useRepo()
  const repoRoot = repo?.paths?.repoRoot

  return useMemo(() => {
    const {
      lookup,
      allDefs,
      customDefs,
      defaultDefs,
    } = getDefGroupTypes()

    definitionTypes
      && Object.entries(definitionTypes)
          .forEach(([key, defs]) => {
            defs.map(def => {
              const grouped = def?.location?.startsWith(repoRoot) ? customDefs : defaultDefs

              const itemProps = buildItem(def)

              allDefs?.all?.items?.push(itemProps)
              grouped?.[key as TDefGroupType]?.items?.push(itemProps)

              lookup[def.uuid] = def
            })
          })

    return {
      lookup,
      allDefs: sortAllDefs(allDefs),
      customDefs: sortDefinitions(customDefs),
      defaultDefs: sortDefinitions(defaultDefs),
    } as TDefGroupTypes

  }, [
    repoRoot,
    definitionTypes
  ])
}
