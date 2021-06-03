import { saveAccessTokenCookie, getRefreshTokenCookie } from '@/utils/cookies';
import axios from 'axios';
import { baseURL } from './index';
import { createInstanceWithAuth } from './index';

//로그인 체크
async function loginUser(userData) {
	try {
		const response = await axios.post(`${baseURL}/user/signin`, userData, {
			validateStatus: function (status) {
				// 상태 코드가 402 이상일 경우 거부. 나머지(402보다 작은)는 허용.
				return status < 500;
			},
		});
		return response;
	} catch (error) {
		console.log('error=>', error);
	}
}
//토큰 재발급
async function refreshToken() {
	try {
		const response = await axios.get(`${baseURL}/user/accessToken`, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + getRefreshTokenCookie(),
			},
			validateStatus: function (status) {
				// 상태 코드가 402 이상일 경우 거부. 나머지(402보다 작은)는 허용.
				return status < 500;
			},
		});
		if (response.status == 200) {
			saveAccessTokenCookie(response.data);
		} else {
			console.log('토큰 리플레시 오류(리플레시토큰으로 엑세스 토큰 발행 불가) 로그인이 필요함 ==> Message : ' + response.data);
		}
	} catch (error) {
		console.log(error);
	}
}

//토큰 유효성 체크
function accessTokenCheck() {
	return createInstanceWithAuth('/authCheck', {}).get();
}

export { loginUser, refreshToken, accessTokenCheck };
