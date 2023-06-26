jest.resetModules()
jest.resetAllMocks()
jest.clearAllMocks()
const setMox = jest.setMock.bind(jest)

import path from 'path'
import { Latent } from '@GLT/latent'
import { env } from '@keg-hub/parse-config'
import { fsMock } from '../../../__mocks__/nodeMock'
import { parseMock, loadTemplate } from '../../../__mocks__/parseMock'
import { EFileType, ELatentEnv, ELoadFormat } from '@GLT/types'
import {
  mockEnvObj,
  mockEncrypted,
  mockFooContent,
  mockWriteFileContent,
} from '../../../__mocks__'

setMox('fs', fsMock)
setMox('@keg-hub/parse-config', parseMock)
setMox('@keg-hub/parse-config/src/utils/utils', { loadTemplate })

const latentMock = {
  encoded: mockEncrypted,
  environment: ELatentEnv.test,
  crypto: {
    decrypt: jest.fn(),
    encrypt: jest.fn()
  }
}

const fileOpts = {
  data: { foo: `bar` },
  type: EFileType.secrets,
}

const { LatentFile } = require('./file')
const { env } = require('@keg-hub/parse-config')
const latentFile = new LatentFile(fileOpts, latentMock as unknown as Latent)

const tempDir = path.join(__dirname, `../../../../../temp`)
const valuesLoc = path.join(tempDir, `${EFileType.values}.env`)
const secretsLoc = path.join(tempDir, `${EFileType.secrets}.env`)


describe(`latentFile`, () => {

    beforeAll(() => {
      fsMock.existsSync.mockReturnValue(true)
      env.loadEnvSync.mockReturnValue(mockEncrypted)
    })

  describe(`latentFile.<properties>`, () => {

    it(`should set the default properties`, () => {
      const latentF = new LatentFile(fileOpts, latentMock)

      expect(latentF.data).toBe(fileOpts.data)
      expect(latentF.latent.environment).toBe(ELatentEnv.test)
    })

    it(`should allow overwriting the default properties`, () => {
      expect(latentFile.data).toEqual({ foo: `bar` })
      expect(latentFile.latent.environment).toBe(ELatentEnv.test)
    })

  })


  describe(`latentFile.loadAll`, () => {
    afterEach(() => {
      env.loadEnvSync.mockClear()
      latentMock.crypto.decrypt.mockClear()
    })

    it(`should call env.loadEnvSync`, () => {
      latentFile.loadAll({...fileOpts, location: `/some/test/location`})
      expect(env.loadEnvSync).toHaveBeenCalled()
    })

    it(`should call env.loadEnvSync with the default options`, () => {
      latentFile.loadAll({...fileOpts, location: `/some/test/location`})
      const options = env.loadEnvSync.mock.calls[0][0]
      
      expect(options).toEqual({
        fill: false,
        error: false,
        data: { foo: 'bar' },
        format: ELoadFormat.string,
        location:  `/some/test/location/${EFileType.secrets}.env`
      })

    })

    it(`should allow overwriting existing options`, () => {
      latentFile.loadAll({
        data: { bar: `foo` },
        type: EFileType.values,
        environment: ELatentEnv.local,
        location: `/some/test/location`,
      })
      const options = env.loadEnvSync.mock.calls[0][0]

      expect(options).toEqual({
        fill: false,
        error: false,
        format: ELoadFormat.string,
        data: { foo: `bar`, bar: `foo` },
        location:  `/some/test/location/${EFileType.values}.env`
      })

    })

    it(`should call latent.crypto.decrypt`, () => {
      fsMock.existsSync.mockReturnValue(true)
      env.loadEnvSync.mockReturnValue(mockEncrypted)

      latentFile.loadAll({...fileOpts, location: `/some/test/location`})
      expect(latentMock.crypto.decrypt).toHaveBeenCalled()
    })

  })


  describe(`latentFile.loadSingle`, () => {

    afterEach(() => {
      env.loadEnvSync.mockClear()
      latentMock.crypto.decrypt.mockClear()
    })

    it(`should call env.loadEnvSync`, () => {
      latentFile.loadSingle({...fileOpts, location: `/some/test/${EFileType.secrets}.test.env`})
      expect(env.loadEnvSync).toHaveBeenCalled()
    })

    it(`should call env.loadEnvSync with the current correct options`, () => {
      const location = `/some/test/location/${EFileType.secrets}.test.env`
      latentFile.loadSingle({...fileOpts, location})
      const options = env.loadEnvSync.mock.calls[0][0]
      
      expect(options).toEqual({
        location,
        fill: false,
        error: false,
        data: { foo: 'bar' },
        format: ELoadFormat.string,
      })

    })

    it(`should only allow overwriting some options`, () => {
      const location = `/some/test/location/${EFileType.secrets}.test.env`
      latentFile.loadSingle({
        location,
        data: { bar: `foo` },
        type: EFileType.values,
        environment: ELatentEnv.local,
        // Can not overwrite when calling env.loadEnvSync
        fill: true,
        error: true,
        format: ELoadFormat.object,
      })
      const options = env.loadEnvSync.mock.calls[0][0]

      expect(options).toEqual({
        location,
        fill: false,
        error: false,
        format: ELoadFormat.string,
        data: { foo: `bar`, bar: `foo` },
      })

    })

  })

  describe(`latentFile.save`, () => {
    afterEach(() => {
      env.loadEnvSync.mockClear()
      fsMock.writeFileSync.mockClear()
      latentMock.crypto.decrypt.mockClear()
      latentMock.crypto.encrypt.mockClear()
    })

    it(`should try to load the existing file with a call to call env.loadEnvSync`, () => {
      latentFile.save({...fileOpts, type: EFileType.values, location: valuesLoc })
      expect(env.loadEnvSync).toHaveBeenCalled()
      
      expect(env.loadEnvSync.mock.calls[0][0]).toEqual({
        data: { foo: `bar` },
        fill: false,
        error: false,
        format: `object`,
        location: valuesLoc,
      })
    })

    it(`should try to encrypt the file when its a secret file type`, () => {
      env.stringify.mockReturnValue(mockFooContent)

      latentFile.save({...fileOpts, type: EFileType.secrets, location: secretsLoc })
      expect(latentMock.crypto.encrypt).toHaveBeenCalled()

      const first = latentMock.crypto.encrypt.mock.calls[0]
      expect(first).toStrictEqual([`foo=bar\n`, mockEncrypted, true])
    })

    it(`should NOT try to encrypt the file when its a values file type`, () => {
      env.stringify.mockReturnValue(mockFooContent)

      latentFile.save({...fileOpts, type: EFileType.values, location: valuesLoc })
      expect(latentMock.crypto.encrypt).not.toHaveBeenCalled()
    })

    it(`should try to write the file to disk with a writeFileSync call`, () => {
      env.loadEnvSync.mockReturnValue(mockEncrypted)
      env.stringify.mockReturnValue(mockWriteFileContent)
      latentMock.crypto.decrypt.mockReturnValue(mockEnvObj)
      latentMock.crypto.encrypt.mockReturnValue(mockEncrypted)

      latentFile.save({...fileOpts, type: EFileType.secrets, location: secretsLoc })

      expect(fsMock.writeFileSync).toHaveBeenCalled()

      const [ loc, content ] = fsMock.writeFileSync.mock.calls[0]
      expect(loc).toBe(secretsLoc)
      expect(content).toBe(mockEncrypted)
    })

  })

})
