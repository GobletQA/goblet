
describe(`this test file 0`, () => {

  describe(`this is a sub-describe`, () => {

    test(`this test is going to fail on purpose`, () => {
      expect(1 + 1).toBe(3)
    })

    test(`this test should be run or not based on the configured Exam settings`, () => {
      expect(1 + 1).toBe(2)
    })

  })
})