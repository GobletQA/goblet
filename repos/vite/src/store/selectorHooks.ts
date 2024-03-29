import type { RootState } from './store'
import { TypedUseSelectorHook } from 'react-redux'

import { useSelector as useReduxSelector } from 'react-redux'

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector
export const useApp = () => useSelector((state) => state.app)
export const useTestRuns = () => useSelector((state) => state.testRuns)
export const useContainer = () => useSelector((state) => state.container)
export const useDefs = () => useSelector((state) => state.definitions)
export const useFiles = () => useSelector((state) => state.files)
export const useModal = () => useSelector((state) => state.modal)
export const useRepo = () => useSelector((state) => state.repo)
export const useRepos = () => useSelector((state) => state.repos)
export const useSettings = () => useSelector((state) => state.settings)
export const useUser = () => useSelector((state) => state.user)
export const usePage = () => useSelector((state) => state.page)
