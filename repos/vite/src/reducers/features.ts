import type { TAction, TFeatureFileModelList, TFeatureFileModel } from '@types'

export type TFeaturesState = {
  activeFeature?: TFeatureFileModel
  files: TFeatureFileModelList
}
export const featuresState = {} as TFeaturesState

export const featuresActions = {
  clearFeatures: (state:TFeaturesState, action:TAction<TFeaturesState>) => (featuresState),
  setActiveFeature: (
    state:TFeaturesState,
    action:TAction<TFeatureFileModel>
  ) => {
    return {
      ...state,
      activeFeature: action?.payload,
    }
  },
  setFeature: (
    state:TFeaturesState,
    action:TAction<TFeatureFileModel>
  ) => {
    return {
      ...state,
      activeFeature: state?.activeFeature?.uuid === action.payload.uuid
        ? action.payload
        : state?.activeFeature,
      files: {
        ...state.files,
        [action.payload.location]: action.payload
      }
    }
  },
  setFeatures: (
    state:TFeaturesState,
    action:TAction<TFeatureFileModelList>
  ) => {
    return {
      ...state,
      files: action?.payload,
    }
  },
  upsertFeatures: (
    state:TFeaturesState,
    action:TAction<TFeatureFileModelList>
  ) => {
    return {
      ...state,
      files: {
        ...state.files,
        ...action?.payload
      }
    }
  },
}
