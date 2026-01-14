<script setup lang="ts">
    interface Props {
        filterOptions?: Array<{ name: string }>;
        defaultFilter?: { name: string };
    }

    const props = withDefaults(defineProps<Props>(), {
        filterOptions: () => [
            { name: "This Week" },
            { name: "This Month" },
            { name: "This Year" },
        ],
        defaultFilter: () => ({ name: "This Week" })
    });

    const selectedOption = ref(props.defaultFilter);
</script>

<template>
     <div class="flex flex-col gap-4 bg-white p-6 rounded shadow-sm">
            <div class="flex justify-between items-center">
                <span class="text-lg text-gray-800 font-semibold capitalize">
                    Shipment Volume
                </span>
                <CustomListOption :options="filterOptions" :modelValue="selectedOption" />
            </div>
            <div class="flex">
                <ChartBarChart />
            </div>
        </div>

        <div class="flex flex-col gap-4 bg-white p-6 rounded shadow-sm">
            <div class="flex justify-between items-center">
                <span class="text-lg text-gray-800 font-semibold capitalize">
                    Status overview
                </span>
                <CustomListOption :options="filterOptions" :modelValue="selectedOption" />
            </div>
            <div class="flex">
                <ChartHighChart />
            </div>
        </div>
</template>

<style scoped></style>
