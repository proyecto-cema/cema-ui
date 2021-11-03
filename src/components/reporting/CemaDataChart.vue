<template>
  <div style="position: relative">
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
          aspectRatio: 2,
          plugins: {
            title: {
              display: true,
              padding: 20,
              text: 'Chart',
              font: {
                size: 20
              }
            },
            legend: {
              position: 'bottom',
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
    this.retrieveReportData({ name: this.endpoint, yearsTo: thisYear, decrement: 1 }).then(
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
          let preGenerated, extra;
          for (const dataset in data.datasets) {
            preGenerated = data.datasets[dataset];
            extra = { datalabels: {
              color: data.datasets[dataset].borderColor,
              align: 'end',
              anchor: 'end',
              font: {
                weight: 'bold'
              }
            }};
            if (this.chartType[count] === 'line'){
              extra = {
                type: this.chartType[count],
                fill: true,
                ...extra
              };
            } else if (addType){
              extra = {
                type: this.chartType[count],
                ...extra
              }
            }
            this.chartData.data.datasets.push({
              ...extra,
              ...data.datasets[dataset]
            });
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