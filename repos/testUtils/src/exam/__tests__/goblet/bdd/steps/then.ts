import { Then } from '@GTU/Parkin'
import { TStepCtx } from '@GTU/Types'

Then("I expect $world.number to be {int}", (num:number, ctx:TStepCtx) => {
  const { world } = ctx
  expect(world.number ).toBe(num)
})