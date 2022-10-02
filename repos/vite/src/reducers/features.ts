import type { TAction } from '@reducers'
import type { TFeatureFileModel } from '@types'

export type TFeaturesState = {
  activeFeature?: TFeatureFileModel
  files: TFeatureFileModel[]
}
export const featuresState = {} as TFeaturesState

export const featuresActions = {
  clear: (state:TFeaturesState, action:TAction<TFeaturesState>) => (featuresState),
  setActive: (
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
      files: state.files.reduce((acc, file) => {
        file.uuid === action.payload.uuid
          ? acc.push(action.payload)
          : acc.push(file)

        return acc
      }, [] as TFeatureFileModel[]),
    }
  },

  setFeatures: (
    state:TFeaturesState,
    action:TAction<TFeatureFileModel[]>
  ) => {
    return {
      ...state,
      files: action?.payload,
    }
  },
  upsertFeatures: (
    state:TFeaturesState,
    action:TAction<TFeatureFileModel[]>
  ) => {
    return {
      ...state,
      files: [
        ...state.files,
        ...action?.payload
      ]
    }
  },
}
