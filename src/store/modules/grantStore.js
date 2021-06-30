import { getUserGrant, saveGrantList, getCompanyIdx } from '@/utils/cookies';
import {
	getGrantUsers,
	setGrantUsers,
	setGrantPowerUsers,
	setGrant,
	delGrant,
	getDepartment,
	getDesignation,
	getGrantAdmin,
	getUserInfo,
} from '@/api/info';

var isEmpty = function (val) {
	if (val === '' || val === null || val === undefined || (val !== null && typeof val === 'object' && !Object.keys(val).length)) {
		return true;
	} else {
		return false;
	}
};
const grantStore = {
	namespaced: true,
	state: {
		grantUserAll: '',
		grantUserLevel1: '',
		grantUserLevel2: '',
		grantUserLevel3: '',
		grantList: [],
		department: [],
		designation: [],
		userInfo: [],
	},
	getters: {
		grantUserAll: state => {
			return state.grantUserAll;
		},
		grantUserLevel1: state => {
			return state.grantUserLevel1;
		},
		grantUserLevel2: state => {
			return state.grantUserLevel2;
		},
		grantUserLevel3: state => {
			return state.grantUserLevel3;
		},
		grantList: state => {
			return state.grantList;
		},
		department: state => {
			return state.department;
		},
		designation: state => {
			return state.designation;
		},
		userInfo: state => {
			return state.userInfo;
		},
	},
	mutations: {
		setGrantUserInfo(state, info) {
			state.grantUserInfo = info;
		},
		setGrantUserInfoAll(state, info) {
			state.grantUserAll = info;
		},
		setGrantUserInfoLevel1(state, info) {
			state.grantUserLevel1 = info;
		},
		setGrantUserInfoLevel2(state, info) {
			state.grantUserLevel2 = info;
		},
		setGrantUserInfoLevel3(state, info) {
			state.grantUserLevel3 = info;
		},
		getGrantList(state, info) {
			state.grantList = info;
		},
		getDepartment(state, info) {
			state.department = info;
		},
		getDesignation(state, info) {
			state.designation = info;
		},
		getUserInfo(state, info) {
			state.userInfo = info;
		},
	},
	actions: {
		//운영자 권한 불러오기
		async GRANTADMIN({ commit }, idxs) {
			try {
				const { data } = await getGrantAdmin([idxs.cIdx, idxs.idx]);
				const grantList = data.grants;
				commit('getGrantList', grantList);
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		//로그인시 개인별 권한 불러오기
		async GRANT({ commit }) {
			try {
				const { data } = await getGrantAdmin([getCompanyIdx(), getUserGrant()]);
				let grantInfo = [];
				data.grants.forEach(function (value, index) {
					if (value.grant_role_enrollments.active == 1) {
						grantInfo.push(value.idx);
					}
				});
				saveGrantList(grantInfo);
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		//해당 권한을 가진 유저 추출
		async GRANTUSERS({ commit }, set) {
			try {
				const { data } = await getGrantUsers(set);
				const userData = data.users;
				const users1 = userData.filter(value => {
					return value.grant_roles[0].idx === 1;
				});
				const users2 = userData.filter(value => {
					return value.grant_roles[0].idx === 2;
				});
				const users3 = userData.filter(value => {
					return value.grant_roles[0].idx === 3;
				});
				commit('setGrantUserInfoAll', userData);
				commit('setGrantUserInfoLevel3', users3);
				commit('setGrantUserInfoLevel2', users2);
				commit('setGrantUserInfoLevel1', users1);
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		//운영자 설정
		async SETGRANTPOWERUSERS({ commit }, set) {
			try {
				const id = set.id;
				if (!isEmpty(set)) {
					for (let i = 0; i < id.length; i++) {
						await setGrantPowerUsers(id[i]);
					}
				}
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		//직원 설정
		async SETGRANTUSERS({ commit }, set) {
			try {
				const id = set.id;
				if (!isEmpty(set)) {
					for (let i = 0; i < id.length; i++) {
						console.log(id[i]);
						await setGrantUsers(id[i]);
					}
				}
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		//운영자 권한 셋업
		async SETGRANTADMIN({ commit }, data) {
			try {
				if (!isEmpty(data)) {
					await setGrant([data.companyIdx, data.data, data.idx]);
				}
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		async DELGRANTADMIN({ commit }, data) {
			try {
				if (!isEmpty(data)) {
					await delGrant([data.companyIdx, data.data, data.idx]);
				}
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		//팀정보 호출
		async GETDEPARTMENT({ commit }, idx) {
			try {
				const { data } = await getDepartment(idx);
				let department = [];
				data.forEach(element => {
					department.push(element.title);
				});
				commit('getDepartment', department);
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		//직급정보 호출
		async GETDESIGNATION({ commit }, idx) {
			try {
				const { data } = await getDesignation(idx);
				let designation = [];
				data.forEach(element => {
					designation.push(element.title);
				});
				commit('getDesignation', designation);
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
		//유저 개인정보 호출
		async USERINFO({ commit }, idx) {
			try {
				const { data } = await getUserInfo(idx);
				commit('getUserInfo', data);
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
	},
};

export default grantStore;
