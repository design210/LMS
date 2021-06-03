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
			<v-layout row wrap mb-10>
				<v-flex md4>
					<div class="imageBox">
						<v-img src="https://cdn.vuetifyjs.com/images/cards/house.jpg" :aspect-ratio="16 / 9"></v-img>
						<v-chip class="onlineLabel ma-1" small label text-color="white" color="#333">{{ lectureInfoResult.loc_type }}</v-chip>
					</div>
				</v-flex>
				<v-flex md8 pl20>
					<div class="text-left mt-2">
						<v-chip class="ma-1" small label text-color="white" color="#999">법정의무교육</v-chip>
						<v-chip class="ma-1" small label text-color="white" color="#999">초급</v-chip>
						<v-chip class="ma-1" small label text-color="white" color="blue">사내강의</v-chip>
					</div>
					<v-card-title class="pl-0">
						<div class="display-2 mb-2">{{ lectureInfoResult.loc_subject }}</div>
					</v-card-title>
					<v-card-text class="text--primary pl-0">
						<div>총 X차시 / 총 N시간</div>
						<div>{{ lectureInfoResult.loc_tutor_info }}</div>
					</v-card-text>
					<div class="text-left ma-4 ml-0">
						<v-btn v-show="lectureInfoResult.is_scraping === 0" color="blue-grey" class="white--text" @click="scraping(lectureInfoResult.idx)">
							<v-icon left dark>mdi-bookmark-minus</v-icon>스크랩
						</v-btn>
						<v-btn class="ma-2" color="success" @click="lectureOpenAction()">강의 개설</v-btn>
					</div>
				</v-flex>
			</v-layout>
			<v-layout id="tabMenu" :class="{ tabMenuFixed: isTabmenuActive }">
				<v-tabs fixed-tabs background-color="indigo" dark>
					<v-tab class="text-h5" @click="gotoPosition('position1')">강의 소개</v-tab>
					<v-tab class="text-h5" @click="gotoPosition('position2')">커리큘럼</v-tab>
					<v-tab class="text-h5" @click="gotoPosition('position3')">강사 소개</v-tab>
				</v-tabs>
			</v-layout>
			<v-layout row wrap mt-10 id="position1">
				<v-card-title class="pl-0" style="margin-top: 50px">
					<div class="display-1 mb-2">강의소개</div>
				</v-card-title>
				<v-card-text class="text--primary pa-2 mb-5">
					<div class="text-h6" v-html="handleNewLine(lectureInfoResult.loc_memo)"></div>
					<div class="text-h5 mt-5 mb-1">학습 목표입니다....</div>
					<div class="text-h6" v-html="handleNewLine(lectureInfoResult.loc_course_1)"></div>
				</v-card-text>
				<v-card tile elevation="0" style="height: 150px; width: 100%"></v-card>
			</v-layout>
			<v-layout row wrap mt-10 id="position2">
				<v-card-title class="pl-0" style="margin-top: 50px">
					<div class="display-1 mb-2">커리큘럼</div>
				</v-card-title>
				<v-expansion-panels focusable>
					<v-expansion-panel v-for="(item, index) in lectureInfoResult.chapters" :key="index">
						<v-expansion-panel-header>
							<v-flex class="text-h5">{{ item.lo_subject }}</v-flex>
							<v-flex color="#ccc;" class="text-h5" style="text-align: right; margin-right: 20px">00분</v-flex>
						</v-expansion-panel-header>
						<v-expansion-panel-content class="mt-5 mb-2">
							<div class="text-h7 mb-2">{{ item.lo_closing }}</div>
							<div class="ml-4" v-html="handleNewLine(item.lo_objective)"></div>
						</v-expansion-panel-content>
					</v-expansion-panel>
				</v-expansion-panels>
				<v-card tile elevation="0" class="mt-5 pa-2" style="width: 100%">
					<v-card-title>
						<div class="display-1 mb-0">이런분께 추천드려요~!!</div>
					</v-card-title>
					<div class="ml-5" v-html="handleNewLine(lectureInfoResult.loc_course_2)"></div>
				</v-card>
			</v-layout>
			<v-layout column wrap mt-10 pt-20 id="position3">
				<v-card-title class="pl-0" style="margin-top: 50px">
					<div class="display-1 mb-2">강사소개</div>
				</v-card-title>
				<v-card>
					<div class="d-flex flex-no-wrap justify-left" v-for="(item, index) in lectureTutorResult.tutors" :key="index">
						<v-avatar class="ma-3" size="125" tile>
							<v-img src="https://cdn.vuetifyjs.com/images/cards/house.jpg" style="width: 200px"></v-img>
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
				<div class="display-1 mb-2">수료기준</div>
			</v-card-title>
			<v-layout row mt-1>
				<v-card class="mx-auto col-6">
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
				<v-card class="mx-auto col-6">
					<v-toolbar flat color="#ccc" dark>
						<v-btn icon>
							<v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
						</v-btn>
						<v-toolbar-title class="text-h4">평가</v-toolbar-title>
					</v-toolbar>

					<v-card-text>
						<h2 class="title mb-2">
							<div>{{ lectureInfoResult.loc_course_3 }}</div>
							<div class="text-h5 mt-5 mb-2" style="color: #999">평가방법</div>
							<div class="ml-2" v-html="handleNewLine(lectureInfoResult.loc_course_4)"></div>
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
export default {
	mixins: [loading],
	computed: {
		...mapGetters('lectureStore', ['lectureInfoResult', 'lectureTutorResult']),
		...mapGetters('commonStore', ['scrapList']),
	},
	data: () => ({
		isTabmenuActive: false,
		lectureIdx: '',
		tutors: {},
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
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		gotoPosition(position) {
			this.$vuetify.goTo('#' + position);
		},
		handleScroll() {
			// Any code to be executed when the window is scrolled
			if (window.scrollY >= 544) {
				this.isTabmenuActive = true;
			} else {
				this.isTabmenuActive = false;
			}
		},
		handleNewLine(str) {
			return String(str).replace(/(?:\r\n|\r|\n)/g, '</br>');
		},
		async lectureOpenAction() {
			await this.$store.dispatch('commonStore/SCRAPLIST', [{ lecture: this.lectureInfoResult }]);
			this.$router.push('/lecture/lectureopen');
		},
	},
};
</script>
<style scoped>
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
