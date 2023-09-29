import { ENVS } from '../envs'

// The git remote ref used when setting the git remote of the mounted repo 
// This ensures it does not override origin
// i.e. git remote set goblet-ref https://gihub.com/gobletqa/goblet
export const GitRemoteRef = ENVS.GB_GIT_REMOTE_REF || `goblet-ref`
