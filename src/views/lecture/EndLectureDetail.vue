<template>
	<div class="contents-wrap signup-lecture">
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">수강현황</span>
				<span class="page">수강 중 강의</span>
			</div>
			<h1>{{ subject }}</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<div class="contents-container lecture-status">
			<div class="d-flex justify-space-between half-wrapper">
				<section class="info-wrap">
					<h2>강의정보</h2>
					<p>수강기간 : {{ range }}</p>
					<p>총 {{ chaptorCount }}차시 / 총 {{ time }}</p>
				</section>
				<section class="info-wrap">
					<h2>수료 기준</h2>
					<p>진도율 : 매 차시 진도율 {{ progress }}% 이상</p>
				</section>
			</div>
			<section class="tab-menu mt30">
				<ul class="d-flex">
					<li class="active" @click="statusSet()">전체 {{ totalCnt }}</li>
					<!-- <li @click="statusSet(24)">수강전 {{ readyCnt.length }}</li>
					<li @click="statusSet(25)">수강 중 {{ ingCnt.length }}</li> -->
					<li @click="statusSet(26)">수료 {{ endCnt.length }}</li>
					<li @click="statusSet(27)">미수료 {{ notEndCnt.length }}</li>
				</ul>
			</section>
			<section class="d-flex justify-space-between mt30">
				<v-btn depressed color="primary" @click="downloadExcel"> <v-icon color="white">mdi-download-outline</v-icon> 전체 다운로드 </v-btn>
				<search-name :placeholderProp="placeholder" :widthProp="width" @initkeyword="emitkeyword" @onClick="emitClick"></search-name>
			</section>

			<table class="tbl-basic mt10">
				<caption>
					수강생 정보
				</caption>
				<thead>
					<tr>
						<th>이름(아이디)</th>
						<th>진도율</th>
						<th>최근 학습일</th>
						<th>수강 상태</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in setLectureList" :key="index">
						<td>{{ item.user.name }}</td>
						<td>{{ item.progress_rate_avg }}%</td>
						<td v-if="item.latest_learning_date !== undefined">{{ item.latest_learning_date }}</td>
						<td v-else>-</td>
						<td v-if="item.status === 24"><span class="i-not">수강전</span></td>
						<td v-if="item.status === 27"><span class="i-not">미수료</span></td>
						<td v-if="item.status === 25"><span class="i-ing">수강중</span></td>
						<td v-if="item.status === 26"><span class="i-end">수료</span></td>
						<td>
							<v-btn @click="showModalPopup({ idx: item.idx })">상세보기 <v-icon>mdi-chevron-right</v-icon></v-btn>
						</td>
					</tr>
				</tbody>
				<tfoot v-if="setLectureList.length === 0">
					<tr>
						<td colspan="5">수강생이 없습니다.</td>
					</tr>
				</tfoot>
			</table>
			<div class="text-center mt20" v-if="setLectureList.length > 0">
				<v-pagination v-model="page" :length="paginationTotal" @input="reload"></v-pagination>
			</div>
		</div>
		<!-- excel -->
		<table id="excel" v-show="false">
			<tr>
				<td colspan="6"></td>
			</tr>
			<tr>
				<td colspan="6">교육 수료결과</td>
			</tr>
			<tr>
				<td colspan="6"></td>
			</tr>
			<tr>
				<td colspan="6">회사명 : {{ this.excel.company_name }}</td>
			</tr>
			<tr>
				<td colspan="6">강의명 : {{ this.excel.lecture_subject }}</td>
			</tr>
			<tr>
				<td colspan="6">수강기간 : {{ this.excel.lecture_period }}</td>
			</tr>
			<tr>
				<td colspan="6">
					총 수강인원 : 총 {{ this.excel.total_count }}명 (수료자 : {{ this.excel.total_completions_count }}명 / 미수료자 :
					{{ this.excel.total_non_completions_count }}명 )
				</td>
			</tr>
			<tr>
				<td colspan="6"></td>
			</tr>
			<tr>
				<td>번호</td>
				<td>아이디</td>
				<td>이름</td>
				<td>부서</td>
				<td>진도율</td>
				<td>수료여부</td>
			</tr>
			<tr v-for="(item, index) in this.excel.my_lectures" :key="index">
				<td>{{ index + 1 }}</td>
				<td>{{ item.user_id }}</td>
				<td>{{ item.user_name }}</td>
				<td>{{ item.department_name }}</td>
				<td>{{ item.progress_rate }}</td>
				<td>{{ item.is_completions }}</td>
			</tr>
		</table>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import SearchName from '@/components/search/SearchName.vue';
import { getPopupOpt } from '@/utils/popup';
import lectureDetail from '@/components/popup/LectureDetailPopup.vue';
import timeSet from '@/utils/time';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';
import $ from 'jquery';
import XLSX from 'sheetjs-style';
export default {
	components: { SearchName },
	mixins: [loading],
	computed: {
		...mapGetters('lectureOpenStore', ['lectureInfo', 'excel']),
	},
	data() {
		return {
			totalCnt: null,
			readyCnt: [],
			ingCnt: [],
			endCnt: [],
			notEndCnt: [],
			placeholder: '직원이름 또는 아이디를 입력하세요',
			width: '300px',
			grpahPercent: 30,
			setLectureList: [],
			paginationTotal: null,
			subject: '',
			range: '',
			chaptorCount: null,
			progress: null,
			time: '',
			page: 1,
			latestLearningDate: '',
			paginate: 10,
			status: null,
			search: '',
			order: 1,
		};
	},
	methods: {
		//검색어 emit
		emitkeyword(data) {
			this.search = data;
		},
		//검색버튼 클릭
		emitClick() {
			this.reload();
		},
		showModalPopup(data) {
			this.$modal.show(lectureDetail, { idx: data.idx }, getPopupOpt('lectureDetail', '600px', 'auto', false));
		},
		statusSet(num) {
			this.status = num;
			this.reload();
		},
		pagenation() {
			let pageLength = this.lectureInfo.rows.length / this.paginate + (this.lectureInfo.rows.length % this.paginate == 0 ? 0 : 1);
			this.paginationTotal = Math.floor(pageLength);
		},
		async reload() {
			try {
				await this.$store.dispatch('lectureOpenStore/LECTURE_INFO', {
					page: this.page,
					paginate: this.paginate,
					status: this.status,
					search: this.search,
					order: this.order,
					lectureIdx: this.$route.params.id,
				});
				this.setLectureList = this.lectureInfo.rows;
				this.pagenation();
			} catch (error) {
				console.log(error);
			}
		},
		downloadExcel() {
			if (this.setLectureList.length > 0) {
				var excelData = XLSX.utils.table_to_sheet(document.getElementById('excel'));
				excelData.A2.s = {
					font: {
						sz: 18,
						bold: true,
						color: { rgb: 'ffffff' },
					},
					alignment: {
						horizontal: 'center',
					},
					fill: {
						fgColor: {
							rgb: '221c47',
						},
					},
				};
				excelData.A4.s = {
					font: {
						sz: 12,
						bold: true,
					},
				};
				excelData.A5.s = {
					font: {
						sz: 12,
						bold: true,
					},
				};
				excelData.A6.s = {
					font: {
						sz: 12,
						bold: true,
					},
				};
				excelData.A7.s = {
					font: {
						sz: 12,
						bold: true,
					},
				};
				excelData.A9.s = {
					font: {
						sz: 12,
						bold: true,
					},
					fill: {
						fgColor: {
							rgb: 'c0c0c0',
						},
					},
					alignment: {
						horizontal: 'center',
					},
				};
				excelData.B9.s = {
					font: {
						sz: 12,
						bold: true,
					},
					fill: {
						fgColor: {
							rgb: 'c0c0c0',
						},
					},
					alignment: {
						horizontal: 'center',
					},
				};
				excelData.C9.s = {
					font: {
						sz: 12,
						bold: true,
					},
					fill: {
						fgColor: {
							rgb: 'c0c0c0',
						},
					},
					alignment: {
						horizontal: 'center',
					},
				};
				excelData.D9.s = {
					font: {
						sz: 12,
						bold: true,
					},
					fill: {
						fgColor: {
							rgb: 'c0c0c0',
						},
					},
					alignment: {
						horizontal: 'center',
					},
				};
				excelData.E9.s = {
					font: {
						sz: 12,
						bold: true,
					},
					fill: {
						fgColor: {
							rgb: 'c0c0c0',
						},
					},
					alignment: {
						horizontal: 'center',
					},
				};
				excelData.F9.s = {
					font: {
						sz: 12,
						bold: true,
					},
					fill: {
						fgColor: {
							rgb: 'c0c0c0',
						},
					},
					alignment: {
						horizontal: 'center',
					},
				};
				var workBook = XLSX.utils.book_new();
				XLSX.utils.book_append_sheet(workBook, excelData, '수강 현황');
				XLSX.writeFile(workBook, 'lecture_status.xlsx');
			} else {
				alert('수강생 데이터가 없습니다.');
			}
		},
	},
	async mounted() {
		const $menu = $('.lecture-status .tab-menu li');
		$menu.click(function () {
			$menu.removeClass('active');
			$(this).addClass('active');
		});
		bus.$emit('start:spinner');
		await this.$store.dispatch('lectureOpenStore/LECTURE_INFO', {
			page: this.page,
			paginate: this.paginate,
			status: this.status,
			search: this.search,
			order: this.order,
			lectureIdx: this.$route.params.id,
		});
		bus.$emit('end:spinner');
		await this.$store.dispatch('lectureOpenStore/EXCEL', { lectureIdx: this.$route.params.id });
		this.excel.my_lectures.forEach(ele => {
			if (ele.is_completions === false) {
				ele.is_completions = '미수료';
			} else {
				ele.is_completions = '수료';
			}
		});
		this.setLectureList = this.lectureInfo.rows;
		this.subject = this.lectureInfo.subject;
		this.range = this.lectureInfo.display_lecture_info.lecture_period;
		this.chaptorCount = this.lectureInfo.display_lecture_info.chapter_count;
		this.time = timeSet(this.lectureInfo.display_lecture_info.learning_time);
		this.progress = this.lectureInfo.display_completion_info.progress_rate_over;
		this.totalCnt = this.lectureInfo.rows.length;
		this.lectureInfo.rows.forEach(ele => {
			if (ele.status === 24) {
				this.readyCnt.push(ele);
			}
		});
		this.lectureInfo.rows.forEach(ele => {
			if (ele.status === 25) {
				this.ingCnt.push(ele);
			}
		});
		this.lectureInfo.rows.forEach(ele => {
			if (ele.status === 26) {
				this.endCnt.push(ele);
			}
		});
		this.lectureInfo.rows.forEach(ele => {
			if (ele.status === 27) {
				this.notEndCnt.push(ele);
			}
		});
		this.pagenation();
	},
};
</script>
<style lang="scss" scoped>
.half-wrapper {
	& .info-wrap {
		background: #fff;
		width: calc(50% - 10px);
		border-radius: 10px;
		padding: 20px;
	}
}
.tab-menu {
	& ul {
		& li {
			background: rgb(230, 230, 230);
			height: 30px;
			padding: 0 20px;
			border-radius: 15px;
			line-height: 30px;
			margin-right: 10px;
			cursor: pointer;
			&.active {
				background: rgb(13, 159, 226);
				color: #fff;
			}
		}
	}
}
#excel {
	position: fixed;
	top: 0;
	left: 0;
}
</style>
