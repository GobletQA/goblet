import type { Router } from 'express'
import express from 'express'
import { asyncWrap } from './asyncWrap'
import { isFunc } from '@keg-hub/jsutils'

const ExpRouter = express.Router()
const boundGet = ExpRouter.get.bind(ExpRouter)
const boundPut = ExpRouter.put.bind(ExpRouter)
const boundPost = ExpRouter.post.bind(ExpRouter)
const boundPatch = ExpRouter.patch.bind(ExpRouter)
const boundDelete = ExpRouter.delete.bind(ExpRouter)
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
export const AsyncRouter = Object.assign(ExpRouter, {
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

/**
 * Helper method to get the correct Express router based on passed in argument
 */
export const getRouter = (expressRouter?:Router|boolean|string) => {
  return expressRouter === false
    ? undefined
    : expressRouter === undefined || expressRouter === true
      ? AppRouter
      : typeof expressRouter !== 'string'
        ? expressRouter
        : expressRouter === 'async' && AsyncRouter
}