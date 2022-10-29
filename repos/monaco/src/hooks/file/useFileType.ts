import { useMemo } from 'react'

export const useFileType = (fileName:string) => {
  return useMemo(() => {
    return fileName && fileName.indexOf('.') !== -1
      ? `file_type_${fileName.split('.').slice(-1)}`
      : 'default_file'
  }, [fileName])
}