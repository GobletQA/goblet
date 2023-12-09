import { wait } from '@keg-hub/jsutils'
import {
  safeReplacer,
  injectUnsafe,
  replaceUnsafe,
  resetInjectedLogs
} from '../utils/safeReplacer'

describe(`safeReplacer`, () => {

  beforeEach(() => {
    resetInjectedLogs()
  })

  it(`should replace secrets with ****`, () => {
    const key = `password`
    const value = `secret123`
    expect(safeReplacer(key, value)).toBe(`password ****`)
  })

  it(`should replace credit card numbers with ****`, () => {
    const value = `1234-5678-9012-3456`
    expect(safeReplacer(``, value)).toBe(`****`) 
  })

  it(`should replace injected unsafe values with ****`, () => {
    const injected = [`foo`]
    injectUnsafe(injected)
    expect(safeReplacer(``, `foo`)).toBe(`****`)
  })

  it(`should convert buffers to base64 strings`, () => {
    const value = Buffer.from(`test`)
    expect(safeReplacer(``, value)).toBe(`dGVzdA==`)
  })

  it(`should convert dates to strings`, () => {
    const value = new Date()
    expect(typeof safeReplacer(``, value)).toBe(`string`)
  })

  it(`should trim multiline strings`, () => {
    const value = `foo\nbar`
    expect(safeReplacer(`stack`, value)).toEqual([`foo`, `bar`])
  })

})

describe(`replaceUnsafe`, () => {

  it(`should replace all unsafe values in a string`, () => {
    expect(replaceUnsafe(`password: secret123`)).toBe(`password: ****`)
    expect(replaceUnsafe(`pass 1234`)).toBe(`pass ****`)
    expect(replaceUnsafe(`pass: 1234`)).toBe(`pass: ****`)
    expect(replaceUnsafe(`secret 1234`)).toBe(`secret ****`)
    expect(replaceUnsafe(`secret: 1234`)).toBe(`secret: ****`)
    expect(replaceUnsafe(`token 1234`)).toBe(`token ****`)
    expect(replaceUnsafe(`token: 1234`)).toBe(`token: ****`)
  })

  it(`should not replace safe values`, () => {
    expect(replaceUnsafe(`key 1234`)).toBe(`key 1234`)
    expect(replaceUnsafe(`key: 1234`)).toBe(`key: 1234`)
    expect(replaceUnsafe(`sec 1234`)).toBe(`sec 1234`)
    expect(replaceUnsafe(`sec: 1234`)).toBe(`sec: 1234`)
  })

  it(`should handle errors`, async  () => {
    jest.spyOn(console, `error`).mockImplementation(() => {})

    const date = new Date()
    date.toString = () => { throw Error(`Forced Error`) }
    // @ts-ignore
    const response = replaceUnsafe(date)
    expect(response).toBe(``)

    // Wait for console.error call, then check that it was called
    await wait(300)
    expect(console.error).toHaveBeenCalled()

  })

})
