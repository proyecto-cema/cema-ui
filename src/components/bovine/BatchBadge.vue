<template>
  <span
    v-if="badgeType === 0"
    class="btn badge me-1 rounded-pill"
    :class="condition && mouseOver ? 'bg-secondary' : 'bg-primary'"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
  >
    {{ badgeContent }}
  </span>
  <span
    v-else
    class="btn badge me-1 rounded-pill border border-primary text-black"
    @mouseover="mouseOver = true"
    @mouseleave="mouseOver = false"
  >
    {{ badgeContent }}
    <font-awesome-icon
      v-show="condition && mouseOver"
      :class="badgeContent.length > 0 ? 'ms-1' : ''"
      icon="times"
    ></font-awesome-icon>
  </span>
</template>

<script>
export default {
  name: 'BatchBadge',
  data() {
    return { mouseOver: false };
  },
  props: {
    badgeContent: {
      required: true,
      type: String,
    },
    badgeType: {
      type: Number,
      default: 1,
    },
    condition: {
      default: true,
    },
  },
};
</script>

<style scoped></style>
