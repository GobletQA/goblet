import { LETS_ENCRYPT_URLS } from '../../constants/kube'

/**
 * Generates a resource definition file for a ClusterIssuer resource
 * Requires cert-manager be installed
 */
const getClusterIssuerWH = ({
  env,
  email,
  groupName,
  prefixName,
  solverName,
}:Record<any, any>) => (`
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: ${prefixName}
spec:
  acme:
    email: ${email}
    server: ${LETS_ENCRYPT_URLS[env] || LETS_ENCRYPT_URLS.staging}
    privateKeySecretRef:
      name: ${prefixName}-secret
    solvers:
    - dns01:
        webhook:
          groupName: ${groupName}
          solverName: ${solverName}
`)


/**
 * Generates a resource definition file for a ClusterIssuer resource
 * Requires cert-manager be installed
 */
const getClusterIssuerHttp = ({
  env,
  email,
  prefixName,
  className=`nginx`
}:Record<any, any>) => (`
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: ${prefixName}
spec:
  acme:
    email: ${email}
    server: ${LETS_ENCRYPT_URLS[env] || LETS_ENCRYPT_URLS.staging}
    privateKeySecretRef:
      name: ${prefixName}-secret
    solvers:
    - http01:
        ingress:
          class: ${className}
`)


export const getClusterIssuer = (params:Record<any, any>, type?:string) => {
  return type === `http`
    ? getClusterIssuerHttp(params)
    : getClusterIssuerWH(params)
}