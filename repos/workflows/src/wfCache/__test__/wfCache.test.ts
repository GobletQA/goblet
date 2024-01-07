jest.mock('@gobletqa/logger')

const { wfcache } = require('../wfCache')

const cacheName = `test-cache-name`
const cacheRef = `test-cache-ref`
const cacheRef2 = `test-cache-ref2`

describe(`WF Cache`, () => {

  afterEach(() => {
    wfcache.remove(cacheName)
  })

  it(`should save cache`, () => {
    expect(wfcache.cache()).toEqual({})

    const data = { some: `data` }
    wfcache.save(cacheName, data)

    expect(wfcache.cache()).toEqual({ [cacheName]: data })
  })


  it(`should find saved cache`, () => {
    expect(wfcache.cache()).toEqual({})

    const data = { some: `data` }
    wfcache.save(cacheName, data)
    const cache = wfcache.find(cacheName)
    expect(cache).toBe(data)

  })


  it(`should find saved cache from a string ref`, () => {
    expect(wfcache.cache()).toEqual({})

    const data = { some: `data` }
    wfcache.save(cacheName, data, cacheRef)
    expect(wfcache.find(cacheName)).toBe(data)
    expect(wfcache.find(cacheRef)).toBe(data)

  })


  it(`should find saved cache from an of string refs`, () => {
    expect(wfcache.cache()).toEqual({})

    const data = { some: `data` }
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])

    expect(wfcache.find(cacheName)).toBe(data)
    expect(wfcache.find(cacheRef)).toBe(data)
    expect(wfcache.find(cacheRef2)).toBe(data)

  })

  it(`should remove cache by name`, () => {
    expect(wfcache.cache()).toEqual({})

    const data = { some: `data` }
    wfcache.save(cacheName, data)
    wfcache.remove(cacheName)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})

  })

  it(`should remove cache by ref`, () => {
    expect(wfcache.cache()).toEqual({})

    const data = { some: `data` }

    // Remove by cache name
    wfcache.save(cacheName, data, cacheRef)
    wfcache.remove(cacheName)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})

    // Remove by first ref name
    wfcache.save(cacheName, data, cacheRef)
    wfcache.remove(cacheRef)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})

  })

  it(`should remove cache by ref when passed as any array`, () => {
    expect(wfcache.cache()).toEqual({})

    const data = { some: `data` }
    
    // Remove by cache name
    wfcache.remove(cacheName)
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.find(cacheRef2)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})

    // Remove by first ref name
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])
    wfcache.remove(cacheRef)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.find(cacheRef2)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})

    // Remove by second ref name
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])
    wfcache.remove(cacheRef2)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.find(cacheRef2)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})

  })

})


export {}