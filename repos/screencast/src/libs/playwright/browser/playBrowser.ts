import type { TStartPlaying } from '@GSC/types'

import { Player }  from '../player/player'
import { startBrowser } from './startBrowser'

export const playBrowser = async (data:TStartPlaying) => {
  const {
    id,
    repo,
    action,
    onEvent,
    onCleanup,
    browserConf,
    pwComponents,
  } = data

  const { props, action:method } = action
  const [playerOpts, url] = props
  const browserItems = pwComponents || await startBrowser(browserConf)


  const player =  new Player({
    onEvent,
    onCleanup,
    ...browserItems,
  }, id)

  return await player.start({ url, options: playerOpts, repo })
}
