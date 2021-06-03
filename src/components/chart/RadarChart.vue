<script>
//Importing Bar class from the vue-chartjs wrapper
import { Radar } from 'vue-chartjs';
//Exporting this so it can be used in other components
export default {
	extends: Radar,
	data() {
		return {
			datacollection: {
				//Data to be represented on x-axis
				labels: ['A', 'B', 'C', 'D'],
				datasets: [
					{
						label: 'Data One',
						backgroundColor: '#e43d3da1',
						data: [80, 80, 80, 80],
					},
					{
						label: 'Data Two',
						backgroundColor: '#3d99e4a1',
						data: [40, 60, 50, 90],
					},
				],
			},
			//Chart.js options that controls the appearance of the chart
			options: {
				scales: {
					yAxes: [
						{
							ticks: {
								beginAtZero: true,
							},
							gridLines: {
								display: true,
							},
						},
					],
					xAxes: [
						{
							gridLines: {
								display: false,
							},
						},
					],
				},
				legend: {
					display: true,
				},
				responsive: true,
				maintainAspectRatio: false,
			},
		};
	},
	mounted() {
		//renderChart function renders the chart with the datacollection and options object.
		this.renderChart(this.datacollection, this.options);
	},
};
</script>
