import { mockFileContent, mockEnvObj } from '../__mocks__/mockValues'

export const parseMock = {
  env: {
    stringify: jest.fn((obj:any) => {
      return Object.entries(obj).reduce((result, [ key, value ]) => {
        return key ? `${result}${key}=${String(value)}\n` : result
      }, '')
    }),
    loadEnvSync: jest.fn(({ fill }) => {
      return fill
        ? mockEnvObj
        : mockFileContent
    })
  }
}

export const loadTemplate = jest.fn((args:any, content:string, loader:(temp:string)=>Record<any, any>) => {
  const { format = true } = args
  return format === 'string' ? content || mockFileContent : loader(content)
})