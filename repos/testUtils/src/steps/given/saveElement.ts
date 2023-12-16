import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { SavedLocatorWorldPath } from '@gobletqa/environment/constants'
import { saveWorldLocator } from '@GTU/Support/helpers'

const saveElToWorld = async (
  selector:string,
  worldPath:string,
  ctx:TStepCtx
) => {
  if(!worldPath)
    throw new Error(`A path on the $world object is required`)

  const { world } = ctx
  return await saveWorldLocator({ selector, world, worldPath }, ctx)
}

const autoSaveElToWorld = async (selector:string, ctx:TStepCtx) => {
  const element = await saveElToWorld(
    selector,
    SavedLocatorWorldPath,
    ctx
  )
  await element.focus()
}

const meta = {
  name: `Save Element`,
  autoSaveLocator: true,
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
  ctx:TStepCtx
) => autoSaveElToWorld(selector, ctx), meta)
Given(`I select {string}`, (
  selector:string,
  ctx:TStepCtx
) => autoSaveElToWorld(selector, ctx), meta)


Given(`{string} is saved as {string}`, saveElToWorld, metaExp)
Given(`I save {string} as {string}`, saveElToWorld, metaExp)
Given(`I save the element {string} as {string}`, saveElToWorld, metaExp)

