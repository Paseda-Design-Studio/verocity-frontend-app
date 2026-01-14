<script setup lang="ts">
import auth from '~/middleware/auth'
import { useShipmentFormStore } from '~/stores/shipmentForm'

definePageMeta({
  layout: 'admin',
  middleware: [auth],
})

const shipmentForm = useShipmentFormStore()

const {
  steps,
  formData,
  costCalculation,
  stepValidations,
  shipmentLoading,
  updatePaymentMethod,
  updateStepValidation,
} = shipmentForm

const paymentDetailsRef = ref()

const goToPreviousStep = () => {
  navigateTo('/admin/shipment/create/shipping-address')
}
const handleCancel = () => {
  shipmentForm.resetForm();
  navigateTo('/admin/shipment');
}
const goToNextStep = () => {
  if (stepValidations.payment) {
    navigateTo('/admin/shipment/create/shipping-confirmation')
  }
}
</script>

<template>
  <LayoutsCreateShipmentLayout
    :current-step="2"
    :steps="steps.map(s => s.title)"
    step-title="Payment"
  >
    <template #default>
      <ShipmentsPaymentsDetails
        :cost-calculation="costCalculation"
        :loading="shipmentLoading"
        @payment-method-selected="updatePaymentMethod"
        @validation-changed="val => updateStepValidation('payment', val)"
        ref="paymentDetailsRef"
      />
    </template>
    <template #actions>
      <ShipmentsNavigationAction
        :next-step-title="'Next'"
        :has-previous-step="true"
        :can-proceed="stepValidations.payment"
        :loading="shipmentLoading"
        @previous="goToPreviousStep"
        @next="goToNextStep"
        @cancel="handleCancel"
      />
    </template>
  </LayoutsCreateShipmentLayout>
</template>