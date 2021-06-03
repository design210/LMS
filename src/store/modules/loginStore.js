import {
	getAccessTokenCookie,
	getRefreshTokenCookie,
	getUserGrant,
	saveAccessTokenCookie,
	saveRefreshTokenCookie,
	deleteCookie,
	saveCompanyIdx,
	saveUserIdx,
	saveUserName,
	saveUserGrant,
	saveUiGrant,
} from '@/utils/cookies';
import { loginUser } from '@/api/auth';
import { getGrantAdmin } from '@/api/info';
const loginStore = {
	namespaced: true,
	state: {
		accesstoken: getAccessTokenCookie() || '',
		refreshtoken: getRefreshTokenCookie() || '',
		resultMessage: {
			loginFlag: 'error', //success, error
			loginMessage: '',
		},
	},
	getters: {
		accesstoken: state => {
			return state.accesstoken;
		},
		resultMessage: state => {
			return state.resultMessage;
		},
	},
	mutations: {
		clearCookie() {
			deleteCookie('accessToken');
			deleteCookie('refreshToken');
			deleteCookie('companyIdx');
			deleteCookie('userIdx');
			deleteCookie('userName');
			deleteCookie('userGrant');
			deleteCookie('uiGrant');
			deleteCookie('grantList');
			deleteCookie('lectureIdx');
		},
		clearAccessCookie() {
			deleteCookie('accessToken');
		},
		setAccessToken(state, accesstoken) {
			state.accesstoken = accesstoken;
		},
		setRefreshToken(state, refreshtoken) {
			state.refreshtoken = refreshtoken;
		},
		resetAccessToken(state) {
			state.accesstoken = getAccessTokenCookie();
		},
		setResultMessage(state, resultMessage) {
			state.resultMessage = resultMessage;
		},
	},
	actions: {
		async LOGIN({ commit }, userData) {
			try {
				const { data } = await loginUser(userData);
				if (typeof data == 'object') {
					saveCompanyIdx(data.user.company.idx);
					saveUserIdx(data.user.idx);
					saveUserName(data.user.name);
					saveUserGrant(data.user.grant_roles[0].idx);
					commit('setAccessToken', data.accessToken);
					commit('setRefreshToken', data.refreshToken);
					saveAccessTokenCookie(data.accessToken);
					saveRefreshTokenCookie(data.refreshToken);
					commit('setResultMessage', {
						loginFlag: 'success', //success, error
						loginMessage: '정상적으로 로그인 되었습니다.',
					});
					//메뉴권한
					let grantIdx = [];
					const response = await getGrantAdmin([data.user.company.idx, getUserGrant()]);
					response.data.grants.forEach(function (value, index) {
						if (value.grant_role_enrollments.active === 1) {
							grantIdx.push(value.idx);
						}
					});
					saveUiGrant(grantIdx);
				} else {
					commit('setResultMessage', {
						loginFlag: 'error', //success, error
						loginMessage: data,
					});
				}
				return true;
			} catch (error) {
				console.log(error);
				return false;
			}
		},
	},
};

export default loginStore;
