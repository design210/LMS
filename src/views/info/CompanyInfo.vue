<template>
	<div class="contents-wrap">
		<div class="title-header orange">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">회사정보</span>
			</div>
			<h1>회사정보</h1>
			<v-icon>mdi-office-building-marker-outline</v-icon>
		</div>
		<div class="contents-container">
			<div class="white-shadow-box-round">
				<h3>기업명</h3>
				<div class="mt5"><input type="text" v-model="companyName" readonly /></div>
				<h3 class="mt40">대표자</h3>
				<div class="mt5"><input type="text" v-model="ceoName" readonly /></div>
				<h3 class="mt40">사업자등록번호</h3>
				<div class="business-number mt5">
					<input type="text" v-model="bizNo[0]" readonly />
					<input type="text" v-model="bizNo[1]" readonly />
					<input type="text" v-model="bizNo[2]" readonly />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import loading from '@/mixins/loading';
import { getCompanyIdx } from '@/utils/cookies';
import { mapState } from 'vuex';
export default {
	mixins: [loading],
	computed: {
		...mapState('companyStore', {
			companyName: state => state.companyName,
			ceoName: state => state.ceoName,
			bizNo: state => {
				const data = state.bizNo.split('-');
				return data;
			},
		}),
	},
	async mounted() {
		try {
			const Idx = getCompanyIdx();
			await this.$store.dispatch('companyStore/COMPANYINFO', Idx);
		} catch (error) {
			console.log(error);
		}
	},
};
</script>

<style lang="scss" scoped>
.business-number {
	& input[type='text'] {
		&:nth-child(1) {
			width: 80px;
			margin-right: 10px;
		}
		&:nth-child(2) {
			width: 80px;
			margin-right: 10px;
		}
		&:nth-child(3) {
			width: 120px;
		}
	}
}
</style>
