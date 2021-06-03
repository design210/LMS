<template>
	<div class="contents-wrap">
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">운영자관리</span>
			</div>
			<h1>운영자관리</h1>
			<v-icon>mdi-account-multiple-plus-outline</v-icon>
		</div>
		<div class="contents-container">
			<div class="white-shadow-box-round">
				<div class="top-wrap">
					<div class="total">
						총 <span>{{ userNum }}</span
						>명
					</div>
					<search-name @initkeyword="keyword" @onClick="click"></search-name>
				</div>
				<div class="btn-group">
					<v-btn color="blue" dark @click="showModalPopup"> 운영자 추가/삭제 </v-btn>
					<v-btn color="green" dark class="ml5" @click="showModalPowerPopup"> 운영자 권한 설정 <v-icon>mdi-account-cog-outline</v-icon> </v-btn>
				</div>
				<table class="tbl-basic">
					<colgroup>
						<col width="" />
						<col width="" />
						<col width="" />
					</colgroup>
					<thead>
						<tr>
							<th>이름</th>
							<th>아이디</th>
							<th>부서</th>
							<th>직급</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in userInfo" :key="index">
							<td>{{ item.name }}</td>
							<td>{{ item.id }}</td>
							<td>{{ item.department.title }}</td>
							<td>{{ item.designation.title }}</td>
						</tr>
					</tbody>
					<tfoot>
						<tr>
							<td colspan="4" v-if="noData">검색 결과가 없습니다.</td>
							<td colspan="4" v-if="userNum === 0">운영자가 없습니다.</td>
						</tr>
					</tfoot>
				</table>
			</div>
		</div>
	</div>
</template>

<script>
import bus from '@/utils/bus';
import adminSetPopup from '@/components/popup/adminSetPopup';
import adminPowerSetPopup from '@/components/popup/adminPowerSetPopup';
import { getPopupOpt } from '@/utils/popup';
import SearchName from '@/components/search/SearchName.vue';
import { getCompanyIdx } from '@/utils/cookies';
import { mapGetters } from 'vuex';
export default {
	components: { SearchName },
	data() {
		return {
			onKeyword: '',
			userInfo: [],
			userNum: '',
			noData: false,
		};
	},
	watch: {
		onKeyword(newValue, oldValue) {
			if (newValue == '') {
				this.userInfo = this.grantUserLevel2;
				this.noData = false;
			}
		},
	},
	computed: {
		...mapGetters('grantStore', ['grantUserLevel2']),
	},
	async mounted() {
		try {
			const companyIdx = getCompanyIdx();
			bus.$emit('start:spinner');
			await this.$store.dispatch('grantStore/GRANTUSERS', companyIdx);
			bus.$emit('end:spinner');
			this.userInfo = this.grantUserLevel2;
			this.userNum = this.userInfo.length;
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		async dataReset() {
			try {
				const companyIdx = getCompanyIdx();
				bus.$emit('start:spinner');
				await this.$store.dispatch('grantStore/GRANTUSERS', companyIdx);
				bus.$emit('end:spinner');
				this.userInfo = this.grantUserLevel2;
				this.userNum = this.userInfo.length;
			} catch (error) {
				console.log(error);
			}
		},
		showModalPopup() {
			this.$modal.show(adminSetPopup, {}, getPopupOpt('adminSetPopup', '700px', 'auto', false));
		},
		showModalPowerPopup() {
			this.$modal.show(adminPowerSetPopup, {}, getPopupOpt('adminPowerSetPopup', '430px', 'auto', false));
		},
		keyword(data) {
			this.onKeyword = data;
		},
		click() {
			if (this.onKeyword !== '') {
				const searchArray = [];
				this.userInfo.forEach(element => {
					if (element.name.indexOf(this.onKeyword) > -1) {
						searchArray.push(element);
						this.noData = false;
					} else {
						this.noData = true;
					}
				});
				this.userInfo = searchArray;
			}
		},
	},
	created() {
		bus.$on('data:reload', this.dataReset);
	},
	beforeDestroy() {
		bus.$off('data:reload', this.dataReset);
	},
};
</script>

<style lang="scss" scoped>
.top-wrap {
	display: flex;
	justify-content: space-between;
	& .total {
		font-size: 1.5rem;
		margin-top: 8px;
	}
	& .search-wrap {
		display: flex;
		& .select-width {
			width: 150px;
		}
	}
}
.btn-group {
	margin-top: 10px;
	background: rgb(238, 238, 238);
	text-align: right;
	padding: 5px 10px 5px 0;
}
</style>
