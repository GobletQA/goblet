import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getPage } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

const randomInt = (min:number, max:number) => Math.floor(Math.random() * (max - min + 1) + min)

/**
 * Moves the mouse on the page to some X,Y coordinates
 */
export const moveMouse = async (
  XPos:number,
  YPos:number,
  ctx:TStepCtx
) => {
  const page = await getPage()
  await page.mouse.move(XPos, YPos);
}

const moveMouseRandom = async (ctx:TStepCtx) => {
  const page = await getPage()
  const { width, height } = page.viewportSize()
  await moveMouse(randomInt(1, width), randomInt(1, height), ctx)
}

Given(`I move the mouse`, moveMouseRandom, {
  name: `Move the mouse`,
  module: `moveMouse`,
  description: `Moves the mouse on the page some arbitrary amount.`,
  race: true
})

Given(`I move the mouse to {int}, {int}`, moveMouse, {
  name: `Move the mouse to position`,
  description: `Moves the mouse to a specific X,Y coordinates of the page.`,
  expressions: [
    {
      example: 100,
      description: `X coordinate`,
      type: ExpressionTypes.int,
      kind: ExpressionKinds.number,
    },
    {
      example: 100,
      description: `Y coordinate`,
      type: ExpressionTypes.int,
      kind: ExpressionKinds.number,
    },
  ],
  module: `moveMouse`,
  race: true
})
