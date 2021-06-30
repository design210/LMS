import { createInstanceWithAuth } from './index';

//개인별 강좌 리스트 전체 호출
function getUserLectureList() {
	return createInstanceWithAuth('/my_lecture/all', {}, {}).get();
}

//개인별 강좌 리스트 한개 호출
function getUserLecture(idx) {
	return createInstanceWithAuth('/my_lecture/' + idx, {}, {}).get();
}

//개인별 강좌 리스트 필터 포함
function getUserLectureFilterList(pages) {
	let param = {
		page: pages.page,
		paginate: pages.paginate,
		search: btoa(unescape(encodeURIComponent(pages.search))),
		status: pages.status,
		order: pages.order,
	};
	return createInstanceWithAuth('/my_lecture/all/pagination', {}, param).get();
}

//강의 상세 : chaptor List
function getLectureInfo(idx) {
	return createInstanceWithAuth('/lecture/info/' + idx, {}, {}).get();
}

//개인별 강좌 / 차시리스트  / 강의 호출
function getUserChapter(idx) {
	return createInstanceWithAuth('/chapter/' + idx, {}, {}).get();
}

//카테노이드 KEY로 동영상 URL가지고 오기
function catenodiUrl(idxs) {
	const param = { my_lecture_idx: idxs.myLectureIdx };
	return createInstanceWithAuth('/resource/kollus/' + idxs.resource_idx, {}, param).get();
}

//CP사 Html
function htmlUrl(idxs) {
	const param = { my_lecture_idx: idxs.myLectureIdx };
	return createInstanceWithAuth('/resource/html/' + idxs.resource_idx, {}, param).get();
}

//전체 강좌 호출 :: 통합으로 사용 안함
function getLectureAll() {
	return createInstanceWithAuth('/user/lecture/all', {}, {}).get();
}

//스크랩 하기
function getLectureScraping(data) {
	let param = { targets: data };
	return createInstanceWithAuth('/user/lecture/scraping', param, {}).put();
}
function getLectureScrapList() {
	const param = { is_scraping: true };
	return createInstanceWithAuth('/user/lecture/all', {}, param).get();
}

//강의를 리스트에 표시
function getLecture(data) {
	const param = { idx: data.idx };
	return createInstanceWithAuth('/user/lecture/' + data.idx, param, {}).post();
}

//대표 강사 정보
function getLectureTutors(idx) {
	return createInstanceWithAuth('/lecture/tutor/' + idx, {}, {}).get();
}
//영상을 본 진도율 가지고 오기 카테노이드 한정
function getLectureVideoRate(data) {
	let idx = data.resource_idx;
	let param = { my_lecture_idx: data.myLectureIdx };
	return createInstanceWithAuth('/resource/progress_rate/' + idx, {}, param).get();
}
// 강의관리 : 강의목록 & 서치 통합
function getLectureManageList(data) {
	let paramData = {
		page: data.page,
		paginate: data.paginate,
		filter: {
			search: data.filter.search,
			mainCategory: data.filter.mainCategory,
			subCategory: data.filter.subCategory,
			difficulty: data.filter.difficulty,
			provider_type: data.filter.provider_type,
		},
	};
	return createInstanceWithAuth('/user/lecture/pagination/', paramData, {}).post();
}
// 강의 카테고리
function getLectureCategories() {
	return createInstanceWithAuth('/category/all', {}, {}).get();
}

export {
	getUserLectureList,
	getUserChapter,
	catenodiUrl,
	getLectureAll,
	getLectureScraping,
	getLecture,
	getLectureScrapList,
	getLectureInfo,
	getLectureTutors,
	getLectureVideoRate,
	htmlUrl,
	getLectureManageList,
	getLectureCategories,
	getUserLectureFilterList,
	getUserLecture,
};
