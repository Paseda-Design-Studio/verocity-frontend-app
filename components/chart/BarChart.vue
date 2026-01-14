<script lang="ts" setup>
	/*
 TODO:
Map this props to a type of ARRAY
 */

	const props = defineProps<{
		data?: string;
	}>();

	onMounted(() => {
		barChartData.value = setChartData();
		barChartOptions.value = setChartOptions();
	});

	const barChartData = ref();
	const barChartOptions = ref();

	const setChartData = () => {
		return {
			labels: ['M', 'T', 'W', 'TH', 'F', 'S', 'S'],
			datasets: [
				{
					data: [540, 325, 702, 620, 345, 123, 987],
					backgroundColor: ['rgb(240,82,44)'],
				},
			],
		};
	};
	const setChartOptions = () => {
		return {
			maintainAspectRatio: false, // Add this
			aspectRatio: undefined,
			responsive: true,
			scales:{
				
			},
			
			plugins: {
				customCanvasBackgroundColor: {
					color: 'lightGreen',
					
				},
				tooltip: {
					enabled: true,
					mode: 'index',
					intersect: false,
				},
				

				legend: {
					display: false,
				},
				
			},
			hover:{},
			// reduce the width of the bar
			barThickness: 24,
			borderRadius: 5,
			
		};
	};
</script>

<template>
	<div class="chart-wrapper">
		<Chart
			type="bar"
			:data="barChartData"
			:options="barChartOptions"
			class="w-full"
		/>
	</div>
</template>

<style scoped>
.chart-wrapper {
    height: 180px;
    width: 100%;
}
</style>
