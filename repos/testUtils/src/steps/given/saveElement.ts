import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import { saveWorldLocator } from '@GTU/Support/helpers'

/**
 * Saves the element and focuses it for future steps to reuse
 */
export const selectSaveEl = async (
  selector:string,
  worldPath:string,
  world:TWorldConfig
) => {
  const element = await saveWorldLocator(selector, worldPath, world)
  await element.focus()
}

export const saveElToWorld = async (
  selector:string,
  worldPath:string,
  world:TWorldConfig
) => {
  await saveWorldLocator(selector, worldPath, world)
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

Given('{string} is saved', (
  selector,
  world
) => saveElToWorld(selector, `__meta.savedElement`, world), meta)
Given('I select {string}', (
  selector,
  world
) => selectSaveEl(selector, `__meta.savedElement`, world), meta)


Given('{string} is saved as {string}', saveElToWorld, metaExp)
Given('I save {string} as {string}', saveElToWorld, metaExp)
Given('I save the element {string} as {string}', saveElToWorld, metaExp)

