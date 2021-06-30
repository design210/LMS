import { createInstanceWithAuth } from './index';

//모든 개강 현황
function getLectureAllList(pages) {
	const param = {
		page: pages.page,
		paginate: pages.paginate,
		status: pages.status,
		search: btoa(unescape(encodeURIComponent(pages.search))),
		order: pages.order,
		search_start_date: pages.search_start_date,
		search_end_date: pages.search_end_date,
	};
	return createInstanceWithAuth('/open_lecture/info/all', {}, param).get();
}

//개강 강의 상세
function getLectureInfo(pages) {
	const param = {
		page: pages.page,
		paginate: pages.paginate,
		status: pages.status,
		search: btoa(unescape(encodeURIComponent(pages.search))),
		order: pages.order,
	};
	const lectureIdx = pages.lectureIdx;
	return createInstanceWithAuth('/open_lecture/info/' + lectureIdx, {}, param).get();
}

//엑셀 추출
function getExcel(idx) {
	return createInstanceWithAuth('/open_lecture/export/' + idx.lectureIdx, {}, {}).get();
}

//상세보기 모달 챕터 상세
function getChaptorInfo(idx) {
	return createInstanceWithAuth('/open_lecture/details/' + idx.idx, {}, {}).get();
}

//강의 개설하기
function getLectureOpen(param) {
	return createInstanceWithAuth('/open_lecture/', param, {}).post();
}

//예정강의 삭제하기
function delLecture(lectureIdx) {
	return createInstanceWithAuth('/open_lecture/' + lectureIdx.idx, {}, {}).delete();
}

export { getLectureAllList, getLectureOpen, delLecture, getLectureInfo, getChaptorInfo, getExcel };
