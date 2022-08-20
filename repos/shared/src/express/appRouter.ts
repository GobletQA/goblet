import express from 'express'
import { isFunc } from '@keg-hub/jsutils'
import { asyncWrap } from '@gobletqa/shared/express'

const Router = express.Router()
const boundGet = Router.get.bind(Router)
const boundPut = Router.put.bind(Router)
const boundPost = Router.post.bind(Router)
const boundPatch = Router.patch.bind(Router)
const boundDelete = Router.delete.bind(Router)
const defaultMiddleWare = [express.json(), express.urlencoded({ extended: true })]

/**
 * Loops the passed in handlers and wraps them in the asyncWrap method
 * Expects the first argument is a string representing the route path
 */
const wrapInAsync = (boundMethod, ...args) => {
  return boundMethod(
    args.shift(),
    ...defaultMiddleWare,
    ...args.filter(isFunc).map((handler) => asyncWrap(handler))
  )
}

/**
 * Root Express router for the backend API attached to the Main Express App
 * Extends the express Router, and overrides the main HTTP verb methods
 * It wraps the methods with asyncWrap so it's added by default to those methods
 */
export const AsyncRouter = Object.assign(Router, {
  get: (...args: Array<any>) => wrapInAsync(boundGet, ...args),
  put: (...args: Array<any>) => wrapInAsync(boundPut, ...args),
  post: (...args: Array<any>) => wrapInAsync(boundPost, ...args),
  patch: (...args: Array<any>) => wrapInAsync(boundPatch, ...args),
  delete: (...args: Array<any>) => wrapInAsync(boundDelete, ...args),
})

/**
 * AppRouter - Express router
 * @type {Object}
 * @public
 */
export const AppRouter = express.Router()