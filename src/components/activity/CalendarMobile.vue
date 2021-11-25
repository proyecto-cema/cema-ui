 

<template>
  <v-calendar
    :attributes='attributes'
    is-double-paned>
  </v-calendar>
</template>

<script>
import {mapActions} from "vuex";
import {ACTIVITIES_EXTRA_DATA} from "../../constants";


export default {
  data() {
    return {
      search: {name: null, type: ""},
      isMobile: true,
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
    this.searchActivitys();
  },
  methods:{
    ...mapActions("activity", ["listActivities"]),
    async clearSearchActivityData(){
      this.search.type="";
      this.search.name="";
      this.searchActivitys();
    },
    async searchActivitys() {
      this.attributesMobile=[]
      let type = "";
      if(!this.search.type){
        type = "activities"
      }else{
        console.log(this.search.type)
        type = ACTIVITIES_EXTRA_DATA[this.search.type].url;
      }
      if(this.search.name===undefined){
        this.search.name=null
      }

      var searchAct={name:this.search.name,type:type}
      
      this.listActivities(searchAct).then(
        (response) => {
          console.log(response);

          for(var i = 0;response.data.length>i ; i++)
          {
            
            let style = ACTIVITIES_EXTRA_DATA[response.data[i].type].style;
            let color = ACTIVITIES_EXTRA_DATA[response.data[i].type].color;
            this.activity={
              key: i,
              customData: {
                id: response.data[i].id,
                title: response.data[i].name,
                class: style ,
                color:color
              },
              dates: new Date(response.data[i].executionDate),
            }
            this.attributes.push(this.activity)
            
          }
        }
      )
    }
  },
  computed: {
    attributes() {
      return [
        // Today attribute
        {
          contentStyle: {
            fontWeight: '700',
            fontSize: '.9rem',
            class:"bg-danger"
            
          },
          dates: new Date(),
        },
        // Attributes for todos
        ...this.attributes.map(todo => ({
          dates: todo.dates,
          dot: {
            color: todo.customData.color,
            class:todo.customData.class,
            opacity: todo.isComplete ? 0.3 : 1,
          },
          popover: {
            label: todo.customData.title,
          },
        })),
      ];
    },
  },
};
</script>

 <style lang="postcss" scoped>
</style>