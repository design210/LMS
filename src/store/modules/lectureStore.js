import {
	getUserLectureList,
	getLectureInfo,
	getLectureAll,
	getLectureScraping,
	getLectureScrapList,
	getLecture,
	getLectureTutors,
	getLectureVideoRate,
	getLectureManageList,
	getLectureCategories,
	getUserLectureFilterList,
} from '@/api/lecture';
const lectureStore = {
	namespaced: true,
	state: {
		lectureList: [],
		myLectureList: [],
		lectureScrapingResult: [],
		lectureResult: [],
		myScrapListResult: [],
		myScrapDeleteResult: [],
		lectureOpenResult: [],
		lectureInfoResult: [],
		lectureTutorResult: [],
		lectureVideoRateResult: [],
		lectureManageList: [],
		lectureCategories: [],
		userLectureFilterList: [],
	},
	getters: {
		myLectureList: state => {
			return state.myLectureList;
		},
		lectureList: state => {
			return state.lectureList;
		},
		lectureScrapingResult: state => {
			return state.lectureScrapingResult;
		},
		lectureResult: state => {
			return state.lectureResult;
		},
		myScrapListResult: state => {
			return state.myScrapListResult;
		},
		myScrapDeleteResult: state => {
			return state.myScrapDeleteResult;
		},
		lectureOpenResult: state => {
			return state.lectureOpenResult;
		},
		lectureInfoResult: state => {
			return state.lectureInfoResult;
		},
		lectureTutorResult: state => {
			return state.lectureTutorResult;
		},
		lectureVideoRateResult: state => {
			return state.lectureVideoRateResult;
		},
		lectureManageList: state => {
			return state.lectureManageList;
		},
		lectureCategories: state => {
			return state.lectureCategories;
		},
		userLectureFilterList: state => {
			return state.userLectureFilterList;
		},
	},
	mutations: {
		setMyLectureList(state, myLectureList) {
			state.myLectureList = myLectureList;
		},
		setLectureAll(state, lectureList) {
			state.lectureList = lectureList;
		},
		setLectureScrapingResult(state, lectureScrapingResult) {
			state.lectureScrapingResult = lectureScrapingResult;
		},
		setLectureResult(state, lectureResult) {
			state.lectureResult = lectureResult;
		},
		setMyScrapListResult(state, myScrapListResult) {
			state.myScrapListResult = myScrapListResult;
		},
		setMyScrapDeleteResult(state, myScrapDeleteResult) {
			state.myScrapDeleteResult = myScrapDeleteResult;
		},
		setLectureOpenResult(state, lectureOpenResult) {
			state.lectureOpenResult = lectureOpenResult;
		},
		setLectureInfoResult(state, lectureInfoResult) {
			state.lectureInfoResult = lectureInfoResult;
		},
		setLectureTutorResult(state, lectureTutorResult) {
			state.lectureTutorResult = lectureTutorResult;
		},
		setLectureVideoRateResult(state, lectureVideoRateResult) {
			state.lectureVideoRateResult = lectureVideoRateResult;
		},
		getLectureManageList(state, lecturelist) {
			state.lectureManageList = lecturelist;
		},
		getLectureCategories(state, categories) {
			state.lectureCategories = categories;
		},
		getUserLectureFilterList(state, lectureList) {
			state.userLectureFilterList = lectureList;
		},
	},
	actions: {
		async LECTURELIST({ commit }) {
			const { data } = await getUserLectureList();
			commit('setMyLectureList', data);
			return data;
		},
		async LECTUREINFO({ commit }, idx) {
			const { data } = await getLectureInfo(idx);
			commit('setLectureInfoResult', data);
			return data;
		},
		async LECTURE_PUT({ commit }, paramData) {
			const { data } = await getLecture(paramData);
			commit('setLectureResult', data);
			return data;
		},
		async LECTUREALL({ commit }) {
			const { data } = await getLectureAll();
			commit('setLectureAll', data);
			return data;
		},
		async SCRAPING({ commit }, paramData) {
			const { data } = await getLectureScraping(paramData);
			commit('setLectureScrapingResult', data);
			return data;
		},
		async SCRAPINGLIST({ commit }) {
			const { data } = await getLectureScrapList();
			commit('setMyScrapListResult', data);
			return data;
		},
		async LECTURE_TUTORS({ commit }, idx) {
			const { data } = await getLectureTutors(idx);
			commit('setLectureTutorResult', data);
			return data;
		},
		async VIDEO_RATE({ commit }, param) {
			const { data } = await getLectureVideoRate(param);
			commit('setLectureVideoRateResult', data);
			return data;
		},
		async LECTURE_MANAGE_LIST({ commit }, paramData) {
			const { data } = await getLectureManageList(paramData);
			commit('getLectureManageList', data);
			return data;
		},
		async LECTURE_CATEGORIES({ commit }, paramData) {
			const { data } = await getLectureCategories(paramData);
			commit('getLectureCategories', data);
			return data;
		},
		async LECTURE_FILTER({ commit }, paramData) {
			const { data } = await getUserLectureFilterList(paramData);
			commit('getUserLectureFilterList', data);
			return data;
		},
	},
};

export default lectureStore;
