jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

import { LatentFile } from './file'
import {emptyObj} from '@keg-hub/jsutils'
import { env } from '@keg-hub/parse-config'

const latentFile = new LatentFile({
  error:false,
  fill: false,
  data: { foo: `bar` },
  pattern: /{([^}]*)}/g
})

describe(`latentFile`, () => {

  describe(`latentFile.<properties>`, () => {

    it(`should set the default properties`, () => {
      const latentF = new LatentFile()
      expect(latentF.fill).toBe(true)
      expect(latentF.error).toBe(true)
      expect(latentF.data).toBe(emptyObj)
      expect(latentF.pattern.toString()).toBe(`/{{([^}]*)}}/g`)
    })

    it(`should allow overwriting the default properties`, () => {
      expect(latentFile.fill).toBe(false)
      expect(latentFile.error).toBe(false)
      expect(latentFile.data).toEqual({ foo: `bar` })
      expect(latentFile.pattern.toString()).toBe(`/{([^}]*)}/g`)
    })

  })


  describe(`latentFile.load`, () => {
    afterEach(() => {
      env.loadEnvSync.mockClear()
    })

    it(`should call env.loadEnvSync`, () => {
      latentFile.load(`/some/test/location`)
      expect(env.loadEnvSync).toHaveBeenCalled()
    })

    it(`should call env.loadEnvSync with the current correct options`, () => {
      latentFile.load(`/some/test/location`)
      const options = env.loadEnvSync.mock.calls[0][0]
      
      expect(options).toEqual({
        fill: false,
        error: false,
        format: 'object',
        data: { foo: 'bar' },
        pattern: /{([^}]*)}/g,
        location: '/some/test/location'
      })

    })


    it(`should allow overwriting existing options`, () => {
      latentFile.load(`/some/test/location`, {
        fill: true,
        error: true,
        data: { bar: `foo` },
        pattern: /{{([^}]*)}}/g,
      })
      const options = env.loadEnvSync.mock.calls[0][0]

      expect(options).toEqual({
        fill: true,
        error: true,
        format: 'object',
        pattern: /{{([^}]*)}}/g,
        location: '/some/test/location',
        data: { foo: 'bar', bar: 'foo' },
      })

    })

  })


})
