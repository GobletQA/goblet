import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import { set } from '@keg-hub/jsutils'
import { getLocator } from '@GTU/Playwright'
import { cleanWorldPath } from '@GTU/Support/helpers'

/**
 * Finds the element matching selector returned from selectorAlias, and registers it as the current ancestor
 * @param {string} selector - valid playwright selector
 * @param {string} alias - mapped selector alias if there is one otherwise the word `selector`
 * @param {string} data - if mapped alias exists then this is the on-screen text of the selector.  if no mapped alias exists then this is the selector + on-screen text of the element
 * @param {Object} world
 */
export const saveElement = async (
  selector:string,
  worldPath:string,
  world:TWorldConfig
) => {
  const element = await getLocator(selector)
  const cleaned = cleanWorldPath(worldPath)
  set(world, cleaned, { selector, element })

  return element
}

/**
 * Saves the element and focuses it for future steps to reuse
 */
const selectSaveEl = async (
  selector:string,
  worldPath:string,
  world:TWorldConfig
) => {
  const element = await saveElement(selector, worldPath, world)
  await element.focus()
}

const saveElToWorld = async (
  selector:string,
  worldPath:string,
  world:TWorldConfig
) => {
  await saveElement(selector, worldPath, world)
}

const meta = {
  description: `Locates and saves an element for use in subsequent steps.`,
  module: `saveElement`,
  examples: [
    `Given ".item[data-test-id='the-goblet-pub'])" is saved as "page.elements.parent"`
  ],
  expressions: [
    {
      type: 'string',
      description: `The selector or alias of the element to be saved`,
      examples: [
        'li.hotel-items',
      ],
    },
  ],
}

const metaExp = {
  ...meta,
  expressions: meta.expressions.concat([{
    type: `string`,
    examples: [`page.elements.parent`],
    description: `Path on the world where the element should be saved`,
  }])
}

Given('{string} is saved', (selector, world) => saveElToWorld(selector, `__meta.savedElement`, world), meta)
Given('I select {string}', (selector, world) => selectSaveEl(selector, `__meta.savedElement`, world), meta)


Given('{string} is saved as {string}', saveElToWorld, metaExp)
Given('I save {string} as {string}', saveElToWorld, metaExp)
Given('I save the element {string} as {string}', saveElToWorld, metaExp)

