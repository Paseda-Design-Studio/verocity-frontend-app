<script setup lang="ts">
import auth from '~/middleware/auth'
import { useShipmentFormStore } from '~/stores/shipmentForm'
import { getErrorMessage } from '~/api/core/errorHandler'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  layout: 'admin',
  middleware: [auth],
})

const shipmentForm = useShipmentFormStore();
const toast = useToast();

const {
  steps,
  formData,
  costCalculation,
  isSubmitting,
  shipmentLoading,
  createShipment,
  resetForm,
} = shipmentForm;

const confirmationRef = ref()
const submissionError = ref<string | null>(null)

const goToPreviousStep = () => {
  navigateTo('/admin/shipment/create/shipping-payment')
}

const handleCancel = () => {
  resetForm();
  navigateTo('/admin/shipment');
}

const handleSubmit = async () => {
  submissionError.value = null;
  try {
    await createShipment(formData)
    
    // Show success toast
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Shipment created successfully!',
      life: 5000
    });
    
    resetForm()
    // Redirect to shipments list or success page
    navigateTo('/admin/shipment')
  } catch (err: any) {
    // Extract and display error message
    const errorMessage = getErrorMessage(err);
    submissionError.value = errorMessage;
    
    // Show error toast
    toast.add({
      severity: 'error',
      summary: 'Shipment Creation Failed',
      detail: errorMessage,
      life: 8000
    });
    
    console.error('Shipment creation error:', errorMessage);
  }
}
</script>

<template>
  <LayoutsCreateShipmentLayout
    :current-step="3"
    :steps="steps.map(s => s.title)"
    step-title="Confirmation"
  >
    <template #default>
      <!-- Submission Error Display -->
      <div v-if="submissionError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start gap-3">
          <svg class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="flex-1">
            <h3 class="text-sm font-semibold text-red-800 mb-1">Shipment Creation Failed</h3>
            <p class="text-sm text-red-700">{{ submissionError }}</p>
          </div>
        </div>
      </div>

      <ShipmentsConfirmation
        :form-data="{ ...formData, paymentMethod: formData.payment_method ?? formData.payment?.method ?? '' }"
        :cost-calculation="costCalculation"
        :is-submitting="isSubmitting"
        ref="confirmationRef"
      />
    </template>
    <template #actions>
      <ShipmentsNavigationAction
        :next-step-title="'Submit'"
        :has-previous-step="true"
        :can-proceed="true"
        :loading="isSubmitting || shipmentLoading"
        @previous="goToPreviousStep"
        @next="handleSubmit"
        @cancel="handleCancel"
      />
    </template>
  </LayoutsCreateShipmentLayout>
</template>