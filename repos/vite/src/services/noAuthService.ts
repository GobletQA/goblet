
/**
 * TODO: update this to return working test data of a dummy user
 */
class NoAuthService {

  getUser = async () => {
    return {
      id: `12345`,
      provider: `github`,
      username: `NoAuthUser`,
      token: `1234-1234-1234`,
      displayName: `No Auth User`,
      reposUrl: `github.com/gobletqa`,
      email: `no-auth-user@gobletqa.com`,
    }
  }

  getJwt = async () => {
    
  }

  getRepo = async () => {
    
  }

  getHeaders = async () => {
    
  }

}


export const noAuthService = new NoAuthService()