<template>
	<div class="contents-wrap lecture-open">
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">강의 목록</span>
				<span class="page">강의 개설</span>
			</div>
			<h1>강의 개설</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<v-stepper alt-labels class="mt-10">
			<v-stepper-header>
				<v-stepper-step step="1" class="step1">STEP 01</v-stepper-step>
				<v-divider></v-divider>
				<v-stepper-step :complete="isResultPage" step="2">STEP 02</v-stepper-step>
			</v-stepper-header>
		</v-stepper>
		<v-layout justify-center class="mt-10">
			<div class="contents-container" v-show="!isResultPage">
				<v-card-title class="pl-0 pb-0 mt-0 mb-2">
					<div class="display-1">개설 강의</div>
				</v-card-title>
				<v-layout>
					<v-card class="pa-4 mt-0" style="background-color: #fff !important">
						<div class="v-application">
							<div class="scrap-wrap">
								<div class="header">
									<div class="select">
										개설 강의 <span>{{ myScrapListResult.length }}</span> 개
									</div>
								</div>
								<div class="body">
									<table class="list">
										<colgroup>
											<col width="*" />
											<col width="80" />
										</colgroup>
										<tr v-for="(item, index) in myScrapListResult" :key="index" multiple>
											<td class="subject pb-3 pt-3" style="border-left: 1px solid #ddd">
												<div class="text-h5 ml-1">{{ item.lecture.loc_subject }}</div>
											</td>
											<td>총 {{ item.lecture.loc_ct }}차시</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
					</v-card>
				</v-layout>
				<v-card-title class="pl-0 pb-0 mt-10 mb-2">
					<div class="display-1">수강생 선택</div>
				</v-card-title>
				<v-layout>
					<v-card class="pa-4 mt-0" style="background-color: #fff !important; width: 100%">
						<employeeSelect @addUserData="userDataAsscess"></employeeSelect>
					</v-card>
				</v-layout>
				<v-card-title class="pl-0 pb-0 mt-10 mb-2">
					<div class="display-1">수강 기간 선택</div>
				</v-card-title>
				<v-layout>
					<v-card class="pa-4 mt-0 row" style="background-color: #fff !important; width: 100%">
						<v-col class="pr-5 mt-0" cols="12" sm="6">
							<v-date-picker class="mt-0" v-model="lectureDates" locale="ko-KR" full-width range></v-date-picker>
						</v-col>
						<v-col cols="12" sm="6">
							<v-text-field id="dateRange" v-model="dateRangeText" readonly></v-text-field>
						</v-col>
					</v-card>
				</v-layout>
				<div class="text-center ma-10">
					<v-btn x-large color="blue" class="text-h4 ma-2 white--text" @click="cancel()"> 취소 </v-btn>
					<v-btn x-large color="blue-grey" class="text-h4 ma-2 white--text" @click="lectureAction()">
						개설하기
						<v-icon right dark>mdi-cloud-upload</v-icon>
					</v-btn>
				</div>
			</div>
			<div class="contents-container" v-show="isResultPage">
				<v-stepper alt-labels>
					<v-stepper-step step="1" complete></v-stepper-step>
				</v-stepper>
				<div class="text-center">
					<v-sheet class="display-2 mb-2">강의 개설이 완료되었습니다.</v-sheet>
					<v-sheet class="display-0 mb-10">개설된 강의는 수강현황 페이지에서 확인 가능합니다.</v-sheet>
					<div class="mt-5">
						<v-btn x-large color="blue" class="text-h4 ma-2 white--text" @click="home">
							수강현황 페이지로 이동
							<v-icon right dark>mdi-cloud-upload</v-icon>
						</v-btn>
					</div>
				</div>
			</div>
		</v-layout>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import employeeSelect from '@/components/select/EmployeeSelect';
import time from '@/utils/unixTime';
import { mapGetters } from 'vuex';
import { getPopupOpt } from '@/utils/popup';
import cancelPopup from '@/components/popup/cancelPopup.vue';
export default {
	mixins: [loading],
	components: { employeeSelect },
	computed: {
		...mapGetters('commonStore', ['scrapList']),
		...mapGetters('lectureStore', ['lectureInfoResult']),
		...mapGetters('lectureOpenStore', ['lectureOpenResult']),
		dateRangeText() {
			let date = this.lectureDates;
			let align = date.sort();
			let dateValue = align.join(' ~ ');
			return dateValue;
		},
	},
	data() {
		return {
			myScrapListResult: {},
			selectUserList: {},
			lectureDates: [],
			openResult: [],
			isResultPage: false,
			lectureResult: [],
			idx: null,
			lectureIdx: null,
			createdAt: '',
			startedAt: '',
			expiredAt: '',
		};
	},
	async mounted() {
		try {
			this.lectureIdx = this.$route.params.id;
			await this.$store.dispatch('lectureStore/LECTUREINFO', this.lectureIdx);
			this.myScrapListResult = [
				{
					lecture: this.lectureInfoResult,
				},
			];
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		home() {
			this.$router.push('/lecture/signuplecture');
		},
		cancel() {
			this.$modal.show(cancelPopup, {}, getPopupOpt('cancelPopup', '300px', '200px', false));
		},
		userDataAsscess(data) {
			this.selectUserList = data;
		},
		async lectureAction() {
			if (this.selectUserList.length == undefined) {
				alert('수강생을 선택해 주세요!');
				return;
			}
			if (this.lectureDates[0] == '' || this.lectureDates[1] == '' || this.lectureDates[0] == undefined || this.lectureDates[1] == undefined) {
				alert('강좌를 기간을 선택해 주세요!');
				return;
			}
			const data = {
				lecture_idx: this.myScrapListResult[0].lecture.idx,
				users: this.selectUserList,
				started_at: this.lectureDates[0],
				expired_at: this.lectureDates[1],
			};
			await this.$store.dispatch('lectureOpenStore/LECTURE_OPEN', data);
			this.isResultPage = true;
			this.idx = this.lectureOpenResult.openLecture.idx;
			this.createdAt = time(this.lectureOpenResult.openLecture.created_at);
			this.startedAt = time(this.lectureOpenResult.openLecture.started_at);
			this.expiredAt = time(this.lectureOpenResult.openLecture.expired_at);
			this.lectureIdx = this.lectureOpenResult.openLecture.lecture_idx;
		},
	},
};
</script>
<style lang="scss" scoped>
.step1 {
	cursor: default !important;
	&:hover {
		background: transparent !important;
	}
	&:active {
		background: transparent !important;
	}
}
.header {
	background: rgb(187, 207, 243);
	display: flex;
	padding: 15px;
	border-radius: 5px 5px 0 0;
	justify-content: space-between;
}
.body {
	& .list {
		& tr {
			& td {
				background: rgb(236, 236, 236);
				text-align: center;
				padding: 7px;
				border-bottom: 1px dotted #ddd;
				&.subject {
					text-align: left;
				}
			}
			&:nth-child(even) {
				& td {
					background: #fff;
				}
			}
		}
	}
}
</style>
