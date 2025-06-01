import { useCountryRepository } from "./countryRepository";
import type { CountriesResponse } from "~/utils/helper";

export function useCountryService() {
  const countryRepository = useCountryRepository();

  const getCountries = async (): Promise<CountriesResponse> => {
    return await countryRepository.fetchCountries();
  };

  const getOperationalCountries = async (): Promise<CountriesResponse> => {
    return await countryRepository.fetchOperationalCountries();
  };

  return {
    getCountries,
    getOperationalCountries,
  };
}
