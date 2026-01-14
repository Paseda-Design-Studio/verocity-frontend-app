<template>
    <div class="chart-wrapper">
        <Chart
            type="doughnut"
            :data="chartData"
            :options="chartOptions"
            :plugins="chartPlugins"
            class="w-full"
        />
    </div>
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
                    cutout: '75%',
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
			responsive: true,
            maintainAspectRatio: false,
            aspectRatio: undefined,
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
                    padding: 8,
                    labels: {
                        color: '#1B1C1E',
                        boxWidth: 4,
                        borderRadius: '50%',
                        usePointStyle: true,
                        padding: 12,
                        font: {
                            size: 8
                        }
                    },
                },
            },
        };
    };

    const setChartPlugins = () => {
        return [
            {
                id: 'centerTextPlugin',
                beforeDraw: (chart) => {
                    const { ctx } = chart;
                    ctx.restore();

                    // Get the chart area (where the actual donut is drawn)
                    const chartArea = chart.chartArea;
                    const { left, right, top, bottom } = chartArea;

                    // Calculate the center of the actual chart area (donut center)
                    const centerX = (left + right) / 2;
                    const centerY = (top + bottom) / 2;

                    // Primary text (number)
                    const fontSizePrimary = Math.min(right - left, bottom - top) * 0.15;
                    const textPrimary = Number(2420).toFixed(0);
                    ctx.font = `bold ${fontSizePrimary}px Arial`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = '#1B1C1E';

                    // Draw primary text at donut center, slightly above
                    ctx.fillText(textPrimary, centerX, centerY - 6);

                    // Secondary text (label)
                    const fontSizeSecondary = Math.min(right - left, bottom - top) * 0.05;
                    const textSecondary = 'Shipments';
                    ctx.font = `${fontSizeSecondary}px Arial`;
                    ctx.fillStyle = '#3A3B3C';
                    ctx.textAlign = 'center';

                    // Draw secondary text at donut center, slightly below
                    ctx.fillText(textSecondary, centerX, centerY + 10);

                    ctx.save();
                },
            },
        ];
    };
</script>

<style scoped>
	
</style>
