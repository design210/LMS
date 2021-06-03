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
				<v-stepper-step editable step="1">STEP 01</v-stepper-step>
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
										개설 강의 수 : <span>{{ myScrapListResult.length }}</span> 개
									</div>
								</div>
								<div class="body">
									<table class="list">
										<colgroup>
											<col width="*" />
											<col width="80" />
											<col width="90" />
										</colgroup>
										<tr v-for="(item, index) in myScrapListResult" :key="index" multiple>
											<td class="subject pb-3 pt-3" style="border-left: 1px solid #ddd">
												<div class="text-h5 ml-1">{{ item.lecture.loc_subject }}</div>
												<div class="ml-4 mt-2" style="color: #999">{{ item.lecture.loc_memo }}</div>
											</td>
											<td>총 x차시</td>
											<td style="border-right: 1px solid #ddd">평가 0개</td>
										</tr>
									</table>
								</div>
							</div>
						</div>
					</v-card>
				</v-layout>
				<!--TODO:1차 버전에서는 제외 하기로 함 -->
				<!--v-card-title class="pl-0 pb-0 mt-10">
				<div class="display-1">개설강의 그룹명</div>
			</v-card-title>
			<v-card-title class="pa-0 mt-1">
				<div class="display-0">수강현황 페이지에서 개설강의 그룹명으로 개설된 강의를 검색할 수 있습니다.</div>
			</v-card-title>
			<div>
				<v-text-field></v-text-field>
			</div-->
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
					<v-btn x-large color="blue" class="text-h4 ma-2 white--text" @click="$router.push('/lecture/lecturescrap')"> 취소 </v-btn>
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
					<div class="listWrap mt30">
						<table class="tbl-basic">
							<colgroup>
								<col width="6%" />
								<col width="20%" />
								<col width="20%" />
								<col width="20%" />
								<col width="10%" />
								<col width="15%" />
							</colgroup>
							<thead>
								<tr>
									<th>idx</th>
									<th>개설날짜</th>
									<th>시작날짜</th>
									<th>종료날짜</th>
									<th>강의코드</th>
									<th>결과값</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(row, k) in openResult" :key="k">
									<td>{{ row.idx }}</td>
									<td class="subject">{{ row.createdAt }}</td>
									<td>{{ row.started_at }}</td>
									<td>{{ row.expired_at }}</td>
									<td>{{ row.user_lecture_idx }}</td>
									<td>{{ row.status }}</td>
								</tr>
								<tr v-if="openResult.length == 0">
									<td colspan="6">데이터가 없습니다.</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="mt-5">
						<v-btn x-large color="blue" class="text-h4 ma-2 white--text" @click="$router.push('/lecturelist')">
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
import { mapGetters } from 'vuex';
export default {
	mixins: [loading],
	components: { employeeSelect },
	computed: {
		...mapGetters('commonStore', ['scrapList']),
		...mapGetters('lectureStore', ['lectureOpenResult']),
		dateRangeText() {
			return this.lectureDates.join(' ~ ');
		},
	},
	data() {
		return {
			myScrapListResult: {},
			selectUserList: {},
			lectureDates: [],
			openResult: [],
			isResultPage: false,
		};
	},
	async mounted() {
		try {
			let currDate = new Date();
			let month = parseInt(currDate.getMonth()) + 1;
			month = month <= 9 ? '0' + month : month;
			let nowDate = currDate.getFullYear() + '-' + month + '-' + currDate.getDate();
			this.lectureDates = [nowDate];
			this.myScrapListResult = this.$store.getters['commonStore/scrapList'];
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		userDataAsscess(data) {
			this.selectUserList = data;
		},
		async lectureAction() {
			if (this.myScrapListResult.length <= 0) {
				alert('강좌를 선택해 주세요!');
				return;
			}
			if (this.selectUserList.length <= 0) {
				alert('수강생을 선택해 주세요!');
				return;
			}
			if (this.lectureDates[0] == '' || this.lectureDates[1] == '') {
				alert('강좌를 기간을 선택해 주세요!');
				return;
			}
			//TODO : 해당 부분 API 호출시 아직은 Array로 처리할 수 없어 1건 씩 처리하는데 너무 빠른 API 호출은 API쪽에서 문제가 되어 건당 1초의 시간을 기다렸다 호출하고 있음  향후 기능개선 필요!
			this.myScrapListResult.forEach(item => {
				this.selectUserList.forEach(async user => {
					const data = {
						t_lecture_idx: item.lecture.idx,
						t_user_idx: user,
						started_at: this.lectureDates[0],
						expired_at: this.lectureDates[1],
					};
					await this.$store.dispatch('lectureStore/LECTURE_OPEN', data);
					await this.openResult.push(this.lectureOpenResult);
				});
			});
			this.isResultPage = true;
		},
	},
};
</script>
<style lang="scss" scoped>
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
