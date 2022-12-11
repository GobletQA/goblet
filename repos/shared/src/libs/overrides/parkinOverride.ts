import { TRepo } from '@GSH/types'

/**
 * Helper method to validate the require request is for Parkin
 */
export const parkinCheck = (request?:string) => (
  request.startsWith(`@gobletqa/test-utils/parkin`) ||
  request.startsWith(`GobletParkin`) ||
  request.startsWith(`@GTU/Parkin`)
)

/**
 * Override module for Parkin to allow loading the repo specific parkin instance
 */
export const parkinOverride = (repo:TRepo) => {
  return () => ({
    And: repo.parkin.And.bind(repo.parkin),
    But: repo.parkin.But.bind(repo.parkin),
    When: repo.parkin.When.bind(repo.parkin),
    Then: repo.parkin.Then.bind(repo.parkin),
    Given: repo.parkin.Given.bind(repo.parkin),
    After: repo.parkin.hooks.afterEach.bind(repo.parkin.hooks),
    AfterAll: repo.parkin.hooks.afterAll.bind(repo.parkin.hooks),
    Before: repo.parkin.hooks.beforeEach.bind(repo.parkin.hooks),
    BeforeAll: repo.parkin.hooks.beforeAll.bind(repo.parkin.hooks),
  })
}
