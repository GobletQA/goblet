import { wait } from '@keg-hub/jsutils/wait'

describe(`these tests wait 2 seconds between each test`, () => {

  test(`test wait 1-1`, async () => {
    expect(1 + 1).toBe(2)
    await wait(2000)
  })

  test(`test wait 1-2`, async () => {
    expect(1 + 2).toBe(3)
    await wait(2000)
  })


  test(`test wait 1-3`, async () => {
    expect(1 + 3).toBe(4)
    await wait(2000)
  })

})