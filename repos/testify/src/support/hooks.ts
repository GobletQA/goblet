/**
 * Use the Parkin hooks to initialize and cleanup the playwright browser
 * Called from a separate file then parkin and playwright to fix circular dependency
 * `playwrightTestEnv` load the parkin world to get the app url
 * `GobletParkin`  also load the parkin world to pass to Parkin when creating the parkin instance
 * By moving the hooks out of the GobletParkin initialization to this support file
 * we can resolve circular dependency
 */

import { VideoRecorder } from '@GTU/Playwright/video'
import { AfterAll, BeforeAll } from '@GTU/Parkin'
import { TraceRecorder } from '@GTU/Playwright/tracer'
import { initialize, cleanupPageAndContext } from '@GTU/PlaywrightEnv'
import { getPage, getContext } from '@GTU/Playwright/browserContext'


// TODO: this have to be moved to an init file instead of hooks
// If browser initialization fails, then the test are still run
// Because Before hook errors don't stop the the test execution

/**
 * Add wrap method to ensure no arguments are passed to initialize and cleanup
 */
BeforeAll(async () => {
  if(global?.__goblet?.options?.browserDisabled ?? false) return

  const { context, page } = await initialize()
  if(!context || !page) return

  context.__contextGoblet ||= {}
  context.__contextGoblet.tracer = new TraceRecorder()

  await context.__contextGoblet.tracer.start(context)

  page.__pageGoblet ||= {}
  page.__pageGoblet.video = new VideoRecorder(page)

})

AfterAll(async () => {
  if(global?.__goblet?.options?.browserDisabled ?? false) return

  const context = await getContext()
  if(!context) return

  const tracer = context?.__contextGoblet?.tracer
  if(tracer) tracer.clean(context)

  const page = await getPage()
  if(!page) return

  const video = page?.__pageGoblet?.video

  // Don't pass force because we don't want to force close the context
  // In the event reusePage || reuseContext is `true`
  await cleanupPageAndContext()
  if(!video) return

  // The video is not available until after the page closes
  // So we call clean after calling the playwright cleanup method
  await video.copyToRepo(page)
  video.clean()
})
