import utils from "./utils";

const yearNow = utils.methods.getMomentToday('YYYY');
export const chartIterator = [
    {
        classes: "col-12",
        endpoint: "performance",
        chartTypes: ['bar', 'filled-line', 'line'],
        title: "Rendimiento anual del alimento por kilogramo vivo",
        dates: {decrement: 5, yearsTo: yearNow}
    },
    {
        classes: "col-12",
        endpoint: "pregnancy",
        chartTypes: ['pie'],
        title: "Porcentaje de preñez",
        dates: {decrement: 0, yearsTo: yearNow}
    },
    {
        classes: "col-12",
        endpoint: "weight",
        chartTypes: ['bar'],
        title: "Peso promedio por categoría",
        dates: {decrement: 1, yearsTo: yearNow}
    },
    {
        classes: "col-12",
        endpoint: "batch",
        chartTypes: ['bar'],
        title: "Peso promedio por lote",
        dates: {decrement: 5, yearsTo: yearNow}
    },
    {
        classes: "col-12",
        endpoint: "feed",
        chartTypes: ['bar'],
        title: "Cantidad de alimento consumido por categoría",
        dates: {decrement: 3, yearsTo: yearNow}
    },
    {
        classes: "col-12",
        endpoint: "disease",
        chartTypes: ['bar'],
        title: "Cantidad de infecciones anuales por tipo",
        dates: {decrement: 2, yearsTo: yearNow}
    },
    {
        classes: "col-12",
        endpoint: "income",
        chartTypes: ['bar'],
        title: "Gastos vs Ingresos",
        dates: {decrement: 3, yearsTo: yearNow}
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