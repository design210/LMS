<template>
	<div class="contents-wrap">
		<div class="title-header purple2">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">내 강의실</span>
				<span class="page">강의 리스트</span>
				<span class="page">강의 정보</span>
			</div>
			<h1>강의정보 상세보기</h1>
			<v-icon>mdi-television-play</v-icon>
		</div>
		<div class="contents-container">
			<h1><v-icon @click="back">mdi-arrow-left</v-icon> {{ lectureInfo.loc_subject }}</h1>
			<div class="bg mt20">
				<h2>강의소개</h2>
				<div class="mt10">{{ lectureInfo.loc_memo }}</div>
			</div>
			<v-layout row wrap mt-10 id="position2">
				<v-card-title class="pl-0 info-top">
					<div class="display-1">커리큘럼</div>
					<div class="ml10">총 {{ lectureInfo.loc_ct }}차시 ( {{ time }} )</div>
				</v-card-title>
			</v-layout>
			<v-expansion-panels focusable class="mt10 mb30">
				<v-expansion-panel v-for="(item, index) in chaptorList" :key="index">
					<v-expansion-panel-header>
						<v-flex class="text-h5">{{ item.lo_subject }}</v-flex>
						<v-flex color="#ccc;" class="text-h5" style="text-align: right; margin-right: 20px">{{ parseInt(item.lo_time / 60) }}분</v-flex>
					</v-expansion-panel-header>
					<v-expansion-panel-content class="mt-5 mb-2">
						<div class="text-h7 mb-2">{{ index + 1 }}차시 학습목표</div>
						<div class="ml-4" v-html="handleNewLine(item.lo_objective)"></div>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
			<div class="bg">
				<v-card-title>
					<div class="display-1 mb-0">이런분께 추천드려요~!!</div>
				</v-card-title>
				<div class="ml-5 mt10" v-html="handleNewLine(lectureInfo.loc_course_2)"></div>
			</div>
			<v-layout column wrap mt-10 pt-20 id="position3">
				<v-card-title class="pl-0">
					<div class="display-1 mb-2">강사소개</div>
				</v-card-title>
				<v-card>
					<div class="d-flex flex-no-wrap justify-left" v-for="(item, index) in tutor" :key="index">
						<v-avatar class="ma-3" size="125" tile v-if="item.tutor_thumbnails.length > 0">
							<v-img :src="item.lecture_thumbnails[0].aws_url" style="width: 200px"></v-img>
						</v-avatar>
						<v-avatar class="ma-3" size="125" tile v-else>
							<v-img src="https://letuin-expert-cp.s3.ap-northeast-2.amazonaws.com/tutor_thumbnail/no_thumbnail.jpeg" style="width: 200px"></v-img>
						</v-avatar>
						<div class="tutor-info">
							<v-card-title class="text-h4">{{ item.lt_familyname }}{{ item.lt_firstname }}<span class="text-h5 ml-2">선생님</span></v-card-title>
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
			<v-layout>
				<v-card class="avg-info">
					<v-toolbar flat color="#ccc" dark>
						<v-btn icon>
							<v-icon>mdi-checkbox-multiple-blank-outline</v-icon>
						</v-btn>
						<v-toolbar-title class="text-h4" style="padding-left: 0">진도율</v-toolbar-title>
					</v-toolbar>

					<v-card-text>
						<h2 class="title mb-2" style="padding: 20px">
							<div>{{ lectureInfo.loc_course_5 }}</div>
							<div class="text-h5 mt-5 mb-2" style="color: #999">평가방법</div>
							<div class="ml-2" v-html="handleNewLine(lectureInfo.loc_course_6)"></div>
						</h2>
					</v-card-text>
				</v-card>
			</v-layout>
		</div>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import time from '@/utils/time';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';

export default {
	mixins: [loading],
	computed: {
		...mapGetters('lectureStore', ['lectureInfoResult', 'lectureTutorResult']),
	},
	data() {
		return {
			lectureInfo: [],
			time: '',
			chaptorList: [],
			tutor: [],
		};
	},
	async mounted() {
		try {
			this.id = this.$route.params.id;
			bus.$emit('start:spinner');
			await this.$store.dispatch('lectureStore/LECTUREINFO', this.id);
			await this.$store.dispatch('lectureStore/LECTURE_TUTORS', this.id);
			this.tutor = this.lectureTutorResult.tutors;
			this.lectureInfo = this.lectureInfoResult;
			this.time = time(this.lectureInfoResult.loc_time);
			this.chaptorList = this.lectureInfoResult.chapters;
			console.log(this.chaptorList);
			console.log(this.lectureInfo);
			bus.$emit('end:spinner');
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		back() {
			this.$router.go(-1);
		},
		handleNewLine(str) {
			return String(str).replace(/(?:\r\n|\r|\n)/g, '</br>');
		},
	},
};
</script>

<style scoped lang="scss">
.bg {
	background: #fff;
	padding: 15px;
	box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.05);
	border-radius: 10px;
	& h2 {
		font-weight: 400;
	}
}
.avg-info {
	width: 50%;
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
.tutor-info {
	padding: 20px 0;
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
