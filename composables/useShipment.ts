import { ref } from "vue";
import { useShipmentService } from "~/api/shipment/shipmentService";
import type {
  CreateShipmentPayload,
  ShipmentResponse,
  ShipmentQuoteEstimatePayload,
  ShipmentQuoteEstimateResponse,
} from "~/api/shipment/types";

export function useShipment() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const shipmentResponse = ref<ShipmentResponse | null>(null);
  const quoteEstimate = ref<ShipmentQuoteEstimateResponse | null>(null);

  const shipmentService = useShipmentService();

  const createShipment = async (payload: CreateShipmentPayload) => {
    loading.value = true;
    error.value = null;
    try {
      shipmentResponse.value = await shipmentService.createShipment(payload);
    } catch (err: any) {
      error.value = err.message || "Failed to create shipment";
    } finally {
      loading.value = false;
    }
  };

  const getShipmentQuoteEstimate = async (payload: ShipmentQuoteEstimatePayload) => {
    loading.value = true;
    error.value = null;
    try {
      quoteEstimate.value = await shipmentService.getShipmentQuoteEstimate(payload);
      if (import.meta.env.DEV) {
        console.log("Quote Estimate:", quoteEstimate.value);
      }
    } catch (err: any) {
      error.value = err.message || "Failed to get shipment quote estimate";
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    shipmentResponse,
    quoteEstimate,
    createShipment,
    getShipmentQuoteEstimate,
  };
}