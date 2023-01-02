import { useMemo } from 'react'
import { EEditKey } from '@GBR/types'
import { useEditing } from '@GBR/contexts'
import { ensureArr, exists } from '@keg-hub/jsutils'

export const useIsEditing = (keys:EEditKey|EEditKey[]) => {
  const { editing } = useEditing()

  return useMemo(() => {
    const checkKeys = ensureArr<EEditKey>(keys)
    return checkKeys.length === checkKeys.filter(key => editing[key])?.length
  }, [keys, editing])
}