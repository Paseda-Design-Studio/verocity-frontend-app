import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useCountryService } from '~/api/utils/countryService'
import type { Country } from '~/utils/helper'

export const useCountryStore = defineStore('country', () => {
  const operationalCountries = ref<Country[] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const fetchOperationalCountries = async () => {
    loading.value = true
    error.value = null
    try {
      const service = useCountryService()
      const res = await service.getOperationalCountries()
      operationalCountries.value = res.countries // <-- keep full objects
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch operational countries'
    } finally {
      loading.value = false
    }
  }

  return {
    operationalCountries,
    loading,
    error,
    fetchOperationalCountries,
  }
})