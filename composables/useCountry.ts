import { useCountryService } from "~/api/utils/countryService";
import type { Country } from "~/utils/helper";

export function useCountry() {
  const countryService = useCountryService();

  const { data: countries, pending: loadingCountries, error: errorCountries } = useAsyncData<Country[]>(
    'countries',
    () => countryService.getCountries().then(res => res.countries)
  );

  const { data: operationalCountries, pending: loadingOperational, error: errorOperational } = useAsyncData<Country[]>(
    'operational-countries',
    () => countryService.getOperationalCountries().then(res => res.countries)
  );

  return {
    countries,
    operationalCountries,
    loadingCountries,
    loadingOperational,
    errorCountries,
    errorOperational,
  };
}