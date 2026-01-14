import { useApiClient } from "../core/apiClient";
import type { CountriesResponse, CitiesResponse } from "~/utils/helper";

export function useCountryRepository() {
  const apiClient = useApiClient();

  const fetchCountries = async (): Promise<CountriesResponse> => {
    const response = await apiClient.get<CountriesResponse>("/countries");
    if (!response) throw new Error("No response from /countries");
    return response;
  };

  const fetchOperationalCountries = async (): Promise<CountriesResponse> => {
    const response = await apiClient.get<CountriesResponse>("/operational-countries");
    if (!response) throw new Error("No response from /operational-countries");
    return response;
  };
  
  const fetchCitiesByCountryAndLocation = async (
    countryCode: string,
    locationCode: string
  ): Promise<CitiesResponse> => {
    const response = await apiClient.get<CitiesResponse>(
      `/countries/${countryCode}/locations/${locationCode}/cities`
    );
    if (!response) throw new Error("No response from cities endpoint");
    return response;
  };

  return {
    fetchCountries,
    fetchOperationalCountries,
    fetchCitiesByCountryAndLocation,
  };
}