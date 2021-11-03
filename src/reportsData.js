export const chartIterator = [
    {
        classes: "col-12",
        endpoint: "performance",
        chartTypes: ['line', 'bar'],
        title: "Rendimiento anual del alimento por kilogramo vivo"
    },
    {
        classes: "col-12",
        endpoint: "pregnancy",
        chartTypes: ['pie'],
        title: "Porcentaje de preñez"
    },
    {
        classes: "col-12",
        endpoint: "weight",
        chartTypes: ['bar'],
        title: "Peso promedio por categoría"
    },
    {
        classes: "col-12",
        endpoint: "batch",
        chartTypes: ['bar'],
        title: "Peso promedio por lote"
    },
    {
        classes: "col-12",
        endpoint: "feed",
        chartTypes: ['bar'],
        title: "Cantidad de alimento consumido por categoría"
    },
    {
        classes: "col-12",
        endpoint: "disease",
        chartTypes: ['bar'],
        title: "Cantidad de infecciones anuales por tipo"
    },
    {
        classes: "col-12",
        endpoint: "income",
        chartTypes: ['bar'],
        title: "Gastos vs Ingresos"
    },
];


export const activeBovines = {
    "Toro": {
        imageDisplay: require("@/assets/images/reporting/bulls.png"),
        altDisplay: "Toros Activos",
        activeQuantity: 0
    },
    "Vaca": {
        imageDisplay: require("@/assets/images/reporting/cows.png"),
        altDisplay: "Vacas Activas",
        activeQuantity: 0
    },
    "Ternero": {
        imageDisplay: require("@/assets/images/reporting/calves.png"),
        altDisplay: "Terneros Activos",
        activeQuantity: 0
    },
    "Total": {
        imageDisplay: require("@/assets/images/reporting/bovines.png"),
        altDisplay: "Activos Totales",
        activeQuantity: 0
    }
};