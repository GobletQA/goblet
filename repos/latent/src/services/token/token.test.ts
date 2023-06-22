jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

import { LatentToken } from './token'
import {
  altUrl,
  repoUrl,
  repoToken
} from '../../../__mocks__'

const latentToken = new LatentToken()

describe(`LatentToken`, () => {
  describe(`LatentToken.generate`, () => {

    it(`should generate a consistent token when called with same inputs`, () => {
      const token1 = latentToken.generate(repoUrl)
      const token2 = latentToken.generate(repoUrl)

      expect(typeof token1).toBe(`string`)
      expect(typeof token2).toBe(`string`)
      expect(token1).toBe(token2)
      expect(token1).toBe(repoToken)
    })


    it(`should generate tokens that are always a consistent length`, () => {
      const token1 = latentToken.generate(repoUrl)
      const token2 = latentToken.generate(altUrl)
      const token3 = latentToken.generate(`12345`)
      const token4 = latentToken.generate(` `)

      const half = repoToken.slice(0, repoToken.length / 2)
      const third = repoToken.slice(0, repoToken.length / 3)
      const quarter = repoToken.slice(0, repoToken.length / 4)

      const token5 = latentToken.generate(half)
      const token6 = latentToken.generate(third)
      const token7 = latentToken.generate(quarter)
      const token8 = latentToken.generate(`${repoToken}${half}`)
      const token9 = latentToken.generate(`${repoToken}${third}`)
      const token10 = latentToken.generate(`${repoToken}${quarter}`)

      expect(token1.length).toBe(88)
      expect(token2.length).toBe(88)
      expect(token3.length).toBe(88)
      expect(token4.length).toBe(88)
      expect(token5.length).toBe(88)
      expect(token6.length).toBe(88)
      expect(token7.length).toBe(88)
      expect(token8.length).toBe(88)
      expect(token9.length).toBe(88)
      expect(token10.length).toBe(88)
    })


  })

  describe(`LatentToken.validate`, () => {

    it(`should validate a consistent token when called with same inputs`, () => {
      expect(latentToken.validate(repoUrl, repoToken)).toBe(repoUrl)
    })

    it(`should throw an error if the token fails validation`, () => {
      expect(() => latentToken.validate(altUrl, repoToken)).toThrow()
    })

  })

})