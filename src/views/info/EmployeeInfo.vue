<template>
	<div class="contents-wrap">
		<div class="title-header green">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">직원관리</span>
			</div>
			<h1>직원관리</h1>
			<v-icon>mdi-account-box-multiple</v-icon>
		</div>
		<div class="contents-container">
			<!-- <div @click="downloadExcel">엑셀</div> -->
			<div class="white-shadow-box-round">
				<div class="top-wrap">
					<div class="total">
						총 <span>{{ this.totalCount }}</span
						>명
					</div>
					<!--search-kind @selectKind="kind" @initkeyword="keyword" @onClick="click"></search-kind-->
					<v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details></v-text-field>
					<!--v-btn color="btn-search" dark class="ml5" @click="emitClick"><v-icon>mdi-magnify</v-icon></v-btn-->
				</div>
				<v-data-table :headers="headers" :items="desserts" :items-per-page="15" class="indexList" :search="search" id="account-statistic-table">
				</v-data-table>
			</div>
		</div>
	</div>
</template>

<script>
import XLSX from 'xlsx';
import { getCompanyIdx } from '@/utils/cookies';
import { timestampToyymmdd } from '@/utils/common';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';
export default {
	computed: {
		...mapGetters('employeeStore', ['employeeData']),
	},
	data() {
		return {
			search: '',
			totalCount: 0,
			headers: [
				{
					text: '이름',
					align: 'start',
					//sortable: false,
					value: 'name',
				},
				{ text: '아이디', value: 'userId' },
				{ text: '부서', value: 'department.title' },
				{ text: '직급', value: 'designation.title' },
				{ text: '생년월일', value: 'birth' },
				{ text: '이메일주소', value: 'email' },
				{ text: '휴대폰번호', value: 'phone' },
				{ text: '입사일', value: 'joinDate' },
			],
			desserts: [],
		};
	},
	async mounted() {
		try {
			await this.$store.dispatch('employeeStore/EMPLOYEEDATA', getCompanyIdx());
			bus.$emit('end:spinner');
			this.desserts = this.employeeData.map(e => {
				e.joinDate = String(timestampToyymmdd(e.joinDate, 'yyyy-mm-dd'));
				return e;
			});
			this.totalCount = this.employeeData.length;
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		kind(data) {
			this.onKind = data;
		},
		keyword(data) {
			this.onKeyword = data;
		},
		click() {
			alert('버튼 클릭 액션');
		},
		downloadExcel() {
			document.querySelector('table').id = 'Excel';
			var excelData = XLSX.utils.table_to_sheet(document.getElementById('Excel')); // table id를 넣어주면된다
			var workBook = XLSX.utils.book_new(); // 새 시트 생성
			XLSX.utils.book_append_sheet(workBook, excelData, '직원 목록'); // 시트 명명, 데이터 지정
			XLSX.writeFile(workBook, 'employee_list.xlsx'); // 엑셀파일 만듬
		},
	},
};
</script>

<style lang="scss" scoped>
.v-data-table::v-deep th {
	font-size: 14px !important;
}
.v-data-table::v-deep td {
	font-size: 14px !important;
}
.v-data-footer {
	font-size: 14px !important;
}
.top-wrap {
	display: flex;
	justify-content: space-between;
	& .total {
		font-size: 1.5rem;
		margin-top: 8px;
	}
}
.tbl-basic {
	margin-top: -10px;
}
</style>
