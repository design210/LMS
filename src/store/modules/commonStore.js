import { saveLectureIdx } from '@/utils/cookies';
const commonStore = {
	namespaced: true,
	state: {
		scrapList: [],
		myLectureIdx: '',
	},
	getters: {
		scrapList: state => {
			return state.scrapList;
		},
		myLectureIdx: state => {
			return state.myLectureIdx;
		},
	},
	mutations: {
		setScrapList(state, scrapList) {
			state.scrapList = scrapList;
		},
		getMyLectureIdx(state, idx) {
			state.myLectureIdx = idx;
			saveLectureIdx(idx);
		},
	},
	actions: {
		async SCRAPLIST({ commit }, data) {
			commit('setScrapList', data);
			return data;
		},
	},
};

export default commonStore;
