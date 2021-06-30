import { getLectureInfo, getUserLecture } from '@/api/lecture';
const chaptorStore = {
	namespaced: true,
	state: {
		chaptorsList: {},
		chaptors: {},
	},
	getters: {
		chaptorsList: state => {
			return state.chaptorsList;
		},
		chaptors: state => {
			return state.chaptors;
		},
	},
	mutations: {
		setChaptorList(state, cahptorData) {
			state.chaptorsList = cahptorData;
		},
		setChaptor(state, data) {
			state.chaptors = data;
		},
	},
	actions: {
		async CHAPTORLIST({ commit }, idx) {
			const { data } = await getLectureInfo(idx);
			commit('setChaptorList', data);
			return data;
		},
		async CHAPTOR({ commit }, idx) {
			const { data } = await getUserLecture(idx);
			commit('setChaptor', data);
			return data;
		},
	},
};

export default chaptorStore;
