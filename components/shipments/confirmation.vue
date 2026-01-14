<script setup lang="ts">
    import type { ShipmentItem, Person, ShipmentCostData } from '~/api/shipment/types'

    interface FormData {
        items: ShipmentItem[]
        sender: Person
        recipient: Person
        paymentMethod: string
    }

    interface Props {
        formData: FormData
        costCalculation?: ShipmentCostData | null
        isSubmitting?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        isSubmitting: false,
        costCalculation: null
    })

    const emit = defineEmits<{
        'mark-as-paid': []
        'submission-complete': [success: boolean, shipmentId?: string]
    }>()

    // Modal state
    const showResultModal = ref(false)
    const submissionSuccess = ref(false)
    const generatedShipmentId = ref('')

    // Computed values
    const totalCost = computed(() => {
        return props.costCalculation?.cost_breakdown.total || '0'
    })

    const currency = computed(() => {
        return props.costCalculation?.cost_breakdown.currency || 'USD'
    })

    const formattedCurrency = computed(() => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency.value
        })
    })

    const costBreakdown = computed(() => {
        if (!props.costCalculation) return null
        return props.costCalculation.cost_breakdown
    })

    // Legacy format for existing components
    const legacySender = computed(() => ({
        name: `${props.formData.sender.first_name} ${props.formData.sender.last_name}`,
        phone: props.formData.sender.phone,
        address: `${props.formData.sender.street}, ${props.formData.sender.city}, ${props.formData.sender.state}, ${props.formData.sender.country}`
    }))

    const legacyRecipient = computed(() => ({
        name: `${props.formData.recipient.first_name} ${props.formData.recipient.last_name}`,
        phone: props.formData.recipient.phone,
        address: `${props.formData.recipient.street}, ${props.formData.recipient.city}, ${props.formData.recipient.state}, ${props.formData.recipient.country}`
    }))

    const handleMarkAsPaid = () => {
        emit('mark-as-paid')
    }

    // Handle submission result (called from parent)
    const showSubmissionResult = (success: boolean, shipmentId: string = '') => {
        submissionSuccess.value = success
        generatedShipmentId.value = shipmentId
        showResultModal.value = true
    }

    const handleModalContinue = () => {
        emit('submission-complete', submissionSuccess.value, generatedShipmentId.value)
    }

    // Expose method for parent to call
    defineExpose({
        showSubmissionResult
    })
</script>

<template>
    <div>
        <div class="flex flex-col gap-4">
            <!-- Package details component -->
            <ShipmentsPackageDetails :items="formData.items" :show-actions="true" />
            <Divider class="mt-4" />

            <!-- Address info component -->
            <ShipmentsAddressInfo :sender="legacySender" :recipient="legacyRecipient" />
            <Divider class="mt-4" />

            <!-- Cost Breakdown Display -->
            <div v-if="costCalculation && costBreakdown" class="mb-6">
                <h3 class="text-lg font-medium mb-4">Cost Breakdown</h3>
                <div class="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Base Shipping Cost:</span>
                        <span class="text-sm font-medium">{{
                            formattedCurrency.format(parseFloat(costBreakdown.base_shipping_cost)) }}</span>
                    </div>

                    <div v-if="parseFloat(costBreakdown.fragile_surcharge) > 0"
                        class="flex justify-between items-center">
                        <span class="text-sm text-orange-600">Fragile Surcharge:</span>
                        <span class="text-sm font-medium text-orange-600">{{
                            formattedCurrency.format(parseFloat(costBreakdown.fragile_surcharge)) }}</span>
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Insurance:</span>
                        <span class="text-sm font-medium">{{
                            formattedCurrency.format(parseFloat(costBreakdown.insurance_cost)) }}</span>
                    </div>

                    <div class="flex justify-between items-center">
                        <span class="text-sm text-gray-600">Tax ({{ (parseFloat(costBreakdown.tax_rate) *
                            100).toFixed(1) }}%):</span>
                        <span class="text-sm font-medium">{{
                            formattedCurrency.format(parseFloat(costBreakdown.tax_amount)) }}</span>
                    </div>

                    <Divider class="my-2" />

                    <div class="flex justify-between items-center">
                        <span class="text-lg font-semibold">Total:</span>
                        <span class="text-lg font-semibold">{{ formattedCurrency.format(parseFloat(costBreakdown.total))
                            }}</span>
                    </div>
                </div>

                <!-- Additional Information -->
                <div class="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>
                        <span>Total Weight:</span>
                        <span class="font-medium ml-1">{{ costBreakdown.total_weight }}kg</span>
                    </div>
                    <div>
                        <span>Total Value:</span>
                        <span class="font-medium ml-1">{{
                            formattedCurrency.format(parseFloat(costBreakdown.total_value.toString())) }}</span>
                    </div>
                    <div class="col-span-2">
                        <span>Route:</span>
                        <span class="font-medium ml-1">{{ costBreakdown.route.origin }} → {{
                            costBreakdown.route.destination }}</span>
                    </div>
                </div>
            </div>

            <!-- Payment Method Display -->
            <div class="mb-6">
                <h3 class="text-lg font-medium mb-4">Payment Method</h3>
                <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span class="font-medium capitalize">{{ formData.paymentMethod.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim() }}</span>
                    </div>

                    <!-- Bank Transfer Details -->
                    <div v-if="formData.paymentMethod === 'banktransfer'" class="mt-3 p-3 bg-blue-50 rounded-md">
                        <p class="text-xs text-blue-800">
                            <strong>Note:</strong> Please complete the bank transfer using the details provided in the
                            previous step.
                        </p>
                        <button @click="handleMarkAsPaid"
                            class="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                            Mark as Paid
                        </button>
                    </div>
                </div>
            </div>

            <!-- Submission status -->
            <div v-if="isSubmitting" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div class="flex items-center gap-3">
                    <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <p class="text-blue-800 font-medium">Creating your shipment...</p>
                </div>
            </div>

            <!-- No Cost Calculation Warning -->
            <div v-if="!costCalculation" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div class="flex items-center gap-3">
                    <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-yellow-600" />
                    <p class="text-yellow-800 font-medium">Cost calculation not available. Please go back and complete
                        the address information.</p>
                </div>
            </div>
        </div>

        <!-- Result Modal -->
        <ShipmentsResultModal v-model:visible="showResultModal" :is-success="submissionSuccess"
            :customer-name="legacySender.name" :shipment-id="generatedShipmentId" @continue="handleModalContinue" />
    </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
