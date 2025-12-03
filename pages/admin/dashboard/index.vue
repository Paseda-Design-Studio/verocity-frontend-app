<script setup lang="ts">
  definePageMeta({
    layout: "admin",
  });

  // Custom statistics data
  const dashboardStats = [
    {
      title: "Total Shipments",
      count: 3250,
      subtext: "45% vs last month"
    },
    {
      title: "Active Shipments",
      count: 1420,
      subtext: "12% vs last month"
    },
    {
      title: "Delivered Shipments",
      count: 1830,
      subtext: "28% vs last month"
    }
  ];

  const columns = [
    { label: "Customer Name", key: "customer" },
    { label: "Shipment ID", key: "trackID" },
    { label: "Shipment Date", key: "date" },
    { label: "From", key: "departure" },
    { label: "Destination", key: "destination" },
    { label: "Status", key: "status" },
  ];

  // Sample data
  const activities: shipmentProp[] = [
    {
      id: 1,
      customer: "Jane Oliver",
      trackID: "PCM-034PR0871",
      date: "24 Apr 2023",
      departure: "United States",
      destination: "Ghana",
      status: "pending",
    },
    {
      id: 2,
      customer: "Jane Oliver",
      trackID: "PCM-034PR0871",
      date: "24 Apr 2023",
      departure: "United States",
      destination: "Ghana",
      status: "delivery",
    },
    {
      id: 3,
      customer: "Jane Oliver",
      trackID: "PCM-034PR0871",
      date: "24 Apr 2023",
      departure: "United States",
      destination: "Ghana",
      status: "In Transit",
    },
  ];

  // Action handlers
  const viewShipment = (shipment: shipmentProp) => {
    navigateTo(`/admin/shipments/${shipment.id}`);
  };

  const editShipment = (shipment: shipmentProp) => {
    navigateTo(`/admin/shipments/${shipment.id}/edit`);
  };

  const deleteShipment = async (shipment: shipmentProp) => {
    if (confirm(`Are you sure you want to delete shipment ${shipment.trackID}?`)) {
      try {
        console.log('Deleting shipment:', shipment.trackID);
        // API call to delete shipment and refetch data
      } catch (error) {
        console.error('Error deleting shipment:', error);
      }
    }
  };

  // Pagination state for app-datatable-wrapper
  const currentPage = ref(1);
  const totalPages = ref(1);
  const updatePage = (page: number) => {
    currentPage.value = page;
    // Optionally, fetch new data here
  };
</script>

<template>
  <div>
    <section class="mt-6 md:mt-8 lg:mt-10">
      <AdminTitleHeader type="greeting" title="Welcome" user="Toyosi" subtext="Dashboard Overview"
        :show-divider="true" />
    </section>

    <section class="mt-6 md:mt-8 lg:mt-10">
      <AdminDashboardStatisticSummary :statistics="dashboardStats" />
    </section>

    <section class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6 md:mt-8 lg:mt-10">
      <AdminDashboardAnalytics />
    </section>

    <section class="flex flex-col gap-2 mt-6 md:mt-8 lg:mt-10">
      <div class="flex justify-between items-center">
        <span class="text-lg text-gray-800 font-semibold capitalize">
          Recent Activity
        </span>
        <Button label="view all" severity="secondary" outlined size="small" class="bg-white" />
      </div>

      <div class="relative overflow-x-auto">
        <app-datatable-wrapper
          :columns="columns"
          :tableData="activities"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :updatePage="updatePage"
        >
          <template #table="{ tableData }">
            <app-datatable :columns="columns" :tableData="tableData">
              <template #tableCta="{ item }">
                <AppTableMenu v-if="item" placement="bottom-end" width="md" 
                  @view="viewShipment(item as shipmentProp)"
                  @edit="editShipment(item as shipmentProp)" 
                  @delete="deleteShipment(item as shipmentProp)" />
              </template>
            </app-datatable>
          </template>
        </app-datatable-wrapper>
      </div>
    </section>
  </div>
</template>

<style scoped></style>
