import { useShipmentRepository } from "./shipmentRepository";
import type {
  CreateShipmentPayload,
  ShipmentResponse,
  ShipmentQuoteEstimatePayload,
  ShipmentQuoteEstimateResponse,
} from "./types";

export function useShipmentService() {
  const shipmentRepository = useShipmentRepository();

  /**
   * Create a new shipment
   */
  const createShipment = async (payload: CreateShipmentPayload): Promise<ShipmentResponse> => {
    return await shipmentRepository.createShipmentByAdmin(payload);
  };

  /**
   * Get a shipment quote estimate
   */
  const getShipmentQuoteEstimate = async (
    payload: ShipmentQuoteEstimatePayload
  ): Promise<ShipmentQuoteEstimateResponse> => {
    return await shipmentRepository.estimateShipmentQuote(payload);
  };

  return {
    createShipment,
    getShipmentQuoteEstimate,
  };
}