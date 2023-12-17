/**
 * Sets up the environment for running parkin with Jest
 * Loaded via the jest config options `setupFilesAfterEnv`
 * Is loaded after `parkinTestInit.js` to ensure the parkin instance is already configured
 * Which adds the `getParkinInstance` method to the global object, which is called here
 */

const getHook = (hookName) => {
  return (...args:any[]) => {
    // TODO: need to investigate
    const parkin = global.getParkinInstance()
    return parkin.hooks[hookName].apply(parkin.hooks, args)
  }
}

/**
 * Test hooks to execute before and after test runs 
 * @example
 * import { BeforeAll, AfterAll } from '@GTU/Parkin'
 * BeforeAll(() => setupMyTestEnv())
 * AfterAll(() => cleanupMyEnv())
 */
export const BeforeAll = getHook('beforeAll')
export const AfterAll = getHook('afterAll')
export const BeforeEach = getHook('beforeEach')
export const AfterEach = getHook('afterEach')
export const Before = getHook('beforeEach')
export const After = getHook('afterEach')
