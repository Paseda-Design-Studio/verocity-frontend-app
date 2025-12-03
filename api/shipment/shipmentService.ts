import { useShipmentRepository } from "./shipmentRepository";
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

  /**
   * Calculate shipment cost
   */
  const calculateShipmentCost = async (
    payload: ShipmentCostPayload
  ): Promise<ShipmentCostResponse> => {
    return await shipmentRepository.calculateShipmentCost(payload);
  };

/**
 * Upload shipment item image
 */
const uploadShipmentImage = async (imageFile: File): Promise<ImageUploadData> => {
  return await shipmentRepository.uploadShipmentImage(imageFile);
};


  return {
    createShipment,
    getShipmentQuoteEstimate,
    calculateShipmentCost,
    uploadShipmentImage,
  };
}
