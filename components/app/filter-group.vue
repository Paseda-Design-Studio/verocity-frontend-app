<template>
  <div class="flex flex-wrap items-center gap-2 md:gap-3">
    <span v-if="showFilterLabel" class="text-xs md:text-sm font-medium text-gray-700 hidden sm:inline">
      {{ filterLabel }}
    </span>

    <!-- Dynamic Filters -->
    <AppFilterSelect v-for="filter in filters" :key="filter.key"
      :modelValue="filterValues[filter.key] ?? filter.defaultValue ?? defaultValue"
      @update:modelValue="val => handleFilterChange(filter.key, val)" :label="filter.label" :options="filter.options"
      :min-width="filter.minWidth || 'md'" :disabled="filter.disabled" />

    <!-- Clear Filters Button -->
    <button v-if="showClearButton && hasActiveFilters" @click="clearAllFilters"
      class="text-xs md:text-sm text-gray-500 hover:text-gray-700 underline transition-colors duration-200 px-2 py-1"
      :class="clearButtonClass">
      {{ clearButtonText }}
    </button>

    <!-- Active Filters Count -->
    <span v-if="showActiveCount && activeFiltersCount > 0"
      class="text-xs bg-primary-100 text-primary-800 px-2 py-1 rounded-full font-medium" :class="activeCountClass">
      {{ activeFiltersCount }} active
    </span>
  </div>
</template>

<script setup lang="ts">
  interface FilterOption {
    name: string;
    key: string;
  }

  interface FilterConfig {
    key: string;
    label: string;
    options: FilterOption[];
    defaultValue?: string;
    minWidth?: 'sm' | 'md' | 'lg' | 'xl';
    disabled?: boolean;
  }

  interface Props {
    filters: FilterConfig[];
    modelValue?: Record<string, string>;
    showFilterLabel?: boolean;
    filterLabel?: string;
    showClearButton?: boolean;
    clearButtonText?: string;
    clearButtonClass?: string;
    showActiveCount?: boolean;
    activeCountClass?: string;
    defaultValue?: string;
  }

  interface Emits {
    (e: 'update:modelValue', value: Record<string, string>): void;
    (e: 'filter-change', key: string, value: string): void;
    (e: 'clear-filters'): void;
  }

  const props = withDefaults(defineProps<Props>(), {
    showFilterLabel: true,
    filterLabel: 'Filter',
    showClearButton: true,
    clearButtonText: 'Clear all',
    clearButtonClass: '',
    showActiveCount: true,
    activeCountClass: '',
    defaultValue: 'all'
  });

  const emit = defineEmits<Emits>();

  // Initialize filter values
  const filterValues = ref<Record<string, string>>({});

  // Initialize filter values on mount
  onMounted(() => {
    const initialValues: Record<string, string> = {};

    props.filters.forEach(filter => {
      initialValues[filter.key] =
        props.modelValue?.[filter.key] ||
        filter.defaultValue ||
        props.defaultValue;
    });

    filterValues.value = initialValues;
    emit('update:modelValue', filterValues.value);
  });

  // Watch for external changes to modelValue
  watch(() => props.modelValue, (newValue) => {
    if (newValue && Object.keys(newValue).length > 0) {
      filterValues.value = { ...newValue };
    }
  }, { deep: true });

  // Computed properties
  const hasActiveFilters = computed(() => {
    return Object.values(filterValues.value).some(value => value !== props.defaultValue);
  });

  const activeFiltersCount = computed(() => {
    return Object.values(filterValues.value).filter(value => value !== props.defaultValue).length;
  });

  // Methods
  const handleFilterChange = (key: string, value: string) => {
    filterValues.value[key] = value;
    emit('update:modelValue', filterValues.value);
    emit('filter-change', key, value);
  };

  const clearAllFilters = () => {
    const clearedValues: Record<string, string> = {};

    props.filters.forEach(filter => {
      clearedValues[filter.key] = filter.defaultValue || props.defaultValue;
    });

    filterValues.value = clearedValues;
    emit('update:modelValue', filterValues.value);
    emit('clear-filters');
  };

  // Expose methods for parent component
  defineExpose({
    clearAllFilters,
    filterValues: readonly(filterValues)
  });
</script>
