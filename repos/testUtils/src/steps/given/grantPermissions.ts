import type { TStepCtx } from '@GTU/Types'

import { Given } from '@GTU/Parkin'
import { getContext } from '@GTU/Playwright'
import { ExpressionKinds, ExpressionTypes } from '@gobletqa/shared/constants'

const BrowserPermissions = {
  midi: `midi`,
  camera: `camera`,
  gyroscope: `gyroscope`,
  microphone: `microphone`,
  geolocation: `geolocation`,
  magnetometer: `magnetometer`,
  accelerometer: `accelerometer`,
  notifications: `notifications`,
  [`midi-sysex`]: `midi-sysex`,
  [`clipboard-read`]: `clipboard-read`,
  [`clipboard-write`]: `clipboard-write`,
  [`payment-handler`]: `payment-handler`,
  [`background-sync`]: `background-sync`,
  [`accessibility-events`]: `accessibility-events`,
  [`ambient-light-sensor`]: `ambient-light-sensor`,
}
const BrowserPermissionList = Object.values(BrowserPermissions)

const clearCookies = async (permission:string, ctx:TStepCtx) => {
  const context = await getContext()

  expect(BrowserPermissionList)
    .toEqual(expect.arrayContaining([permission]))

  await context.grantPermissions([permission])
}

Given(`I grant the browser permission {string}`, clearCookies, {
  race: true,
  alias: [`permission`],
  module: `grantPermission`,
  name: `Grant browser permission`,
  description: `Grants the browser permission for the following`,
  expressions: [
    {
      decor: false,
      label: `State`,
      example: `clipboard-write`,
      type: ExpressionTypes.string,
      kind: ExpressionKinds.options,
      options: BrowserPermissionList,
      description: `Permission to grant to the browser`,
    }
  ]
})

