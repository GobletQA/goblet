import { DrawAction } from './DrawAction'
import { SquareAction } from './SquareAction'
import { PictureAction } from './PictureAction'

import { ExamRunAction } from './ExamRunAction'
import { DecorationAction } from './DecorationAction'
import { WorldEditorAction } from './WorldEditorAction'

export const RaceActions = [
  DecorationAction,
  WorldEditorAction,
  ExamRunAction,
  DrawAction,
  SquareAction,
  PictureAction,
]

export const MonacoActions = [
  DecorationAction,
  ExamRunAction,
  DrawAction,
  SquareAction,
  PictureAction,
]