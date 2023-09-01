
import { AfterAll, BeforeAll } from '@GTU/Parkin'
import { initialize, cleanup } from '@GTU/PlaywrightEnv'

/**
 * Add wrap method to ensure no arguments are passed to initialize and cleanup
 */
BeforeAll(async () => {
  await initialize()
})

AfterAll(async () => {
  await cleanup()
})
