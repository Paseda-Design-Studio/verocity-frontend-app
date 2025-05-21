<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    name: string;
    filled?: boolean;
  }>(),
  { filled: false }
);

const hasStroke = ref(false);
const icon = ref("");

const fetchIcon = async () => {
  try {
    const iconsImport = import.meta.glob("../../assets/icons/**/**.svg", {
      query: "?raw",
      eager: false,
    });

    const imported = await iconsImport[
      `../../assets/icons/${props.name}.svg`
    ]();

    // Handle both string and object with default property
    const rawIcon = typeof imported === "string" ? imported : imported.default;

    if (rawIcon && typeof rawIcon === "string" && rawIcon.includes("stroke")) {
      hasStroke.value = true;
    }

    icon.value = rawIcon || "";
  } catch (error) {
    console.error(`Error loading icon "${props.name}":`, error);
    throw createError({
      statusCode: 414,
      statusMessage: `Icon "${props.name}" not found`,
    });
  }
};

// Replace top-level await with onMounted lifecycle hook
onMounted(() => {
  fetchIcon();
});

// Watch for changes to props.name
watch(
  () => props.name,
  () => {
    fetchIcon();
  },
  { immediate: true }
);
</script>

<template>
  <span
    class="app-icon w-4 h-4"
    :class="{ fill: filled, stroke: hasStroke && !filled }"
    v-html="icon"
  />
</template>

<style lang="scss" scoped>
.app-icon {
  line-height: 0;

  &.fill * {
    fill: currentColor !important;
  }

  &.stroke * {
    stroke: currentColor !important;
  }
}
</style>
