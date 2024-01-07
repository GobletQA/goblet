const { GithubApi } = require('../githubApi')

describe(`Git Providers`, () => {
  
  describe(`buildAPIUrl`, () => {

    it(`builds the correct api url`, () => {
      if(process.env.CI) return true

      const apiUrl = GithubApi.buildAPIUrl({
        remote: `https://github.com/foo/bar`
      })
      expect(apiUrl).toBe(`https://api.github.com/foo/bar`)
    })

    it(`should not override the host when passed`, () => {
      if(process.env.CI) return true

      const apiUrl = GithubApi.buildAPIUrl({
        host: `test.dev`,
        remote: `https://github.com/foo/bar`
      })
      expect(apiUrl).toBe(`https://test.dev/foo/bar`)
    })

    it(`should add pre path and post path fields`, () => {
      if(process.env.CI) return true

      const preUrl = GithubApi.buildAPIUrl({
        prePath: `pre`,
        remote: `https://github.com/foo/bar`
      })

      expect(preUrl).toBe(`https://api.github.com/pre/foo/bar`)

      const postUrl = GithubApi.buildAPIUrl({
        postPath: `post`,
        remote: `https://github.com/foo/bar`
      })
      expect(postUrl).toBe(`https://api.github.com/foo/bar/post`)

      const both = GithubApi.buildAPIUrl({
        prePath: `pre`,
        postPath: `post`,
        remote: `https://github.com/foo/bar`
      })
      expect(both).toBe(`https://api.github.com/pre/foo/bar/post`)

    })

  })

})

export {}