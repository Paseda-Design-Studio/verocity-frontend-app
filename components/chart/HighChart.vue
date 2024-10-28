<template>
	<Chart
		type="doughnut"
		:data="chartData"
		:options="chartOptions"
		:plugins="chartPlugins"
		class="w-full"
	/>
</template>

<script setup>
	import { ref, onMounted } from 'vue';

	onMounted(() => {
		chartData.value = setChartData();
		chartOptions.value = setChartOptions();
		chartPlugins.value = setChartPlugins();
	});

	const chartData = ref();
	const chartOptions = ref();
	const chartPlugins = ref();

	const setChartData = () => {
		return {
			labels: [
				'Pending',
				'Out of Delivery',
				'In Transit',
				'Delivered',
				'Delayed',
				'Cancelled',
			],
			datasets: [
				{
					cutout: '75%', // Ensures enough space for text
					data: [54, 20, 68, 100, 12, 33],
					backgroundColor: [
						'rgb(169,169,169)',
						'rgb(0,123,255)',
						'rgb(255,165,0)',
						'rgb(40,167,69)',
						'rgb(236,130,130)',
						'rgb(255,0,0)',
					],
					borderWidth: 2,
					borderColor: '#fff',
				},
			],
		};
	};

	const setChartOptions = () => {
		return {
			// maintainAspectRatio: false,
			aspectRatio: 1.5,
			dataLabels: {
				display: true,
				formatter: (value) => {
					return value + '%';
				},
				align: 'bottom',
				backgroundColor: '#ccc',
				borderRadius: 3,
				font: {
					size: 18,
				},
			},
			plugins: {
				customCanvasBackgroundColor: {
					color: 'lightGreen',
				},

				legend: {
					position: 'right',
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
	};

	const setChartPlugins = () => {
		return [
			{
				id: 'centerTextPlugin',
				beforeDraw: (chart) => {
					const { width, height, ctx } = chart;
					ctx.restore();

					// Primary text (number) properties
					const fontSizePrimary = 36;
					const textPrimary = Number(2420).toFixed(0);
					ctx.font = `${fontSizePrimary}px Arial`;
					ctx.textBaseline = 'middle';
					ctx.fillStyle = '#1B1C1E';

					// Calculate position for primary text
					const textXPrimary = Math.round(
						(width - ctx.measureText(textPrimary).width) / 3
					);
					const textYPrimary = height / 2 - fontSizePrimary / 4; // Slightly above center to balance with secondary text

					// Draw primary text (number)
					ctx.fillText(textPrimary, textXPrimary, textYPrimary);

					// Secondary text (label) properties
					const fontSizeSecondary = 14;
					const textSecondary = 'Shipment';
					ctx.font = `${fontSizeSecondary}px Arial`;
					ctx.fillStyle = '#3A3B3C';

					// Calculate position for secondary text
					const textXSecondary = Math.round(
						(width - ctx.measureText(textSecondary).width) / 3
					);
					const textYSecondary = textYPrimary + fontSizePrimary * 0.8; // Slightly below primary text

					// Draw secondary text (label)
					ctx.fillText(textSecondary, textXSecondary, textYSecondary);

					ctx.save();
				},
			},
			// {
			// 	id: 'customCanvasBackgroundColor',
			// 	beforeDraw: (chart, args, options) => {
			// 		const { ctx } = chart;
			// 		ctx.save();
			// 		ctx.globalCompositeOperation = 'destination-over';
			// 		ctx.fillStyle = options.color || '#99ffff';
			// 		ctx.fillRect(0, 0, chart.width, chart.height);
			// 		ctx.restore();
			// 	},
			// },
		];
	};
</script>
