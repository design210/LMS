import { getEmployeeList } from '@/api/info';
const employeeStore = {
	namespaced: true,
	state: {
		companyInfo: {},
		employeeData: {},
	},
	getters: {
		companyInfo: state => {
			return state.companyInfo;
		},
		employeeData: state => {
			return state.employeeData;
		},
	},
	mutations: {
		setCompanyInfo(state, companyInfo) {
			state.companyInfo = companyInfo;
		},
		setEmployeeData(state, employeeData) {
			state.employeeData = employeeData.users;
		},
	},
	actions: {
		async EMPLOYEEDATA({ commit }, companyIdx) {
			const { data } = await getEmployeeList(companyIdx);
			commit('setCompanyInfo', data);
			commit('setEmployeeData', data);
			return data;
		},
	},
};

export default employeeStore;
