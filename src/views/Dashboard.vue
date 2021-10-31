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
    this.retrieveReportData("live", 1).then(
      response => {
        let animals = response.data.animalList;
        let thisYear = this.getMomentToday('YYYY');
        for (let i = 0; i < animals.length; i++) {
          if(animals[i].year == thisYear){
            this.activeBovines[animals[i].category].activeQuantity = animals[i].value;
            this.activeBovines["Total"].activeQuantity += animals[i].value;
          }
        }
      }
    );
  }
};
</script>