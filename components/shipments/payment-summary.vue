<script setup lang="ts">
    interface Props {
        paymentMethod: string
        deliveryCost?: number
        insurance?: number
        tax?: number
        discount?: number
        total?: number
        currency?: string
        readonly?: boolean
        showButton?: boolean
        showPaymentMethod?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        deliveryCost: 0,
        insurance: 0,
        tax: 0,
        discount: 0,
        total: 0,
        currency: 'USD',
        readonly: false,
        showButton: true,
        showPaymentMethod: true
    })

    const emit = defineEmits<{
        'mark-as-paid': []
    }>()

    // Computed values
    const formattedCurrency = computed(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: props.currency
        })
    })

    const paymentMethodLabel = computed(() => {
        switch (props.paymentMethod) {
            case 'paystack':
                return 'Paystack'
            case 'banktransfer':
                return 'Bank Transfer'
            default:
                return props.paymentMethod || 'Not selected'
        }
    })

    const isBankTransfer = computed(() => props.paymentMethod === 'banktransfer')

    const handleMarkAsPaid = () => {
        emit('mark-as-paid')
    }
</script>

<template>
    <div>
        <!-- Header Row -->
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold">Payment Summary</h3>
            <div class="flex items-center gap-4">
                <!-- Mark as Paid Link (only for bank transfer) -->
                <button v-if="isBankTransfer" @click="handleMarkAsPaid"
                    class="text-green-600 hover:text-green-700 text-sm font-medium underline transition-colors">
                    Mark as Paid
                </button>

                <!-- Edit Button -->
                <NuxtLink to="/admin/shipment/edit-payment"
                    class="flex items-center gap-2 text-gray-700 border border-gray-200 rounded p-1 hover:text-primary-700 hover:bg-gray-50 transition-colors"
                    v-if="showButton">
                    <AppIcon name="pencil-alt" class="w-4 h-4" />
                    <span class="text-sm font-medium">Edit</span>
                </NuxtLink>
            </div>
        </div>

        <!-- Payment Details Row -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <!-- Payment Method -->
            <div class="flex justify-between items-center mb-4" v-if="showPaymentMethod">
                <span class="text-sm text-gray-600">Payment Method:</span>
                <img v-if="paymentMethod === 'paystack'" src="/paystack.png" :alt="paymentMethod"
                    class="w-20 h-12 mr-3 object-contain" />
                <div v-else class="flex items-center gap-2">
                    <AppIcon name="cash-bank" class="w-4 h-4 text-gray-400" />
                    <span class="text-sm font-medium text-gray-900">{{ paymentMethodLabel }}</span>
                </div>
            </div>

            <!-- Cost Breakdown -->
            <div class="space-y-3">
                <!-- Delivery Cost -->
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Delivery Cost:</span>
                    <span class="text-sm font-medium text-gray-900">
                        {{ formattedCurrency.format(deliveryCost) }}
                    </span>
                </div>

                <!-- Insurance -->
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Insurance:</span>
                    <span class="text-sm font-medium text-gray-900">
                        {{ formattedCurrency.format(insurance) }}
                    </span>
                </div>

                <!-- Tax -->
                <div class="flex justify-between items-center">
                    <span class="text-sm text-gray-600">Tax:</span>
                    <span class="text-sm font-medium text-gray-900">
                        {{ formattedCurrency.format(tax) }}
                    </span>
                </div>

                <!-- Discount (if applicable) -->
                <div v-if="discount && discount > 0" class="flex justify-between items-center">
                    <span class="text-sm text-green-600">Discount:</span>
                    <span class="text-sm font-medium text-green-600">
                        -{{ formattedCurrency.format(discount) }}
                    </span>
                </div>

                <!-- Divider -->
                <hr class="border-gray-300 my-3">

                <!-- Total -->
                <div class="flex justify-between items-center">
                    <span class="text-base font-semibold text-gray-900">Total:</span>
                    <span class="text-base font-semibold text-gray-900">
                        {{ formattedCurrency.format(total) }}
                    </span>
                </div>
            </div>

            <!-- Bank Transfer Status (if applicable) -->
            <div v-if="isBankTransfer" class="mt-4 pt-3 border-t border-gray-300">
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span class="text-sm text-gray-600">Awaiting payment confirmation</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
