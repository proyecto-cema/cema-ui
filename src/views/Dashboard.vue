<template>
  <div class="row">
    <active-bovines-card v-for="chartHelper in activeBovines" :active-quantity="chartHelper.activeQuantity"
                         :alt-display="chartHelper.altDisplay" :image-display="chartHelper.imageDisplay"></active-bovines-card>
  </div>
  <div id="chartCarousel" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
    <div class="carousel-inner">
      <div class="carousel-item" :class="chartActive === chartHelper.endpoint? 'active':''" v-for="chartHelper in chartIterator" :key="chartHelper.endpoint">
        <cema-data-chart class="container" :chart-type="chartHelper.chartTypes" :title="chartHelper.title"
                         :endpoint="chartHelper.endpoint" :chart-id="chartHelper.endpoint + '-chart'"></cema-data-chart>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#chartCarousel" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#chartCarousel" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Siguiente</span>
    </button>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ActiveBovinesCard from "../components/reporting/ActiveBovinesCard";
import CemaDataChart from "../components/reporting/CemaDataChart";
import {activeBovines, chartIterator} from "../reportsData";

export default {
  name: 'Dashboard',
  components: { ActiveBovinesCard, CemaDataChart },
  data(){
    return {
      chartIterator: chartIterator,
      chartActive: "performance",
      activeBovines: activeBovines
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
            this.activeBovines[reportedList[i].category].activeQuantity = reportedList[i].count;
            this.activeBovines["Total"].activeQuantity += reportedList[i].count;
          }
        }
      }
    );
  }
};
</script>