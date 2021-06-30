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
			<div class="white-shadow-box-round">
				<div class="top-wrap">
					<div class="total">
						총 <span>{{ this.totalCount }}</span
						>명
					</div>
					<div class="search">
						<v-text-field v-model="search" append-icon="mdi-magnify" label="검색해 주세요" single-line hide-details></v-text-field>
					</div>
				</div>
				<v-data-table :headers="headers" :items="desserts" :items-per-page="15" class="indexList" :search="search" id="account-statistic-table">
				</v-data-table>
			</div>
		</div>
	</div>
</template>

<script>
import { getCompanyIdx } from '@/utils/cookies';
import { timestampToyymmdd } from '@/utils/stamp';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';
export default {
	computed: {
		...mapGetters('grantStore', ['grantUserAll']),
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
					width: '9%',
				},
				{ text: '아이디', value: 'userId', width: '10%' },
				{ text: '부서', value: 'department.title', width: '15%' },
				{ text: '직급', value: 'designation.title', width: '9%' },
				{ text: '생년월일', value: 'birth', width: '11%' },
				{ text: '이메일주소', value: 'email', width: '21%' },
				{ text: '휴대폰번호', value: 'phone', width: '14%' },
				{ text: '입사일', value: 'joinDate', width: '11%' },
			],
			desserts: [],
		};
	},
	async mounted() {
		try {
			await this.$store.dispatch('grantStore/GRANTUSERS', getCompanyIdx());
			bus.$emit('end:spinner');
			this.desserts = this.grantUserAll.map(e => {
				e.joinDate = String(timestampToyymmdd(e.joinDate, 'yyyy-mm-dd'));
				return e;
			});
			this.totalCount = this.grantUserAll.length;
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
	},
};
</script>

<style lang="scss" scoped>
.search {
	width: 400px;
	& input {
		padding: 0 10px !important;
	}
}
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
