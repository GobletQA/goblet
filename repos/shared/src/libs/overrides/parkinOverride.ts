import type { Repo } from '@GSH/types'
import type { TStepCtx } from '@GTU/Types'

import { wait } from '@keg-hub/jsutils/wait'
import { isFunc } from '@keg-hub/jsutils/isFunc'

/**
 * Helper method to validate the require request is for Parkin
 */
export const parkinCheck = (request?:string) => (
  request.startsWith(`@gobletqa/test-utils/parkin`) ||
  request.startsWith(`GobletParkin`) ||
  request.startsWith(`@GTU/Parkin`)
)


/**
 * This is a temp method that duplicates testUtils/src/parkin/stepFunctions
 * Need to find a better way to manage those dependencies
 * screen-cast most likely will need testUtils as a dependency
 */
const augmentCtx = async (ctx:TStepCtx) => {
  if(!ctx) return ctx

  const goblet = global.__goblet

  return {...ctx, goblet }

  // No sure if we should inject the page and context into the step ctx object
  // Could cause memory leaks and other issues
  // const page = global.page
  // const context = global.context
  // const goblet = global.__global
  // return {...ctx, page, context, goblet }
}


/**
 * Still debating on if this is a good idea or not.
 * It wraps the step method with a 1 second buffer before and after
 * May help will web inconsistencies.
 */
const waitBuffer = false

const getStepHandler = (repo:Repo, name:string) => {
  return (...args:any[]) => {

    const [match, action, meta] = args

    const method = !isFunc(action)
      ? action
      : async (...args:any[]) => {
          waitBuffer && await wait(1000)
          const ctx = args.pop() as TStepCtx
          const augmented = await augmentCtx(ctx)

          const resp = await action(...args, augmented)
          waitBuffer && await wait(1000)

          return resp
        }

    return repo.parkin[name].apply(repo.parkin, [match, method, meta])
  }
}



/**
 * Override module for Parkin to allow loading the repo specific parkin instance
 */
export const parkinOverride = (repo:Repo) => {
  return () => ({
    And: getStepHandler(repo, `And`),
    But: getStepHandler(repo, `But`),
    When: getStepHandler(repo, `When`),
    Then: getStepHandler(repo, `Then`),
    Given: getStepHandler(repo, `Given`),
    After: repo.parkin.hooks.afterEach.bind(repo.parkin.hooks),
    AfterEach: repo.parkin.hooks.afterEach.bind(repo.parkin.hooks),
    AfterAll: repo.parkin.hooks.afterAll.bind(repo.parkin.hooks),
    Before: repo.parkin.hooks.beforeEach.bind(repo.parkin.hooks),
    BeforeAll: repo.parkin.hooks.beforeAll.bind(repo.parkin.hooks),
    BeforeEach: repo.parkin.hooks.beforeEach.bind(repo.parkin.hooks),
  })
}
