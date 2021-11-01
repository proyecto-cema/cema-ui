<template>
  <div class="row">
    <active-bovines-card v-for="chartHelper in activeBovines" :active-quantity="chartHelper.activeQuantity"
                         :alt-display="chartHelper.altDisplay" :image-display="chartHelper.imageDisplay"></active-bovines-card>
  </div>
  <avg-weight-per-category></avg-weight-per-category>
</template>

<script>
import { mapActions } from "vuex";
import ActiveBovinesCard from "../components/reporting/ActiveBovinesCard";
import AvgWeightPerCategory from "../components/reporting/AvgWeightPerCategory";

export default {
  name: 'Dashboard',
  components: { ActiveBovinesCard, AvgWeightPerCategory },
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
    this.retrieveReportData({ name: "live", yearsTo: thisYear, decrement: 0 }).then(
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