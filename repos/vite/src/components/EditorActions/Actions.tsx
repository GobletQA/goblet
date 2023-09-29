import { DrawAction } from './DrawAction'
import { SquareAction } from './SquareAction'
import { PictureAction } from './PictureAction'

import { TestRunsAction } from './TestRunsAction'
import { DecorationAction } from './DecorationAction'
import { WorldEditorAction } from './WorldEditorAction'

export const RaceActions = [
  DecorationAction,
  WorldEditorAction,
  TestRunsAction,
  DrawAction,
  SquareAction,
  PictureAction,
]

export const MonacoActions = [
  DecorationAction,
  TestRunsAction,
  DrawAction,
  SquareAction,
  PictureAction,
]