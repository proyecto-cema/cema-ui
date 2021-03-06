import axios from 'axios'
import {
  ADMINISTRATION_CONTEXT, ADMINISTRATION_VERSION,
  BASE_URL,
  BOVINE_CONTEXT,
  BOVINE_VERSION,
  LOGIN_CONTEXT,
  LOGIN_VERSION,
  ACTIVITY_CONTEXT,
  ACTIVITY_VERSION, REPORTING_CONTEXT, REPORTING_VERSION,
  OPERATION_CONTEXT,
  OPERATION_VERSION,
  HEALTH_CONTEXT, 
  HEALTH_VERSION,
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

export const httpReporting = axios.create({
  baseURL: BASE_URL + REPORTING_CONTEXT + REPORTING_VERSION,
  headers: headers
})

export const httpOperation = axios.create({
  baseURL: BASE_URL + OPERATION_CONTEXT + OPERATION_VERSION,
  headers: headers
})

export const httpHealth = axios.create({
  baseURL: BASE_URL + HEALTH_CONTEXT + HEALTH_VERSION,
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

export const getWarningStructure = function (message) {
  return {type: 'GOOD', message: message != null ? message: 'La acción intentará impactar (dentro de las 24h).', color: 'bg-warning'};
}

export const getErrorStructure = function (message) {
  return {type: 'OK', message: message != null ? message: 'Error al realizar la accion', color: 'bg-danger'};
}

export const getInfoStructure = function (notificationData) {
  return {id: notificationData.id, type: 'Info',
    date: notificationData.executionDate,
    description: notificationData.description,
    message: notificationData.name != null ? notificationData.name: 'Nota importante',
    color: 'bg-info'};
}
