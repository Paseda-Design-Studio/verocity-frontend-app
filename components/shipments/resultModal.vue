<script setup lang="ts">
    interface Props {
        visible: boolean
        isSuccess: boolean
        title?: string
        message?: string
        buttonText?: string
        showDetails?: boolean
        details?: Record<string, any>
        detailsConfig?: Array<{
            key: string
            label: string
            format?: 'text' | 'currency' | 'date' | 'badge'
        }>
    }

    const props = withDefaults(defineProps<Props>(), {
        title: '',
        message: '',
        buttonText: '',
        showDetails: false,
        details: () => ({}),
        detailsConfig: () => []
    })

    const emit = defineEmits<{
        'update:visible': [value: boolean]
        'continue': []
        'close': []
    }>()

    // Computed values
    const modalTitle = computed(() => {
        return props.title || (props.isSuccess ? 'Success!' : 'Error!')
    })

    const defaultMessage = computed(() => {
        if (props.isSuccess) {
            return 'Operation completed successfully.'
        } else {
            return 'There was an issue processing your request. Please try again.'
        }
    })

    const displayMessage = computed(() => {
        return props.message || defaultMessage.value
    })

    const iconName = computed(() => {
        return props.isSuccess ? 'check' : 'x-circle'
    })

    const iconColor = computed(() => {
        return props.isSuccess ? 'text-green-500' : 'text-red-500'
    })

    const iconBgColor = computed(() => {
        return props.isSuccess ? 'bg-green-50' : 'bg-red-50'
    })

    const buttonTextComputed = computed(() => {
        return props.buttonText || (props.isSuccess ? 'Continue' : 'Try Again')
    })

    // Animation control
    const showIcon = ref(false)

    const handleContinue = () => {
        emit('continue')
        emit('update:visible', false)
    }

    const handleClose = () => {
        emit('close')
        emit('update:visible', false)
    }

    // Watch for modal opening to trigger icon animation
    watch(() => props.visible, (newValue) => {
        if (newValue) {
            showIcon.value = false
            setTimeout(() => {
                showIcon.value = true
            }, 200)
        } else {
            showIcon.value = false
        }
    })

    // Format detail values
    const formatDetailValue = (value: any, format: string = 'text') => {
        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(value)
            case 'date':
                return new Date(value).toLocaleDateString()
            case 'badge':
                return value
            default:
                return value
        }
    }
</script>

<template>
    <AppModalWrapper :visible="visible" @update:visible="emit('update:visible', $event)" @close="handleClose" width="md"
        :closable="false">

        <!-- Content -->
        <div class="text-center p-6">
            <!-- Animated Icon Avatar -->
            <div class="flex justify-center mb-4">
                <div class="relative inline-block">
                    <!-- Background Circle -->
                    <div :class="[
                        'w-28 h-28 rounded-full flex items-center justify-center shadow-lg relative z-10',
                        iconBgColor,
                        'ring-4',
                        isSuccess ? 'ring-green-100' : 'ring-red-100'
                    ]">
                        <!-- Animated Icon -->
                        <div :class="[
                            'w-16 h-16 flex items-center justify-center transition-all duration-700 transform',
                            showIcon ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 rotate-180'
                        ]">
                            <AppIcon :name="iconName" :class="[
                                'w-full h-full',
                                iconColor
                            ]" />
                        </div>
                    </div>

                    <!-- Success Animation Rings -->
                    <div v-if="isSuccess && showIcon"
                        class="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-60 z-0">
                    </div>
                </div>
            </div>

            <!-- Title -->
            <h2 :class="[
                'text-xl font-bold mb-3',
                isSuccess ? 'text-gray-900' : 'text-gray-900'
            ]">
                {{ modalTitle }}
            </h2>

            <!-- Message -->
            <p class="text-gray-600 mb-5 leading-relaxed text-sm">
                {{ displayMessage }}
            </p>

            <!-- Details Card -->
            <div v-if="showDetails && detailsConfig.length > 0"
                class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 mb-5 border border-gray-200">
                <div class="space-y-2">
                    <div v-for="config in detailsConfig" :key="config.key" class="flex justify-between items-center">
                        <span class="text-xs text-gray-600 font-medium">{{ config.label }}:</span>
                        <span v-if="config.format === 'badge'"
                            class="text-xs font-mono font-bold text-primary bg-primary-50 px-2 py-1 rounded">
                            {{ details[config.key] }}
                        </span>
                        <span v-else class="text-xs font-semibold text-gray-900">
                            {{ formatDetailValue(details[config.key], config.format) }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Custom Details Slot -->
            <slot name="details" />

            <!-- Action Buttons -->
            <div class="flex justify-center gap-3">
                <slot name="actions" :handleContinue="handleContinue" :handleClose="handleClose">
                    <button @click="handleContinue" :class="[
                        'px-6 py-2 text-sm font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200',
                        isSuccess
                            ? 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500'
                            : 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
                    ]">
                        {{ buttonTextComputed }}
                    </button>
                </slot>
            </div>
        </div>
    </AppModalWrapper>
</template>

<style scoped>

    /* Custom animations */
    @keyframes ping {

        75%,
        100% {
            transform: scale(1.2);
            opacity: 0;
        }
    }

    .animate-ping {
        animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    /* Enhanced hover effects */
    button:hover {
        transform: translateY(-1px);
    }
</style>
