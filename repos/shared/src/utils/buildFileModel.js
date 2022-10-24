const path = require('path')
const mime = require('mime')
const { getFileType } = require('./getFileType')
const { fileModel } = require('@GSH/models')
const { getLastModified } = require('@GSH/libs/fileSys/fileSys')

/**
 * getType seemed to stop working, the owner of the package is doing odd things
 * So we normalize the getType and lookup methods incase one can't be found
 */
const getMime = (location) => {
  const ext = path.extname(location).replace(`.`, ``)
  return mime.types[ext] || `text/plain`
}


/**
 * Builds a fileModel from the fileModel object and passed arguments
 * @param {Object} fileModel - Partial fileModel merged with the default
 * @param {Object} [repo={}] - Repo Class instance for the currently active repo
 *
 * @returns {Object} - Built fileModel object containing all fileModel properties
 */
const buildFileModel = async (
  { location, fileType, uuid, ...modelData },
  repo
) => {
  fileType = fileType || getFileType(location, repo.fileTypes)

  return fileModel({
    ...modelData,
    fileType,
    location,
    uuid: location,
    mime: getMime(location),
    name: location.split('/').pop(),
    relative: location.replace(repo.paths.repoRoot, ''),
    ext: path.extname(location).replace('.', ''),
    lastModified: await getLastModified(location),
  })
}

module.exports = {
  buildFileModel,
}
