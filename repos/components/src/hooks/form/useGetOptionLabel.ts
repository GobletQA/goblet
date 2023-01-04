import type { TOptionLabelCB } from '@GBC/types'
import { useInline } from '@GBC/hooks/useInline'
import { isArr, isStr, isFunc } from '@keg-hub/jsutils'


export type THGetOptionLabel = {
  getOptionLabel?:TOptionLabelCB
}

export const useGetOptionLabel = (props:THGetOptionLabel) => {
  const {
    getOptionLabel
  } = props
  const getOption = useInline(getOptionLabel)

  return useInline((option:any):string => {
    return isFunc(getOptionLabel)
      ? getOption?.(option)
      : isStr(option)
      ? option
      : isArr(option)
        ? option.length
          ? option.join(``)
          : ``
        : option?.label || option?.title || option?.name || `` 
  })
}