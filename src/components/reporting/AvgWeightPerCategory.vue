<template>
  <div>
    <canvas id="batches-chart"></canvas>
  </div>
</template>

<script>

import {exampleChart} from "../../dataSources";
import {Chart} from "chart.js";
import {mapActions} from "vuex";

export default {
  name: "AvgWeightPerCategory",
  data(){
    return {
      batchChartData: {
        type: 'bar',
        data: {
          labels: [],
          datasets: []
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    }
  },
  methods: {
    ...mapActions("reporting", ["retrieveReportData"]),
    randomMax(max){
      return Math.floor(Math.random() * max);
    },
    generateRandomColor(){
      return `rgba(${this.randomMax(255)}, ${this.randomMax(255)}, ${this.randomMax(255)},`
    },
    updateChart(batchList){
      let datasets = {};
      let labels = new Set();
      let color;
      for (let i = 0; i < batchList.length; i++) {
        const batch = batchList[i];
        labels.add(batch.year);
        if(!(batch.batchName in datasets)){
          color = this.generateRandomColor()
          datasets[batch.batchName] = {
            label: `Peso x categoría(${batch.batchName})`,
            borderWidth: 1,
            data: [],
            backgroundColor: color+"0.2)",
            borderColor: color+"1)"
          };
        }
        datasets[batch.batchName].data.push(batch.value);
      }
      this.batchChartData.data.labels = [...labels];
      console.log(datasets);
      for (const dataset in datasets) {
        this.batchChartData.data.datasets.push(datasets[dataset])
      }
      this.batchesChart.update();
    }
  },
  mounted() {
    const ctx = document.getElementById('batches-chart').getContext('2d');
    this.batchesChart = new Chart(ctx, this.batchChartData);
    this.retrieveReportData("batch", 5).then(
        (response) => {
          console.log(response);
          let batchList = response.data.batchList;
          this.updateChart(batchList);
        }
    );
  }
}
</script>

<style scoped>

</style>