<template>
  <div
    class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium border"
    :class="[
      statusColor,
      statusTextColor,
      statusBorderColor,
      `bg-${status.toLowerCase()}-100`,
      `text-${status.toLowerCase()}-600`,
    ]"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

interface Props {
  status: string | any;
}

const props = defineProps<Props>();

const statusColor = computed(() => {
  switch (props.status) {
    case "Delivered":
      return "bg-green-100";
    case "In Transit":
      return "bg-yellow-100";
    case "Out for delivery":
      return "bg-blue-100";
    case "Pending":
      return "bg-gray-100";
    default:
      return "";
  }
});

const statusTextColor = computed(() => {
  switch (props.status) {
    case "Delivered":
      return "text-green-600";
    case "In Transit":
      return "text-yellow-600";
    case "Out for delivery":
      return "text-blue-600";
    case "Pending":
      return "text-gray-900";
    default:
      return "";
  }
});

const statusBorderColor = computed(() => {
  switch (props.status) {
    case "Delivered":
      return "border-green-600";
    case "In Transit":
      return "border-yellow-600";
    case "Out for delivery":
      return "border-blue-600";
    case "Pending":
      return "border-gray-200";
    default:
      return "";
  }
});
</script>
