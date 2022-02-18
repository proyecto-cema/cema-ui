<template>
  <div v-if="this.headers.totalPages > 1" class="d-flex justify-content-center">
    <div aria-label="Large button group" class="btn-group" role="group">
      <button
        :class="this.headers.currentPage <= 0 ? 'disabled' : ''"
        class="btn btn-outline-primary"
        type="button"
        @click="this.searchPage(this.headers.currentPage - 1)"
      >
        Anterior
      </button>
      <button
        v-for="i in this.headers.totalPages"
        :key="i"
        :class="this.headers.currentPage === i - 1 ? 'btn-primary' : 'btn-outline-primary'"
        class="btn"
        type="button"
        @click="this.searchPage(i - 1)"
      >
        {{ i }}
      </button>
      <button
        :class="this.headers.currentPage >= this.headers.totalPages - 1 ? 'disabled' : ''"
        class="btn btn-outline-primary"
        type="button"
        @click="this.searchPage(this.headers.currentPage + 1)"
      >
        Siguiente
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ListPagination',
  emits: ['callChangePage'],
  props: {
    headers: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    searchPage(page) {
      this.$emit('callChangePage', page);
    },
  },
};
</script>

<style scoped></style>
