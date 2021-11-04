<template>
  <div class="text-center section">
    <h2 class="h2 mt-3">Calendario de actividades</h2>
    <form @submit.prevent="">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-6">
          <cema-input v-model.trim="search.name" component-type="input"  maxlength="20"
                      input-title="Nombre actividad" input-id="nameActivity" :label="false" type="text" class="mb-2" ></cema-input>
        </div>
        <div class="col-12 col-md-6 col-lg-6">
          <cema-input v-model="search.type" component-type="select" 
                              input-title="Tipo Actividad" input-id="Type" :label="false"
                              :options="activitiesOptions" optionKey="backendName">
                    <template v-slot:default="{ option }">
                      {{ option.displayName }}
                    </template>
                  </cema-input>
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end mt-2 mb-2">
          <button class="btn btn-secondary text-white" type="button"
            v-on:click="openActivityModal()">
              Crear actividad
          </button>
          <button class="btn btn-primary text-white"
                  type="button"
                  v-on:click="this.clearSearchActivityData()">
            Restablecer
          </button>
          <button class="btn btn-secondary text-white"
                  type="button"
                  v-on:click="this.searchActivitys()">
            Buscar
          </button>
        </div>
      </div>
    </form>
    <div v-if="!isMobile">
      <v-calendar
        ref="calendar"
        class="custom-calendar max-w-full"
        :masks="masks"
        :attributes="attributes"
        disable-page-swipe
        is-expanded
      >
        <template v-slot:day-content="{ day, attributes }" >
          <div class="flex flex-col h-full z-10 overflow-hidden" id="day" >
            <span class="day-label text-sm ">{{ day.day }}</span>
            <div class="flex-grow overflow-y-auto overflow-x-auto">
              <div
                v-for="attr in attributes"
                :key="attr.key"
                class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1 " style="border-radius: 5px;"
                v-bind:style="attr.customData.future? {opacity:0.7}:{}"
                :class="attr.customData.class"
                v-on:click="this.openActivityModalWithSearch(attr.customData.id, attr.customData.type)"
              >
                {{ attr.customData.title }}
              </div>
            </div>
          </div>
          
        </template>
      </v-calendar>
    </div>
    <div v-else>
      <v-calendar
          ref="mobileCalendar"
          :attributes='attributes'
          is-double-paned>
      </v-calendar>
    </div>
  </div>
  <activity-modal modalId="activityModal"></activity-modal>
</template>
<script>
import {mapActions} from "vuex";
import ActivityModal from "../../components/activity/ActivityModal";
import {Modal} from "bootstrap";
import CemaInput from "../../components/form/CemaInput";
import {ACTIVITIES_EXTRA_DATA, ACTIVITIES_OPTIONS} from "../../constants";
import CalendarMobile from "../../components/activity/CalendarMobile"
export default {
  name:"Calendar",
  data() {
    return {
      activitiesOptions: ACTIVITIES_OPTIONS,
      search: { name: null, type: "" },
      isMobile: true,
      activityModal: null,
      masks: {
        weekdays: 'WWW',
      },
      activities: [],
      mobileActivities: [],
      helperDate: null
    };
  },
  beforeDestroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeTimeOut);
    }
  },
  mounted() {
    this.helperDate = this.replaceFormat(this.$route.query.fecha) || this.getMomentToday();
    this.setCuigToDefault();
    this.isMobile = screen.width <= 760;
    this.searchActivitys();
    this.activityModal = new Modal(document.getElementById('activityModal'));
    window.addEventListener('resize', this.resizeTimeOut);
  },
  components: {
    ActivityModal,
    CemaInput,
    CalendarMobile
  },
  methods:{
    ...mapActions("activity", ["listActivities","getActivity"]),
    ...mapActions("bovine", ["setCuigToDefault"]),

    resizeTimeOut(){
      clearTimeout(this.timeout);
      this.timeout = setTimeout(this.onResize, this.delay);
    },
    onResize(event) {
      this.isMobile = screen.width <= 760;
      console.log("Mobile:", this.isMobile);
    },
    clearSearchActivityData(){
      this.search.type = "";
      this.search.name = "";
      this.searchActivitys();
    },
    async searchActivitys() {
      this.activities = [];
      this.mobileActivities = [];
      let type = this.search.type ? ACTIVITIES_EXTRA_DATA[this.search.type].url: "activities";
      this.search.name = this.search.name ?? null

      let searchAct = { name: this.search.name, type: type }
      
      this.listActivities(searchAct).then(
        (response) => {
          console.log(response);
          let activity, future, style, color, mobileActivity, date;
          let today = this.getMomentToday()

          for(let i = 0;response.data.length>i ; i++)
          {
            future = response.data[i].executionDate < today;
            style = ACTIVITIES_EXTRA_DATA[response.data[i].type].style;
            color = ACTIVITIES_EXTRA_DATA[response.data[i].type].color;
            date = new Date(response.data[i].executionDate);
            activity = {
              key: i,
              customData: {
                id: response.data[i].id,
                title: response.data[i].name,
                class: style,
                future: future,
                type: ACTIVITIES_EXTRA_DATA[response.data[i].type].url,
                color: color
              },
              dates: date,
            };
            mobileActivity = {
              key: i,
              dates: date,
              dot: {
                color: color,
                class: style,
                opacity: activity.customData.future ? 1 : 0.3,
              },
              popover: {
                label: activity.customData.title,
              },
            }
            this.activities.push(activity);
            this.mobileActivities.push(mobileActivity);
          }
        }
      )
    },
    openActivityModalWithSearch(id, type) {
      let act = {
        id: id,
        url: type
      }
      console.log(act);
      this.getActivity(act);
      this.openActivityModal();
    },
    openActivityModal() {
      this.activityModal.show();
    }
  },
  computed: {
    attributes(){
      if(this.isMobile){
        return [
          {
            contentStyle: {
              fontWeight: '700',
              fontSize: '.9rem',
              class:"bg-danger"
            },
            dates: this.getMomentToday(),
          },
          ...this.mobileActivities
        ];
      }
      return this.activities;
    }
  }
}

</script>
<style lang="scss">

</style>