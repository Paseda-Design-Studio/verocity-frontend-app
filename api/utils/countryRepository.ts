import { useApiClient } from "../core/apiClient";
import type { CountriesResponse } from "~/utils/helper";

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

  return {
    fetchCountries,
    fetchOperationalCountries,
  };
}