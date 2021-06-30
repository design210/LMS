import { createInstanceWithAuth } from './index';
//Grant 유저 전체 정보 호출
function getGrantUsers(companyIdx) {
	return createInstanceWithAuth('/company/infoWithUsers/' + companyIdx, {}, {}).get();
}
//유저 개인 정보 호출
function getUserInfo(idx) {
	return createInstanceWithAuth('/user/info/' + idx.idx, {}, {}).get();
}
//회사 정보 호출
function getCompanyInfo(companyIdx) {
	return createInstanceWithAuth('/company/info/' + companyIdx, {}, {}).get();
}

//Grant 개인별 권한 정보 호출 : 일반, 운영자, 대표 구분 없음
function getGrantAdmin(idx) {
	const param = { company_idx: idx[0] };
	return createInstanceWithAuth('/grant/grant_role/' + idx[1], param, {}).get();
}

//Grant 팀 정보 호출
function getDepartment(companyIdx) {
	return createInstanceWithAuth('/company/departments/' + companyIdx, {}, {}).get();
}
//Grant 직급 정보 호출
function getDesignation(companyIdx) {
	return createInstanceWithAuth('/company/designation/' + companyIdx, {}, {}).get();
}
//Grant 운영자로 권한 변경
function setGrantPowerUsers(data) {
	return createInstanceWithAuth('/user/grant_role/' + data, { grant_role_idx: 2 }, {}).put();
}
//Gramt 일반직원으로 권한 변경
function setGrantUsers(data) {
	return createInstanceWithAuth('/user/grant_role/' + data, { grant_role_idx: 3 }, {}).put();
}

//Grant 운영자 메뉴 권한 추가
function setGrant(data) {
	return createInstanceWithAuth('/grant/grant_role/' + data[2], { updateGrants: data[1] }, { company_idx: data[0] }).put();
}

//Grant 운영자 메뉴 권한 제거
function delGrant(data) {
	return createInstanceWithAuth('/grant/grant_role/' + data[2], { updateGrants: data[1] }, { company_idx: data[0] }).put();
}

export {
	getCompanyInfo,
	getGrantUsers,
	setGrantUsers,
	setGrantPowerUsers,
	setGrant,
	delGrant,
	getDepartment,
	getDesignation,
	getGrantAdmin,
	getUserInfo,
};
