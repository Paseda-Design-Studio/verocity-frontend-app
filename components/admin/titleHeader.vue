<script setup lang="ts">
interface Props {
  type?: string;
  title?: string;
  user?: string;
  subtext?: string;
  showDivider?: boolean;
}

const props = defineProps<Props>()

const emit = defineEmits<{
  actionClick: []
}>();
</script>

<template>
  <section class="dashboard-header">
    <div class="flex justify-between items-start">
      <HeaderBox
        :type="type"
        :title="title ?? ''"
        :user="user"
        :subtext="subtext"
      />
      
      <!-- Action slot - allows parent to pass any component -->
      <div class="action-area">
        <slot name="action">
        </slot>
      </div>
    </div>
    
    <Divider v-if="showDivider" class="mt-4" />
  </section>
</template>

<style scoped>
.action-area {
  flex-shrink: 0;
}
</style>
