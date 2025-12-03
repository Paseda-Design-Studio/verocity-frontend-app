<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number, Boolean],
    required: true,
  },
  modelValue: {
    type: [String, Number, Boolean],
    required: true,
  },
  label: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue"]);

const handleChange = () => {
  console.log("Radio changed, emitting value:", props.value);
  console.log("Current modelValue:", props.modelValue);
  emit("update:modelValue", props.value);
};

// Add a watcher to see if props change
watch(
  () => props.modelValue,
  (newVal: any) => {
    console.log("modelValue changed to:", newVal);
  }
);
</script>
<template>
  <div class="flex items-center">
    <div class="relative inline-flex align-bottom cursor-pointer select-none">
      <input
        type="radio"
        :id="id"
        :name="name"
        :value="value"
        :checked="modelValue === value"
        :disabled="disabled"
        @change="handleChange"
        class="absolute opacity-0 w-full h-full cursor-pointer z-10"
      />
      <div
        class="flex justify-center items-center w-4 h-4 border rounded-full transition duration-200 ease-in-out"
        :class="[
          modelValue === value
            ? 'border-primary-600 bg-white'
            : 'border-gray-300 bg-white',
          disabled ? 'opacity-60 cursor-default' : 'hover:border-primary-600',
        ]"
      >
        <div
          v-if="modelValue === value"
          class="w-3 h-3 rounded-full bg-primary-600 border border-white"
        ></div>
      </div>
    </div>
    <label :for="id" class="text-sm ml-2 cursor-pointer text-gray-400">{{ label }}</label>
  </div>
</template>

<style scoped>
input[type="radio"]:focus-visible + div {
  @apply ring-2 ring-primary-400 ring-opacity-20;
}
</style>
