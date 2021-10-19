<template>
  <div class="text-center section">
    <div class="row m-3 d-flex justify-content-end">
      <button class="btn btn-secondary text-white col-lg-2 col-10" type="button"
            v-on:click="openActivityModal()">
        Crear actividad
      </button>
    </div>
    <h2 class="h2">Calendario de actividades</h2>
    
    <div>
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
                v-on:click="this.openActivityModal()"
              >
                {{ attr.customData.title }}
              </p>
            </div>
          </div>
        </template>
      </v-calendar>
    </div>
  </div>
       
  <activity-modal modalId="activityModal"></activity-modal>
</template>
<script>
import {mapActions} from "vuex";
import ActivityModal from "../../components/activity/ActivityModal";
import {Modal} from "bootstrap";

const todos = [
  {
    description: 'Take Noah to basketball practice.',
    isComplete: false,
    dates: { weekdays: 6 }, // Every Friday
    color: '#ff8080',       // Red
  },
];
export default {
  name:"Calendar",
  data() {
    const month = new Date().getMonth();
    const year = new Date().getFullYear();
    return {
      activity:{},
      activityModal: null,
      incId: todos.length,
      // meetings,
      todos,
      masks: {
        weekdays: 'WWW',
      },
      attributes: [
        {
          key: 1,
          customData: {
            id:"7049f123-3d85-4ed3-86ee-87e7a4ecbecb",
            title: 'Vacunacion 2021',
            class: 'bg-info text-white',
          },
          dates: new Date(2021,9, 18),
        },
        {
          key: 18,
          customData: {
            id:"bc928a3f-9b24-4da4-97e4-901514fd6c57",
            title: 'vacuna de la vaca loca',
            class: 'bg-info text-white',
          },
          dates: new Date(2021, 9, 9),
        },
        {
          key: 2,
          customData: {
            id:"2dcd1ebe-99cf-4e1a-a155-bbc9537e6f00",
            title: 'Vacunación 65465',
            class: 'bg-info text-white' ,
          },
          dates: new Date(2021, 9, 26),
        },
        {
          key: 3,
          customData: {
            id:"900d9708-4b26-4bf8-952c-fe598201e30c",
            title: "Vacunación 65465",
            class: 'bg-info text-white',
          },
          dates: new Date(2021, 10, 5),
        },
        {
          key: 4,
          customData: {
            id:"d7120233-3862-4353-8de6-59b8bfcf8e3d",
            title: 'Pesaje',
            class: 'bg-success text-white',
          },
          dates: new Date(2021, 10 , 13),
        },
        {
          key: 4,
          customData: {
            id:"771ddb96-4f6d-4ca7-8de0-b761a14eeab9",
            title: 'Pesaje 1',
            class: 'bg-success text-white',
          },
          dates: new Date(2021, 9, 14),
        },
        {
          key: 5,
          customData: {
            title: "Ultrasonido 9/25",
            class: 'bg-warning text-white',
          },
          dates: new Date(2021, 9, 25),
        },
        {
          key: 6,
          customData: {
            title: 'Ultrasonido vaca 5',
            class: 'bg-warning text-white',
          },
          dates: new Date(2021, 10, 20),
        }
      ],
    };
  },
  mounted() {
    this.searchActivitys();
    this.activityModal = new Modal(document.getElementById('activityModal'));
  },
  components: {
    ActivityModal,
  },
  methods:{
    ...mapActions("activity", ["listActivities"]),
    async searchActivitys() {
      this.activitys = null;
      this.listActivities().then(
        (response) => {
          for(var i = 0; response.data.length()>i ; i++)
          {
            activity={
              key: i,
              customData: {
                id:"2dcd1ebe-99cf-4e1a-a155-bbc9537e6f00",
                title: 'Vacunación 65465',
                class: 'bg-info text-white' ,
              },
              dates: new Date(2021, 9, 26),
            }
          }
          this.activitys = response.data;
          console.log(response);
        }
      )
    },
    openActivityModal(){
      this.activityModal.show()
    }
  },
  computed: {
    attributesMobile() {
      return [
        
        {
          contentStyle: {
            fontWeight: '700',
            fontSize: '.9rem',
          },
          dates: new Date(),
        },
        // Attributes for todos
        ...this.todos.map(todo => ({
          dates: todo.dates,
          dot: {
            backgroundColor: todo.color,
            opacity: todo.isComplete ? 0.3 : 1,
          },
          popover: {
            label: todo.description,
            visibility: 'focus'
          },
        })),
      ];
    },
  },
}

</script>
<style lang="scss">

</style>