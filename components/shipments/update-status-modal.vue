<script setup lang="ts">
    interface StatusOption {
        name: string;
        key: string;
        color: string;
        icon: string;
    }

    interface Props {
        visible: boolean;
        title?: string;
        currentStatus?: string;
        loading?: boolean;
    }

    interface Emits {
        (e: 'update:visible', value: boolean): void;
        (e: 'close'): void;
        (e: 'update-status', status: string): void;
    }

    const props = withDefaults(defineProps<Props>(), {
        title: 'Update Status',
        currentStatus: 'pending',
        loading: false
    });

    const emit = defineEmits<Emits>();

    // Status options
    const statusOptions: StatusOption[] = [
        { name: 'Pending', key: 'pending', color: 'bg-yellow-500', icon: 'clock' },
        { name: 'In Transit', key: 'in-transit', color: 'bg-blue-500', icon: 'truck' },
        { name: 'Out for Delivery', key: 'out-for-delivery', color: 'bg-orange-500', icon: 'map-pin' },
        { name: 'Delivered', key: 'delivered', color: 'bg-green-500', icon: 'check-circle' },
        { name: 'On Hold', key: 'on-hold', color: 'bg-gray-500', icon: 'pause-circle' },
        { name: 'Cancelled', key: 'cancelled', color: 'bg-red-500', icon: 'x-circle' }
    ];

    const selectedStatus = ref(props.currentStatus);
    const isUpdating = ref(false);

    watch(() => props.currentStatus, (newStatus) => {
        selectedStatus.value = newStatus;
    });

    const handleClose = () => {
        if (!isUpdating.value) {
            emit('close');
            emit('update:visible', false);
        }
    };

    const handleUpdateStatus = async () => {
        if (selectedStatus.value === props.currentStatus || isUpdating.value) {
            return;
        }

        isUpdating.value = true;

        try {
            emit('update-status', selectedStatus.value);
            await new Promise(resolve => setTimeout(resolve, 1000));
            handleClose();
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            isUpdating.value = false;
        }
    };

    const hasStatusChanged = computed(() => {
        return selectedStatus.value !== props.currentStatus;
    });

    const getCurrentStatusOption = (statusKey: string) => {
        return statusOptions.find(option => option.key === statusKey);
    };

    // Get available options for dropdown
    const availableOptions = computed(() => {
        return statusOptions.map(option => ({
            ...option,
            disabled: option.key === props.currentStatus
        }));
    });
</script>

<template>
    <AppModalWrapper :visible="visible" @update:visible="emit('update:visible', $event)" @close="handleClose" width="sm"
        :closable="!isUpdating" :show-header="true" :show-footer="true" header-class="border-b border-gray-100 pb-2"
        footer-class="border-t border-gray-100 bg-gray-50">
        <!-- Header -->
        <template #header>
            <div class="flex items-center justify-between">
                <h3 class="text-base font-semibold text-gray-900">{{ title }}</h3>
                <button v-if="!isUpdating" @click="handleClose"
                    class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded hover:bg-gray-100 flex items-center justify-center">
                    <AppIcon name="close" class="w-5 h-5 text-gray-400" filled />
                </button>
            </div>
        </template>

        <!-- Content -->
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                <AppDropdown>
                    <template #trigger>
                        <div class="flex items-center gap-2 px-3 py-2 border rounded cursor-pointer bg-white w-full">
                            <div
                                :class="['w-2 h-2 rounded-full', getCurrentStatusOption(selectedStatus)?.color || 'bg-gray-400']">
                            </div>
                            <span class="text-sm">
                                {{ getCurrentStatusOption(selectedStatus)?.name || 'Select new status' }}
                            </span>
                            <AppIcon name="chevron-down" class="ml-auto text-gray-400" />
                        </div>
                    </template>
                    <li v-for="option in availableOptions" :key="option.key" :class="[
                        'flex items-center gap-2 px-3 py-2 cursor-pointer',
                        option.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                    ]" @click="!option.disabled && (selectedStatus = option.key)">
                        <div :class="['w-2 h-2 rounded-full', option.color]"></div>
                        <span class="text-sm">{{ option.name }}</span>
                        <span v-if="option.key === currentStatus"
                            class="text-xs text-blue-600 font-medium">(Current)</span>
                        <input type="checkbox" class="ml-auto accent-primary-600"
                            :checked="selectedStatus === option.key" :disabled="option.disabled"
                            @change.stop="selectedStatus = option.key" tabindex="-1"
                            :aria-label="`Select status ${option.name}`" />
                    </li>
                </AppDropdown>
            </div>
        </div>

        <!-- Footer -->
        <template #footer>
            <div class="flex justify-end gap-3">
                <button @click="handleClose" :disabled="isUpdating"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    Cancel
                </button>

                <button @click="handleUpdateStatus" :disabled="!hasStatusChanged || isUpdating"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    <div v-if="isUpdating"
                        class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>{{ isUpdating ? 'Updating...' : 'Update Status' }}</span>
                </button>
            </div>
        </template>
    </AppModalWrapper>
</template>

<style scoped>

    /* PrimeVue Dropdown Custom Styling */
    :deep(.status-dropdown .p-dropdown) {
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        transition: all 0.2s ease;
        background: white;
    }

    :deep(.status-dropdown .p-dropdown:not(.p-disabled):hover) {
        border-color: #9ca3af;
    }

    :deep(.status-dropdown .p-dropdown:not(.p-disabled).p-focus) {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
    }

    :deep(.status-dropdown .p-dropdown .p-dropdown-label) {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        color: #374151;
        line-height: 1.25rem;
    }

    :deep(.status-dropdown .p-dropdown .p-dropdown-trigger) {
        width: 2rem;
        color: #6b7280;
    }

    /* Dropdown panel with higher z-index to appear above modal */
    :global(.p-dropdown-panel) {
        z-index: 10001 !important;
        border: 1px solid #d1d5db !important;
        border-radius: 0.5rem !important;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        margin-top: 0.25rem !important;
    }

    :global(.p-dropdown-items) {
        padding: 0.25rem !important;
    }

    :global(.p-dropdown-item) {
        padding: 0.5rem 0.75rem !important;
        border-radius: 0.375rem !important;
        font-size: 0.875rem !important;
        transition: all 0.15s ease !important;
        margin: 0.125rem 0 !important;
    }

    :global(.p-dropdown-item:not(.p-highlight):not(.p-disabled):hover) {
        background-color: #f3f4f6 !important;
        color: #374151 !important;
    }

    :global(.p-dropdown-item.p-highlight) {
        background-color: #3b82f6 !important;
        color: white !important;
    }

    :global(.p-dropdown-item.p-disabled) {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
    }

    /* Disabled state for entire dropdown */
    :deep(.status-dropdown.opacity-50 .p-dropdown) {
        cursor: not-allowed;
        background-color: #f9fafb;
    }

    /* Button hover effects */
    button:hover:not(:disabled) {
        transform: translateY(-1px);
    }

    /* Loading spinner animation */
    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .animate-spin {
        animation: spin 1s linear infinite;
    }

    /* Focus styles for accessibility */
    :deep(.status-dropdown .p-dropdown:focus-within) {
        outline: none;
    }

    /* Custom scrollbar for dropdown items */
    :global(.p-dropdown-items) {
        scrollbar-width: thin !important;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent !important;
    }

    :global(.p-dropdown-items::-webkit-scrollbar) {
        width: 4px !important;
    }

    :global(.p-dropdown-items::-webkit-scrollbar-track) {
        background: transparent !important;
    }

    :global(.p-dropdown-items::-webkit-scrollbar-thumb) {
        background-color: rgba(156, 163, 175, 0.5) !important;
        border-radius: 2px !important;
    }
</style>
