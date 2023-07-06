const { GOBLET_RUN_FROM_CI } = process.env

export const isCI = GOBLET_RUN_FROM_CI === `true`
  || GOBLET_RUN_FROM_CI === `T`
  || GOBLET_RUN_FROM_CI === `1`

export const notCI = !isCI
