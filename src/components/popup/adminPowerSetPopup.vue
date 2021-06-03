<template>
	<defaultPopup @close="close">
		<template slot="head">
			<h2>운영자 권한설정</h2>
		</template>
		<template slot="body">
			<div class="title">메뉴접근권한</div>
			<div class="comment">운영자 등급인 직원에게 노출되는 메뉴를 설정할 수 있습니다.</div>
			<ul class="powerset-list">
				<li v-for="(item, index) in grantGetList" :key="index" class="v-application">
					<v-checkbox v-model="idxSet" :value="item.idx" :label="item.name" class="ck-indigo"></v-checkbox>
				</li>
			</ul>
			<!-- <div>설정값 : {{ idxSet }}</div>
			<div>미설정 값 : {{ powerDel }}</div>
			<div>기존값 : {{ idxOri }}</div> -->
		</template>
		<template slot="footer">
			<div class="v-application btn-pop mt40">
				<v-btn @click="close" class="mr5">취소</v-btn>
				<v-btn color="primary" @click="powerSave">저장</v-btn>
			</div>
			<div class="v-application">
				<v-overlay :absolute="absolute" :value="overlay">
					<v-btn color="success" @click="close"> 저장 되었습니다. </v-btn>
				</v-overlay>
			</div>
		</template>
	</defaultPopup>
</template>

<script>
import defaultPopup from '@/components/popup/defaultPopup';
import { mapGetters } from 'vuex';
import { getCompanyIdx } from '@/utils/cookies';

export default {
	components: { defaultPopup },
	computed: {
		...mapGetters('grantStore', ['grantList']),
	},
	data() {
		return {
			absolute: true,
			overlay: false,
			idxSet: [],
			idxOri: [],
			grantGetList: [],
			powerDel: [],
		};
	},
	watch: {
		idxSet() {
			let difference = this.idxOri.filter(x => !this.idxSet.includes(x));
			this.powerDel = difference;
		},
	},
	async mounted() {
		const companyIdx = getCompanyIdx();
		await this.$store.dispatch('grantStore/GRANTADMIN', { cIdx: companyIdx, idx: 2 });
		let newArray = [];
		this.grantList.forEach(el => {
			if (el.idx !== 1 && el.idx !== 2 && el.idx !== 5 && el.idx !== 7 && el.idx !== 8 && el.idx !== 9 && el.idx !== 10) {
				newArray.push(el);
			}
		});
		this.grantGetList = newArray;
		let poArray = [];
		newArray.forEach(el => {
			poArray.push(el.idx);
		});
		//전체
		this.idxOri = poArray;
		let selected = [];
		newArray.forEach(el => {
			if (el.grant_role_enrollments.active === 1) {
				selected.push(el.idx);
			}
		});
		//선택된 권한
		this.idxSet = selected;
	},
	methods: {
		close() {
			this.$emit('close');
		},
		async powerSave() {
			const companyIdx = getCompanyIdx();
			let addPower = [];
			let removePower = [];
			this.idxSet.forEach(el => {
				addPower.push({
					idx: el,
					active: true,
				});
			});
			this.powerDel.forEach(el => {
				removePower.push({
					idx: el,
					active: false,
				});
			});
			await this.$store.dispatch('grantStore/SETGRANTADMIN', { data: addPower, companyIdx: companyIdx, idx: 2 });
			await this.$store.dispatch('grantStore/DELGRANTADMIN', { data: removePower, companyIdx: companyIdx, idx: 2 });
			this.overlay = !this.overlay;
		},
	},
};
</script>

<style lang="scss" scoped>
.title {
	font-size: 1.8rem;
}
.comment {
	font-size: 1.4rem;
	margin-top: 5px;
	color: rgb(117, 117, 117);
}
ul {
	border: 1px solid rgb(233, 233, 233);
	padding: 20px 20px 25px 20px;
	border-radius: 10px;
	margin-top: 20px;
	& li {
		height: 18px;
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
