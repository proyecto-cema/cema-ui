import axios from 'axios'
import {
  ADMINISTRATION_CONTEXT, ADMINISTRATION_VERSION,
  BASE_URL,
  BOVINE_CONTEXT,
  BOVINE_VERSION,
  LOGIN_CONTEXT,
  LOGIN_VERSION,
  ACTIVITY_CONTEXT,
  ACTIVITY_VERSION
} from '../constants'

const headers = { 'Content-type': 'application/json' }

export const httpUsers = axios.create({
  baseURL: BASE_URL + LOGIN_CONTEXT + LOGIN_VERSION,
  headers: headers
})

export const httpBovines = axios.create({
  baseURL: BASE_URL + BOVINE_CONTEXT + BOVINE_VERSION,
  headers: headers
})

export const httpAdministration = axios.create({
  baseURL: BASE_URL + ADMINISTRATION_CONTEXT + ADMINISTRATION_VERSION,
  headers: headers
})

export const httpActivity = axios.create({
  baseURL: BASE_URL + ACTIVITY_CONTEXT + ACTIVITY_VERSION,
  headers: headers
})

export const getHttpError = function (object, key) {
  let defaultError = {type: 'Undefined', message: 'ERROR indefinido, intente nuevamente mas tarde.', color: 'bg-danger'};
  let result = {...object[key], color: 'bg-danger'};
  return (typeof result !== "undefined") ? result : defaultError;
}

export const getSuccessStructure = function (message) {
  return {type: 'OK', message: message != null ? message: 'Acción realizada correctamente', color: 'bg-success'};
}
