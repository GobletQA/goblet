
// Get all allowed emails from the env
export const ALLOWED_USERS = (process.env.GB_GITHUB_AUTH_USERS || '').split(',')

export const ENVIRONMENT = process.env.NODE_ENV || `local`
