import type { TStepDefs, TStepDef } from '@ltipton/parkin'
import type {
  TDspAction,
  TDefinitionFileModel,
  TDefinitionFileModelList,
} from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { createReducer, createAction } from '@reduxjs/toolkit'

export type TDefinitionsState = {
  activeDefinition?: TStepDef
  definitions: TDefinitionFileModelList
  definitionTypes: TStepDefs
}

export const definitionsState = {} as TDefinitionsState

const resetDefs = createAction<TDefinitionsState>(`resetDefs`)
const setActiveDef = createAction<TStepDef>(`setActiveDef`)
const clearDefs = createAction<TDefinitionFileModelList>(`clearDefs`)
const setDef = createAction<TDefinitionFileModel>(`setDef`)
const setDefs = createAction<TDefinitionFileModelList>(`setDefs`)
const upsertDefs = createAction<TDefinitionFileModelList>(`upsertDefs`)
const clearDefTypes = createAction<TStepDefs>(`clearDefTypes`)
const setDefTypes = createAction<TStepDefs>(`setDefTypes`)
const upsertDefTypes = createAction<TStepDefs>(`upsertDefTypes`)

export const definitionsActions = {
  resetDefs: (state:TDefinitionsState, action:TDspAction<TDefinitionsState>) => (definitionsState),
  setActiveDef: (
    state:TDefinitionsState,
    action:TDspAction<TStepDef>
  ) => {
    return {
      ...state,
      activeDefinition: action?.payload,
    }
  },
  clearDefs: (
    state:TDefinitionsState,
    action:TDspAction<TDefinitionFileModelList>
  ) => ({
    ...state,
    definitions: {} as TDefinitionFileModelList
  }),
  setDef: (
    state:TDefinitionsState,
    action:TDspAction<TDefinitionFileModel>
  ) => {
    return {
      ...state,
      activeDefinition: state?.activeDefinition?.uuid === action.payload.uuid
        ? action.payload
        : state?.activeDefinition,
      definitions: Object.entries(state.definitions).reduce((acc, [key, model]) => {
        acc[key] = model.uuid === action.payload.uuid
          ? action.payload
          : model

        return acc
      }, {} as TDefinitionFileModelList),
    } as TDefinitionsState
  },
  setDefs: (
    state:TDefinitionsState,
    action:TDspAction<TDefinitionFileModelList>
  ) => {
    return {
      ...state,
      definitions: action?.payload,
    }
  },
  upsertDefs: (
    state:TDefinitionsState,
    action:TDspAction<TDefinitionFileModelList>
  ) => {
    return {
      ...state,
      definitions: {
        ...state.definitions,
        ...action?.payload
      }
    }
  },
  clearDefTypes: (
    state:TDefinitionsState,
    action:TDspAction<TStepDefs>
  ) => ({
    ...state,
    definitionTypes: {} as TStepDefs
  }),
  setDefTypes: (
    state:TDefinitionsState,
    action:TDspAction<TStepDefs>
  ) => {
    return {
      ...state,
      definitionTypes: action?.payload,
    }
  },
  upsertDefTypes: (
    state:TDefinitionsState,
    action:TDspAction<TStepDefs>
  ) => {
    return {
      ...state,
      definitionTypes: {
        ...state.definitionTypes,
        ...action?.payload
      }
    }
  },
}

export const definitionsReducer = createReducer(
  definitionsState,
  (builder:ActionReducerMapBuilder<TDefinitionsState>) => {
    builder.addCase(resetDefs, definitionsActions.resetDefs)
    builder.addCase(setActiveDef, definitionsActions.setActiveDef)
    builder.addCase(clearDefs, definitionsActions.clearDefs)
    builder.addCase(setDef, definitionsActions.setDef)
    builder.addCase(setDefs, definitionsActions.setDefs)
    builder.addCase(upsertDefs, definitionsActions.upsertDefs)
    builder.addCase(clearDefTypes, definitionsActions.clearDefTypes)
    builder.addCase(setDefTypes, definitionsActions.setDefTypes)
    builder.addCase(upsertDefTypes, definitionsActions.upsertDefTypes)
  }
)
