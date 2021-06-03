<template>
	<div>
		<defaultPopup @close="close">
			<template slot="head">
				<h2>운영자 추가/삭제</h2>
			</template>
			<template slot="body">
				<search-module
					@employee="employeeCheck"
					@administrator="adminCheck"
					@addAdmin="addAdminOriData"
					@addUser="addUserOridata"
					:reset="reset"
					:adminsData="admins"
					:notAdminsData="notAdmins"
					:powerprop="powerUserIdx"
					:userprop="userIdx"
					:oriAdminProp="oriAdmin"
					:oriUserProp="oriUser"
					:department="department"
					:designation="designation"
				></search-module>
			</template>
			<template slot="footer">
				<div class="v-application btn-pop mt40">
					<v-btn @click="close" class="mr5">취소</v-btn>
					<v-btn color="primary" @click="powerSave">저장</v-btn>
				</div>
				<div class="v-application">
					<v-overlay :absolute="absolute" :value="overlay">
						<v-btn color="success" @click="closeSave"> 저장 되었습니다. </v-btn>
					</v-overlay>
				</div>
			</template>
		</defaultPopup>
	</div>
</template>

<script>
import defaultPopup from '@/components/popup/defaultPopup';
import SearchModule from '@/components/search/SearchModule';
import { getCompanyIdx } from '@/utils/cookies';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';
export default {
	components: { defaultPopup, SearchModule },
	data() {
		return {
			absolute: true,
			overlay: false,
			powerUserIdx: [],
			userIdx: [],
			addPowerUserIdx: [],
			addUserIdx: [],
			admins: [],
			notAdmins: [],
			oriAdmin: [],
			oriUser: [],
			addAdminData: [],
			addUserData: [],
			reset: false,
			adminCheckYN: false,
			employeeCheckYN: false,
			compare: false,
		};
	},
	computed: {
		...mapGetters('grantStore', ['grantUserLevel2', 'grantUserLevel3', 'department', 'designation']),
	},
	async mounted() {
		try {
			const companyIdx = getCompanyIdx();
			bus.$emit('start:spinner');
			await this.$store.dispatch('grantStore/GRANTUSERS', companyIdx);
			await this.$store.dispatch('grantStore/GETDEPARTMENT', companyIdx);
			await this.$store.dispatch('grantStore/GETDESIGNATION', companyIdx);
			bus.$emit('end:spinner');
			let userIdx = [];
			let powerIdx = [];
			this.grantUserLevel2.forEach(value => {
				powerIdx.push(value.idx);
			});
			this.grantUserLevel3.forEach(value => {
				userIdx.push(value.idx);
			});
			this.powerUserIdx = powerIdx;
			this.userIdx = userIdx;
			this.admins = this.grantUserLevel2;
			this.notAdmins = this.grantUserLevel3;
			let adminResult = powerIdx.map(v => {
				return v;
			});
			let userResult = userIdx.map(v => {
				return v;
			});
			this.oriAdmin = adminResult;
			this.oriUser = userResult;
		} catch (error) {
			console.log(error);
		}
	},
	watch: {
		powerUserIdx() {
			this.compare = true;
		},
	},
	methods: {
		close() {
			this.$emit('close');
		},
		closeSave() {
			this.$emit('close');
			bus.$emit('data:reload');
		},
		addAdminOriData(data) {
			this.addAdminData = data;
		},
		addUserOridata(data) {
			this.addUserData = data;
		},
		async powerSave() {
			bus.$emit('start:spinner');
			await this.$store.dispatch('grantStore/SETGRANTPOWERUSERS', { id: this.addAdminData });
			await this.$store.dispatch('grantStore/SETGRANTUSERS', { id: this.addUserData });
			bus.$emit('end:spinner');
			this.admins = this.grantUserLevel2;
			this.notAdmins = this.grantUserLevel3;
			this.reset = !this.reset;
			this.overlay = !this.overlay;
		},
		employeeCheck(data) {
			if (data === 'none') {
				this.employeeCheckYN = false;
			} else {
				this.employeeCheckYN = true;
			}
		},
		adminCheck(data) {
			if (data === 'none') {
				this.adminCheckYN = false;
			} else {
				this.adminCheckYN = true;
			}
		},
	},
};
</script>
<style lang="scss" scpoed>
.btn-pop {
	justify-content: center;
}
.v-application {
	&.btn-pop {
		justify-content: center;
	}
}
</style>
