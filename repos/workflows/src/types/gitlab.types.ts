export type TGLBranchMeta = {
  name:string
  web_url:string
  merged:boolean
  default:boolean
  can_push:boolean
  protected:boolean
  developers_can_push:boolean
  developers_can_merge:boolean
  commit: {
    id: string
    title: string
    message: string
    web_url: string
    short_id: string
    created_at: string
    parent_ids: string[]
    author_name: string
    author_email: string
    committer_name:string
    committer_email:string
    committer_date:string
  }
}

export type TGLRepoApiMeta = {
  id: number
  name:string
  name_with_namespace:string
  description:string
  path:string
  path_with_namespace:string
  created_at:string
  default_branch:string
  tag_list:string[]
  topics:string[]
  ssh_url_to_repo:string
  http_url_to_repo:string
  web_url:string
  readme_url:string
  forks_count: number
  avatar_url?: string|null
  star_count: number
  last_activity_at:string
  namespace: {
    id: number
    name:string
    path:string
    kind:string
    full_path:string
    web_url:string
  }
  container_registry_image_prefix:string
  _links: {
    self:string
    issues:string
    merge_requests:string
    repo_branches:string
    labels:string
    events:string
    members:string
    cluster_agents:string
  }
  packages_enabled:boolean
  empty_repo:boolean
  archived:boolean
  visibility:string
  resolve_outdated_diff_discussions:boolean
  issues_enabled:boolean
  merge_requests_enabled:boolean
  wiki_enabled:boolean
  jobs_enabled:boolean
  snippets_enabled:boolean
  container_registry_enabled:boolean
  service_desk_enabled:boolean
  service_desk_address:string
  can_create_merge_request_in:boolean
  issues_access_level:string
  repository_access_level:string
  merge_requests_access_level:string
  forking_access_level:string
  wiki_access_level:string
  builds_access_level:string
  snippets_access_level:string
  pages_access_level:string
  operations_access_level:string
  analytics_access_level:string
  container_registry_access_level:string
  security_and_compliance_access_level:string
  releases_access_level:string
  environments_access_level:string
  feature_flags_access_level:string
  infrastructure_access_level:string
  monitor_access_level:string
  shared_runners_enabled:boolean
  group_runners_enabled:boolean
  lfs_enabled:boolean
  creator_id: number
  import_status:string
  open_issues_count: number
  runners_token:string
  ci_job_token_scope_enabled:boolean
  ci_separated_caches:boolean
  ci_opt_in_jwt:boolean
  ci_allow_fork_pipelines_to_run_in_parent_project:boolean
  public_jobs:boolean
  build_git_strategy:string
  build_timeout: 3600
  auto_cancel_pending_pipelines:string
  shared_with_groups: string[]
  only_allow_merge_if_pipeline_succeeds:boolean
  restrict_user_defined_variables:boolean
  request_access_enabled:boolean
  only_allow_merge_if_all_discussions_are_resolved:boolean
  printing_merge_request_link_enabled:boolean
  merge_method:string
  squash_option:string
  enforce_auth_checks_on_uploads:boolean
  auto_devops_enabled:boolean
  auto_devops_deploy_strategy:string
  autoclose_referenced_issues:boolean
  keep_latest_artifact:boolean
  external_authorization_classification_label:string
  requirements_enabled:boolean
  requirements_access_level:string
  security_and_compliance_enabled:boolean
  permissions: {
    group_access: {
      access_level: number
      notification_level: number
    }
  }
    // parent_id?: number|null
    // avatar_url?: number|null
  // compliance_frameworks: []
  // emails_disabled: null
  // import_url: null
  // import_type: null
  // import_error: null
  // ci_default_git_depth: null
  // ci_forward_deployment_enabled: null
  // ci_config_path: null
  // allow_merge_on_skipped_pipeline: null
  // remove_source_branch_after_merge: null
  // suggestion_commit_message: null
  // merge_commit_template: null
  // squash_commit_template: null
  // issue_branch_template: null
  // runner_token_expiration_interval: null
    // project_access: null
}