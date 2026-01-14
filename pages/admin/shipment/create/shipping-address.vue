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
  stepValidations,
  updateSender,
  updateRecipient,
  updateCostCalculation,
  updateStepValidation,
} = shipmentForm

const addressDetailsRef = ref()

const isNavigating = ref(false);
const goToPreviousStep = async () => {
  if (isNavigating.value) return;
  isNavigating.value = true;
  try {
    await navigateTo('/admin/shipment/create/shipping-details');
  } finally {
    isNavigating.value = false;
  }
}
const errorMessage = ref("");

const handleCancel = () => {
  shipmentForm.resetForm();
  navigateTo('/admin/shipment');
}

const goToNextStep = async () => {
  if (isNavigating.value) return;
  isNavigating.value = true;
  errorMessage.value = "";
  
  // Trigger validation display if form is invalid
  if (!stepValidations.address) {
    if (addressDetailsRef.value && typeof addressDetailsRef.value.validateForm === 'function') {
      addressDetailsRef.value.validateForm();
    }
    errorMessage.value = "Please complete all required fields before proceeding.";
    isNavigating.value = false;
    return;
  }
  
  try {
    if (stepValidations.address) {
      console.log('Address validation passed, current costCalculation:', shipmentForm.costCalculation);
      
      // Always trigger cost calculation to ensure it's up to date
      console.log('Triggering cost calculation...');
      if (addressDetailsRef.value && typeof addressDetailsRef.value.triggerCostCalculation === 'function') {
        console.log('Calling triggerCostCalculation on child component');
        try {
          await addressDetailsRef.value.triggerCostCalculation();
          console.log('Cost calculation completed, checking result:', shipmentForm.costCalculation);
        } catch (error) {
          console.error('Cost calculation failed:', error);
          errorMessage.value = "Failed to calculate shipping cost. Please check your address information and try again.";
          return;
        }
      } else {
        console.log('addressDetailsRef or triggerCostCalculation method not found');
        errorMessage.value = "Unable to access cost calculation. Please refresh the page and try again.";
        return;
      }
      
      // Check if costCalculation is set in the store
      if (!shipmentForm.costCalculation) {
        console.log('Cost calculation still missing after trigger');
        errorMessage.value = "Unable to calculate shipping cost. Please verify all address information is complete and try again.";
        return;
      }
      
      console.log('Cost calculation successful, navigating to payment');
      await navigateTo('/admin/shipment/create/shipping-payment');
    } else {
      console.log('Address validation failed');
      errorMessage.value = "Please complete all required address fields.";
    }
  } finally {
    isNavigating.value = false;
  }
}
</script>

<template>
  <LayoutsCreateShipmentLayout
    :current-step="1"
    :steps="steps.map(s => s.title)"
    step-title="Address"
  >
    <template #default>
      <ShipmentsAddressDetails
        :shipping-items="formData.items"
        @sender-updated="updateSender"
        @recipient-updated="updateRecipient"
        @cost-calculated="updateCostCalculation"
        @validation-changed="val => updateStepValidation('address', val)"
        ref="addressDetailsRef"
      />
      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-800 text-sm">{{ errorMessage }}</p>
      </div>
    </template>
    <template #actions>
      <ShipmentsNavigationAction
        :next-step-title="'Next'"
        :has-previous-step="true"
        :can-proceed="stepValidations.address"
        @previous="goToPreviousStep"
        @next="goToNextStep"
        @cancel="handleCancel"
      />
    </template>
  </LayoutsCreateShipmentLayout>
</template>