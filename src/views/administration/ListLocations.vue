<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button"
              v-on:click="openAddLocationModal(null, null)">
        Nueva ubicación
      </button>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <caption>Mostrando {{ locationsLength }} de {{ locationsLength }}
          ubicaciones
        </caption>
        <thead>
        <tr v-if="locationsLength !== 0">
          <th scope="col">Predeterminada</th>
          <th scope="col">Nombre</th>
          <th scope="col">Descripción</th>
          <th scope="col">Tamaño</th>
          <th class="text-end" scope="col">Acciones</th>
        </tr>
        <tr v-else>
          <th scope="col">No se encontraron resultados.</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(location, index) in locations" :key="location.name">
          <td>
            <font-awesome-icon size="lg"
                :icon="location.isDefault? ['far', 'check-square']:['far', 'square']"
                @click.stop="changeDefaultLocation(index)">
            </font-awesome-icon>
          </td>
          <td>{{ location.name }}</td>
          <td>{{ location.description }}</td>
          <td>{{ location.size }}</td>
          <td class="text-end">
            <font-awesome-icon
                class="me-2"
                icon="edit"
                @click.stop="openAddLocationModal(index, location)">
            </font-awesome-icon>
            <font-awesome-icon
                icon="trash"
                @click.stop="formDeleteLocation(index, location.name)">
            </font-awesome-icon>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
  <confirmation-modal
      :confirmation-message="'¿Confirma que desea eliminar la ubicacion '
      + deleted['name'] + '?'"
      modal-id="deleteModal" title="Eliminar"
      @acceptModal="modalDelete(); deleteModal.hide()" @rejectModal="deleteModal.hide(); deleted = {}"></confirmation-modal>
  <location-modal modalId="addLocationModal" @deleteModal="deleteLocationForm" @createdNew="addLocationToList"></location-modal>
</template>
<script>
import {mapActions} from "vuex";
import {Modal} from "bootstrap";
import ConfirmationModal from "../../components/ConfirmationModal";
import LocationModal from "../../components/administration/LocationModal";

export default {
  name: "ListLocations",
  data() {
    return {
      locations: [],
      locationsLength: 0,
      deleted: {},
      deleteModal: null,
      addLocationModal: null,
      timeout: false,
      delay: 250
    };
  },
  components: { ConfirmationModal, LocationModal },
  mounted() {
    this.addLocationModal = new Modal(document.getElementById('addLocationModal'));
    this.deleteModal = new Modal(document.getElementById('deleteModal'));
    this.searchLocations();
  },
  methods: {
    ...mapActions("location", ["listLocations", "setupEditLocation", "deleteLocation", "makeDefaultLocation"]),
    ...mapActions(["showSuccess"]),
    setIndexForName(index, name){
      this.deleted = {
        name: name,
        index: index
      };
    },
    formDeleteLocation(index, name) {
      this.setIndexForName(index, name);
      this.deleteModal.show()
    },
    openAddLocationModal(index, location){
      if (location){
        this.setIndexForName(index, location.name);
        this.setupEditLocation(location);
      }
      this.addLocationModal.show();
    },
    deleteLocationForm(name){
      if (!this.deleted){
        this.setIndexForName(this.locations.length, name);
      }
      this.modalDelete();
    },
    addLocationToList({location, edit}){
      console.log(location, edit);
      let helperDeleted = {...this.deleted};
      if(edit) {
        this.locations.splice(helperDeleted.index, 1);
        this.deleted = {};
      }
      this.locations.push(location);
    },
    changeDefaultLocation(index){
      let location = this.locations[index];
      if (location.isDefault){
        console.log("Already default")
        return
      }
      this.makeDefaultLocation(location).then(
          () => {
            for (let i = 0; i < this.locations; i++) {
              if (this.locations[i].isDefault){
                this.locations[i].isDefault = false;
                break;
              }
            }
            this.locations[index].isDefault = true;
          }
      );
    },
    async modalDelete() {
      let helperDeleted = {...this.deleted};
      let toDelete = this.locations[helperDeleted.index];
      console.log(`Deleting location ${ helperDeleted.name }`)
      this.deleteLocation(toDelete).then(
          () => {
            this.locations.splice(helperDeleted.index, 1);
            this.showSuccess(`La ubicacion ${helperDeleted.name} se eliminó correctamente`);
            this.deleted = {};
          }
      );
    },
    async searchLocations(){
      this.locations = null;
      this.listLocations().then(
        (response) => {
          this.locations = response.data;
          console.log(response);
          this.locationsLength = this.locations != null ? this.locations.length:0
        }
      )
    },
  },
};
</script>
<style>
</style>