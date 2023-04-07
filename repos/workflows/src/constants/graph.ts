
const { deepFreeze } = require('@keg-hub/jsutils')

const {
  GITLAB_GRAPH_URL=`https://gitlab.com/api/graphql`,
  GITHUB_GRAPH_URL=`https://api.github.com/graphql`
} = process.env

/**
 * Constants for running the workflows with consistent values
 * Frozen so the values can not be changed
 * @type {Object}
 * @readonly
 */
export const Graph = deepFreeze({
  Github: {
    Url: GITHUB_GRAPH_URL,
    AuthHeader: { Ref: `token`, Key: `Authorization` },
    Opts: {
      Affiliations: [
        'OWNER',
        'COLLABORATOR',
        'ORGANIZATION_MEMBER'
      ],
      SortDirection: {
        ASC: 'ASC',
      }
    },
    Endpoints: {
      Repo: {
        ListAll: {
          Key: `repos.listAll`,
          DataPath: `viewer.repositories`,
          Query: `query($first: Int!, $after: String, $affiliations: [RepositoryAffiliation], $ownerAffiliations: [RepositoryAffiliation], $sortDirection: OrderDirection!)
          {
            viewer {
              repositories(first: $first, after: $after, affiliations: $affiliations, ownerAffiliations: $ownerAffiliations, orderBy: {field: NAME, direction: $sortDirection}, isFork: false) {
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
                nodes{
                  url
                  name
                  refs(first: $first, refPrefix:"refs/heads/") {
                    nodes {
                      name
                    }
                  }
                }
              }
            }
          }`
        },
        Branches: {},
        UserRepos: {},
      },
    },
  },
  Gitlab: {
    Url: GITLAB_GRAPH_URL,
    AuthHeader: { Ref: `Bearer`, Key: `Authorization` },
    Endpoints: {
      Repo: {
        ListAll: {
          Key: `repos.listAll`,
          DataPath: `projects`,
          Query: `query($first: Int!, $after: String) {
            projects(membership: true) {
              nodes {
                name
                fullPath
                httpUrlToRepo
                repository {
                  rootRef
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }`
        },
        Branches: {
          Key: `repos.branches`,
          DataPath: `project.repository.branchNames`,
          Query: `query($first: Int!, $offset: Int!, $fullPath: String!, $searchPattern: String!) {
            project(fullPath: $fullPath) {
              name
              repository {
                branchNames(searchPattern:$searchPattern, offset:$offset, limit:$first)
                rootRef
              }
            }
          }`
        },
        UserRepos: {
          Key: `repos.userRepos`,
          DataPath: ``,
          Query: `query($first: Int!, $after: String, $username: String) {
            user(username: $username) {
              groups {
                nodes {
                  descendantGroups {
                    nodes {
                      projects {
                        nodes {
                          name
                          repository {
                            rootRef
                          }
                        }
                      }
                    }
                  }
                  projects {
                    nodes {
                      name
                      repository {
                        rootRef
                      }
                    }
                  }
                }
              }
            }
          }`
        }
      },
    }
  }
})
