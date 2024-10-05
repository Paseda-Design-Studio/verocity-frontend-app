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
					backgroundColor: ['rgb(240, 82, 44)'],
				},
			],
		};
	};
	const setChartOptions = () => {
		const documentStyle = getComputedStyle(document.documentElement);
		const textColor = documentStyle.getPropertyValue('--p-text-color');
		const textColorSecondary = documentStyle.getPropertyValue(
			'--p-text-muted-color'
		);
		const surfaceBorder = documentStyle.getPropertyValue(
			'--p-content-border-color'
		);

		return {
			plugins: {
				legend: {
					labels: {
						color: '#fff',
					},
				},
			},
			scales: {
				x: {
					ticks: {
						color: textColorSecondary,
					},
					grid: {
						color: surfaceBorder,
					},
				},
				y: {
					beginAtZero: true,
					ticks: {
						color: textColorSecondary,
					},
					grid: {
						color: surfaceBorder,
					},
				},
			},
		};
	};
</script>

<template>
	<Chart
		type="bar"
		:data="barChartData"
		:options="barChartOptions"
		class="w-full"
	/>
</template>

<style scoped></style>
