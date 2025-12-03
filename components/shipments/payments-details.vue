<script setup lang="ts">
    import type {
        CreatePaymentPayload,
        ShipmentCostData
    } from '~/api/shipment/types'

    interface Props {
        costCalculation?: ShipmentCostData | null
        loading?: boolean
    }

    interface PaymentSummary {
        baseShippingCost: number
        fragileSurcharge: number
        insurance: number
        tax: number
        discount?: number
        total: number
    }

    const props = withDefaults(defineProps<Props>(), {
        loading: false,
        costCalculation: null
    })

    const emit = defineEmits<{
        'payment-method-selected': [method: string]
        'payment-submit': [payload: CreatePaymentPayload]
        'validation-changed': [isValid: boolean]
    }>()

    // Payment method options
    const paymentMethods = [
        {
            id: 'paystack',
            name: 'bank_transfer',
            label: '',
            image: '/paystack.png'
        },
        {
            id: 'banktransfer',
            name: 'banktransfer',
            label: 'Bank Transfer',
            image: ''
        }
    ]

    // Bank details
    const bankDetails = {
        bankName: 'First Bank of Nigeria',
        accountName: 'Verocity Logistics Ltd',
        accountNumber: '2034567890',
        sortCode: '011-152-003'
    }

    // Reactive state
    const selectedPaymentMethod = ref<string>('')
    const paymentSummary = ref<PaymentSummary>({
        baseShippingCost: 0,
        fragileSurcharge: 0,
        insurance: 0,
        tax: 0,
        discount: 0,
        total: 0
    })

    // Computed values
    const currency = computed(() => props.costCalculation?.cost_breakdown?.currency || 'USD')

    const formattedCurrency = computed(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.value
        })
    })

    const showBankDetails = computed(() => selectedPaymentMethod.value === 'banktransfer')

    // Validation
    const isValid = computed(() => {
        return selectedPaymentMethod.value.trim() !== ''
    })

    // Safely compute tax rate percent for template
    const taxRatePercent = computed(() => {
        const rate = props.costCalculation?.cost_breakdown?.tax_rate
        return rate ? (parseFloat(rate) * 100).toFixed(1) : '0'
    })

    // Handle image error
    const handleImageError = (event: Event) => {
        const target = event.target as HTMLImageElement
        if (target) {
            target.style.display = 'none'
        }
    }

    // Calculate payment summary from cost calculation
    const calculatePaymentSummary = () => {
        const costBreakdown = props.costCalculation?.cost_breakdown
        if (!costBreakdown) return

        paymentSummary.value = {
            baseShippingCost: parseFloat(costBreakdown.base_shipping_cost) || 0,
            fragileSurcharge: parseFloat(costBreakdown.fragile_surcharge) || 0,
            insurance: parseFloat(costBreakdown.insurance_cost) || 0,
            tax: parseFloat(costBreakdown.tax_amount) || 0,
            discount: 0,
            total: parseFloat(costBreakdown.total) || 0
        }
    }

    // Handle payment method selection
    const handlePaymentMethodChange = (method: string) => {
        selectedPaymentMethod.value = method
        emit('payment-method-selected', method)

        // Emit validation status
        nextTick(() => {
            emit('validation-changed', isValid.value)
        })
    }

    // Watch for cost calculation changes
    watch(() => props.costCalculation, () => {
        calculatePaymentSummary()
    }, { immediate: true })

    // Watch for validation changes
    watch(isValid, (valid) => {
        emit('validation-changed', valid)
    }, { immediate: true })

    // Expose methods for parent component
    defineExpose({
        selectedPaymentMethod: readonly(selectedPaymentMethod),
        paymentSummary: readonly(paymentSummary),
        isValid: readonly(isValid)
    })
</script>

<template>
    <div>
        <!-- Payment Summary Section -->
        <div class="justify-between flex items-center mb-4">
            <p class="text-md font-[600]">Payment Summary</p>
        </div>

        <!-- No Cost Calculation Warning -->
        <div v-if="!costCalculation && !loading" class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-yellow-800 text-sm">
                <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 inline mr-2" />
                Please complete the address information to calculate shipping costs.
            </p>
        </div>

        <!-- Payment Summary Details -->
        <div v-else-if="costCalculation && costCalculation.cost_breakdown" class="mb-6">
            <!-- Base Shipping Cost -->
            <div class="flex justify-between items-center mb-4">
                <p class="text-sm text-gray-500">Base Shipping Cost</p>
                <p class="text-sm font-semibold">
                    <span v-if="loading">Loading...</span>
                    <span v-else>{{ formattedCurrency.format(paymentSummary.baseShippingCost) }}</span>
                </p>
            </div>

            <!-- Fragile Surcharge -->
            <div v-if="paymentSummary.fragileSurcharge > 0" class="flex justify-between items-center mb-4">
                <p class="text-sm text-orange-600">Fragile Surcharge</p>
                <p class="text-sm font-medium text-orange-600">
                    <span v-if="loading">Loading...</span>
                    <span v-else>{{ formattedCurrency.format(paymentSummary.fragileSurcharge) }}</span>
                </p>
            </div>

            <!-- Insurance -->
            <div class="flex justify-between items-center mb-4">
                <p class="text-sm text-gray-500">Insurance</p>
                <p class="text-sm font-semibold">
                    <span v-if="loading">Loading...</span>
                    <span v-else>{{ formattedCurrency.format(paymentSummary.insurance) }}</span>
                </p>
            </div>

            <!-- Tax -->
            <div class="flex justify-between items-center mb-4">
                <p class="text-sm">Tax ({{ taxRatePercent }}%)</p>
                <p class="text-sm font-semibold">
                    <span v-if="loading">Loading...</span>
                    <span v-else>{{ formattedCurrency.format(paymentSummary.tax) }}</span>
                </p>
            </div>

            <!-- Discount (if applicable) -->
            <div v-if="paymentSummary.discount && paymentSummary.discount > 0"
                class="flex justify-between items-center mb-4">
                <p class="text-sm text-green-600">Discount</p>
                <p class="text-sm font-medium text-green-600">
                    -{{ formattedCurrency.format(paymentSummary.discount) }}
                </p>
            </div>

            <Divider class="my-4" />

            <!-- Total -->
            <div class="flex justify-between items-center mb-6">
                <p class="text-lg font-semibold">Total</p>
                <p class="text-lg font-semibold">
                    <span v-if="loading">Loading...</span>
                    <span v-else>{{ formattedCurrency.format(paymentSummary.total) }}</span>
                </p>
            </div>

            <!-- Additional Cost Information -->
            <div class="mb-4 p-3 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-2 gap-4 text-xs text-gray-600">
                    <div>
                        <span>Total Weight:</span>
                        <span class="font-medium ml-1">{{ costCalculation.cost_breakdown.total_weight }}kg</span>
                    </div>
                    <div>
                        <span>Total Value:</span>
                        <span class="font-medium ml-1">{{
                            formattedCurrency.format(costCalculation.cost_breakdown.total_value) }}</span>
                    </div>
                    <div class="col-span-2">
                        <span>Route:</span>
                        <span class="font-medium ml-1">{{ costCalculation.cost_breakdown.route.origin }} → {{
                            costCalculation.cost_breakdown.route.destination }}</span>
                    </div>
                    <div v-if="costCalculation.cost_breakdown.has_fragile_items" class="col-span-2">
                        <span class="text-orange-600">
                            <Icon name="heroicons:exclamation-triangle" class="w-3 h-3 inline mr-1" />
                            Contains fragile items
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p class="text-yellow-800 text-sm">
                <Icon name="heroicons:exclamation-triangle" class="w-4 h-4 inline mr-2" />
                Shipping cost data is missing or incomplete. Please go back and recalculate shipping cost.
            </p>
        </div>

        <Divider class="my-4" />

        <!-- Payment Method Section -->
        <div class="flex flex-col mb-4">
            <p class="text-md font-[600]">Payment Method</p>
            <p class="text-sm text-gray-500">Select a payment method <span class="text-red-500">*</span></p>
        </div>

        <div class="mb-6">
            <!-- Payment Method Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="method in paymentMethods" :key="method.id" class="flex items-center gap-x-3">
                    <AppRadioInput :id="method.id" :name="'payment-method'" :value="method.name"
                        :modelValue="selectedPaymentMethod" @update:modelValue="handlePaymentMethodChange" />
                    <label :for="method.id" class="flex items-center cursor-pointer flex-grow">
                        <img v-if="method.image" :src="method.image" :alt="method.label"
                            class="w-20 h-12 mr-3 object-contain" @error="handleImageError" />
                        <span v-else class="text-sm font-medium">{{ method.label }}</span>
                    </label>
                </div>
            </div>

            <!-- Validation Error -->
            <small v-if="!isValid && selectedPaymentMethod === ''" class="text-red-500 mt-2 block">
                Please select a payment method
            </small>

            <!-- Bank Transfer Details Card -->
            <Transition name="slide-down" mode="out-in">
                <div v-if="showBankDetails" class="mt-6 p-6 rounded-lg" style="background-color: #f8f9fd;">
                    <h3 class="text-lg font-medium mb-4">Bank Transfer Details</h3>
                    <div class="space-y-3">
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Bank Name:</span>
                            <span class="text-sm font-medium">{{ bankDetails.bankName }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Account Name:</span>
                            <span class="text-sm font-medium">{{ bankDetails.accountName }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Account Number:</span>
                            <span class="text-sm font-medium">{{ bankDetails.accountNumber }}</span>
                        </div>
                        <div class="flex justify-between items-center">
                            <span class="text-sm text-gray-600">Sort Code:</span>
                            <span class="text-sm font-medium">{{ bankDetails.sortCode }}</span>
                        </div>
                    </div>
                    <div class="mt-4 p-3 bg-blue-50 rounded-md">
                        <p class="text-xs text-blue-800">
                            <strong>Note:</strong> Please use your order reference as the payment description and upload
                            proof of payment after transfer.
                        </p>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>

    .slide-down-enter-active,
    .slide-down-leave-active {
        transition: all 0.3s ease-in-out;
    }

    .slide-down-enter-from {
        opacity: 0;
        transform: translateY(-10px);
    }

    .slide-down-leave-to {
        opacity: 0;
        transform: translateY(-10px);
    }

    .p-invalid {
        border-color: #ef4444 !important;
    }

    .p-error {
        color: #ef4444;
        font-size: 0.75rem;
        margin-top: 0.25rem;
    }
</style>
