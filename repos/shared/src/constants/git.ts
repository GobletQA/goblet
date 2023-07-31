// ENV key used to saved the currently mounted git repo's remote url
// Is used as a shortcut when loading values and secrets
export const GB_GIT_MOUNTED_REMOTE = `GB_GIT_MOUNTED_REMOTE`
export const GB_REPO_NO_SECRETS = `GB_REPO_NO_SECRETS`

// The git remote ref used when setting the git remote of the mounted repo 
// This ensures it does not override origin
// i.e. git remote set goblet-ref https://gihub.com/gobletqa/goblet
export const GB_GIT_REMOTE_REF = process.env.GB_GIT_REMOTE_REF || `goblet-ref`