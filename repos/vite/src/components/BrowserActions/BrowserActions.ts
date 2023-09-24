import type { TActionGroupActions, TBrowserAction } from '@gobletqa/components'
import { StateAction } from './StateAction'
import { EmptyAction } from './EmptyAction'
import { TestRunAction } from './TestRunAction'

const leftActions = [
  TestRunAction,
] as TActionGroupActions

leftActions.name = `browser-left-actions-group`

const centerActions = [
  EmptyAction,
] as TActionGroupActions

centerActions.name = `browser-center-actions-group`

export const BrowserActions:(TBrowserAction|TActionGroupActions)[] = [
  leftActions,
  centerActions,
  StateAction,
]
