import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import type { ShipmentItem, Person, CreateShipmentPayload, ShipmentCostData, CreateShipmentItemPayload, CreatePaymentPayload } from '~/api/shipment/types'
import { useShipmentService } from '~/api/shipment/shipmentService'

export const useShipmentFormStore = defineStore('shipmentForm', () => {
  const steps = [
    { id: 1, title: 'Shipping Details', route: 'shipping-details' },
    { id: 2, title: 'Address', route: 'shipping-address' },
    { id: 3, title: 'Payment', route: 'shipping-payment' },
    { id: 4, title: 'Confirmation', route: 'shipping-confirmation' }
  ]

  const formData = reactive<CreateShipmentPayload & { payment_method?: string }>({
    delivery_status: 'pending',
    items: [],
    sender: {} as Person,
    recipient: {} as Person,
    payment: {} as CreatePaymentPayload,
    payment_method: undefined,
  })

  // Draft item for persisting in-progress form data
  const draftItem = ref<CreateShipmentItemPayload | null>(null)
  function setDraftItem(item: CreateShipmentItemPayload | null) {
    draftItem.value = item
  }

  const stepValidations = reactive<Record<'shipping' | 'address' | 'payment', boolean>>({
    shipping: false,
    address: false,
    payment: false
  })

  const costCalculation = ref<ShipmentCostData | null>(null)
  const isSubmitting = ref(false)
  const shipmentLoading = ref(false)

  function addShippingItem(item: ShipmentItem) {
    formData.items.push(item)
    // Clear cost calculation when items change
    costCalculation.value = null
  }
  function removeShippingItem(index: number) {
    formData.items.splice(index, 1)
    // Clear cost calculation when items change
    costCalculation.value = null
  }
  function updateSender(sender: Person) {
    formData.sender = sender
  }
  function updateRecipient(recipient: Person) {
    formData.recipient = recipient
  }
  function updateCostCalculation(cost: ShipmentCostData) {
    costCalculation.value = cost
  }
  function clearCostCalculation() {
    costCalculation.value = null
  }
  function updatePaymentMethod(method: string) {
    formData.payment_method = method
  }
  function updateStepValidation(step: 'shipping' | 'address' | 'payment', isValid: boolean) {
    stepValidations[step] = isValid
  }

  async function createShipment(payload: CreateShipmentPayload & { payment_method?: string }) {
    isSubmitting.value = true;
    const shipmentService = useShipmentService();
    try {
      // Build the payment object from cost calculation
      if (!costCalculation.value?.cost_breakdown) {
        throw new Error('Cost calculation is required before creating shipment');
      }

      const costBreakdown = costCalculation.value.cost_breakdown;

      // Construct the payment payload from cost calculation
      const paymentPayload: CreatePaymentPayload = {
        method: payload.payment_method || 'card', // Use selected payment method
        amount: parseFloat(costBreakdown.total),
        currency: costBreakdown.currency,
        insurance: parseFloat(costBreakdown.insurance_cost),
        tax: parseFloat(costBreakdown.tax_amount),
        discount: 0, // Default to 0 unless you have discount logic
      };

      // Build the final API payload with cost_hash
      const apiPayload = {
        recipient: payload.recipient,
        sender: payload.sender,
        items: payload.items,
        delivery_status: payload.delivery_status,
        payment: paymentPayload,
        cost_hash: costBreakdown.cost_hash,
      };

      console.log('Shipment Creation Payload:', JSON.stringify(apiPayload, null, 2));

      // Call the actual API
      const response = await shipmentService.createShipment(apiPayload);
      // Optionally handle response, update state, show notification, etc.
      return response;
    } catch (error) {
      // Optionally handle error (e.g., show notification)
      throw error;
    } finally {
      isSubmitting.value = false;
    }
  }

  function resetForm() {
    formData.delivery_status = 'pending'
    formData.items = []
    formData.sender = {} as Person
    formData.recipient = {} as Person
    formData.payment = {} as CreatePaymentPayload
    formData.payment_method = undefined
    costCalculation.value = null
    stepValidations.shipping = false
    stepValidations.address = false
    stepValidations.payment = false
    draftItem.value = null
  }

  return {
    steps,
    formData,
    stepValidations,
    costCalculation,
    isSubmitting,
    shipmentLoading,
    addShippingItem,
    removeShippingItem,
    updateSender,
    updateRecipient,
    updateCostCalculation,
    clearCostCalculation,
    updatePaymentMethod,
    updateStepValidation,
    createShipment,
    resetForm,
    draftItem,
    setDraftItem
  }
}, {
  persist: true // Enable persisted state (requires pinia-plugin-persistedstate)
})
