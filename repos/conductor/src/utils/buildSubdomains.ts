import { SUBDOMAIN } from '../constants'

export const buildSubdomains = (host:string):string => {
  const split =  host.split(`.`)
  const subdomains = split.length >= 2
    ? split.slice(0, split.length - 2)
    : []

  return !subdomains.length
    ? SUBDOMAIN
    : subdomains[0] === SUBDOMAIN
      ? subdomains.join(`.`)
      : `${SUBDOMAIN}.${subdomains.join(`.`)}`

}