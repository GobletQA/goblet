import type { TStartPlaying } from '@GBB/types'

import { Player }  from '@GBB/player/player'
import { GBrowser } from '@GBB/browser'

export const playBrowser = async (data:TStartPlaying) => {
  const {
    id,
    repo,
    action,
    onEvent,
    onCleanup,
    onConsole,
    forwardLogs,
    browserConf,
    pwComponents,
  } = data

  const { props, action:method } = action
  const [playerOpts, url] = props
  const browserItems = pwComponents || await GBrowser.start({ browserConf })

  const player = new Player({
    onEvent,
    onCleanup,
    onConsole,
    forwardLogs,
    ...browserItems,
  }, id)

  player.start({ url, options: playerOpts, repo })

  return player
}
