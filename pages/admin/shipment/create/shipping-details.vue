<script setup lang="ts">
import auth from '~/middleware/auth'
import { useShipmentFormStore } from '~/stores/shipmentForm'

definePageMeta({
  layout: 'admin',
  middleware: [auth],
})



const shipmentForm = useShipmentFormStore();
const {
  steps,
  formData,
  stepValidations,
  addShippingItem,
  removeShippingItem,
  updateStepValidation,
  draftItem,
  setDraftItem,
} = shipmentForm;


const shippingDetailsRef = ref()

const handleCancel = () => {
  shipmentForm.resetForm();
  navigateTo('/admin/shipment');
}

const goToNextStep = () => {
  // Save draft item if form is valid and no items have been added yet
  const shippingDetailsComponent = shippingDetailsRef.value;
  if (shippingDetailsComponent && typeof shippingDetailsComponent.getCurrentFormData === 'function') {
    const draft = shippingDetailsComponent.getCurrentFormData();
    if (draft && formData.items.length === 0) {
      addShippingItem(draft);
      setDraftItem(null);
    } else if (!draft && formData.items.length === 0) {
      // If no item and no draft, clear any previous draft
      setDraftItem(null);
    }
    // If draft exists but items exist, just clear draft
    if (formData.items.length > 0) setDraftItem(null);
  }
  if (stepValidations.shipping) {
    navigateTo('/admin/shipment/create/shipping-address')
  }
}

onMounted(() => {
  // Restore draft item to form if present and no items exist
  const shippingDetailsComponent = shippingDetailsRef.value;
  if (draftItem && formData.items.length === 0 && shippingDetailsComponent && typeof shippingDetailsComponent.handleFormDataUpdate === 'function') {
    shippingDetailsComponent.handleFormDataUpdate(draftItem);
  }
});
</script>

<template>
  <LayoutsCreateShipmentLayout
    :current-step="0"
    :steps="steps.map(s => s.title)"
    step-title="Shipping Details"
  >
    <template #default>
      <ShipmentsShippingDetails
        :shipping-items="formData.items"
        :draft-item="draftItem"
        @add-item="addShippingItem"
        @remove-item="removeShippingItem"
        @validation-changed="val => updateStepValidation('shipping', val)"
        @update-draft-item="setDraftItem"
        ref="shippingDetailsRef"
      />
    </template>
    <template #actions>
      <ShipmentsNavigationAction
        :next-step-title="'Next'"
        :has-previous-step="false"
        :can-proceed="stepValidations.shipping"
        @next="goToNextStep"
        @cancel="handleCancel"
      />
    </template>
  </LayoutsCreateShipmentLayout>
</template>