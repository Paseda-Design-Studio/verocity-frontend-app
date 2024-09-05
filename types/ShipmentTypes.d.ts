export default {};

declare global {
    /**
     * @description This interface represents the structure of a shipment object.
     * @interface shipmentProp
     * @path types/ShipmentTypes.d.ts
     * @note It is globally declared to standardize shipment data across the application.
     */
    interface shipmentProp {
        trackID: string;
        departure: string;
        destination: string;
        status: string;
        date: string;
    }
}
