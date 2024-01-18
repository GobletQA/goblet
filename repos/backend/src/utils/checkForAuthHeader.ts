import jwt from 'jsonwebtoken'



export const checkForAuthHeader = (authHeader?:string, secret?:string) => {
  const authToken = authHeader && authHeader.split(`Bearer `)[1]
  if(!authToken || !secret) return undefined

  try {
    const { iat, exp, status, userId, ...rest } = jwt.verify(authToken, secret) as any
    return {...rest, id: userId}
  }
  catch(err){}

}
