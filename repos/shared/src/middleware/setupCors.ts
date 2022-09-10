import type { Express } from 'express'
import { getOrigin }from '../utils/getOrigin'

const allowedHeaders = [
  `X-PINGOTHER`,
  `Origin`,
  `X-Requested-With`,
  `Content-Type`,
  `Accept`,
  `Authorization`,
  `AuthToken`,
  `x-goblet-host`,
  `x-goblet-proto`,
  `x-goblet-port`,
  `x-goblet-subdomain`,
  `x-forwarded-subdomain`,
  `x-forwarded-port`,
  `x-forwarded-proto`,
  `x-forwarded-host`,
  `x-forwarded-for`,
].join(`,`)

const allowedMethods = [
  `GET`,
  `POST`,
  `PUT`,
  `PATCH`,
  `DELETE`,
  `HEAD`,
  `OPTIONS`
].join(`,`)

/**
 * Configures cors for the backend API and websocket
 * Defines the origins that are allow to connect to the API
 * @param {Object} app - Express app object
 *
 * @returns {void}
 */
export const setupCors = (app:Express) => {
  const config = app?.locals?.config?.server
  if (!app) throw new Error(`Error setting up Cors. Express app does not exist`)
  if(!config) throw new Error(`Error setting up Cors. Server config does not exist`)

  app.use((req, res, next) => {
    const origin = getOrigin(req)

    // If in a deployed env, then validate the origin
    // Otherwise allow the origin in development envs
    const foundOrigin = config.environment !== `local`
      ? config.origins.includes(`*`) || config.origins.includes(origin)
        ? origin
        : undefined
      : origin

    // If no origin, then end the request as Unauthorized
    if(!foundOrigin) return res.status(401).send(`Unauthorized`)

    res.setHeader('Access-Control-Allow-Origin', foundOrigin)
    res.setHeader('Vary', 'Origin,Access-Control-Request-Headers')
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Access-Control-Allow-Methods', allowedMethods)
    res.setHeader('Access-Control-Allow-Headers', allowedHeaders)

    return req.method === 'OPTIONS' ? res.status(200).send('OK') : next()
  })
}
