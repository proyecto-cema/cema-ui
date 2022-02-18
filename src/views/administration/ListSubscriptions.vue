<template>
  <div class="text-center">
    <div class="d-grid gap-2 d-md-flex justify-content-md-end mb-2 mt-3">
      <button class="btn btn-secondary text-white" type="button" v-on:click="this.openMyEstablishmentModal()">
        Ver datos de mi Establecimiento
      </button>
    </div>
    <div class="mt-2">
      <h3>Listado de Suscripciones</h3>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <caption>
          {{
            `Mostrando ${this.subscriptionsLength} de ${this.subscriptionsLength} suscripciones`
          }}
        </caption>
        <thead>
          <tr v-if="this.subscriptionsLength !== 0">
            <th scope="col">Nombre</th>
            <th scope="col">Duración(dias)</th>
            <th scope="col">Precio</th>
            <th scope="col">Fecha Inicio</th>
            <th scope="col">Fecha Fin</th>
          </tr>
          <tr v-else>
            <th scope="col">No se encontraron resultados.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(subscription, index) in this.subscriptions" :key="index">
            <td>{{ subscription.subscriptionType.name }}</td>
            <td>{{ subscription.subscriptionType.duration }}</td>
            <td>{{ subscription.subscriptionType.price }}</td>
            <td>{{ subscription.startingDate }}</td>
            <td>{{ subscription.endingDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center">
      <list-pagination @call-change-page="this.searchSubscriptions" :headers="this.headers"></list-pagination>
    </div>
  </div>
  <establishment-modal modalId="establishmentModal"></establishment-modal>
</template>
<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';

import EstablishmentModal from '../../components/administration/EstablishmentModal';
import ListPagination from '../../components/ListPagination';

let LIST_SIZE = 10;

export default {
  name: 'ListSubscriptions',
  components: { ListPagination, EstablishmentModal },
  data() {
    return {
      subscriptions: [],
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
    };
  },
  mounted() {
    this.establishmentModal = new Modal(document.getElementById('establishmentModal'));
    this.searchSubscriptions();
    console.log(this.$route.params);
    if (this.$route.params.modal) {
      this.openMyEstablishmentModal();
    }
  },
  computed: {
    subscriptionsLength() {
      return this.subscriptions != null ? this.subscriptions.length : 0;
    },
  },
  methods: {
    ...mapActions('establishment', ['listSubscriptions', 'setupEditMyEstablishment']),
    async searchSubscriptions(page = 0) {
      this.subscriptions = null;
      this.listSubscriptions({ page: page, size: LIST_SIZE }).then((response) => {
        this.subscriptions = response.data;
        //this.headers = this.parsePageHeaders(response.headers);
      });
    },
    openMyEstablishmentModal() {
      this.setupEditMyEstablishment();
      this.establishmentModal.show();
    },
  },
};
</script>
<style></style>
