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
      type: Array
    }
  },
  data(){
    return {
      chartData: {
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
          let addType = true;
          this.chartData.options.plugins.title.text = this.title;
          if (this.chartType.length === 1){
            this.chartData.type = this.chartType[0];
            addType = false;
          }
          this.chartData.data.labels = [...data.labels];
          let count = 0;
          let preGenerated;
          for (const dataset in data.datasets) {
            preGenerated = data.datasets[dataset];
            if (addType){
              preGenerated = {
                type: this.chartType[count],
                ...preGenerated
              }
            }
            this.chartData.data.datasets.push(preGenerated);
            count++;
          }
          this.batchesChart.update();
        }
    );
  }
}
</script>

<style scoped>

</style>