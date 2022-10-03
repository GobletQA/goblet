
// Get all allowed emails from the env
export const ALLOWED_USERS = (process.env.GB_GITHUB_AUTH_USERS || '').split(',')

export const ENVIRONMENT = process.env.NODE_ENV || `local`
export const GB_SC_PORT = process.env.GB_SC_PORT || `7006`

export const FileTreeWidth = 200

// TODO: fine way to merge this with TContainerState from Conductor Types
export enum ContainerStates {
  ERROR = 'Error',
  MISSING = 'Missing',
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  CREATING = 'Creating',
}

