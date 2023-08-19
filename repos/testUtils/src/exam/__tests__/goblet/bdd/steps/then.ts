import { Then } from '@GTU/Parkin'
import { TStepCtx } from '@GTU/Types'

Then("I expect {string} to be {int}", (str:string, num:number, ctx:TStepCtx) => {
  const { world } = ctx
  expect(world.number).toBe(num)
})
