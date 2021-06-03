import { getUserChapter, catenodiUrl, htmlUrl } from '@/api/lecture';
const resourceStore = {
	namespaced: true,
	state: {
		resourceData: {},
		catenoidData: {},
		htmlData: {},
	},
	getters: {
		resourceData: state => {
			return state.resourceData;
		},
		catenoidData: state => {
			return state.catenoidData;
		},
		htmlData: state => {
			return state.htmlData;
		},
	},
	mutations: {
		setResourceData(state, resourceData) {
			state.resourceData = resourceData;
		},
		setCatenoidData(state, catenoidData) {
			state.catenoidData = catenoidData;
		},
		setHtmlData(state, htmlData) {
			state.htmlData = htmlData;
		},
	},
	actions: {
		async RESOURCEDATA({ commit }, idx) {
			const { data } = await getUserChapter(idx);
			commit('setResourceData', data);
			return data;
		},
		async CATENOIDDATA({ commit }, idx) {
			const { data } = await catenodiUrl(idx);
			commit('setCatenoidData', data);
			return data;
		},
		async HTML({ commit }, idx) {
			const { data } = await htmlUrl(idx);
			commit('setHtmlData', data);
			return data;
		},
	},
};

export default resourceStore;
