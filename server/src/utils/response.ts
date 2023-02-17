'use strict'

import express from 'express'
import  helper from './helper'
import { Response } from '../common/server.interface'

/**
 * Send standard response to a request
 * @param res express.Response
 * @param status number
 * @param result object | boolean
 * @returns
 */
const send = (
  res: express.Response,
  status: number,
  result: boolean | object,
  err: any
): express.Response<any, Record<string, any>> => {
  const { NODE_ENV } = process.env
  let success = true
  let error: any = false
  if (!helper.isEmpty(err)) {
    error = {
      type: err.type,
      code: err.code,
      message: err.message,
    }
  }
  switch (status) {
    case 200:
      success = true
      break
    case 400:
      success = false
      error.message =
        NODE_ENV === 'production' ? 'bad request' : error.message
      break
    case 401:
      success = false
      error.message =
        NODE_ENV === 'production' ? 'unauthorized' : error.message
      break
    case 404:
      success = false
      error.message =
        NODE_ENV === 'production' ? 'not found' : error.message
      break
    case 500:
      success = false
      error.message =
        NODE_ENV === 'production' ? 'internal server error' : error.message
      break
    default:
      success = false
      error.message = NODE_ENV === 'production' ? 'error' : error.message
      break
  }
  const response: Response = {
    success,
    status,
    result,
    error,
  }
  return res.status(status).json(response)
}

export default { send }
