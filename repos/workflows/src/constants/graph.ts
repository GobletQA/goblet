
const { deepFreeze } = require('@keg-hub/jsutils')

/**
 * Constants for running the workflows with consistent values
 * Frozen so the values can not be changed
 * @type {Object}
 * @readonly
 */
export const Graph = deepFreeze({
  Github: {
    Opts: {
      AFFILIATIONS: [
        'OWNER',
        'COLLABORATOR',
        'ORGANIZATION_MEMBER'
      ],
      SORT_DIRECTION: {
        ASC: 'ASC',
      }
    },
    Endpoints: {
      Repo: {
        LIST_ALL: {
          KEY: 'repos.listAll',
          DATA_PATH: 'viewer.repositories',
          /**
            * GraphQL Queries relative to the GraphQL endpoints
            * @type {string}
            * @readonly
            */
          QUERY: `query($first: Int!, $after: String, $affiliations: [RepositoryAffiliation], $ownerAffiliations: [RepositoryAffiliation], $sortDirection: OrderDirection!)
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
        BRANCHES: {},
      },
    },
  },
  Gitlab: {
    Endpoints: {
      Repo: {
        LIST_ALL: `repos.listAll`,
        DATA_PATH: ``,
        QUERY: `query {
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
      },
      Projects: {
        QUERY: `query {
          projects(membership: true) {
            nodes {
              name
              fullPath
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
        // fullPath Example: "tiptondigital/Builder/react-builder"
        QUERY: `query {
          project(fullPath: $fullPath) {
            name
            repository {
              branchNames(searchPattern:"*", offset:0, limit:100)
              rootRef
            }
          }
        }`
      }
    }
  }
})
