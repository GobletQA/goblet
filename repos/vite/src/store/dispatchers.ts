import { createDispatcher } from '@utils/dispatcher'
import { repoActions } from '@reducers/repo'
import { userActions } from '@reducers/user'
import { modalActions } from '@reducers/modal'
import { reposActions } from '@reducers/repos'
import { filesActions } from '@reducers/files'
import { featuresActions } from '@reducers/features'
import { fileTreeActions } from '@reducers/fileTree'
import { containerActions } from '@reducers/container'
import { definitionsActions } from '@reducers/definitions'

export const containerDispatch = createDispatcher(containerActions)
export const defsDispatch = createDispatcher(definitionsActions)
export const featuresDispatch = createDispatcher(featuresActions)
export const filesDispatch = createDispatcher(filesActions)
export const fileTreeDispatch = createDispatcher(fileTreeActions)
export const modalDispatch = createDispatcher(modalActions)
export const repoDispatch = createDispatcher(repoActions)
export const reposDispatch = createDispatcher(reposActions)
export const userDispatch = createDispatcher(userActions)
