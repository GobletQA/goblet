class NoAuthService {

  noAuthData:any
  getUser?:() => any
  getJwt?:() => any
  getRepo?:() => any
  getHeaders?:() => any

  init = async () => {
    try {
      await import('./__mocks__/noAuthData.json')
        .then(noAuthData => {
          this.getUser = async () => noAuthData.user
          this.getJwt = async () => noAuthData.jwt
          this.getRepo = async () => noAuthData.repo
          this.getHeaders = async () => noAuthData.headers
        })
    }
    catch(err){
      delete this.getUser
      delete this.getJwt
      delete this.getRepo
      delete this.getHeaders
    }
  }

}


export const noAuthService = new NoAuthService()