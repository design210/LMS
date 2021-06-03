<template>
	<div class="contents-container" ref="pdfarea">
		<h1>환영합니다.</h1>
		<!-- <button @click="exportToPDF">PDF 추출</button>
		<div>
			<img
				src="https://www.letuinexpert.com/__FileSave/Learning_Online_Course/1859/_thum_334x253_239030959_W72FPeLA_52_EBB098EB8F84ECB2B4_8EB8C80_EAB3B5ECA095EC9EA5EBB984EC9D98_EC9DB4ED95B4_-_Etching.png"
			/>
		</div>
		<div style="max-width: 700px">
			<line-chart></line-chart>
			<bar-chart></bar-chart>
			<radar-chart></radar-chart>
			<doughnut-chart></doughnut-chart>
		</div> -->

		<!-- <calendar></calendar> -->
	</div>
</template>

<script>
import html2pdf from 'html2pdf.js';
import LineChart from '@/components/chart/LineChart';
import Calendar from '@/components/Calendar.vue';
import loading from '@/mixins/loading';
import BarChart from '@/components/chart/BarChart.vue';
import RadarChart from '@/components/chart/RadarChart.vue';
import DoughnutChart from '@/components/chart/DoughnutChart.vue';
export default {
	components: { Calendar, LineChart, BarChart, RadarChart, DoughnutChart },
	mixins: [loading],
	data() {
		return {};
	},
	methods: {
		exportToPDF() {
			//window.scrollTo(0, 0);
			html2pdf(this.$refs.pdfarea, {
				margin: 0,
				filename: 'Statistics.pdf',
				image: { type: 'jpg', quality: 0.95 },
				html2canvas: {
					useCORS: true,
					scrollY: 0,
					scale: 1,
					dpi: 300,
					letterRendering: true,
					allowTaint: false,
					ignoreElements: function (element) {
						//pdf에 출력하지 않아야할 dom이 있다면 해당 옵션 사용
						if (element.id == 'pdf-button-area') {
							return true;
						}
					},
				},
				jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4', compressPDF: true },
				pagebreak: { mode: 'avoid-all', before: '#page2el' },
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.contents-container {
	& .chart-wrap {
		display: flex;
		justify-content: space-between;
		& .line {
			width: 49%;
		}
		& .bar {
			width: 49%;
		}
	}
}
</style>
