import axios from 'axios';
import { refreshToken } from '@/api/auth';
import { getAccessTokenCookie } from '@/utils/cookies';

export function setInterceprors(instance, data) {
	const accessCookie = getAccessTokenCookie();
	instance.interceptors.request.use(
		function (config) {
			config.headers['Content-Type'] = 'application/json; charset=utf-8';
			config.headers['Authorization'] = 'Bearer ' + accessCookie;
			config.data = data;
			return config;
		},
		function (error) {
			return Promise.reject(error);
		},
	);

	instance.interceptors.response.use(
		function (response) {
			return response;
		},
		async function (error) {
			const errorAPI = error.config;
			if (error.response.status === 401 && errorAPI.retry === undefined) {
				errorAPI.retry = true;
				console.log(errorAPI);
				await refreshToken();
				return await axios(errorAPI);
			}
			return Promise.reject(error);
		},
	);

	return instance;
}
