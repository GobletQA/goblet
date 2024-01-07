
/**
 * Generates a path safe username from the passed in name or user object
 * @function
 * @private
 *
 * @param {Objet} user - User object model
 *
 * @returns {string} - Formatted user name
 */
export const generateFolderName = (user:{ username?:string, gitUser?:string }) => {
  const folderName = user.username || user.gitUser
  if(!folderName) throw new Error(`A user name is required to mount a repo`)

  return folderName && folderName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')
}

