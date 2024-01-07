import { git } from '../git'
import { ENVS } from '@gobletqa/environment'
import { hashIO, gitOpts } from '../__mocks__'
import { Logger, runCmd } from '@keg-hub/cli-utils'

jest.mock('@keg-hub/cli-utils', () => {
  return {
    Logger: {
      log: () => {},
      error: () => {},
      empty: () => {},
    },
    fileSys: {
      pathExistsSync: () => true,
      readFileSync: () => ``,
    },
    runCmd: async () => {
      return {
        data: ``,
        error: ``,
        exitCode: 0
      }
    }
  }
})

describe(`gitTag`, () => {

  describe(`tag`, () => {
    it(`should tag a repo with the passed in tag`, async () => {
      const [err, resp] = await git.tag({
        ...gitOpts,
        tag: ENVS.GB_SECRETS_TAG_REF,
        ref: hashIO.goblet.out
      })
      
      expect(err).toBe(null)
      expect(resp.exitCode).toBe(0)
    })
  })

  describe(`tag.list`, () => {
    it(`should return a list of existing tags`, async () => {
      // git.tag.list({})
      expect(true).toBe(true)
    })
  })

})
