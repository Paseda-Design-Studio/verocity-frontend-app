<template>
  <section
    class="bg-primary-600 relative flex items-center justify-center h-[40vh] md:top-16"
  >
    <div class="container relative flex items-center justify-center z-20">
      <div
        class="flex items-center flex-col justify-center max-w-6xl mx-auto text-center"
      >
        <h2
          class="text-2xl font-semibold tracking-tight text-white sm:text-4xl"
        >
          {{ title }}
        </h2>
        <div class="flex">
          <p class="text-x leading-8 font-medium text-white max-w-md" >
            {{ description }}
          </p>
        </div>
      </div>
    </div>
    <div
      class="absolute inset-0 bg bg-center z-10"
      :style="{ backgroundImage: `url(${backgroundImage})` }"
    ></div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  description: string;
  backgroundImage: string;
}>();
</script>

<style scoped></style>
