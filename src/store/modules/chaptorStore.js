import { getUserLecture } from '@/api/lecture';
const chaptorStore = {
	namespaced: true,
	state: {
		chaptorList: [],
		chaptorData: {},
	},
	getters: {
		chaptorList: state => {
			return state.chaptorList;
		},
		chaptorData: state => {
			return state.chaptorData;
		},
	},
	mutations: {
		setChaptorList(state, chaptorList) {
			//챕터 리스트 데이터
			state.chaptorList = chaptorList;
		},
		setChaptorData(state, chaptorData) {
			//챕터 전체 통합 정보
			state.chaptorData = chaptorData;
		},
	},
	actions: {
		async CHAPTORLIST({ commit }, idx) {
			const { data } = await getUserLecture(idx);
			commit('setChaptorList', data.chapters);
			commit('setChaptorData', data);
			return data;
		},
	},
};

export default chaptorStore;
