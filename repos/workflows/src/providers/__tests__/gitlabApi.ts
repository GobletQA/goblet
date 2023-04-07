const { GitlabApi } = require('../gitlabApi')

describe(`Git Providers`, () => {
  
  describe(`buildAPIUrl`, () => {

    it(`builds the correct api url`, () => {
      const apiUrl = GitlabApi.buildAPIUrl({
        remote: `https://gitlab.com/foo/bar/boo`
      })
      expect(apiUrl).toBe(`https://gitlab.com/foo/bar/boo`)
    })

    it(`should not override the host when passed`, () => {
      const apiUrl = GitlabApi.buildAPIUrl({
        host: `test.dev`,
        remote: `https://gitlab.com/foo/bar/boo`
      })
      expect(apiUrl).toBe(`https://test.dev/foo/bar/boo`)
    })

    it(`should add pre path and post path fields`, () => {
      const preUrl = GitlabApi.buildAPIUrl({
        prePath: `pre`,
        remote: `https://gitlab.com/foo/bar/boo`
      })
      expect(preUrl).toBe(`https://gitlab.com/pre/foo/bar/boo`)

      const postUrl = GitlabApi.buildAPIUrl({
        postPath: `post`,
        remote: `https://gitlab.com/foo/bar/boo`
      })
      expect(postUrl).toBe(`https://gitlab.com/foo/bar/boo/post`)

      const both = GitlabApi.buildAPIUrl({
        prePath: `pre`,
        postPath: `post`,
        remote: `https://gitlab.com/foo/bar/boo`
      })
      expect(both).toBe(`https://gitlab.com/pre/foo/bar/boo/post`)

    })

  })

})
