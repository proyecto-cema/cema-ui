<template>
  <div>
    <canvas :id="chartId"></canvas>
  </div>
</template>

<script>

import {Chart} from "chart.js";
import {mapActions} from "vuex";

export default {
  name: "CemaDataChart",
  props: {
    chartId: {
      required: true,
      type: String
    },
    endpoint: {
      required: true,
      type: String
    },
    title: {
      required: true,
      type: String
    },
    chartType: {
      required: true,
      type: String
    }
  },
  data(){
    return {
      chartData: {
        type: 'bar',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: 'Chart',
              font: {
                size: 20
              }
            },
            legend: {
              display: true
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapActions("reporting", ["retrieveReportData"])
  },
  mounted() {
    const ctx = document.getElementById(this.chartId).getContext('2d');
    this.batchesChart = new Chart(ctx, this.chartData);
    let thisYear = this.getMomentToday('YYYY');
    this.retrieveReportData({ name: this.endpoint, yearsTo: thisYear, decrement: 5 }).then(
        (data) => {
          console.log(data);
          this.chartData.options.plugins.title.text = this.title;
          this.chartData.type = this.chartType;
          this.chartData.data.labels = [...data.labels];
          for (const dataset in data.datasets) {
            this.chartData.data.datasets.push(data.datasets[dataset])
          }
          if(this.chartData.data.datasets.length === 1){
            console.log("Prevents legend from beeing shown")
            this.chartData.options.plugins.legend.display = false;
          }
          this.batchesChart.update();
        }
    );
  }
}
</script>

<style scoped>

</style>