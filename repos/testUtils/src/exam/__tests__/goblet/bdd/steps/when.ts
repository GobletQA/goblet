import { When } from '@GTU/Parkin'
import { TStepCtx } from '@GTU/Types'

When("I add {int} to $world.number", (num:number, ctx:TStepCtx) => {
  const { world } = ctx
  world.number = world.number + num
})
