<template>
  <div class="text-center section">
    <h2 class="h2 mt-3">Calendario de actividades</h2>
    <form @submit.prevent="">
      <div class="row">
        <div class="col-12 col-md-6 col-lg-6">
          <cema-input v-model.trim="search.name" component-type="input" required maxlength="20"
                      input-title="Nombre actividad" input-id="nameActivity" :label="false" type="text" class="mb-2" ></cema-input>
        </div>
        <div class="col-12 col-md-6 col-lg-6">
          <cema-input v-model="search.type" component-type="select" required
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
                  v-on:click="this.searchActivitys(this.search.name,this.search.type)">
            Buscar
          </button>
        </div>
      </div>
    </form>
    <div v-if="!isMobile">
      <v-calendar
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
              <p
                v-for="attr in attributes"
                :key="attr.key"
                class="text-xs leading-tight rounded-sm p-1 mt-0 mb-1 " style=" border-radius: 5px;"
                :class="attr.customData.class"
                v-on:click="this.openActivityModal(attr.customData.id)"
              >
                {{ attr.customData.title }}
              </p>
            </div>
          </div>
          
        </template>
      </v-calendar>
    </div>
    <div v-else>
          
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

export default {
  name:"Calendar",
  data() {
    return {
      activitiesOptions: ACTIVITIES_OPTIONS,
      search: {name: null, type: ""},
      isMobile: false,
      activity:{},
      activityModal: null,
      
      masks: {
        weekdays: 'WWW',
      },
      attributes: [
        
      ],
    };
  },
  mounted() {
    this.setCuigToDefault();
    this.isMobile = screen.width <= 760;
    this.searchActivitys();
    this.activityModal = new Modal(document.getElementById('activityModal'));
  },
  components: {
    ActivityModal,
    CemaInput
  },
  methods:{
    ...mapActions("activity", ["listActivities"]),
    ...mapActions("bovine", ["setCuigToDefault"]),
    clearSearchActivityData(){
      this.search.type="";
      this.search.name="";
      
    },
    async searchActivitys(name, type) {
      this.attributes=[]
      if(type==null||type==""){
        type="activities"
      }
      this.listActivities().then(
        (response) => {
          console.log(response);
          for(var i = 0;response.data.length>i ; i++)
          {
            let style = ACTIVITIES_EXTRA_DATA[response.data[i].type].style;
            this.activity={
              key: i,
              customData: {
                id: response.data[i].id,
                title: response.data[i].name,
                class: style ,
              },
              dates: new Date(response.data[i].executionDate),
            }
            this.attributes.push(this.activity)
            
          }
        }
      )
    },
    openActivityModal(id){
      this.activityModal.show(id)
    }
  },
  
}

</script>
<style lang="scss">
 
</style>