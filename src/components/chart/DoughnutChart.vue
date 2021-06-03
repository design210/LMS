<script>
//Importing Bar class from the vue-chartjs wrapper
import { Doughnut } from 'vue-chartjs';
//Exporting this so it can be used in other components
export default {
	extends: Doughnut,
	data() {
		return {
			datacollection: {
				//Data to be represented on x-axis
				labels: ['Red', 'Yellow', 'Blue'],
				datasets: [
					{
						label: 'My First Dataset',
						data: [300, 50, 100],
						backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
						hoverOffset: 4,
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
