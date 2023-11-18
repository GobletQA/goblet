import type { TStepCtx } from '@GTU/Types'

import { When } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { saveWorldData } from '@GTU/Support/helpers'
import {
  ExpressionKinds,
  ExpressionTypes,
  ExpressionCustomInputs,
} from '@GTU/Constants'

export const saveClipboardToWorld = async (
  worldPath:string,
  ctx:TStepCtx
) => {

  const page = await getPage()

  const content = await page.evaluate(async () => {
    const el = document.createElement(`div`)
    el.tabIndex = 0
    Object.assign(el.style, {opacity: 0, height: `0px`, width: `0px`})
    document.body.append(el)
    el.focus()
    const text = await navigator.clipboard.readText()
    document.body.removeChild(el)

    return text
  })

  const { world } = ctx
  expect(content).not.toBe(undefined)
  saveWorldData({ value: content }, world, worldPath)
}

const meta = {
  race: true,
  name: `Save clipboard to world`,
  alias: [ `clipboard`],
  module: `changeTarget`,
  examples: [
    `I save the clipboard content to the world path "clipboardContent"`
  ],
  description: `Saves the content of the clipboard to a path on the world object`,
  expressions: [
    {
      label: `World Path`,
      example: `clipboard.content`,
      kind: ExpressionKinds.world,
      type: ExpressionTypes.string,
      kindRef: ExpressionCustomInputs.world,
      description: `Path on the world where the count should be saved`,
    }
  ],
}


When(`I save the clipboard content to the world path {string}`, saveClipboardToWorld, meta) 

