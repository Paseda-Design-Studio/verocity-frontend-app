<template>
    <div class="flex mt-4">
        <!-- Add Item Button -->
        <button 
            type="button" 
            @click="$emit('toggle')"
            :class="buttonClasses"
        >
            {{ buttonText }}
        </button>

        <!-- Cancel Button - Only show when form is open and there are existing items -->
        <button 
            v-if="showForm && hasExistingItems"
            type="button" 
            @click="$emit('cancel')"
            class="ml-3 font-semibold text-sm text-gray-600 hover:text-gray-800 hover:underline transition-colors duration-200"
        >
            Cancel
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    showForm: boolean
    isFormValid: boolean
    hasExistingItems?: boolean
}>()

defineEmits<{
    toggle: []
    cancel: []
}>()

const buttonText = computed(() => 
    props.showForm && props.isFormValid ? 'Add Item' : '+ Add Another Item'
)

const buttonClasses = computed(() => [
    'font-semibold text-sm flex items-center gap-2 transition-colors duration-200',
    props.showForm && props.isFormValid 
        ? 'bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-md' 
        : 'text-primary-600 hover:text-primary-700 hover:underline'
])
</script>
