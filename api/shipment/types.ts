import type { ApiResponse } from '~/api/core/types';

/** Person info for sender/recipient */
export interface Person {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
}

/** Shipment item details */
export interface ShipmentItem {
  name: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  quantity: number;
  category: string;
  value: number;
  fragile: boolean;
  insurance_required: boolean;
  handling_instructions?: string;
  sku: string;
  image_url: string;
  image_ref: string;
  version?: number;
}

/** Payment details for a shipment */
export interface Payment {
  ref_id: string;
  method: string;
  amount: number;
  currency: string;
  status: string;
  insurance: number;
  tax: number;
  discount: number;
  details: any;
}

/** Shipment data returned from API */
export interface ShipmentData {
  readonly ref_id: string;
  delivery_status: string;
  sender: Person;
  recipient: Person;
  items: ShipmentItem[];
  payment: Payment;
}

/** API response for a shipment */
export type ShipmentResponse = ApiResponse<ShipmentData>;

/** Payload for creating a person (sender/recipient) */
export type CreatePersonPayload = Person;

/** Payload for creating a shipment item */
export interface CreateShipmentItemPayload {
  name: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  quantity: number;
  category: string;
  value: number;
  fragile: boolean;
  insurance_required: boolean;
  handling_instructions?: string;
  sku: string;
  image_url: string;
  image_ref: string;
  version?: number;
}

/** Payload for creating a payment */
export interface CreatePaymentPayload {
  method: string;
  amount: number;
  currency: string;
  insurance: number;
  tax: number;
  discount: number;
}

/** Payload for creating a shipment */
export interface CreateShipmentPayload {
  recipient: CreatePersonPayload;
  sender: CreatePersonPayload;
  items: CreateShipmentItemPayload[];
  delivery_status: string;
  payment: CreatePaymentPayload;
}

/** Route information for shipment cost */
export interface ShipmentRoute {
  origin: string;
  destination: string;
}

/** Cost breakdown details */
export interface CostBreakdown {
  base_shipping_cost: string;
  fragile_surcharge: string;
  insurance_cost: string;
  tax_amount: string;
  tax_rate: string;
  subtotal: string;
  total: string;
  currency: string;
  total_weight: number;
  total_value: number;
  has_fragile_items: boolean;
  route: ShipmentRoute;
  cost_hash: string;
}

/** Shipment cost data */
export interface ShipmentCostData {
  cost_breakdown: CostBreakdown;
  message: string;
}

/** API response for shipment cost calculation */
export interface ShipmentCostResponse {
  data: ShipmentCostData;
  status: string;
}

/** Payment info for cost calculation */
export interface CostCalculationPayment {
  method: string;
  currency: string;
  insurance_requested: boolean;
}

/** Payload for calculating shipment cost */
export interface ShipmentCostPayload {
  sender: Person;
  recipient: Person;
  items: ShipmentItem[];
  payment: CostCalculationPayment;
}

/** Image upload data */
export interface ImageUploadData {
  publicId: string;
  uploadUrl: string;
}

/** API response for image upload - follows standard ApiResponse format */
export type ImageUploadResponse = ApiResponse<ImageUploadData>;

/** Shipment quote details (keeping for backward compatibility) */
export interface ShipmentQuote {
  currency: string;
  destination: string;
  destination_country: string;
  item_value: string;
  item_value_currency: string;
  origin: string;
  rate_currency: string;
  rate_per_kg: string;
  total_cost: string;
  weight: string;
  weight_unit: string;
}

/** API response for a shipment quote estimate (keeping for backward compatibility) */
export interface ShipmentQuoteEstimateResponse {
  quote: ShipmentQuote;
}

/** Payload for requesting a shipment quote estimate */
export interface QuotePersonalInfo {
  name: string;
  email: string;
  phone: string;
}

export interface QuoteItemDetails {
  category: string;
  weight: number | string;
  value: number;
  description: string;
}

export interface QuoteLocationInfo {
  from_country: string;
  from_city: string;
  to_country: string;
  to_city: string;
}

export interface QuoteShippingPreferences {
  destination_country: string;
  currency: string;
}

export interface ShipmentQuoteEstimatePayload {
  personal_info: QuotePersonalInfo;
  item_details: QuoteItemDetails;
  location_info: QuoteLocationInfo;
  shipping_preferences: QuoteShippingPreferences;
}
