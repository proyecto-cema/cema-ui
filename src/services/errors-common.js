const COMMON_ERRORS = {
  400: { type: 'Server', message: 'Error del servidor, contacte a los desarrolladores' },
  401: { type: 'Authentication', message: 'Usuario no autenticado' },
  403: { type: 'Not-Allowed', message: 'Su usuario no tiene permisos' },
};
export const LOGIN_ERRORS = {
  400: { type: 'establishment', message: 'Su establecimiento no es válido'},
  409: { type: 'invalid-user', message: 'Su usuario no esta deshabilitado'},
  401: { type: 'password', message: 'Contraseña incorrecta' },
  404: { type: 'UserPass', message: 'Usuario o Contraseña incorrectos' },
};
export const BOVINE_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Bovino no encontrado' },
  409: { type: 'Server', message: 'Esta caravana ya se encuentra en uso. Por favor, revise e intente de nuevo.' },
  422: { type: 'Server', message: 'No se puede asignar el estado seleccionado para la categoria del bovino' },
};
export const BATCH_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Lote no encontrado' },
  409: { type: 'Server', message: 'Este nombre de lote ya se encuentra en uso. Por favor, revise e intente de nuevo.' },
};
export const ADMINISTRATION_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Establecimiento no encontrado' },
  409: { type: 'Server', message: 'El establecimiento que esta intentando registrar ya existe' },
};
export const ACTIVITY_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Actividad no encontrada' },
};
export const REPORTING_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Reporte no encontrado' },
};
export const USERS_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Usuario no encontrado' },
  409: { type: 'Server', message: 'El usuario que esta intentando registrar ya existe' },
};
export const LOCATION_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Ubicación no encontrada' },
  409: { type: 'Server', message: 'La ubicación que esta intentando registrar ya existe' },
};
export const OPERATION_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Operacion no encontrada' },
  409: { type: 'Server', message: 'La Operacion que esta intentando registrar ya existe' },
  422: { type: 'Server', message: 'Error al guardar operacion' },
};
export const AUDIT_ERRORS = {
  ...COMMON_ERRORS,
  404: { type: 'Server', message: 'Auditorias no encontradas' },
};
export const SUPPLY_ERRORS = {
  ...COMMON_ERRORS,
  404: {type: "Server", message: "Insumo no encontrada"},
  409: {type: "Server", message: "El Insumo que esta intentando registrar ya existe"},
};
export const DISEASE_ERRORS = {
  ...COMMON_ERRORS,
  404: {type: "Server", message: "Enfermedad no encontrada"},
  422: {type: "Server", message: "No se puede elimiar porque hay bovinos con esta enfermdad"},
  409: {type: "Server", message: "La enfermedad que esta intentando registrar ya existe"},
};
export const SUPPLY_OPERATION_ERRORS = {
  ...COMMON_ERRORS,
  404: {type: "Server", message: "Operacion de insumo no encontrada"},
};
export const ILLNESS_ERRORS = {
  ...COMMON_ERRORS,
  404: {type: "Server", message: "Enfermedad no encontrada"},
  409: {type: "Server", message: "La enfermedad que esta intentando registrar ya existe"},
  422: {type: "Server", message: "La fecha de inicio de enfermedad no puede ser mayor a la de finalización"},
};