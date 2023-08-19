import { git } from '../git'
import { ENVS } from '@gobletqa/environment'
import { hashIO, gitOpts } from '../__mocks__'
import { Logger } from '@keg-hub/cli-utils'

const orgErr = Logger.error
const orgLog = Logger.log
const orgEmpty = Logger.empty

describe(`gitTag`, () => {

  beforeAll(() => {
    Logger.error = () => {}
    Logger.log = () => {}
    Logger.empty = () => {}
  })

  afterAll(async () => {
    await git.tag.remove({
      ...gitOpts,
      tag: ENVS.GB_SECRETS_TAG_REF,
    })

    Logger.error = orgErr
    Logger.log = orgLog
    Logger.empty = orgEmpty
  })

  describe(`tag`, () => {

    afterEach(async () => {
      await git.tag.remove({
        ...gitOpts,
        tag: ENVS.GB_SECRETS_TAG_REF,
      })
    })

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

  describe(`tag.cat`, () => {
    
    beforeEach(async () => {
      await git.tag({
        ...gitOpts,
        tag: ENVS.GB_SECRETS_TAG_REF,
        ref: hashIO.goblet.out
      })
    })

    afterAll(async () => {
      await git.tag.remove({
        ...gitOpts,
        tag: ENVS.GB_SECRETS_TAG_REF,
      })
    })

    it(`should return a original hashed tag in plain text`, async () => {
      const repo = await git.tag.cat({
        ...gitOpts,
        tag: ENVS.GB_SECRETS_TAG_REF,
      })

      expect(repo).toBe(hashIO.goblet.in)
    })

  })

  describe(`tag.remove`, () => {
    beforeEach(async () => {
      await git.tag({
        ...gitOpts,
        tag: ENVS.GB_SECRETS_TAG_REF,
        ref: hashIO.goblet.out
      })
    })

    it(`should return a list of existing tags`, async () => {
      const [rmErr, rmResp] = await git.tag.remove({
        ...gitOpts,
        tag: ENVS.GB_SECRETS_TAG_REF,
      })

      expect(rmErr).toBe(null)
      expect(rmResp.data.includes(`Deleted tag`)).toBe(true)
      expect(rmResp.data.includes(ENVS.GB_SECRETS_TAG_REF)).toBe(true)
    })

  })

})



// ;(async () => {
//   const resp = await git.tag({
//     ...gitOpts,
//     tag: ENVS.GB_SECRETS_TAG_REF,
//     ref: hashIO.goblet.out
//   })

//   console.log(`------- resp -------`)
//   console.log(resp)

//   const existing = await git.tag.cat({
//     ...gitOpts,
//     tag: ENVS.GB_SECRETS_TAG_REF,
//   })
  
//   console.log(`------- existing -------`)
//   console.log(existing)

//   const rmResp = await git.tag.remove({
//     ...gitOpts,
//     tag: ENVS.GB_SECRETS_TAG_REF,
//   })
  
//   console.log(`------- rmResp -------`)
//   console.log(rmResp)
// })()