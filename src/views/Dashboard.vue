<template>
  <div class="row">
    <active-bovines-card v-for="chartHelper in activeBovines" :active-quantity="chartHelper.activeQuantity"
                         :alt-display="chartHelper.altDisplay" :image-display="chartHelper.imageDisplay"></active-bovines-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import ActiveBovinesCard from "../components/reporting/ActiveBovinesCard";

export default {
  name: 'Dashboard',
  components: { ActiveBovinesCard },
  data(){
    return {
      activeBovines: [
        {
          imageDisplay: require("@/assets/images/reporting/bulls.png"),
          altDisplay: "Toros Activos",
          activeQuantity: 0
        },
        {
          imageDisplay: require("@/assets/images/reporting/cows.png"),
          altDisplay: "Vacas Activas",
          activeQuantity: 0
        },
        {
          imageDisplay: require("@/assets/images/reporting/calves.png"),
          altDisplay: "Terneros Activos",
          activeQuantity: 0
        },
        {
          imageDisplay: require("@/assets/images/reporting/bovines.png"),
          altDisplay: "Activos Totales",
          activeQuantity: 0
        }
      ]
    }
  },
  methods: {
    ...mapActions("reporting", ["retrieveReportData"]),
  }
};
</script>