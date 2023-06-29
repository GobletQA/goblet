import { git } from '../git'
import {
  hashIO,
  gitOpts
} from '../__mocks__'


describe(`gitHash`, () => {

  describe(`hash`, () => {
    it(`it returns a has from the passed in content`, async () => {
      const [err, resp] = await git.hash({ ...gitOpts, content: hashIO.goblet.in }, {})
      expect(resp.data).toBe(hashIO.goblet.out)
    })
    
    it(`it returns a different hash for different content`, async () => {
      const [gobErr, gobResp] = await git.hash({ ...gitOpts, content: hashIO.goblet.in }, {})
      const [demoErr, demoResp] = await git.hash({ ...gitOpts, content: hashIO.demos.in }, {})
      expect(gobResp.data).not.toBe(demoResp.data)

      expect(gobResp.data).toBe(hashIO.goblet.out)
      expect(demoResp.data).toBe(hashIO.demos.out)
    })
    
  })

  describe(`hash.content`, () => {
    it(`it returns a has from the passed in content`, async () => {
      const hash = await git.hash.content({ ...gitOpts, content: hashIO.goblet.in }, {})
      expect(hash).toBe(hashIO.goblet.out)
    })
  })

})

// ;(async () => {
 
//   const hash = await git.hash.content({ ...gitOpts, content: hashIO.demos.in }, {})
//   console.log(`------- hash -------`)
//   console.log(hash)
  
// })()