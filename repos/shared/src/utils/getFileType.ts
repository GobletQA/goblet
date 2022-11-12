/**
 * Gets the file type based on location and allowed fileTypes
 */
export const getFileType = (location:string, fileTypes:Record<string, any>) => {
  const foundFileType = Object.entries(fileTypes)
  .reduce(
    (foundType, [type, typeMeta]) => {
      return !foundType && location.startsWith(typeMeta.location)
        ? typeMeta
        : foundType
    },
    ''
  )

  return foundFileType ? foundFileType.type : 'unknown'
}
