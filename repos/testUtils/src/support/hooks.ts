/**
 * Use the Parkin hooks to initialize and cleanup the playwright browser
 * Called from a separate file then parkin and playwright to fix circular dependency
 * `playwrightTestEnv` load the parkin world to get the app url
 * `GobletParkin`  also load the parkin world to pass to Parkin when creating the parkin instance
 * By moving the hooks out of the GobletParkin initializaion to this support file
 * we can resolve circular dependency
 */

import { Tracer } from '@GTU/Playwright/tracer'
import { AfterAll, BeforeAll } from '@GTU/Parkin'
import { initialize, cleanup } from '@GTU/PlaywrightEnv'
import { Video } from '@GTU/Playwright/video'
import { getPage, getContext } from '@GTU/Playwright/browserContext'

/**
 * Add wrap method to ensure no arguments are passed to initialize and cleanup
 */
BeforeAll(async () => {
  const { context } = await initialize()
  await Tracer.start(context)
})

AfterAll(async () => {
  const context = await getContext()
  Tracer.clean(context)

  const page = await getPage()
  Video.clean(page)

  await cleanup()
})
