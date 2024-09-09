<template>
	<Chart
		type="doughnut"
		:data="chartData"
		:options="chartOptions"
		class="w-full"
	/>
</template>

<script setup>
	import { ref, onMounted } from 'vue';

	onMounted(() => {
		chartData.value = setChartData();
		chartOptions.value = setChartOptions();
	});

	const chartData = ref();
	const chartOptions = ref(null);

	const setChartData = () => {
		return {
			labels: ['A', 'B', 'C'],
			datasets: [
				{
					data: [540, 325, 702],
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(54, 162, 235)',
						'rgb(255, 205, 86)',
					],
				},
			],
		};
	};

	const setChartOptions = () => {
		const documentStyle = getComputedStyle(document.documentElement);
		const textColor = documentStyle.getPropertyValue('--p-text-color');

		return {
			plugins: {
				legend: {
					labels: {
						cutout: '50%',
						color: textColor,
					},
				},
			},
		};
	};
</script>
