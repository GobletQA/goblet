import { ENVS } from '@gobletqa/environment'

export const loggerColorDisabled = () => {
  const noColors = ENVS.GOBLET_TEST_COLORS === `0`
    || (ENVS.GOBLET_TEST_COLORS || ``).toLowerCase().startsWith(`f`)

  return noColors
}
 
export const stripColors = (str:string) => {
  return loggerColorDisabled()
    ? str.replace(/\u001b\[.*?m/g, ``).replace(/\x1B\[.*?m/g, ``)
    : str
}
