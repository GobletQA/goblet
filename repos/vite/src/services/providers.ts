import type { Auth } from "firebase/auth"

const auth = {} as Auth

export const getProviderMetadata = () => {
  
  return {
    auth
  }
  
}