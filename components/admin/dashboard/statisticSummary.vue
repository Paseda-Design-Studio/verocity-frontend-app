<script setup lang="ts">
interface StatisticItem {
  title: string;
  count: number;
  subtext: string;
}

interface Props {
  statistics?: StatisticItem[];
}

const props = withDefaults(defineProps<Props>(), {
  statistics: () => []
});
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full">
    <StatisticsBox
      v-for="stat in statistics"
      :key="stat.title"
      :title="stat.title"
      :count="stat.count"
      :subtext="stat.subtext"
      class="min-w-0"
    />
  </div>
</template>
