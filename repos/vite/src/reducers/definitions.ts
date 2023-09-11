import type { TStepDef } from '@ltipton/parkin'
import type {
  TDspAction,
  TDefGroupList,
  TDefinitionFileModel,
  TDefinitionFileModelList,
} from '@types'
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit'

import { createReducer, createAction } from '@reduxjs/toolkit'

export type TDefinitionsState = {
  activeDefinition?: TStepDef
  definitionTypes: TDefGroupList
  definitions: TDefinitionFileModelList
}

export const definitionsState = {} as TDefinitionsState

const resetDefs = createAction<TDefinitionsState>(`resetDefs`)
const setActiveDef = createAction<TStepDef>(`setActiveDef`)
const clearDefs = createAction<TDefinitionFileModelList>(`clearDefs`)
const setDef = createAction<TDefinitionFileModel>(`setDef`)
const setDefs = createAction<TDefinitionFileModelList>(`setDefs`)
const upsertDefs = createAction<TDefinitionFileModelList>(`upsertDefs`)
const clearDefTypes = createAction<TDefGroupList>(`clearDefTypes`)
const setDefTypes = createAction<TDefGroupList>(`setDefTypes`)
const upsertDefTypes = createAction<TDefGroupList>(`upsertDefTypes`)

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
    action:TDspAction<TDefGroupList>
  ) => ({
    ...state,
    definitionTypes: {} as TDefGroupList
  }),
  setDefTypes: (
    state:TDefinitionsState,
    action:TDspAction<TDefGroupList>
  ) => {
    return {
      ...state,
      definitionTypes: action?.payload,
    }
  },
  upsertDefTypes: (
    state:TDefinitionsState,
    action:TDspAction<TDefGroupList>
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
