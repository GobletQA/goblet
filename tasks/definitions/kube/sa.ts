
const saAct = async () => {
  
}

export const serviceAccount = {
  name: `service-account`,
  action: saAct,
  alias: [`sa`],
  description: `Deploy the kubectl service account to the dind pod`,
  options: {
    
  }
}