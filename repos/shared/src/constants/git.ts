// ENV key used to saved the currently mounted git repo's remote url
// Is used as a shortcut when loading values and secrets
export const GBMountedRemoteKey = `GB_GIT_MOUNTED_REMOTE`

// The git remote ref used when setting the git remote of the mounted repo 
// This ensures it does not override origin
// i.e. git remote set goblet-ref https://gihub.com/gobletqa/goblet
export const GBGitRemoteRef = process.env.GB_GIT_REMOTE_REF || `goblet-ref`