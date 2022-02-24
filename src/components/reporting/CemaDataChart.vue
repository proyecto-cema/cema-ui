<template>
  <div style="position: relative">
    <canvas :id="chartId"></canvas>
    <a
      :id="`download-${chartId}`"
      @click.stop="downloadChart()"
      :download="`cuadro-${chartId}.png`"
      href=""
      style="width: 40px"
      class="float-end"
      title="Descargar Gráfico"
      ><font-awesome-icon icon="download"
    /></a>
  </div>
</template>

<script>
import { Chart } from 'chart.js';
import { mapActions } from 'vuex';

export default {
  name: 'CemaDataChart',
  props: {
    chartId: {
      required: true,
      type: String,
    },
    endpoint: {
      required: true,
      type: String,
    },
    title: {
      required: true,
      type: String,
    },
    chartType: {
      required: true,
      type: Array,
    },
    dates: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      chartData: {
        data: {
          labels: [],
          datasets: [],
        },
        options: {
          responsive: true,
          aspectRatio: 2.12,
          plugins: {
            title: {
              display: true,
              padding: 20,
              text: 'Chart',
              font: {
                size: 20,
              },
            },
            legend: {
              position: 'bottom',
              display: true,
            },
          },
        },
      },
    };
  },
  methods: {
    ...mapActions('reporting', ['retrieveReportData']),
    redrawChart(dates) {
      console.log(dates);
      this.retrieveReportData({ name: this.endpoint, ...dates }).then((data) => {
        console.log(data);
        let addType = true;
        this.chartData.options.plugins.title.text = this.title;
        if (this.endpoint === 'performance') {
          let max = Math.max(...data.datasets.cost.data);
          this.chartData.options['scales'] = {
            fixed: {
              position: 'left',
            },
            percentage: {
              min: 0,
              max: Math.floor(max) + 1,
              position: 'right',
            },
          };
          data.datasets.liveWeight.yAxisID = 'fixed';
          data.datasets.spending.yAxisID = 'fixed';
          data.datasets.cost.yAxisID = 'percentage';
        }
        if (this.chartType.length === 1) {
          this.chartData.type = this.chartType[0];
          addType = false;
        }
        if (this.endpoint === 'pregnancy') {
          this.chartData.data.labels = ['Preñada', ['No preñada']];
        } else {
          this.chartData.data.labels = [...data.labels];
        }
        let count = 0;
        let preGenerated, extra;
        this.chartData.data.datasets = [];
        for (const dataset in data.datasets) {
          preGenerated = data.datasets[dataset];
          extra = {
            datalabels: {
              color: data.datasets[dataset].borderColor,
              align: 'start',
              anchor: 'end',
              font: {
                weight: 'bold',
              },
            },
          };
          if (this.chartType[count] === 'filled-line') {
            extra = {
              type: 'line',
              fill: true,
              ...extra,
            };
          } else if (addType) {
            extra = {
              type: this.chartType[count],
              ...extra,
            };
          }
          this.chartData.data.datasets.push({
            ...extra,
            ...data.datasets[dataset],
          });
          count++;
        }
        this.batchesChart.update();
      });
    },
    fillCanvasBackgroundWithColor(canvas, color) {
      const context = canvas.getContext('2d');
      context.save();

      context.globalCompositeOperation = 'destination-over';

      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
    },
    downloadChart() {
      let canvas = document.getElementById(this.chartId);
      this.fillCanvasBackgroundWithColor(canvas, 'white');
      let url_base64jp = canvas.toDataURL('image/png');
      let a = document.getElementById(`download-${this.chartId}`);
      a.href = url_base64jp;
    },
  },
  mounted() {
    const ctx = document.getElementById(this.chartId).getContext('2d');
    this.batchesChart = new Chart(ctx, this.chartData);
    this.redrawChart(this.dates);
  },
};
</script>

<style scoped></style>
