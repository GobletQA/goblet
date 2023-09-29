import { ENVS } from '@gobletqa/environment'
import { ApiLogger, setupLogger } from '@gobletqa/logger'

setupLogger({ tag: `Goblet Browser` })

export {
  ApiLogger as Logger
}


export const logEnvMsg = (msg:string, method:string=`verbose`, ...rest:any[]) => {
  !ENVS.GOBLET_RUN_FROM_CI
    && !ENVS.GOBLET_RUN_FROM_UI
    && ApiLogger[method](msg, ...rest)
}