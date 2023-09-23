import { safeReplacer, replaceUnsafe, injectUnsafe } from '../utils/safeReplacer'

describe('safeReplacer', () => {

  it('should replace secrets with ****', () => {
    const key = 'password'
    const value = 'secret123'
    expect(safeReplacer(key, value)).toBe('****')
  })

  it('should replace credit card numbers with ****', () => {
    const value = '1234-5678-9012-3456'
    expect(safeReplacer('', value)).toBe('****') 
  })

  it('should replace injected unsafe values with ****', () => {
    const injected = ['foo']
    injectUnsafe(injected)
    expect(safeReplacer('', 'foo')).toBe('****')
  })

  it('should convert buffers to base64 strings', () => {
    const value = Buffer.from('test')
    expect(safeReplacer('', value)).toBe('dGVzdA==')
  })

  it('should convert dates to strings', () => {
    const value = new Date()
    expect(typeof safeReplacer('', value)).toBe('string')
  })

  it('should trim multiline strings', () => {
    const value = 'foo\nbar'
    expect(safeReplacer('', value)).toEqual(['foo', 'bar'])
  })

})

describe('replaceUnsafe', () => {

  it('should replace all unsafe values in a string', () => {
    const str = 'password: secret123'
    expect(replaceUnsafe(str)).toBe('password: ****')
  })

  it('should handle errors', () => {
    // Mock implementation to force error
    jest.spyOn(console, 'error').mockImplementation(() => {})

    const str = 'password: secret123'
    const response = replaceUnsafe(str)
    expect(response).toBe('')
    expect(console.error).toHaveBeenCalled()
  })

})
