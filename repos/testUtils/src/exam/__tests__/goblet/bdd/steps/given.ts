import { Given } from '@GTU/Parkin'
import { TStepCtx } from '@GTU/Types'

Given("I have {int} as $world.number", (num:number, ctx:TStepCtx) => {
  const { world } = ctx
  world.number = num
})
