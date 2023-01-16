import type {
  TDspAction,
  TDefinitionAst,
  TDefinitionFileModel,
  TDefinitionsAstTypeMap,
  TDefinitionFileModelList,
} from '@types'

export type TDefinitionsState = {
  activeDefinition?: TDefinitionAst
  definitions: TDefinitionFileModelList
  definitionTypes: TDefinitionsAstTypeMap
}
export const definitionsState = {} as TDefinitionsState

export const definitionsActions = {
  resetDefs: (state:TDefinitionsState, action:TDspAction<TDefinitionsState>) => (definitionsState),
  setActiveDef: (
    state:TDefinitionsState,
    action:TDspAction<TDefinitionAst>
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
    }
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
    action:TDspAction<TDefinitionsAstTypeMap>
  ) => ({
    ...state,
    definitionTypes: {} as TDefinitionsAstTypeMap
  }),
  setDefTypes: (
    state:TDefinitionsState,
    action:TDspAction<TDefinitionsAstTypeMap>
  ) => {
    return {
      ...state,
      definitionTypes: action?.payload,
    }
  },
  upsertDefTypes: (
    state:TDefinitionsState,
    action:TDspAction<TDefinitionsAstTypeMap>
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

