<template>
	<div>
		<v-card-title class="popup-title"
			><span>{{ resourceData.lo_subject }}</span>
		</v-card-title>
		<div class="closeButton" @click="closePopup()"><v-icon color="#fff">mdi-close-thick</v-icon></div>
		<div class="v-application">
			<v-progress-linear buffer-value="0" stream :value="videoRate"></v-progress-linear>
			<v-progress-linear color="accent" :value="videoRate" height="25">
				<strong>{{ Math.ceil(videoRate) }}%</strong>
			</v-progress-linear>
		</div>
		<v-card-text v-if="catenodiViewFlag">
			<iframe width="970" height="546" :src="catenoidUrl" frameborder="0"></iframe>
		</v-card-text>
		<v-card-text v-if="htmlViewFlag" class="cp">
			<iframe id="cp" width="970" height="546" :src="htmlUrl" frameborder="0"></iframe>
		</v-card-text>
		<v-card-text v-if="pdfViewFlag">
			<pdf
				:src="pdfUrl"
				ref="pdfComponent"
				:page="currentPage"
				@num-pages="pageCount = $event"
				@page-loaded="currentPage = $event"
				@loaded="loadPdfHandler"
			></pdf>
		</v-card-text>
		<v-card-actions class="popup-footer">
			<div v-if="pdfViewFlag">
				<v-btn @click="changePdfPage(0)" class="turn" :class="{ grey: currentPage == 1 }">
					<v-icon>mdi-check-bold</v-icon>
					<span style="font-size: 15px">이전</span>
				</v-btn>
				{{ currentPage }} / {{ pageCount }}
				<v-btn @click="changePdfPage(1)" class="turn" :class="{ grey: currentPage == pageCount }">
					<v-icon>mdi-check-bold</v-icon>
					<span style="font-size: 15px">다음</span>
				</v-btn>
			</div>
			<v-btn class="" @click="closePopup()">
				<v-icon>mdi-check-bold</v-icon>
				<span style="font-size: 15px">닫기</span>
			</v-btn>
		</v-card-actions>
	</div>
</template>

<script>
import loading from '@/mixins/loading';
import pdf from 'vue-pdf';
import { mapGetters } from 'vuex';
import { getLectureIdx } from '@/utils/cookies';
export default {
	mixins: [loading],
	props: {
		chaptorIdx: String,
	},
	components: {
		pdf,
	},
	computed: {
		...mapGetters('resourceStore', ['resourceData', 'catenoidData', 'htmlData']),
		...mapGetters('lectureStore', ['lectureVideoRateResult']),
	},
	data() {
		//변수생성
		return {
			catenoidUrl: '',
			htmlUrl: '',
			pdfUrl: '',
			catenodiViewFlag: false,
			htmlViewFlag: false,
			pdfViewFlag: false,
			chaptorCode: '',
			resources_idx: '',
			currentPage: 0,
			pageCount: 0,
			myLectureIdx: '',
			videoRate: 0,
			videoRateInterval: '',
		};
	},
	async mounted() {
		try {
			this.myLectureIdx = getLectureIdx();
			this.resourceCode = this.chaptorIdx;
			await this.$store.dispatch('resourceStore/RESOURCEDATA', this.resourceCode);
			let source = this.resourceData.resources[0];
			this.resources_idx = source.idx;
			console.log('resourceIdx : ' + this.resources_idx + '   mylectureIdx :' + this.myLectureIdx);
			//카테노이드
			if (source.type == '2' && source.provider == '4') {
				this.catenoidVideoPlay();
			} else if (source.type == '9' && source.provider == '10') {
				//CP사 html
				this.htmlPlay();
			} else {
				//기타 PDF
				this.pdfPlay();
			}
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		closePopup() {
			clearInterval(this.videoRateInterval);
			this.$emit('close');
		},
		async catenoidVideoPlay() {
			this.catenodiViewFlag = true;
			this.htmlViewFlag = false;
			this.pdfViewFlag = false;
			const data = {
				myLectureIdx: this.myLectureIdx,
				resource_idx: this.resources_idx,
			};
			await this.$store.dispatch('resourceStore/CATENOIDDATA', data);
			this.catenoidUrl = this.catenoidData.resourceURL;
			//진도율 체크
			this.videoRateInterval = setInterval(() => {
				this.videoRateCall();
			}, 10000);
		},
		async htmlPlay() {
			this.catenodiViewFlag = false;
			this.htmlViewFlag = true;
			this.pdfViewFlag = false;
			const data = {
				myLectureIdx: this.myLectureIdx,
				resource_idx: this.resources_idx,
			};
			await this.$store.dispatch('resourceStore/HTML', data);
			this.htmlUrl = this.htmlData.resourceURL;
			//진도율 체크 : iframe 이슈로 인해 시간별로 체크 - 차후 수정 요망
			this.videoRateInterval = setInterval(() => {
				this.videoRateCall();
			}, 5000);
		},
		pdfPlay() {
			this.catenodiViewFlag = false;
			this.htmlViewFlag = false;
			this.pdfViewFlag = true;
			this.pdfUrl = require('@/assets/sample/sampleChaptor.pdf');
			console.log(this.pdfUrl);
		},
		changePdfPage(val) {
			if (val === 0 && this.currentPage > 1) {
				this.currentPage--;
				console.log(this.currentPage);
			}
			if (val === 1 && this.currentPage < this.pageCount) {
				this.currentPage++;
				console.log(this.currentPage);
			}
		},
		// pdf loading time
		loadPdfHandler() {
			this.currentPage = 1;
		},
		async videoRateCall() {
			const data = {
				myLectureIdx: this.myLectureIdx,
				resource_idx: this.resources_idx,
			};
			await this.$store.dispatch('lectureStore/VIDEO_RATE', data);
			if (!isNaN(this.lectureVideoRateResult.progress_rate)) {
				this.videoRate = Number(this.lectureVideoRateResult.progress_rate);
				console.log(this.videoRate);
			}
		},
	},
};
</script>
<style scopeds>
/* Modal */
iframe {
	border: 0;
	margin: 20px 0 0 0;
}
.closeButton {
	position: absolute;
	right: 20px;
	top: 10px;
	color: #fff;
	font-size: 20px;
	cursor: pointer;
}
.modal,
.overlay {
	width: 100%;
	height: 100%;
	position: fixed;
	left: 0;
	top: 0;
}
.overlay {
	opacity: 0.5;
	background-color: black;
}

.v-card {
	position: relative;
	max-width: 100% !important;
	margin: auto;
	margin-top: 10% !important;
	padding: 0 !important;
	background-color: white;
	z-index: 10;
	opacity: 1;
}

.modal-card {
	position: relative;
}
.popup-title {
	height: 60px;
	min-height: 60px;
	padding: 10px 10px 0 10px;
	box-sizing: border-box;
	border-bottom: 3px solid #c0d3ea;
	background-color: #1b77e8;
	color: #ffffff;
	font-weight: bold;
	font-size: 17px !important;
}
.popup-footer {
	position: absolute;
	width: 100%;
	height: 60px;
	bottom: 0px;
	border-top: 3px solid #c0c0c0;
	background-color: #ccc;

	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
