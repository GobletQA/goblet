
import { screencastApi } from '@services/screencastApi'

export const resetIdle = async () => {
  await screencastApi.resetIdle()
}
