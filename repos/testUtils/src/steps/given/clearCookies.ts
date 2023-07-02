import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getContext } from '@GTU/Playwright'


const clearCookies = async (ctx:TStepCtx) => {
  const context = await getContext()
  await context.clearCookies()
}

Given(`I clear the browser cookies`, clearCookies, {
  race: true,
  module: `clearCookies`,
  alias: [`Clear`, `Cookies`],
  name: `Clear browser cookies`,
  description: `Clears all cookies for the current Browser Context`,
})

