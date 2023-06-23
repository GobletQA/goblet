jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()

import { LatentFile } from './file'
import { Latent } from '@GLT/latent'
import { env } from '@keg-hub/parse-config'
import { mockEncrypted } from '../../../__mocks__'
import {EFileType, ELatentEnv, ELoadFormat} from '@GLT/types'

const latentMock = {
  encoded: mockEncrypted,
  crypto: {
    decrypt: jest.fn((content:string, encoded:string, base64:boolean) => content)
  }
} as unknown as Latent

const fileOpts = {
  data: { foo: `bar` },
  type: EFileType.secrets,
  environment: ELatentEnv.test,
}

const latentFile = new LatentFile(fileOpts, latentMock)

describe(`latentFile`, () => {

  describe(`latentFile.<properties>`, () => {

    it(`should set the default properties`, () => {
      const latentF = new LatentFile({
        ...fileOpts,
        environment: ELatentEnv.local
      }, latentMock)

      expect(latentF.data).toBe(fileOpts.data)
      expect(latentF.environment).toBe(ELatentEnv.local)
    })

    it(`should allow overwriting the default properties`, () => {
      expect(latentFile.data).toEqual({ foo: `bar` })
      expect(latentFile.environment).toBe(ELatentEnv.test)
    })

  })


  describe(`latentFile.load`, () => {
    afterEach(() => {
      env.loadEnvSync.mockClear()
      // @ts-ignore
      latentMock.crypto.decrypt.mockClear()
    })

    it(`should call env.loadEnvSync`, () => {
      latentFile.load(`/some/test/location`, fileOpts)
      expect(env.loadEnvSync).toHaveBeenCalled()
    })

    it(`should call env.loadEnvSync with the current correct options`, () => {
      latentFile.load(`/some/test/location`, fileOpts)
      const options = env.loadEnvSync.mock.calls[0][0]
      
      expect(options).toEqual({
        fill: false,
        error: true,
        data: { foo: 'bar' },
        format: ELoadFormat.string,
        location:  `/some/test/location/${EFileType.secrets}.env`
      })

    })

    it(`should allow overwriting existing options`, () => {
      latentFile.load(`/some/test/location`, {
        data: { bar: `foo` },
        type: EFileType.values,
        environment: ELatentEnv.local,
      })
      const options = env.loadEnvSync.mock.calls[0][0]

      expect(options).toEqual({
        fill: false,
        error: true,
        format: ELoadFormat.string,
        data: { foo: `bar`, bar: `foo` },
        location:  `/some/test/location/${EFileType.values}.env`
      })

    })

    it(`should call latent.crypto.decrypt`, () => {
      latentFile.load(`/some/test/location`, fileOpts)
      expect(latentMock.crypto.decrypt).toHaveBeenCalled()
    })

    // TODO: add tests for calls to latent.crypto.decrypt

  })


})
