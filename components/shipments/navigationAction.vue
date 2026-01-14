<template>
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6">
        <!-- Cancel Button - Left -->
        <div class="order-2 sm:order-1">
            <Button type="button" @click="$emit('cancel')" outlined :pt="{
                root: {
                    class: 'py-3 px-6 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 rounded-md transition-colors duration-200'
                }
            }">
                Cancel
            </Button>
        </div>

        <!-- Navigation Buttons - Right -->
        <div class="flex gap-3 order-1 sm:order-2">
            <Button severity="secondary" type="button" @click="$emit('previous')" :disabled="!hasPreviousStep" :pt="{
                root: {
                    class: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:outline-none py-3 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
                }
            }">
                Previous
            </Button>

            <Button type="button" @click="$emit('next')" :disabled="!canProceed || loading" :loading="loading" :pt="{
                root: {
                    class: 'bg-primary-600 text-white hover:bg-primary-700 focus:outline-none py-3 px-6 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
                }
            }">
                {{ nextStepTitle }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
    defineProps<{
        hasPreviousStep?: boolean
        canProceed: boolean
        nextStepTitle: string
        loading?: boolean
    }>()

    defineEmits<{
        cancel: []
        previous: []
        next: []
    }>()
</script>
