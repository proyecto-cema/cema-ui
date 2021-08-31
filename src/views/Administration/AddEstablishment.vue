<template>
  <div class="row text-center">
    <div class="offset-lg-2 col-12 col-lg-8">
      <form class="borderDiv" style="border-radius: 10px;margin-top:100px; background: #ffffff;" @submit.prevent="">
        <div class="header" >
          <h3 style="color:white">{{ edit ? "Editar Establecimiento" : "Registrar Establecimiento" }}</h3>
        </div>
          <div class="offset-1 col-10">
            <div class="row">
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>Nombre</label></div>
                <input
                    v-model.trim="establishment.name"
                    :class="[errorSave.name ? 'is-invalid' : '']"
                    class="form-control marginButton"
                    placeholder="Nombre" required
                    type="text"
                >
                <div v-if="errorSave.name" class="textError">
                  <span :class="is-invalid"></span> Ingrese el nombre del establecimiento
                </div>
              </div>
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>CUIG</label></div>
                <input
                    v-model.trim="establishment.cuig"
                    :readonly="edit"
                    :class="[errorSave.cuig ? 'is-invalid' : '']"
                    class="form-control marginButton"
                    placeholder="CUIG" required
                    type="text"
                >
                <div v-if="errorSave.cuig" class="textError">
                  <span :class="is-invalid"></span> Ingrese el CUIG del establecimiento
                </div>
              </div>
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>Ubicacion</label></div>
                <input
                    v-model.trim="establishment.location"
                    class="form-control marginButton"
                    placeholder="Ubicacion"
                    type="text"
                >
              </div>
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>Teléfono</label></div>
                <input
                    v-model.trim="establishment.phone"
                    class="form-control marginButton"
                    placeholder="Teléfono"
                    type="text"
                >
              </div>
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>Correo Electrónico</label></div>
                <input
                    v-model.trim="establishment.email"
                    class="form-control marginButton"
                    placeholder="Correo Electrónico"
                    type="text"
                >
              </div>
              <div class="col-12 col-md-6 marginSeccion">
                <div class="textLeft"><label>Propietario</label></div>
                <select id="sexo" v-model="establishment.ownerUserName" :class="[errorSave.owner ? 'is-invalid' : '']"
                        class="form-control invalid-arrow marginButton" required>
                  <option selected="selected" value="">Seleccionar</option>
                  <option v-for="owner in owners" :value="owner.userName" :key="owner.userName">{{owner.name+" "+owner.lastName }}</option>
                </select>
                <div v-if="errorSave.owner" class="textError">
                  <span class="is-invalid"></span> Seleccione el propietario
                </div>
              </div>
            </div>
          </div>
          <div class="col-12">
            <div class="col-lg-10 offset-lg-1 col-sm-10 offset-sm-1 col-10 offset-1 marginSeccion">
              <div v-if="error.type !== null" class="alert alert-danger alert-dismissible">
                {{ error.message }}
              </div>
              <div v-if="success !== null" class="alert alert-success alert-dismissible">
                {{ success }}
              </div>
            </div>
            <div class="row" style="margin-right: 0px;">
              <div class="col-lg-2 col-sm-4 col-4"
                   v-bind:class="this.edit?'offset-lg-6':'offset-lg-8 offset-sm-4 offset-4'">
                <button class="btn btn-dark text-white button-margin" data-bs-target="#CancelModal" data-bs-toggle="modal"
                        type="button">
                  Cancelar
                </button>
              </div>
              <div v-if=(this.edit) class="col-lg-2 col-sm-4 col-4">
                <div>
                  <button class="btn btn-danger text-white button-margin" data-bs-target="#DeleteModal" data-bs-toggle="modal"
                          type="button">
                    Eliminar
                  </button>
                </div>
              </div>
              <div class="col-lg-2 col-sm-4 col-4">
                <button class="btn btn-primary text-white button-margin" data-bs-target="#SaveModal" data-bs-toggle="modal"
                        type="button">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        
      </form>
    </div>
  </div>

  <confirmation-modal
      confirmation-message="¿Está seguro que desea cancelar la acción en curso?
       Se cerrará la ventana y se perderán todos los cambios."
      modal-id="CancelModal" title="Cancelar" @acceptModal="this.$router.push('/')"></confirmation-modal>
  <confirmation-modal
      confirmation-message="¿Confirma que desea guardar los datos del establecimineto?"
      modal-id="SaveModal" title="Guardar" @acceptModal="formSaveEstablishment()"></confirmation-modal>
  <confirmation-modal
      confirmation-message="¿Confirma que desea eliminar Establecimiento?"
      modal-id="DeleteModal" title="Eliminar" @acceptModal="formDeleteEstablishment()"></confirmation-modal>
  <confirmation-modal
      confirmation-message="El establecimiento buscado no se encuentra, ¿desea crear uno nuevo o volver al inicio?"
      modal-id="SearchModal" title="Establecimiento no encontrado"
      btn-accept="Nuevo" btn-reject="Inicio"
      @acceptModal="this.$router.push('/establecimiento/formulario')"
      @rejectModal="this.$router.push('/')"
  ></confirmation-modal>
</template>
<script>
import {mapActions, mapState} from "vuex";
import ConfirmationModal from "../../components/ConfirmationModal";
import { Modal } from 'bootstrap';


export default {
  name: "AddEstablishment",
  data() {
    return {
      success: null,
      edit: false,
      owners:[],
      errorSave: {
        name: false,
        cuig: false,
        owner: false
      },

    };
  },
  components:{
    ConfirmationModal
  },
  mounted() {
    this.searchOwners()
    this.cuig = this.$route.query.cuig;
    console.log("Owners:"+ this.owners);
    this.edit = !(this.cuig == null || this.cuig === "");
    
    if (this.edit){
      this.formRetrieveEstablishment()
    }else{
      this.clearEstablishmentData();
    }
  },
  computed: {
    ...mapState("establishment", ["establishment", "error","owner"]),
    
  },
  methods: {
    ...mapActions("establishment", ["getEstablishment", "saveEstablishment", "deleteEstablishment", "clearEstablishmentData","listOwners"]),

    successCall(message) {
      this.success = message;
      this.edit = false;
      this.clearEstablishmentData();
    },
    async formSaveEstablishment() {
      this.showModal = true
      this.errorSave = {};
      this.success = null;
      this.errorSave = {
        name: (this.establishment.name == null || this.establishment.name === ""),
        cuig: (this.establishment.cuig == null || this.establishment.ciug === ""),
        owner: (this.establishment.owner == null || this.establishment.owner === "")
      }
      if (this.errorSave.name || this.errorSave.cuig || this.errorSave.owner) {
        console.error(this.errorSave)
        return
      }
      let data = {
        edit: this.edit,
        establishment: this.establishment
      };
      this.saveEstablishment(data).then(
        () => {
          this.successCall("El Establecimiento se guardó correctamente");
        }
      );
    },
    async formRetrieveEstablishment() {
      this.errorSave = {};
      this.success = null;
      this.getEstablishment(this.cuig).then(
        () => {},
        (error) => {
          let modal = new Modal(document.getElementById('SearchModal'));
          modal.show()
          this.edit = false;
        }
      )
    },
   
    async formDeleteEstablishment() {
      this.errorSave = {};
      this.success = null;
      this.deleteEstablishment(this.cuig).then(
        () => {
          this.successCall("El Establecimiento se elimino correctamente");
        }
      );
    },
    async searchOwners() {
      this.owners=null;
      //Se busca todos los usuarios con el rol patron
      //Usuarios Rol patron son los dueños de los establecimientos
      this.listOwners('patron').then(
          (response) => {
            this.owners = response.data;
            console.log(response);
          }
      )
    }
  },
};

</script>
<style>
.TextCenterImage {
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.textLeft {
  text-align: left !important;
}

.marginButton {
  margin-top: 0 !important;
}

.marginSeccion {
  margin-bottom: 8px;
}

.borderDiv {
  border: solid;
  padding-left: 0;
  padding-right: 0;
}

.contenedor {
  position: relative;
  display: inline-block;
  text-align: center;
}

.textError {
  text-align: left !important;
  color: red;
  font-size: 14px;
}
.header{
  background-color:black;
  padding-bottom: 1px;margin-bottom: 5px;
  border-top-right-radius: 6px;
  border-top-left-radius: 6px;
}
</style>