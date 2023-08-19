import { Given } from '@GTU/Parkin'
import { TStepCtx } from '@GTU/Types'

Given("I have {int} as {string}", (num:number, str:string, ctx:TStepCtx) => {
  const { world } = ctx
  world.number = num
})
