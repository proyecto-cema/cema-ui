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
    "Ultrasound": {displayName: "Tacto", backendName: "Ultrasound"}
};
export const ACTIVITIES_EXTRA_DATA = {
    "Inoculation": {
        displayName: "Vacunación", backendName: "Inoculation",
        url: "inoculations", componentName: "VaccinationForm",
        validations: { "drug": "drug" }, style: "bg-success text-white", color:"green"
    },
    "Weighing": {
        displayName: "Pesaje", backendName: "Weighing",
        url: "weightings", componentName: "WeighingForm",
        validations: {}, style: "bg-warning text-white", color:"yellow"
    },
    "Ultrasound": {
        displayName: "Tacto", backendName: "Ultrasound",
        url: "ultrasounds", componentName: "UltrasoundForm",
        validations: {}, style: "bg-info text-white", color:"blue"
    },
};
export const SEARCH_DEFAULT_TAG = "Seleccione la caravana";

export const LOGIN_CONTEXT = process.env.VUE_APP_LOGIN_CONTEXT
export const BOVINE_CONTEXT = process.env.VUE_APP_BOVINE_CONTEXT
export const ADMINISTRATION_CONTEXT = process.env.VUE_APP_ADMINISTRATION_CONTEXT
export const ACTIVITY_CONTEXT = process.env.VUE_APP_ACTIVITY_CONTEXT
export const REPORTING_CONTEXT = process.env.VUE_APP_REPORTING_CONTEXT

export const LOGIN_VERSION = process.env.VUE_APP_LOGIN_VERSION
export const BOVINE_VERSION = process.env.VUE_APP_BOVINE_VERSION
export const ADMINISTRATION_VERSION = process.env.VUE_APP_ADMINISTRATION_VERSION
export const ACTIVITY_VERSION = process.env.VUE_APP_ACTIVITY_VERSION
export const REPORTING_VERSION = process.env.VUE_APP_REPORTING_VERSION

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
export const REPORTING_ERRORS = {
    ...COMMON_ERRORS,
    404: {type: "Server", message: "Reporte no encontrado"},
}

export const REPORTING_SELECTOR = {
    "batch": { value: "weight", groupBy: "batchName" },
    "weight": { value: "weight", groupBy: "category" },
    "performance": { value: ["liveWeight", "spending"], groupBy: null, multiple: true, displayNames: ["Peso(Kg)", "Costo($)"] },
    "income": { value: ["spending", "earnings"], groupBy: null, multiple: true, displayNames: ["Gastos", "Ingresos"] },
    "pregnancy": { value: "percentage" },
    "feed": { value: "foodEaten", groupBy: "category" },
    "disease": { value: "infections", groupBy: "name" },
}