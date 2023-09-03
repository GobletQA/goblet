import type { Router, RequestHandler } from 'express'
import express from 'express'
import { asyncWrap } from './asyncWrap'
import { isFunc } from '@keg-hub/jsutils/isFunc'

const ExpRouter = express.Router()
const boundAll = ExpRouter.all.bind(ExpRouter)
const boundGet = ExpRouter.get.bind(ExpRouter)
const boundPut = ExpRouter.put.bind(ExpRouter)
const boundHead = ExpRouter.head.bind(ExpRouter)
const boundPost = ExpRouter.post.bind(ExpRouter)
const boundPatch = ExpRouter.patch.bind(ExpRouter)
const boundDelete = ExpRouter.delete.bind(ExpRouter)
const boundOptions = ExpRouter.options.bind(ExpRouter)
const defaultMiddleWare = [express.json(), express.urlencoded({ extended: true })]


type TRouterHandler = Router[`all`]
  | Router[`get`]
  | Router[`put`]
  | Router[`head`]
  | Router[`post`]
  | Router[`patch`]
  | Router[`delete`]
  | Router[`options`]
  

/**
 * Loops the passed in handlers and wraps them in the asyncWrap method
 * Expects the first argument is a string representing the route path
 */
const wrapInAsync = (
  boundMethod:TRouterHandler,
  ...args:Array<string|RequestHandler>
) => {
  return boundMethod(
    args.shift() as string,
    ...defaultMiddleWare,
    ...(args as RequestHandler[]).filter(isFunc).map((handler) => asyncWrap(handler))
  )
}

/**
 * Root Express router for the backend API attached to the Main Express App
 * Extends the express Router, and overrides the main HTTP verb methods
 * It wraps the methods with asyncWrap so it's added by default to those methods
 */
export const AsyncRouter = Object.assign(ExpRouter, {
  all: (...args: Array<any>) => wrapInAsync(boundAll, ...args),
  get: (...args: Array<any>) => wrapInAsync(boundGet, ...args),
  put: (...args: Array<any>) => wrapInAsync(boundPut, ...args),
  post: (...args: Array<any>) => wrapInAsync(boundPost, ...args),
  head: (...args: Array<any>) => wrapInAsync(boundHead, ...args),
  patch: (...args: Array<any>) => wrapInAsync(boundPatch, ...args),
  delete: (...args: Array<any>) => wrapInAsync(boundDelete, ...args),
  options: (...args: Array<any>) => wrapInAsync(boundOptions, ...args),
}) as Router



/**
 * AppRouter - Express router
 * @public
 */
export const AppRouter = express.Router()
