import { getLectureAllList, getLectureOpen, delLecture, getLectureInfo, getChaptorInfo, getExcel } from '@/api/lectureOpen';
const lectureOpenStore = {
	namespaced: true,
	state: {
		lectureOpenInfo: '',
		lectureOpenResult: '',
		lectureInfo: '',
		chaptorInfo: '',
		excel: '',
	},
	getters: {
		lectureOpenInfo: state => {
			return state.lectureOpenInfo;
		},
		lectureOpenResult: state => {
			return state.lectureOpenResult;
		},
		lectureInfo: state => {
			return state.lectureInfo;
		},
		chaptorInfo: state => {
			return state.chaptorInfo;
		},
		excel: state => {
			return state.excel;
		},
	},
	mutations: {
		setLectureOpenInfo(state, lectureOpenInfo) {
			state.lectureOpenInfo = lectureOpenInfo;
		},
		setLectureOpenResult(state, setLectureOpenResult) {
			state.lectureOpenResult = setLectureOpenResult;
		},
		setLectureInfo(state, setLectureInfo) {
			state.lectureInfo = setLectureInfo;
		},
		setChaptorInfo(state, setChaptorInfo) {
			state.chaptorInfo = setChaptorInfo;
		},
		setExcel(state, setExcel) {
			state.excel = setExcel;
		},
	},
	actions: {
		async LECTURE_OPEN({ commit }, paramData) {
			const { data } = await getLectureOpen(paramData);
			commit('setLectureOpenResult', data);
			return data;
		},
		async LECTURE_ALL_LIST({ commit }, pages) {
			const { data } = await getLectureAllList(pages);
			commit('setLectureOpenInfo', data);
			return data;
		},
		async DEL_LECTURE({ commit }, lectureIdx) {
			const { data } = await delLecture(lectureIdx);
			return data;
		},
		async LECTURE_INFO({ commit }, pages) {
			const { data } = await getLectureInfo(pages);
			commit('setLectureInfo', data);
			return data;
		},
		async CHAPTOR_INFO({ commit }, idx) {
			const { data } = await getChaptorInfo(idx);
			commit('setChaptorInfo', data);
			return data;
		},
		async EXCEL({ commit }, idx) {
			const { data } = await getExcel(idx);
			commit('setExcel', data);
			return data;
		},
	},
};

export default lectureOpenStore;
