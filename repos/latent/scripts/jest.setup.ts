// Jest Test Setup file
import { mockFileContent, mockEnvObj } from '../__mocks__/mockValues'
import * as parseConfig from '@keg-hub/parse-config'

process.env.GB_LT_TOKEN_SECRET = process.env.GB_LT_TOKEN_SECRET || `goblet-latent-test`


jest.setMock('@keg-hub/parse-config', {
  ...parseConfig,
  env: {
    ...parseConfig.env,
    loadEnvSync: jest.fn(({ fill }) => fill ? mockEnvObj : mockFileContent)
  }
})
