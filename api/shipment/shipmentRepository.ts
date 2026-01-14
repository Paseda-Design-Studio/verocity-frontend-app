import { useApiClient } from "../core/apiClient";
import type { ApiResponse } from "../core/types";
import type {
  CreateShipmentPayload,
  ShipmentResponse,
  ShipmentQuoteEstimatePayload,
  ShipmentQuoteEstimateResponse,
  ShipmentCostPayload,
  ShipmentCostResponse,
  ImageUploadResponse,
  ImageUploadData,
} from "./types";

export function useShipmentRepository() {
  const apiClient = useApiClient();

  /**
   * Creates a new shipment By Admin and Super Admin
   * @param shipmentData - The data for the new shipment
   * @returns ShipmentResponse - The created shipment data
   * @throws Error if the API call fails or returns an invalid response
   * /admin/shipment/shipment
   */
  const createShipmentByAdmin = async (
    shipmentData: CreateShipmentPayload
  ): Promise<ShipmentResponse> => {
    const response = await apiClient.post<ShipmentResponse>(
      "/admin/shipment",
      shipmentData
    );

    console.log("Create Shipment response from repo:", response);

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  /**
   * Estimates a shipment quote
   * @param estimateData - The data for the shipment quote estimate
   * @returns ShipmentQuoteEstimateResponse - The estimated quote data
   * @throws Error if the API call fails or returns an invalid response
   * /shipment-quote
   */
  const estimateShipmentQuote = async (
    estimateData: ShipmentQuoteEstimatePayload
  ): Promise<ShipmentQuoteEstimateResponse> => {
    const response = await apiClient.post<ShipmentQuoteEstimateResponse>(
      "/shipment-quote",
      estimateData
    );

    console.log("Shipment Quote Estimate response from repo:", response);

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

  /**
   * Calculates shipment cost with detailed breakdown
   * @param costData - The data for the shipment cost calculation
   * @returns ShipmentCostResponse - The detailed cost breakdown
   * @throws Error if the API call fails or returns an invalid response
   * /shipment/cost
   */
  const calculateShipmentCost = async (
    costData: ShipmentCostPayload
  ): Promise<ShipmentCostResponse> => {
    const response = await apiClient.post<ShipmentCostResponse>(
      "/admin/shipments/calculate-cost",
      costData
    );

    console.log("Shipment Cost Calculation response from repo:", response);

    if (!response) {
      throw new Error("Invalid response structure: No response received");
    }

    return response;
  };

/**
 * Upload shipment item image
 * @param imageFile - The image file to upload
 * @returns ImageUploadData - The uploaded image data
 * @throws Error if the API call fails or returns an invalid response
 * Sends FormData with 'image' key to /admin/shipment/upload
 */
const uploadShipmentImage = async (
  imageFile: File
): Promise<ImageUploadData> => {
  // Create FormData with 'image' key
  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await apiClient.post<ImageUploadData>(
    "/admin/shipment/upload",
    formData
  );

  console.log("Image Upload response from repo:", response);

  if (!response) {
    throw new Error("Invalid response structure: No response received");
  }

  return response;
};

  /**
   * Expose the repository methods
   */
  return {
    createShipmentByAdmin,
    estimateShipmentQuote,
    calculateShipmentCost,
    uploadShipmentImage,
  };
}
