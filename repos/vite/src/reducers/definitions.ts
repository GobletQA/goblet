import type {
  TAction,
  TDefinitionAst,
  TDefinitionsAstList,
  TDefinitionsAstTypeMap
} from '@types'

export type TDefinitionsState = {
  activeDefinition?: TDefinitionAst
  definitions: TDefinitionsAstList
  definitionTypes: TDefinitionsAstTypeMap
}
export const definitionsState = {} as TDefinitionsState

export const definitionsActions = {
  clear: (state:TDefinitionsState, action:TAction<TDefinitionsState>) => (definitionsState),
  setActive: (
    state:TDefinitionsState,
    action:TAction<TDefinitionAst>
  ) => {
    return {
      ...state,
      activeDefinition: action?.payload,
    }
  },
  clearDefs: (
    state:TDefinitionsState,
    action:TAction<TDefinitionsAstList>
  ) => ({
    ...state,
    definitions: {} as TDefinitionsAstList
  }),
  setDef: (
    state:TDefinitionsState,
    action:TAction<TDefinitionAst>
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
      }, {} as TDefinitionsAstList),
    }
  },
  setDefs: (
    state:TDefinitionsState,
    action:TAction<TDefinitionsAstList>
  ) => {
    return {
      ...state,
      definitions: action?.payload,
    }
  },
  upsertDefs: (
    state:TDefinitionsState,
    action:TAction<TDefinitionsAstList>
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
    action:TAction<TDefinitionsAstTypeMap>
  ) => ({
    ...state,
    definitionTypes: {} as TDefinitionsAstTypeMap
  }),
  setDefTypes: (
    state:TDefinitionsState,
    action:TAction<TDefinitionsAstTypeMap>
  ) => {
    return {
      ...state,
      definitionTypes: action?.payload,
    }
  },
  upsertDefTypes: (
    state:TDefinitionsState,
    action:TAction<TDefinitionsAstTypeMap>
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

