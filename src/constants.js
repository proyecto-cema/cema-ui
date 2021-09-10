export const BASE_URL = process.env.VUE_APP_API_URL
export const JAVA_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";
export const REGEX_LETTERS_NUMBERS = /^([a-zA-Z0-9]+)$/;

export const LOGIN_CONTEXT = process.env.VUE_APP_LOGIN_CONTEXT
export const BOVINE_CONTEXT = process.env.VUE_APP_BOVINE_CONTEXT
export const ADMINISTRATION_CONTEXT = process.env.VUE_APP_ADMINISTRATION_CONTEXT

export const LOGIN_VERSION = process.env.VUE_APP_LOGIN_VERSION
export const BOVINE_VERSION = process.env.VUE_APP_BOVINE_VERSION
export const ADMINISTRATION_VERSION = process.env.VUE_APP_ADMINISTRATION_VERSION

const COMMON_ERRORS = {
    401: {type: "Authentication", message:"Usuario no autenticado"},
    403: {type: "Not-Allowed", message:"Su usuario no tiene permisos"}
}
export const LOGIN_ERRORS = {
    401: {type: "password", message:"Contraseña incorrecta"},
    404: {type: "UserPass", message:"Usuario o Contraseña incorrectos"}
}
export const BOVINE_ERRORS = {
    ...COMMON_ERRORS,
    404: {type: "Server", message: "Bovino no encontrado"},
    409: {type: "Server", message: "Esta caravana ya se encuentra en uso. Por favor, revise e intente de nuevo."}
}
export const ADMINISTRATION_ERRORS = {
    ...COMMON_ERRORS,
    404: {type: "Server", message: "Establecimiento no encontrado"},
    409: {type: "Server", message: "El establecimiento que esta intentando registrar ya existe"}
}