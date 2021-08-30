import axios from 'axios'
import {
  ADMINISTRATION_CONTEXT, ADMINISTRATION_VERSION,
  BASE_URL,
  BOVINE_CONTEXT,
  BOVINE_VERSION,
  ESTABLISHMENT_CONTEXT,
  ESTABLISHMENT_VERSION,
  LOGIN_CONTEXT,
  LOGIN_VERSION
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


ADMINISTRATION_VERSION