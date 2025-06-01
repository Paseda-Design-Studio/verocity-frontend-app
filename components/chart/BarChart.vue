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
			// maintainAspectRatio: false,
			aspectRatio: 1.5,
			plugins: {
				customCanvasBackgroundColor: {
					color: 'lightGreen',
				},

				legend: {
					display: false,
					position: 'top',
					align: 'center',
					padding: 10,
					labels: {
						color: '#1B1C1E',
						boxWidth: 5,
						borderRadius: '50%',
						usePointStyle: true,
						padding: 28,
					},
				},
			},
			// Adding the custom plugin to display text in the center of the doughnut
		};

		// return {
		// 	plugins: {
		// 		legend: {
		// 			labels: {
		// 				color: '#fff',
		// 			},
		// 		},
		// 	},
		// 	scales: {
		// 		x: {
		// 			ticks: {
		// 				color: textColorSecondary,
		// 			},
		// 			grid: {
		// 				color: surfaceBorder,
		// 			},
		// 		},
		// 		y: {
		// 			beginAtZero: true,
		// 			ticks: {
		// 				color: textColorSecondary,
		// 			},
		// 			grid: {
		// 				color: surfaceBorder,
		// 			},
		// 		},
		// 	},
		// };
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
