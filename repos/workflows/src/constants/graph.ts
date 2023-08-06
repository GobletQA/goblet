import { deepFreeze } from '@keg-hub/jsutils'
import { GITLAB_GRAPH_URL, GITHUB_GRAPH_URL } from '@gobletqa/environment/constants'

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
          Key: `Github.repos.listAll`,
          DataPath: `data.viewer.repositories`,
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
      },
    },
  },
  Gitlab: {
    Url: GITLAB_GRAPH_URL,
    AuthHeader: { Ref: `Bearer`, Key: `Authorization` },
    Endpoints: {
      Repo: {
        ListAll: {
          Key: `Gitlab.repos.listAll`,
          DataPath: `data.projects`,
          Query: `query($first: Int!, $after: String) {
            projects(membership: true, first: $first, after: $after) {
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
          Key: `Gitlab.repos.branches`,
          DataPath: `data.project.repository.branchNames`,
          Query: `query($first: Int!, $offset: Int!, $fullPath: ID!, $searchPattern: String!) {
            project(fullPath: $fullPath) {
              name
              repository {
                branchNames(searchPattern:$searchPattern, offset:$offset, limit:$first)
                rootRef
              }
            }
          }`
        }
      },
    }
  }
})
