<template>
	<Chart
		type="pie"
		:data="chartData"
		:options="chartOptions"
		class="w-1/2"
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
			labels: ['A', 'B', 'C', 'D', 'E'],
			datasets: [
				{
					data: [540, 325, 702, 543, 234],
					backgroundColor: [
						'rgb(255, 99, 132)',
						'rgb(54, 162, 235)',
						'rgb(255, 205, 86)',
						'rgb(255, 102, 36)',
						'rgb(255, 112, 56)',
					],
					// Adding border to the chart slices
					borderWidth: 2, // Adjust the width as needed
					borderColor: '#fff', // Change this to any color you want
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
						cutout: '100%',
						color: textColor,
					},
				},
			},
			
		};
	};
</script>
