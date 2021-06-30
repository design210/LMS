<template>
	<div class="contents-wrap">
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">강의 목록</span>
				<span class="page">강의 상세보기</span>
			</div>
			<h1>강의 상세보기</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<div class="contents-container">
			<v-layout row wrap mb-10 class="d-flex" style="flex-wrap: nowrap">
				<div>
					<div class="imageBox" v-if="this.lectureInfoResult.lecture_thumbnails.length > 0">
						<v-img :src="this.lectureInfoResult.lecture_thumbnails[0].aws_url" :aspect-ratio="16 / 12"></v-img>
					</div>
					<div class="imageBox" v-else>
						<v-img src="https://letuin-expert-cp.s3.ap-northeast-2.amazonaws.com/lecture_thumbnail/no_thumbnail.jpeg" :aspect-ratio="16 / 12"></v-img>
					</div>
				</div>
				<v-flex md8 pl20>
					<!-- 메인 카테고리 난이도 디데이 날짜 데이터 없음-->
					<div class="text-left mt-2">
						<v-chip class="ma-1" small label text-color="white" color="#ff6600">{{ mainCategory }}</v-chip>
						<v-chip class="ma-1" small label text-color="white" color="rgb(30, 177, 108)">{{ difficulty }}</v-chip>
						<v-chip class="ma-1" small label text-color="white" color="blue" v-if="lectureInfoResult.provider_type === 22">사내강의</v-chip>
					</div>
					<v-card-title class="pl-0">
						<div class="display-2 mb-2">{{ lectureInfoResult.loc_subject }}</div>
					</v-card-title>
					<v-card-text class="text--primary pl-0">
						<div class="total">총 {{ lectureInfoResult.loc_ct }}차시 / 총 {{ time }}</div>
						<div class="total">{{ lectureInfoResult.loc_tutor_info }}</div>
					</v-card-text>
					<div class="text-left">
						<v-btn class="ma-2" color="success" @click="lectureOpenAction">강의 개설</v-btn>
						<v-btn class="ma-2" color="primary" @click="listView">목록 보기</v-btn>
					</div>
				</v-flex>
			</v-layout>
			<v-layout id="tabMenu" :class="{ tabMenuFixed: isTabmenuActive }" class="tab-menu">
				<v-tabs fixed-tabs background-color="indigo" dark>
					<v-tab class="text-h5" @click="gotoPosition('position1')">강의 소개</v-tab>
					<v-tab class="text-h5" @click="gotoPosition('position2')">커리큘럼</v-tab>
					<v-tab class="text-h5" @click="gotoPosition('position3')">강사 소개</v-tab>
				</v-tabs>
			</v-layout>
			<div style="height: 40px" v-if="spacer"></div>
			<div class="lecture-info">
				<div id="position1" class="mt50">
					<h2>강의소개</h2>
					<div class="text-h6" v-html="handleNewLine(lectureInfoResult.loc_memo)"></div>
				</div>
				<div class="mt50">
					<h2>학습 목표</h2>
					<div class="text-h6" v-html="handleNewLine(lectureInfoResult.loc_course_1)"></div>
				</div>
			</div>
			<div class="mt50" id="position2">
				<h2>커리큘럼</h2>
				<v-expansion-panels focusable class="mb30">
					<v-expansion-panel v-for="(item, index) in lectureInfoResult.chapters" :key="index">
						<v-expansion-panel-header>
							<v-flex class="text-h5">{{ index + 1 }}차시 {{ item.lo_subject }}</v-flex>
							<v-flex color="#ccc;" class="text-h5" style="text-align: right; margin-right: 20px">{{ parseInt(item.lo_time / 60) }}분</v-flex>
						</v-expansion-panel-header>
						<v-expansion-panel-content class="mt-5 mb-2">
							<div class="text-h7 mb-2">{{ index + 1 }}차시 학습목표</div>
							<div class="ml-4" v-html="handleNewLine(item.lo_objective)"></div>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
				<div class="select">
					<v-card-title>
						<div class="display-1 mb-0">이런분께 추천드려요~!!</div>
					</v-card-title>
					<div class="ml-5" v-html="handleNewLine(lectureInfoResult.loc_course_2)"></div>
				</div>
			</div>
			<v-layout column wrap mt-10 pt-20 id="position3">
				<v-card-title class="pl-0">
					<div class="display-1">강사소개</div>
				</v-card-title>
				<v-card style="margin: 0 !important; width: 50%">
					<div class="d-flex flex-no-wrap justify-left" v-for="(item, index) in lectureTutorResult.tutors" :key="index">
						<v-avatar class="ma-3" size="125" tile v-if="item.tutor_thumbnails.length > 0">
							<v-img :src="item.tutor_thumbnails[0].aws_url" style="width: 200px"></v-img>
						</v-avatar>
						<v-avatar class="ma-3" size="125" tile v-else>
							<v-img src="https://letuin-expert-cp.s3.ap-northeast-2.amazonaws.com/tutor_thumbnail/no_thumbnail.jpeg" style="width: 200px"></v-img>
						</v-avatar>
						<div>
							<v-card-title class="text-h4">{{ item.lt_name }}<span class="text-h5 ml-2">선생님</span></v-card-title>
							<ul>
								<li style="display: flex">
									<span>학력 : </span><span class="text-h6 ml-1">{{ item.lt_educational_history }}</span>
								</li>
								<li style="display: flex"><span>경력 : </span><span class="text-h6 ml-1" v-html="handleNewLine(item.lt_career)"></span></li>
							</ul>
						</div>
					</div>
				</v-card>
			</v-layout>
			<v-card-title class="pl-0 mt-10">
				<div class="display-1">수료기준</div>
			</v-card-title>
			<v-layout>
				<v-card class="mx-auto col-6" style="margin: 0 !important; width: 50%">
					<v-toolbar flat color="#ccc" dark>
						<v-btn icon>
							<v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
						</v-btn>
						<v-toolbar-title class="text-h4">진도율</v-toolbar-title>
					</v-toolbar>

					<v-card-text>
						<h2 class="title mb-2">
							<div>{{ lectureInfoResult.loc_course_5 }}</div>
							<div class="text-h5 mt-5 mb-2" style="color: #999">평가방법</div>
							<div class="ml-2" v-html="handleNewLine(lectureInfoResult.loc_course_6)"></div>
						</h2>
					</v-card-text>
				</v-card>
			</v-layout>
		</div>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import { mapGetters } from 'vuex';
import timeSet from '@/utils/time';
export default {
	mixins: [loading],
	computed: {
		...mapGetters('lectureStore', ['lectureInfoResult', 'lectureTutorResult']),
		...mapGetters('commonStore', ['scrapList']),
		time: function () {
			return timeSet(this.lectureInfoResult.loc_time);
		},
	},
	data: () => ({
		isTabmenuActive: false,
		spacer: false,
		lectureIdx: '',
		tutors: {},
		mainCategory: '',
		difficulty: '',
	}),
	created() {
		window.addEventListener('scroll', this.handleScroll);
	},
	destroyed() {
		window.removeEventListener('scroll', this.handleScroll);
	},
	async mounted() {
		try {
			this.lectureIdx = this.$route.params.id;
			await this.$store.dispatch('lectureStore/LECTUREINFO', this.lectureIdx);
			await this.$store.dispatch('lectureStore/LECTURE_TUTORS', this.lectureIdx);
			this.mainCategory = this.lectureInfoResult.mainCategory[0].value;
			this.difficulty = this.lectureInfoResult.difficulty[0].value;
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		listView() {
			this.$router.push('/lecture/lecturelist');
		},
		gotoPosition(position) {
			this.$vuetify.goTo('#' + position, { offset: +50 });
		},
		handleScroll() {
			// Any code to be executed when the window is scrolled
			console.log(window.scrollY);
			if (window.scrollY >= 594) {
				this.isTabmenuActive = true;
				this.spacer = true;
			} else {
				this.isTabmenuActive = false;
				this.spacer = false;
			}
		},
		handleNewLine(str) {
			return String(str).replace(/(?:\r\n|\r|\n)/g, '</br>');
		},
		async lectureOpenAction() {
			console.log('====>', this.lectureInfoResult);
			await this.$store.dispatch('commonStore/SCRAPLIST', [{ lecture: this.lectureInfoResult }]);
			this.$router.push(`/lecture/lectureopen/${this.lectureIdx}`);
		},
	},
};
</script>
<style scoped>
.select {
	width: 100%;
	border-radius: 10px;
	padding: 15px;
	background: #fff;
	box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
}
.lecture-info {
	display: flex;
	justify-content: space-between;
}
.lecture-info > div {
	width: calc(50% - 10px);
	background: #fff;
	padding: 15px;
	border-radius: 10px;
	box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
}
.imageBox {
	width: 340px !important;
	margin-right: 20px;
}
h2 {
	font-weight: 400;
}
.tab-menu {
	background: rgb(55, 57, 133);
}
.tabMenuFixed {
	width: calc(100% - 310px) !important;
}
.total {
	font-size: 16px;
	line-height: 20px;
}
.imageBox {
	position: relative;
}
.onlineLabel {
	position: absolute;
	top: 3px;
	left: 3px;
}
.bookmark {
	position: absolute;
	top: 3px;
	right: 3px;
}
.tabMenu {
	z-index: 1;
}
#tabMenu {
	width: 100%;
}
.tabMenuFixed {
	position: fixed;
	width: 100%;
	top: 0px !important;
	z-index: 9999;
	margin-top: 0px !important;
}
</style>
