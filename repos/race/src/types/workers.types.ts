import type { ParkinWorker } from '../workers/parkin/parkinWorker'
import type { EditorWorker } from '../workers/editor/editorWorker'

export type TParkinWorker = typeof ParkinWorker
export type TEditorWorker = typeof EditorWorker
