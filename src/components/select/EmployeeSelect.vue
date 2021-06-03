<template>
	<div>
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
	</div>
</template>

<script>
import SearchModule from '@/components/search/SearchModule';
import { getCompanyIdx } from '@/utils/cookies';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';
export default {
	components: { SearchModule },
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
		...mapGetters('grantStore', ['grantUserAll', 'department', 'designation']),
	},
	async mounted() {
		try {
			const companyIdx = getCompanyIdx();
			bus.$emit('start:spinner');
			await this.$store.dispatch('grantStore/GRANTUSERS', companyIdx);
			bus.$emit('end:spinner');
			let userIdx = [];
			this.grantUserAll.forEach(value => {
				userIdx.push(value.idx);
			});
			this.userIdx = userIdx;
			this.notAdmins = this.grantUserAll;
			let userResult = userIdx.map(v => {
				return v;
			});
			this.oriUser = userResult;
		} catch (error) {
			console.log(error);
		}
	},
	watch: {
		powerUserIdx() {
			this.compare = true;
		},
		addAdminData() {
			this.$emit('addUserData', this.addAdminData);
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
