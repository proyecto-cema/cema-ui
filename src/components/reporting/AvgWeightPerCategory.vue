<template>
  <BarChart :chartData="dataSource" />
</template>

<script>
import {mapActions} from "vuex";
import { BarChart } from 'vue-chart-3';

export default {
  name: "AvgWeightPerCategory",
  components: { BarChart },
  data(){
    return {
      dataSource: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
          },
        ],
      }
    }
  },
  methods: {
    ...mapActions("reporting", ["retrieveReportData"]),
  }
  beforeCreate() {
    this.retrieveReportData().then(
        response => {
          let batchList = response.data.batchList;
          console.log(batchList);
          for (const key in batchList) {
            let batchData = batchList[key];
            console.log(batchData);
            this.dataSource.labels.push(batchData["batchName"]);
            console.log(this.dataSource.labels);
            console.log(this.dataSource.datasets[0]["data"]);
            this.dataSource.datasets[0]["data"].push(batchData["value"]);
            this.dataSource.datasets[0]["backgroundColor"].push("#A5C8ED");
          }
        }
    );
  },
}
</script>

<style scoped>

</style>