
/**
* Requests describes the minimum amount of compute resources required. If Requests is omitted for a container, it defaults to Limits if that is explicitly specified, otherwise to an implementation-defined value. More info: https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/
*/
export const buildResources = () => {
  
  return {
    limits: {
      
    },
    requests: {
    }
  }
  
}