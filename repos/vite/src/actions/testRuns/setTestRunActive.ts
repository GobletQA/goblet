import {testRunsDispatch} from "@store"

export const setTestRunActive = (id?:string) => testRunsDispatch.setTestRunActive(id)