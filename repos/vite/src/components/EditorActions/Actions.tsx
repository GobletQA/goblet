import { DrawAction } from './DrawAction'
import { SquareAction } from './SquareAction'
import { PictureAction } from './PictureAction'
import { RunTestsAction } from './RunTestsAction'
import { RecordBrowserAction } from './RecordBrowserAction'
import { DecorationAction } from './DecorationAction'
import { DecorationActionDev } from './DecorationAction.dev'

export const Actions = [
  RunTestsAction,
  DecorationActionDev,
  DecorationAction,
  RecordBrowserAction,
  DrawAction,
  SquareAction,
  PictureAction,
]