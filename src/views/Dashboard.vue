<template>
  <div class="row">
    <active-bovines-card v-for="chartHelper in activeBovines" :active-quantity="chartHelper.activeQuantity"
                         :alt-display="chartHelper.altDisplay" :image-display="chartHelper.imageDisplay"></active-bovines-card>
  </div>
  <div class="row">
    <div class="col-lg-6 col-12">
      <cema-data-chart chart-type="bar" title="Peso promedio por categoría"
                       endpoint="weight" chart-id="categories-chart"></cema-data-chart>
    </div>
    <div class="col-lg-6 col-12">
      <cema-data-chart chart-type="bar" title="Peso promedio por lote"
                       endpoint="batch" chart-id="batches-chart"></cema-data-chart>
    </div>
    <div class="col-lg-6 col-12">
      <cema-data-chart chart-type="bar" title="Rendimiento anual del alimento por kilogramo vivo"
                       endpoint="performance" chart-id="performance-chart"></cema-data-chart>
    </div>
    <div class="col-lg-6 col-12">
      <cema-data-chart chart-type="doughnut" title="Porcentaje de preñez"
                       endpoint="pregnancy" chart-id="pregnancy-chart"></cema-data-chart>
    </div>
    <div class="col-lg-6 col-12">
      <cema-data-chart chart-type="bar" title="Cantidad de alimento consumido por categoría"
                       endpoint="feed" chart-id="feed-chart"></cema-data-chart>
    </div>
    <div class="col-lg-6 col-12">
      <cema-data-chart chart-type="bar" title="Cantidad de infecciones anuales por tipo"
                       endpoint="disease" chart-id="disease-chart"></cema-data-chart>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ActiveBovinesCard from "../components/reporting/ActiveBovinesCard";
import CemaDataChart from "../components/reporting/CemaDataChart";

export default {
  name: 'Dashboard',
  components: { ActiveBovinesCard, CemaDataChart },
  data(){
    return {
      activeBovines: {
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
      }
    }
  },
  methods: {
    ...mapActions("reporting", ["retrieveReportData"]),
  },
  mounted() {
    let thisYear = this.getMomentToday('YYYY');
    this.retrieveReportData(
        { name: "live", yearsTo: thisYear, decrement: 0, arrangeData: false }
    ).then(
      reportedList => {
        for (let i = 0; i < reportedList.length; i++) {
          if(reportedList[i].year == thisYear){
            this.activeBovines[reportedList[i].category].activeQuantity = reportedList[i].value;
            this.activeBovines["Total"].activeQuantity += reportedList[i].value;
          }
        }
      }
    );
  }
};
</script>