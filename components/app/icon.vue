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
    const rawIcon =
      typeof imported === "string"
        ? imported
        : (imported as { default: string }).default;

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
    class="app-icon"
    :class="{ 
      fill: filled, 
      stroke: hasStroke && !filled,
      'w-4 h-4': true 
    }"
    v-html="icon"
  />
</template>

<style lang="scss" scoped>
.app-icon {
  line-height: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &.fill :deep(svg),
  &.fill :deep(svg *) {
    fill: currentColor !important;
    stroke: none !important;
  }

  &.stroke :deep(svg),
  &.stroke :deep(svg *) {
    stroke: currentColor !important;
    fill: none !important;
  }

  // Default behavior - inherit color
  :deep(svg) {
    width: 100%;
    height: 100%;
    color: inherit;
  }

  :deep(svg path),
  :deep(svg circle),
  :deep(svg rect),
  :deep(svg line),
  :deep(svg polyline),
  :deep(svg polygon) {
    color: inherit;
  }
}
</style>
