import type {
  TFCRow,
  TFConfig,
  TFCSection,
} from '../form.types'
import { EItemParent } from '../form.types'
import { useWatchRef } from './useWatchRef'
import { TInputConfig } from './useBuildInput'
import { isItemArr, isRow, isSection } from '../utils/isType'
import {
  itemsFactory,
  rowFactory,
  rowsFactory,
  sectionFactory,
  sectionsFactory
} from '../factories'

export type TBuildOpts = {
  path?: string
  perRow?: number
  config: TFConfig
  parent?: EItemParent | string
  itemParent?: EItemParent
}

export type TInputsConfig = Omit<TInputConfig, 'path' | 'key' | 'type'> & {
  type: string
  key?: string
  path?: string
}

export const useBuildInputs = (
  props:TFCSection | TFCRow | TInputsConfig[],
  options:TBuildOpts
) => {

  const optionsRef = useWatchRef<TBuildOpts>(options, true)

  // TODO add check for array of sections and array of rows
  // rowsFactory sectionsFactory

  isSection(props)
    ? sectionFactory(props, optionsRef)
    : isRow(props)
      ? rowFactory(props, optionsRef)
      : isItemArr(props) && itemsFactory(props, optionsRef)

  return optionsRef.current
}