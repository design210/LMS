import { getCompanyInfo } from '@/api/info';
const companyStore = {
	namespaced: true,
	state: {
		companyName: '',
		ceoName: '',
		bizNo: '',
	},
	mutations: {
		setCompanyName(state, companyName) {
			state.companyName = companyName;
		},
		setCeoName(state, ceoName) {
			state.ceoName = ceoName;
		},
		setBizNo(state, bizNo) {
			state.bizNo = bizNo;
		},
	},
	actions: {
		async COMPANYINFO({ commit }, idx) {
			try {
				const { data } = await getCompanyInfo(idx);
				commit('setCompanyName', data.name);
				commit('setCeoName', data.ceo_name);
				commit('setBizNo', data.biz_no);
				return true;
			} catch (error) {
				console.log(error);
			}
		},
	},
};

export default companyStore;
