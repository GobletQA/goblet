import { When } from '@GTU/Parkin'
import { TStepCtx } from '@GTU/Types'

When("I add {int} to {string}", (num:number, str:string, ctx:TStepCtx) => {
  const { world } = ctx
  world.number = world.number + num
})
