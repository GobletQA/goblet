import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getLocator } from '@GTU/Playwright'
import { saveWorldData } from '@GTU/Support/helpers'
import { SavedTextWorldPath } from '@GTU/Constants'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

const saveTextToWorld = async (
  selector:string,
  worldPath:string,
  ctx:TStepCtx
) => {

  if(!worldPath)
    throw new Error(`A $world path is required`)

  const locator = await getLocator(selector, ctx)
  const textContent = locator.innerText

  const { world } = ctx
  return await saveWorldData({ value: textContent }, world, worldPath)
}

const autoSaveTextToWorld = async (
  selector:string,
  ctx:TStepCtx
) => {
  const { world } = ctx

  const locator = await getLocator(selector, ctx)
  const textContent = locator.innerText
  return await saveWorldData({ value: textContent }, world, SavedTextWorldPath)
}

const meta = {
  race: true,
  name: `Save a element text`,
  autoSaveLocator: true,
  description: `Locates and saves an element for use in subsequent steps.`,
  module: `saveVariable`,
  examples: [
    `Given ".item[data-test-id='save-element'])" is saved as "page.elements.parent"`
  ],
  expressions: [
    {
      kind: ExpressionKinds.element,
      type: ExpressionTypes.string,
      description: `The selector or alias of the element to be saved`,
      examples: [
        `li.save-element`,
      ],
    },
  ],
}

const metaExp = {
  ...meta,
  expressions: meta.expressions.concat([{
    kind: ExpressionKinds.text,
    type: ExpressionTypes.string,
    examples: [`page.elements.parent`],
    description: `Path on the world where the element text should be saved`,
  }])
}

Given(`I save the text from {string}`, autoSaveTextToWorld, metaExp)
Given(`I save the text from {string} as {string}`, saveTextToWorld, metaExp)
