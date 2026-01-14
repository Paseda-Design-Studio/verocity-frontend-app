import { useCountryRepository } from "./countryRepository";
import type { CountriesResponse, CitiesResponse } from "~/utils/helper";

export function useCountryService() {
  const countryRepository = useCountryRepository();

  const getCountries = async (): Promise<CountriesResponse> => {
    return await countryRepository.fetchCountries();
  };

  const getOperationalCountries = async (): Promise<CountriesResponse> => {
    return await countryRepository.fetchOperationalCountries();
  };

  const getCitiesByCountryAndLocation = async (
    countryCode: string,
    locationCode: string
  ): Promise<CitiesResponse> => {
    return await countryRepository.fetchCitiesByCountryAndLocation(countryCode, locationCode);
  };

  return {
    getCountries,
    getOperationalCountries,
    getCitiesByCountryAndLocation,
  };
}
