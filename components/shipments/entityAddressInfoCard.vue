<script setup lang="ts">
interface Props {
    title: string
    contactName: string
    address: string
    email?: string
    phone: string
}

const props = defineProps<Props>()
</script>

<template>
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <!-- Card Title -->
        <h4 class="text-sm font-semibold text-gray-900 mb-4">{{ title }}</h4>

        <!-- Contact Information -->
        <div class="space-y-3">
            <!-- Contact Name -->
            <div class="flex justify-between items-start">
                <span class="text-sm text-gray-600">Name:</span>
                <span class="text-sm font-medium text-gray-900 text-right">{{ contactName }}</span>
            </div>

            <!-- Address -->
            <div class="flex justify-between items-start">
                <span class="text-sm text-gray-600">Address:</span>
                <span class="text-sm font-medium text-gray-900 text-right max-w-[60%]">{{ address }}</span>
            </div>

            <!-- Email (if provided) -->
            <div v-if="email" class="flex justify-between items-start">
                <span class="text-sm text-gray-600">Email:</span>
                <span class="text-sm font-medium text-gray-900 text-right">{{ email }}</span>
            </div>

            <!-- Phone -->
            <div class="flex justify-between items-start">
                <span class="text-sm text-gray-600">Phone:</span>
                <span class="text-sm font-medium text-gray-900 text-right">{{ phone }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
