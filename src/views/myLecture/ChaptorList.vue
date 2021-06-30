<template>
	<div class="contents-wrap">
		<div class="title-header purple2">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">내 강의실</span>
				<span class="page">강의 리스트</span>
				<span class="page">강의 수강</span>
			</div>
			<h1>강의 수강</h1>
			<v-icon>mdi-television-play</v-icon>
		</div>
		<div class="contents-container">
			<v-layout row wrap mb-10>
				<v-flex md4>
					<div class="imageBox" v-if="this.chaptors.lecture.lecture_thumbnails.length > 0">
						<v-img :src="this.chaptors.lecture.lecture_thumbnails[0].aws_url" :aspect-ratio="16 / 12"></v-img>
					</div>
					<div class="imageBox" v-else>
						<v-img src="https://letuin-expert-cp.s3.ap-northeast-2.amazonaws.com/lecture_thumbnail/no_thumbnail.jpeg" :aspect-ratio="16 / 12"></v-img>
					</div>
				</v-flex>
				<v-flex md8 pl20>
					<v-card-title class="pl-0">
						<div class="display-2 mb-2">{{ chaptorData.subject }}</div>
					</v-card-title>
					<div class="text-left mt-0">
						<v-chip class="ma-1" small label text-color="white" color="#ff6600">{{ mainCategories }}</v-chip>
						<v-chip class="ma-1" small label text-color="white" color="rgb(30, 177, 108)">{{ difficulty }}</v-chip>
						<v-chip class="ma-1" small label text-color="white" color="blue" v-if="inner">사내강의</v-chip>
					</div>
					<v-card-text class="text--primary pl-0 info-wrap mt5">
						<div class="total">총 {{ chaptorData.chapter_count }}차시 / 총 {{ totalTime }}</div>
						<div class="mt5">{{ start }} ~ {{ end }}</div>
						<div class="mt5" v-if="status === 24">개강일까지 D - {{ startday }}</div>
						<div class="mt5" v-if="status === 25">종료일까지 {{ dday }}일 남음</div>
					</v-card-text>
					<div class="mt20">
						<router-link :to="`/chaptorlist/detail/${lectureIdx}`"><v-btn color="primary" class="mr10">강의정보 상세보기</v-btn></router-link>
						<!-- <v-btn color="success">강의자료 다운로드</v-btn> -->
					</div>
				</v-flex>
			</v-layout>
			<div class="status">
				<div class="d-flex title">
					<div class="display-1 mb-2">수강 현황</div>
					<span class="icon ing" v-if="status === 25">수강중</span>
					<span class="icon end" v-if="status === 26">수료</span>
					<span class="icon not-end" v-if="status === 27">미수료</span>
				</div>
				<div class="avg-wrap">
					<div class="avg-box" v-if="status !== 24">
						<h3>나의 진도율</h3>
						<div class="graph-wrap">
							<div class="graph" :style="{ width: avg + '%' }"></div>
						</div>
						<div class="graph-info">
							<div>{{ avg }}%</div>
							<div v-if="lastday !== undefined && lastday !== ''">최근 학습일 : {{ lastday }}</div>
						</div>
						<div class="message" v-if="status === 24 || status === 25">종료일까지 {{ dday }}일 남았어요!</div>
						<div v-if="status === 26 || status === 27" class="end">수강종료! 수고하셨습니다</div>
					</div>
					<div class="avg-box not" v-else><span>아직 수강 전입니다.</span></div>
					<div class="info-box">
						<h3>수료기준</h3>
						<div>진도율 100% 기준 <b>80% 이상 시 수료가능</b></div>
						<h3 class="mt10">평가방법</h3>
						<div>매 차시 진도율 80% 이상일때 진도 완료로 인정</div>
						<div>각 차시 시간 중 총 13분 이상 수강시 수강으로 인정</div>
					</div>
				</div>
			</div>
			<v-layout row wrap mt-10 id="position2">
				<v-card-title class="pl-0 info-top mt50" style="width: 100%">
					<div class="display-1 mb-2">커리큘럼</div>
					<div v-if="status === 25 || status === 26 || status === 27">차시 학습시간 | 내 진도율</div>
					<div v-if="status === 24">차시 학습시간</div>
				</v-card-title>
			</v-layout>
			<div class="chaptor-list">
				<ul v-if="status === 25 || status === 26 || status === 27">
					<li v-for="(item, index) in chaptorList" :key="index">
						<div
							v-if="status === 25"
							class="subject"
							@click="showModalPopup({ idx: item.idx, provider: item.resources[0].provider, type: item.resources[0].type })"
						>
							{{ index + 1 }}차시 {{ item.subject }}
						</div>
						<div v-if="status === 26 || status === 27">{{ index + 1 }}차시 {{ item.subject }}</div>
						<div>{{ parseInt(item.learning_time / 60) }}분 | {{ item.progress_rate }}%</div>
					</li>
				</ul>
				<ul v-if="status === 24">
					<li v-for="(item, index) in chaptorList" :key="index">
						<div>{{ index + 1 }}차시 {{ item.subject }}</div>
						<div>{{ parseInt(item.learning_time / 60) }}분</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import { getPopupOpt } from '@/utils/popup';
import playerVideoPoup from '@/components/popup/PlayerVideoPopup';
import time from '@/utils/time';
import unix from '@/utils/unixTime';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';

export default {
	mixins: [loading],
	computed: {
		...mapGetters('chaptorStore', ['chaptors']),
	},
	data() {
		return {
			chaptorList: [],
			chaptorData: [],
			mainCategories: '',
			difficulty: '',
			totalTime: null,
			inner: false,
			start: '',
			end: '',
			lastday: '',
			id: null,
			lectureIdx: '',
			avg: null,
			status: null,
			dday: null,
			startday: null,
		};
	},
	async mounted() {
		try {
			this.id = this.$route.params.id;
			bus.$emit('start:spinner');
			await this.$store.dispatch('chaptorStore/CHAPTOR', this.id);
			this.chaptorData = this.chaptors.lecture;
			this.mainCategories = this.chaptors.lecture.mainCategory[0].value;
			this.difficulty = this.chaptors.lecture.difficulty[0].value;
			this.lectureIdx = this.chaptors.lecture.idx;
			this.totalTime = time(this.chaptors.lecture.total_learning_time);
			this.inner = this.chaptors.lecture.is_company_lecture;
			this.start = unix(this.chaptors.open_lecture.started_at);
			this.end = unix(this.chaptors.open_lecture.expired_at);
			if (this.chaptors.latest_learning_date !== undefined) {
				this.lastday = unix(this.chaptors.latest_learning_date);
			}
			this.dday = this.chaptors.open_lecture.expired_days;
			this.startday = this.chaptors.open_lecture.started_days;
			this.chaptorList = this.chaptors.chapters;
			this.avg = this.chaptors.progress_rate_avg;
			this.status = this.chaptors.status;
			console.log(this.chaptors);
			bus.$emit('end:spinner');
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		showModalPopup(data) {
			let height = '';
			let width = '';
			//카테노이드
			if (data.type == '2' && data.provider == '4') {
				width = '940px';
				height = '550px';
			} else if (data.type == '9' && data.provider == '10') {
				width = '1000px';
				height = '650px';
			} else {
				//기타 PDF
				width = '1080px';
				height = '880px';
			}
			this.$modal.show(playerVideoPoup, { chaptorIdx: data.idx, lectureIdx: this.id }, getPopupOpt('playerVideoPoup', width, height, false));
		},
	},
};
</script>

<style scoped lang="scss">
.end {
	text-align: center;
	margin-top: 20px;
	font-size: 1.8rem;
}
.icon {
	height: 22px;
	margin-left: 10px;
	margin-top: 2px;
	background: #fff;
}
.chaptor-icon {
	color: rgb(105, 81, 161) !important;
	margin-right: 10px;
	font-size: 3rem;
	vertical-align: -2px !important;
}
.info-wrap {
	& > div {
		font-size: 1.4rem;
	}
}
.status {
	& .title {
		& h2 {
			margin-right: 10px;
		}
		& span {
			border: 1px solid rgb(85, 144, 255);
			border-radius: 3px;
			padding: 0 10px;
			color: rgb(85, 144, 255);
		}
	}
	& .avg-wrap {
		& .avg-box {
			background: #fff;
			border-radius: 10px;
			width: calc(60% - 7px);
			padding: 20px;
			&.not {
				display: flex;
				align-items: center;
				justify-content: center;
			}
			& .graph-wrap {
				background: rgb(235, 235, 235);
				height: 15px;
				margin-top: 10px;
				& .graph {
					background: rgb(63, 145, 238);
					height: 15px;
				}
			}
			& .graph-info {
				display: flex;
				justify-content: space-between;
			}
			& .message {
				text-align: center;
				margin-top: 20px;
				font-size: 1.8rem;
			}
		}
		display: flex;
		justify-content: space-between;
		& .info-box {
			width: calc(40% - 7px);
			padding: 20px;
			background: #fff;
			border-radius: 10px;
		}
	}
}
.chaptor-list {
	& ul {
		background: #fff;
		border-radius: 10px;
		& li {
			display: flex;
			justify-content: space-between;
			padding: 10px 15px;
			border-bottom: 1px dotted #ccc;
			& .subject {
				cursor: pointer;
				&:hover {
					color: rgb(54, 121, 228);
				}
			}
		}
	}
}
.info-top {
	display: flex;
	justify-content: space-between;
}
</style>
