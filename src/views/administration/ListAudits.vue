<template>
  <div class="text-center">
    <div class="mt-2">
      <h3>Listado Auditoria</h3>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <caption>
          {{
            `Mostrando ${auditsLength} de ${auditsLength} ubicaciones`
          }}
        </caption>
        <thead>
          <tr v-if="auditsLength !== 0">
            <th scope="col">Fecha</th>
            <th scope="col">Usuario</th>
            <th scope="col">Rol</th>
            <th scope="col">Cuig</th>
            <th scope="col">Modulo</th>
          </tr>
          <tr v-else>
            <th scope="col">No se encontraron resultados.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="audit in audits" :key="audit.name">
            <td>{{ this.javaDateToMomentDate(audit.auditDate) }}</td>
            <td>{{ audit.username }}</td>
            <td>{{ audit.role }}</td>
            <td>{{ audit.establishmentCuig }}</td>
            <td>{{ audit.module }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-center">
      <div aria-label="Large button group" class="btn-group" role="group">
        <button
          :class="headers.currentPage <= 0 ? 'disabled' : ''"
          class="btn btn-outline-primary"
          type="button"
          @click="this.searchAuditPage(this.headers.currentPage - 1)"
        >
          Anterior
        </button>
        <button
          :class="headers.currentPage >= headers.totalPages - 1 ? 'disabled' : ''"
          class="btn btn-outline-primary"
          type="button"
          @click="this.searchAuditPage(this.headers.currentPage + 1)"
        >
          Siguiente
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { Modal } from 'bootstrap';

export default {
  name: 'ListAudits',
  data() {
    return {
      audits: [],
      auditsLength: 0,
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },

      timeout: false,
      delay: 250,
    };
  },
  mounted() {
    this.searchAudits();
  },
  methods: {
    ...mapActions('audit', ['listAudits']),
    ...mapActions(['showSuccess']),

    async searchAuditPage(page) {
      await this.searchAudits(page, 10);
    },
    async searchAudits(page = 0, size = 10) {
      this.audits = null;
      this.listAudits({ page: page, size: size }).then((response) => {
        this.audits = response.data;

        console.log(response);

        this.headers.totalPages = parseInt(response.headers['total-pages']);
        this.headers.currentPage = parseInt(response.headers['current-page']);
        this.headers.totalElements = parseInt(response.headers['total-elements']);
        this.auditsLength = this.audits != null ? this.audits.length : 0;
      });
    },
  },
};
</script>
<style></style>
