import { useApiClient } from "../core/apiClient";
import type {
  CreateShipmentPayload,
  ShipmentResponse,
  ShipmentQuoteEstimatePayload,
  ShipmentQuoteEstimateResponse,
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
      "/admin/shipment/shipment",
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
   * /shipment/quote/estimate
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
   * Expose the repository methods
   */
  return {
    createShipmentByAdmin,
    estimateShipmentQuote,
  };
}
