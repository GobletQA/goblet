import { LatentCrypto } from './crypto'
import {
  repoToken,
  mockEncrypted,
  mockFileContent
} from '../../../__mocks__'

const latentCrypto = new LatentCrypto()

describe(`latentCrypto`, () => {
  describe(`latentCrypto.encrypt`, () => {

    it(`should encrypt the passed in plain text content`, () => {
      const encrypted = latentCrypto.encrypt(mockFileContent, repoToken)
      expect(encrypted).not.toBe(mockFileContent)
      expect(encrypted).not.toBe(mockFileContent)
      expect(encrypted.length).not.toBe(mockFileContent.length)
    })

  })

  describe(`latentCrypto.decrypt`, () => {

    it(`should decrypt the passed in encrypt content`, () => {
      const decrypted = latentCrypto.decrypt(mockEncrypted, repoToken)
      expect(decrypted).toBe(mockFileContent)
    })

  })

})
