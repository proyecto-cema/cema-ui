export const BASE_URL = process.env.VUE_APP_API_URL
export const JAVA_DATE_FORMAT = "YYYY-MM-DD";
export const JAVA_DATETIME_FORMAT = "'YYYY-MM-DD[T]HH:mm:ss:SSZ'";
export const ROLES = ["Peon", 'Patron', 'Admin'];
export const ROLE_REPRESENTATION = {"ADMIN": 2, "PATRON": 1, "PEON": 0};
export const REGEX_LETTERS_NUMBERS = /^([a-zA-Z0-9]+)$/;
export const REGEX_SPACES = /^\S+$/;
export const MAXIMUM_TOASTS = 4;
export const MAXIMUM_NOTIFICATIONS_TOASTS = 4;
export const VALIDATIONS = {
    is_not_null: (element) => { return !element },
    lt_zero_and_null: (element) => { return (element != null && element<0) },
}
export const ACTIVITIES_EXTRA_DATA = {
    "Inoculation": {
        displayName: "Vacunación", backendName: "Inoculation",
        url: "inoculations", componentName: "VaccinationForm",
        validations: { "drug": "is_not_null", "dose": "lt_zero_and_null" }, style: "bg-success text-white", color:"green"
    },
    "Weighing": {
        displayName: "Pesaje", backendName: "Weighing",
        url: "weightings", componentName: "WeighingForm",
        validations: {"weight": "lt_zero_and_null"}, style: "bg-warning text-white", color:"yellow"
    },
    "Ultrasound": {
        displayName: "Tacto", backendName: "Ultrasound",
        url: "ultrasounds", componentName: "UltrasoundForm",
        validations: {"serviceNumber": "lt_zero_and_null"}, style: "bg-info text-white", color:"blue"
    },
    "Movement": {
        displayName: "Movimiento", backendName: "Movement",
        url: "movements", componentName: "MovementForm",
        validations: { "locationName": "is_not_null" }, style: "bg-danger text-white", color:"red"
    },
    "Feeding": {
        displayName: "Alimentación", backendName: "Feeding",
        url: "feedings", componentName: "FeedingForm",
        validations: { "amount": "lt_zero_and_null" }, style: "bg-primary text-white", color:"gray"
    }
};
export const SEARCH_DEFAULT_TAG = "Seleccione la caravana";

export const LOGIN_CONTEXT = process.env.VUE_APP_LOGIN_CONTEXT
export const BOVINE_CONTEXT = process.env.VUE_APP_BOVINE_CONTEXT
export const ADMINISTRATION_CONTEXT = process.env.VUE_APP_ADMINISTRATION_CONTEXT
export const ACTIVITY_CONTEXT = process.env.VUE_APP_ACTIVITY_CONTEXT
export const REPORTING_CONTEXT = process.env.VUE_APP_REPORTING_CONTEXT
export const OPERATION_CONTEXT = process.env.VUE_APP_OPERATION_CONTEXT
export const HEALTH_CONTEXT = process.env.VUE_APP_HEALTH_CONTEXT

export const LOGIN_VERSION = process.env.VUE_APP_LOGIN_VERSION
export const BOVINE_VERSION = process.env.VUE_APP_BOVINE_VERSION
export const ADMINISTRATION_VERSION = process.env.VUE_APP_ADMINISTRATION_VERSION
export const ACTIVITY_VERSION = process.env.VUE_APP_ACTIVITY_VERSION
export const REPORTING_VERSION = process.env.VUE_APP_REPORTING_VERSION
export const OPERATION_VERSION = process.env.VUE_APP_OPERATION_VERSION
export const HEALTH_VERSION = process.env.VUE_APP_HEALTH_VERSION

export const REPORTING_SELECTOR = {
    "batch": { value: "weight", groupBy: "category" },
    "weight": { value: "weight", groupBy: "category" },
    "performance": { value: ["spending", "liveWeight", "cost"], groupBy: null, multiple: true, displayNames: ["Costo($)", "Peso(Kg)", "Costo x Kg"] },
    "income": { value: ["spending", "earnings"], groupBy: null, multiple: true, displayNames: ["Gastos", "Ingresos"] },
    "pregnancy": { value: "percentage", groupBy: "year" },
    "feed": { value: "foodEaten", groupBy: "category" },
    "disease": { value: "infections", groupBy: "name" },
}
export const BOVINE_STATUS = {
    "Toro": ['En servicio', 'Fuera de servicio'],
    "Vaca": ['Sin preñez', 'Preñada'],
    "Ternero": ['Mamando', 'Destetado'],
    "Todos": ["Muerto", "Vendido"]
};
export const BOVINE_CATEGORIES = {
    "Macho": ['Ternero','Toro'],
    "Hembra": ['Ternero','Vaca'],
    "Todos": ['Ternero','Vaca','Toro']
};

export const FILTERS = {
    "active": {
        "type": "not in",
        "filterSet": new Set(['Muerto', 'Vendido']),
        "field": "status"
    },
    "cows_only": {
        "type": "in",
        "filterSet": new Set(['Vaca']),
        "field": "category"
    },
}

export const SUPPLY_OPERATION_TYPE = {
    'buy': 'Compra',
    'use': "Consumo",
    'loss': "Perdida"
};