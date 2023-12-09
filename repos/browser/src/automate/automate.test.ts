
import { Automate } from './automate'

describe(`Automate`, () => {
  
  test(`Create a new instance without error`, () => {
    const context = {} as any
    const automate = new Automate({ parent: context }, `test-automate-id`)
    expect(automate.id).toBe(`test-automate-id`)
  })
  
  
})