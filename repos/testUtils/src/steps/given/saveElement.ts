import type { TWorldConfig } from '@ltipton/parkin'

import { Given } from '@GTU/Parkin'
import { SavedLocatorWorldPath } from '@GTU/Constants'
import { saveWorldLocator } from '@GTU/Support/helpers'

const saveElToWorld = async (
  selector:string,
  worldPath:string,
  world:TWorldConfig
) => {
  if(!worldPath)
    throw new Error(`A path on the $world object is required`)
  
  return await saveWorldLocator(selector, world, worldPath)
}

const autoSaveElToWorld = async (selector:string, world:TWorldConfig) => {
  const element = await saveElToWorld(
    selector,
    SavedLocatorWorldPath,
    world
  )
  await element.focus()
}


const meta = {
  description: `Locates and saves an element for use in subsequent steps.`,
  module: `saveElement`,
  examples: [
    `Given ".item[data-test-id='the-goblet-pub'])" is saved as "page.elements.parent"`
  ],
  expressions: [
    {
      type: `string`,
      description: `The selector or alias of the element to be saved`,
      examples: [
        `li.hotel-items`,
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

Given(`{string} is saved`, (
  selector:string,
  world:TWorldConfig
) => autoSaveElToWorld(selector, world), meta)
Given(`I select {string}`, (
  selector:string,
  world:TWorldConfig
) => autoSaveElToWorld(selector, world), meta)


Given(`{string} is saved as {string}`, saveElToWorld, metaExp)
Given(`I save {string} as {string}`, saveElToWorld, metaExp)
Given(`I save the element {string} as {string}`, saveElToWorld, metaExp)

