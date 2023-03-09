import { createDispatcher } from '@utils/dispatcher'
import { appActions } from '@reducers/app'
import { repoActions } from '@reducers/repo'
import { userActions } from '@reducers/user'
import { modalActions } from '@reducers/modal'
import { reposActions } from '@reducers/repos'
import { filesActions } from '@reducers/files'
import { featuresActions } from '@reducers/features'
import { settingsActions } from '@reducers/settings'
import { terminalActions } from '@reducers/terminal'
import { containerActions } from '@reducers/container'
import { definitionsActions } from '@reducers/definitions'

export const appDispatch = createDispatcher(appActions)
export const containerDispatch = createDispatcher(containerActions)
export const defsDispatch = createDispatcher(definitionsActions)
export const filesDispatch = createDispatcher(filesActions)
export const modalDispatch = createDispatcher(modalActions)
export const repoDispatch = createDispatcher(repoActions)
export const reposDispatch = createDispatcher(reposActions)
export const settingsDispatch = createDispatcher(settingsActions)
export const terminalDispatch = createDispatcher(terminalActions)
export const userDispatch = createDispatcher(userActions)
