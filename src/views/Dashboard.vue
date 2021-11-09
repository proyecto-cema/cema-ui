<template>
  <div class="row">
    <active-bovines-card v-for="chartHelper in activeBovines" :active-quantity="chartHelper.activeQuantity"
                         :alt-display="chartHelper.altDisplay" :image-display="chartHelper.imageDisplay"></active-bovines-card>
  </div>
  <div id="chartCarousel" class="carousel carousel-dark slide" data-bs-ride="carousel" data-bs-interval="false">
    <div class="carousel-inner">
      <div class="carousel-item" :class="chartActive === chartHelper.endpoint? 'active':''" v-for="chartHelper in chartIterator" :key="chartHelper.endpoint">
        <cema-data-chart class="container" :chart-type="chartHelper.chartTypes" :title="chartHelper.title" :dates="chartHelper.dates"
                         :endpoint="chartHelper.endpoint" :chart-id="chartHelper.endpoint + '-chart'" :ref="chartHelper.endpoint">
        </cema-data-chart>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#chartCarousel" data-bs-slide="prev"
            @click.stop="changeChart(-1)">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Anterior</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#chartCarousel" data-bs-slide="next"
            @click.stop="changeChart(1)">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Siguiente</span>
    </button>
  </div>
  <form @submit.prevent="">
    <div class="row">
      <div class="col-12 col-md-6 col-lg-4 offset-lg-2">
        <cema-input v-model="yearsFrom" :min="getTodayYear-500" :max="search.yearsTo" class="mb-2" year-format="true"
                    input-title="Fecha desde" input-id="searchFrom" type="number" @change="redrawChart()"></cema-input>
      </div>
      <div class="col-12 col-md-6 col-lg-4">
        <cema-input v-model="yearsTo" :min="yearsFrom" :max="getTodayYear" class="mb-2" year-format="true"
                    input-title="Fecha hasta" input-id="searchTo" type="number" @change="redrawChart()"></cema-input>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import ActiveBovinesCard from "../components/reporting/ActiveBovinesCard";
import CemaDataChart from "../components/reporting/CemaDataChart";
import {activeBovines, chartIterator} from "../reportsData";
import CemaInput from "../components/form/CemaInput";

export default {
  name: 'Dashboard',
  components: { ActiveBovinesCard, CemaDataChart, CemaInput },
  data(){
    return {
      chartIterator: chartIterator,
      chartActive: "performance",
      activeBovines: activeBovines,
      activeChart: 0,
      search: {decrement: 1, yearsTo: 2021}
    }
  },
  methods: {
    ...mapActions("reporting", ["retrieveReportData"]),
    changeChart(change){
      if(change === -1 && this.activeChart === 0){
        this.activeChart = this.chartIterator.length-1;
      }else if (change === 1 && this.activeChart === this.chartIterator.length-1){
        this.activeChart = 0;
      }else{
        this.activeChart += change;
      }
      console.log(this.activeChart);
      this.search = this.chartIterator[this.activeChart]['dates'];
    },
    redrawChart(){
      this.$refs[this.chartIterator[this.activeChart]['endpoint']].redrawChart(this.search);
    }
  },
  computed:{
    getTodayYear(){
      return this.getMomentToday('YYYY')
    },
    yearsTo: {
      get() {
        return this.search.yearsTo;
      },
      set(value) {
        this.search.decrement += value - this.search.yearsTo;
        this.search.yearsTo = value;
      }
    },
    yearsFrom: {
      get() {
        return this.search.yearsTo - this.search.decrement
      },
      set(value) {
        this.search.decrement = this.search.yearsTo - value;
      }
    }
  },
  mounted() {
    this.search = this.chartIterator[this.activeChart]['dates'];
    let thisYear = this.getTodayYear;
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
<style scoped>
.carousel-control-next, .carousel-control-prev {
  margin-bottom: 40px;
}
</style>