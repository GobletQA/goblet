
import { useMemo } from 'react'
import { Values } from 'GBConstants'
import { get, noOpObj } from '@keg-hub/jsutils'
import { useSelector } from 'GBHooks/useSelector'

const { STORAGE } = Values

/**
 * Gets the fileType meta data for a fileType
 * @param {string} fileType - Type of file to get the metadata fro
 */
export const useFileTypeMeta = fileType => {
  const { repo } = useSelector(STORAGE.REPO)

  return useMemo(() => (repo?.fileTypes?.[fileType] || noOpObj), [fileType, repo.fileTypes])
}