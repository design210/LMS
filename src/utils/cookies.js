import VueCookies from 'vue-cookies';
function saveAccessTokenCookie(value) {
	VueCookies.set('accessToken', value, '0');
}

function saveRefreshTokenCookie(value) {
	VueCookies.set('refreshToken', value, '0');
}

function getAccessTokenCookie() {
	return VueCookies.get('accessToken');
}

function getRefreshTokenCookie() {
	return VueCookies.get('refreshToken');
}

function saveCompanyIdx(value) {
	VueCookies.set('companyIdx', value, '0');
}

function saveUserIdx(value) {
	VueCookies.set('userIdx', value, '0');
}

function saveUserName(value) {
	VueCookies.set('userName', value, '0');
}

function getCompanyIdx() {
	return VueCookies.get('companyIdx');
}

function getUserIdx() {
	return VueCookies.get('userIdx');
}

function getUserName() {
	return VueCookies.get('userName');
}
//강의 IDX
function saveLectureIdx(value) {
	VueCookies.set('lectureIdx', value, '0');
}
function getLectureIdx() {
	return VueCookies.get('lectureIdx');
}
//권한 관련 쿠키
function saveGrantList(value) {
	VueCookies.set('grantList', value, '0');
}
function saveUserGrant(value) {
	VueCookies.set('userGrant', value, '0');
}
function saveUiGrant(value) {
	VueCookies.set('uiGrant', value, '0');
}
//등급별 메뉴 권한 리스트 - UI용 :Number Array
function getGrantList() {
	return VueCookies.get('grantList');
}
//관리 등급 넘버 - Number
function getUserGrant() {
	return VueCookies.get('userGrant');
}
//라우터용 권한 이름 - Array
function getUiGrant() {
	return VueCookies.get('uiGrant');
}

function deleteCookie(value) {
	VueCookies.remove(value);
}

export {
	saveAccessTokenCookie,
	saveRefreshTokenCookie,
	getAccessTokenCookie,
	getRefreshTokenCookie,
	deleteCookie,
	saveCompanyIdx,
	saveUserIdx,
	saveUserName,
	saveUserGrant,
	saveUiGrant,
	getCompanyIdx,
	getUserIdx,
	getUserName,
	getUserGrant,
	getUiGrant,
	saveGrantList,
	getGrantList,
	saveLectureIdx,
	getLectureIdx,
};
