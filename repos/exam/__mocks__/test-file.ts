describe(`this is a test file`, () => {

  test(`this should be true`, () => {
    expect(1 + 1).toBe(2)
  })

  test(`this should throw`, () => {
    expect(() => {
      expect(1 + 1).toBe(4)
    }).toThrow()
  })

})