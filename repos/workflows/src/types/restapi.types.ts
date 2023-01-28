export type TBranchStatusChecks = {
  checks: []
  contexts: []
  enforcement_level: string
}

export type TBranchProtection = {
  enabled: boolean,
  required_status_checks: TBranchStatusChecks
}

export type TBranchLinks = {
  self: string
  html: string
}

export type TBranchCommitVerification = {
  reason: string,
  verified: boolean,
  payload: string|null
  signature: string|null
}

export type TBranchCommitAuthor = {
  name: string
  email: string
  date: string
}

export type TBranchCommitTree = {
  sha: string
  url: string
}

export type TBranchCommitMeta = {
  url: string
  message: string
  comment_count: number,
  tree: TBranchCommitTree,
  author: TBranchCommitAuthor,
  committer: TBranchCommitAuthor,
  verification: TBranchCommitVerification
}


export type TBranchCommitParent = {
  sha: string,
  url: string,
  html_url: string
}

export type TBranchCommit = {
  sha: string,
  url: string,
  node_id: string,
  html_url: string,
  commit: TBranchCommitMeta
  parents: TBranchCommitParent[]
}

export type TBranchMeta = {
  name: string
  protected: boolean
  _links: TBranchLinks
  commit: TBranchCommit
  protection_url: string
  protection: TBranchProtection
}

export type TBranchResp = Record<`data`, TBranchMeta>

export type TGitOrg = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
  following_url: string
  gists_url: string
  starred_url: string
  subscriptions_url: string
  organizations_url: string
  repos_url: string
  events_url: string
  received_events_url: string
  type: string
  site_admin: boolean
}

export type TRepoLicense = {
  key: string
  name: string
  spdx_id: string
  url: string
  node_id: string
}

export type TRepoPermission = {
  pull: boolean
  push: boolean
  admin: boolean
}

export type TRepoOwner = {
  login: string
  id: number
  node_id: string
  avatar_url: string
  gravatar_id: string
  url: string
  html_url: string
  followers_url: string
}

export type TRepoApiMeta = {
  id: number
  node_id: string
  name: string
  full_name: string
  owner: TRepoOwner
  private: boolean
  html_url: string
  description: string
  fork: boolean
  url: string
  archive_url: string
  assignees_url: string
  blobs_url: string
  branches_url: string
  collaborators_url: string
  comments_url: string
  commits_url: string
  compare_url: string
  contents_url: string
  contributors_url: string
  deployments_url: string
  downloads_url: string
  events_url: string
  forks_url: string
  git_commits_url: string
  git_refs_url: string
  git_tags_url: string
  git_url: string
  issue_comment_url: string
  issue_events_url: string
  issues_url: string
  keys_url: string
  labels_url: string
  languages_url: string
  merges_url: string
  milestones_url: string
  notifications_url: string
  pulls_url: string
  releases_url: string
  ssh_url: string
  stargazers_url: string
  statuses_url: string
  subscribers_url: string
  subscription_url: string
  tags_url: string
  trees_url: string
  clone_url: string
  language: string | null
  forks_count: number
  forks: number
  stargazers_count: number
  watchers_count: number
  watchers: number
  size: number
  default_branch: string
  open_issues_count: number
  open_issues: number
  is_template: boolean
  topics: string[]
  has_issues: boolean
  has_projects: boolean
  has_wiki: boolean
  has_pages: boolean
  has_downloads: boolean
  has_discussions: boolean
  archived: boolean
  disabled: boolean
  visibility: string
  pushed_at: string
  created_at: string
  updated_at: string
  permissions: TRepoPermission
  allow_rebase_merge: boolean
  template_repository: TRepoApiMeta
  temp_clone_token: string
  allow_squash_merge: boolean
  allow_auto_merge: boolean
  delete_branch_on_merge: boolean
  allow_merge_commit: boolean
  subscribers_count: number
  network_count: number
  license: TRepoLicense
  organization: TGitOrg
  parent: TRepoApiMeta
  source: TRepoApiMeta & {
    security_and_analysis: {
      advanced_security: {
        status: string
      }
      secret_scanning: {
        status: string
      }
      secret_scanning_push_protection: {
        status: string
      }
    }
  }
}

export type TRepoResp = Record<`data`, TRepoApiMeta>
