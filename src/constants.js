export const BASE_URL = process.env.VUE_APP_API_URL
export const JAVA_DATE_FORMAT = "YYYY-MM-DDTHH:mm:ssZ";
export const ROLE_REPRESENTATION = {"ADMIN": 2, "PATRON": 1, "PEON": 0}
export const REGEX_LETTERS_NUMBERS = /^([a-zA-Z0-9]+)$/;
export const REGEX_SPACES = /^\S+$/;
export const MAXIMUM_TOASTS = 4;
export const MAXIMUM_NOTIFICATIONS_TOASTS = 4;
export const ACTIVITIES_OPTIONS = {
    "Inoculation": {displayName: "Vacunación", backendName: "Inoculation"},
    "Weighing": {displayName: "Pesaje", backendName: "Weighing"},
    "Ultrasound": {displayName: "Tacto", backendName: "Ultrasound"},
};
export const ACTIVITIES_EXTRA_DATA = {
    "Inoculation": {
        displayName: "Vacunación", backendName: "Inoculation",
        url: "inoculations", componentName: "VaccinationForm",
        validations: { "drug": "drug" }
    },
    "Weighing": {
        displayName: "Pesaje", backendName: "Weighing",
        url: "weightings", componentName: "WeighingForm",
        validations: {}
    },
    "Ultrasound": {
        displayName: "Tacto", backendName: "Ultrasound",
        url: "ultrasounds", componentName: "UltrasoundForm",
        validations: {}
    },
};
export const SEARCH_DEFAULT_TAG = "Seleccione la caravana";

export const LOGIN_CONTEXT = process.env.VUE_APP_LOGIN_CONTEXT
export const BOVINE_CONTEXT = process.env.VUE_APP_BOVINE_CONTEXT
export const ADMINISTRATION_CONTEXT = process.env.VUE_APP_ADMINISTRATION_CONTEXT
export const ACTIVITY_CONTEXT = process.env.VUE_APP_ACTIVITY_CONTEXT

export const LOGIN_VERSION = process.env.VUE_APP_LOGIN_VERSION
export const BOVINE_VERSION = process.env.VUE_APP_BOVINE_VERSION
export const ADMINISTRATION_VERSION = process.env.VUE_APP_ADMINISTRATION_VERSION
export const ACTIVITY_VERSION = process.env.VUE_APP_ACTIVITY_VERSION

const COMMON_ERRORS = {
    400: {type: "Server", message:"Error del servidor, contacte a los desarrolladores"},
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
export const BATCH_ERRORS = {
    ...COMMON_ERRORS,
    404: {type: "Server", message: "Lote no encontrado"},
    409: {type: "Server", message: "Este nombre de lote ya se encuentra en uso. Por favor, revise e intente de nuevo."}
}
export const ADMINISTRATION_ERRORS = {
    ...COMMON_ERRORS,
    404: {type: "Server", message: "Establecimiento no encontrado"},
    409: {type: "Server", message: "El establecimiento que esta intentando registrar ya existe"}
}
export const ACTIVITY_ERRORS = {
    ...COMMON_ERRORS,
    404: {type: "Server", message: "Actividad no encontrada"},
}