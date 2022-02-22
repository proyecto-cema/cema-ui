<template>
  <div class="text-center">
    <div class="mt-2">
      <h3>Listado de Auditoria</h3>
    </div>
    <div class="col-12 table-responsive">
      <table class="table">
        <caption>
          {{
            `Mostrando ${auditsLength} de ${this.headers.totalPages} registros`
          }}
        </caption>
        <thead>
          <tr v-if="auditsLength !== 0">
            <th scope="col">Fecha/Hora de operación</th>
            <th scope="col">Usuario</th>
            <th scope="col">Rol</th>
            <th scope="col">CUIG</th>
            <th scope="col">Módulo</th>
          </tr>
          <tr v-else>
            <th scope="col">No se encontraron resultados.</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="audit in audits" :key="audit.name">
            <td>{{ this.javaDateToMomentDate(audit.auditDate, 'HH:MM - DD/MM/YYYY', false, true) }}</td>
            <td>{{ audit.username }}</td>
            <td>{{ audit.role }}</td>
            <td>{{ audit.establishmentCuig }}</td>
            <td>{{ audit.module }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="headers.totalPages > 1" class="d-flex justify-content-center">
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
          :class="headers.currentPage <= 0 ? 'disabled' : ''"
          class="btn btn-outline-primary"
          type="button"
          @click="this.searchAuditPage(this.headers.currentPage - 200)"
        >
          -200
        </button>
        <button
          v-for="i in this.pageFor"
          :key="i"
          :class="
            headers.currentPage === pageHelper(i) - 1
              ? 'btn-primary'
              : pageHelper(i) - 1 >= headers.totalPages
              ? 'disabled'
              : 'btn-outline-primary'
          "
          class="btn"
          type="button"
          @click="this.searchAuditPage(pageHelper(i) - 1)"
        >
          {{ pageHelper(i) }}
        </button>
        <button
          :class="headers.currentPage >= headers.totalPages - 1 ? 'disabled' : ''"
          class="btn btn-outline-primary"
          type="button"
          @click="this.searchAuditPage(this.headers.currentPage + 200)"
        >
          +200
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

export default {
  name: 'ListAudits',
  data() {
    return {
      audits: [],
      auditsLength: 0,
      headers: { totalPages: 0, currentPage: 0, totalElements: 0 },
      displace: 2,
      timeout: false,
      delay: 250,
    };
  },
  mounted() {
    this.searchAudits();
  },
  computed: {
    pageFor() {
      let displace = this.displace * 2 + 1;
      return this.headers.totalPages > displace ? displace : this.headers.totalPages;
    },
  },
  methods: {
    ...mapActions('audit', ['listAudits']),
    ...mapActions(['showSuccess']),
    pageHelper(i) {
      let page =
        this.headers.currentPage <= this.displace
          ? this.headers.currentPage - this.headers.currentPage
          : this.headers.currentPage - this.displace;
      return page + i;
    },
    async searchAuditPage(page) {
      if (page < 0) {
        page = 0;
      } else if (page > this.headers.totalPages) {
        page = this.headers.totalPages - 1;
      }
      await this.searchAudits(page, 15);
    },
    async searchAudits(page = 0, size = 15) {
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
