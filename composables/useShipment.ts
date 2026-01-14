import { ref } from "vue";
import { useShipmentService } from "~/api/shipment/shipmentService";
import { getErrorMessage } from "~/api/core/errorHandler";
import type {
  CreateShipmentPayload,
  ShipmentResponse,
  ShipmentQuoteEstimatePayload,
  ShipmentQuoteEstimateResponse,
  ShipmentCostPayload,
  ShipmentCostResponse,
  ImageUploadData ,
} from "~/api/shipment/types";

export function useShipment() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const shipmentResponse = ref<ShipmentResponse | null>(null);
  const quoteEstimate = ref<ShipmentQuoteEstimateResponse | null>(null);
  const costCalculation = ref<ShipmentCostResponse | null>(null);
  
  // Image upload specific states
  const uploadLoading = ref(false);
  const uploadError = ref<string | null>(null);

  const shipmentService = useShipmentService();

  const createShipment = async (payload: CreateShipmentPayload) => {
    loading.value = true;
    error.value = null;
    try {
      shipmentResponse.value = await shipmentService.createShipment(payload);
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      error.value = errorMessage;
      console.error("Create shipment error:", errorMessage);
      throw err;
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
      const errorMessage = getErrorMessage(err);
      error.value = errorMessage;
      console.error("Quote estimate error:", errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const calculateShipmentCost = async (payload: ShipmentCostPayload) => {
    loading.value = true;
    error.value = null;
    try {
      costCalculation.value = await shipmentService.calculateShipmentCost(payload);
      if (import.meta.env.DEV) {
        console.log("Cost Calculation:", costCalculation.value);
      }
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      error.value = errorMessage;
      console.error("Cost calculation error:", errorMessage);
      throw err;
    } finally {
      loading.value = false;
    }
  };

const uploadShipmentImage = async (imageFile: File): Promise<ImageUploadData | null> => {
  uploadLoading.value = true;
  uploadError.value = null;
  try {
    const response = await shipmentService.uploadShipmentImage(imageFile);
    if (import.meta.env.DEV) {
      console.log("Image Upload:", response);
    }
    return response;
  } catch (err: any) {
    uploadError.value = err.message || "Failed to upload image";
    throw err;
  } finally {
    uploadLoading.value = false;
  }
};


  const clearError = () => {
    error.value = null;
  };

  const clearUploadError = () => {
    uploadError.value = null;
  };

  const resetShipmentData = () => {
    shipmentResponse.value = null;
    quoteEstimate.value = null;
    costCalculation.value = null;
    error.value = null;
  };

  const resetUploadData = () => {
    uploadError.value = null;
  };

  return {
    loading,
    error,
    shipmentResponse,
    quoteEstimate,
    costCalculation,
    uploadLoading,
    uploadError,
    createShipment,
    getShipmentQuoteEstimate,
    calculateShipmentCost,
    uploadShipmentImage,
    clearError,
    clearUploadError,
    resetShipmentData,
    resetUploadData,
  };
}
