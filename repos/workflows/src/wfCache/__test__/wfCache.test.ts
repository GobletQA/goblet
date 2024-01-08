jest.resetModules()
jest.clearAllMocks()


jest.mock('@gobletqa/logger')

const { wfcache } = require('../wfCache')

const cacheName = `test-cache-name`
const cacheName2 = `test-cache-name2`
const cacheRef = `test-cache-ref`
const cacheRef2 = `test-cache-ref2`

describe(`WF Cache`, () => {

  beforeEach(() => {
    wfcache.clearAll()
  })

  afterAll(() => {
    wfcache.clearAll()
  })

  it(`should save cache`, () => {
    expect(wfcache.cache()).toEqual({})

    const data = { some: `data` }
    wfcache.save(cacheName, data)

    expect(wfcache.cache()).toEqual({ [cacheName]: data })
  })

  it(`should return the saved cache and refs`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    const data2 = { some: `data2` }
    wfcache.save(cacheName, data, [cacheRef])
    wfcache.save(cacheName2, data2, [cacheRef2])

    expect(wfcache.cache()).toEqual({[cacheName]: data, [cacheName2]: data2})
    expect(wfcache.refs()).toEqual({[cacheRef]: cacheName, [cacheRef2]: cacheName2})
  })

  it(`should clear all cache adn refs`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    const data2 = { some: `data2` }
    wfcache.save(cacheName, data, [cacheRef])
    wfcache.save(cacheName2, data2, [cacheRef2])
    
    wfcache.clearAll()

    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})
  })

  it(`should clear only cache`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    const data2 = { some: `data2` }
    wfcache.save(cacheName, data, [cacheRef])
    wfcache.save(cacheName2, data2, [cacheRef2])
    
    wfcache.clearCache()

    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({[cacheRef]: cacheName, [cacheRef2]: cacheName2})
  })


  it(`should clear only refs`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    const data2 = { some: `data2` }
    wfcache.save(cacheName, data, [cacheRef])
    wfcache.save(cacheName2, data2, [cacheRef2])
    
    wfcache.clearRefs()

    expect(wfcache.cache()).toEqual({[cacheName]: data, [cacheName2]: data2})
    expect(wfcache.refs()).toEqual({})
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
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])

    expect(wfcache.find(cacheName)).toBe(data)
    expect(wfcache.find(cacheRef)).toBe(data)
    expect(wfcache.find(cacheRef2)).toBe(data)

  })

  it(`should remove cache by name`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    wfcache.save(cacheName, data)
    wfcache.remove(cacheName)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

  })

  it(`should remove cache by ref`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }

    // Remove by cache name
    wfcache.save(cacheName, data, cacheRef)
    wfcache.remove(cacheName)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    // Remove by first ref name
    wfcache.save(cacheName, data, cacheRef)
    wfcache.remove(cacheRef)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

  })

  it(`should remove cache by ref when passed as any array`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    
    // Remove by cache name
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])
    wfcache.remove(cacheName)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.find(cacheRef2)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    // Remove by first ref name
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])
    wfcache.remove(cacheRef)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.find(cacheRef2)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    // Remove by second ref name
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])
    wfcache.remove(cacheRef2)
    expect(wfcache.find(cacheName)).toBe(undefined)
    expect(wfcache.find(cacheRef)).toBe(undefined)
    expect(wfcache.find(cacheRef2)).toBe(undefined)
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

  })


  it(`should update existing saved cache and refs when save is called with a ref`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    const data2 = { some: `data2` }
    wfcache.save(cacheName, data, [cacheRef, cacheName2])
    expect(wfcache.cache()).toEqual({[cacheName]: data})

    wfcache.save(cacheName2, data2, [cacheRef2])
    expect(wfcache.cache()).toEqual({[cacheName]: data2})

    const cache1 = wfcache.find(cacheName)
    const cache2 = wfcache.find(cacheName2)
    expect(cache1).toEqual(cache2)
    expect(cache1).not.toEqual(data)
    expect(cache1).toEqual(data2)
    expect(cache2).toEqual(data2)

  })


  it(`should remove the cache after being updated by a ref`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    const data2 = { some: `data2` }
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])
    wfcache.save(cacheRef2, data2, [`some-other-ref`])
    wfcache.remove(cacheName)

    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})
  })

  it(`should remove the cache by ref after being updated by a ref`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    const data2 = { some: `data2` }
    wfcache.save(cacheName, data, [cacheRef, cacheRef2])
    wfcache.save(cacheRef2, data2, [`some-other-ref`])
    wfcache.remove(`some-other-ref`)

    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})
  })

  it(`should remove only the matching cache and refs`, () => {
    expect(wfcache.cache()).toEqual({})
    expect(wfcache.refs()).toEqual({})

    const data = { some: `data` }
    const data2 = { some: `data2` }
    wfcache.save(cacheName, data, [cacheRef])
    wfcache.save(cacheName2, data2, [cacheRef2])
    wfcache.remove(cacheName)

    expect(wfcache.cache()).toEqual({[cacheName2]: data2})
    expect(wfcache.refs()).toEqual({[cacheRef2]: cacheName2})
  })

})


export {}