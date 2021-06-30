import Vue from 'vue';
import VueRouter from 'vue-router';
import { getAccessTokenCookie, getRefreshTokenCookie, getUiGrant, getUserGrant } from '@/utils/cookies';
import bus from '@/utils/bus';
import { refreshToken, accessTokenCheck } from '@/api/auth';
const ui = () => import('@/components/common/Ui.vue');
const top = () => import('@/components/common/Top.vue');

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/',
			redirect: '',
		},
		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/login/Login.vue'),
			meta: { unauthorized: true },
		},
		//강의 관리 : 목록
		{
			path: '/lecture/lecturelist',
			name: 'lecturelist',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/LectureList.vue'),
			},
			meta: { idx: '3' },
		},
		//강의 관리 : 상세
		{
			path: '/lecture/lectureinfo/:id',
			name: 'lectureinfo',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/LectureInfo.vue'),
			},
			meta: { idx: '3' },
		},
		//강의 관리 : 개설
		{
			path: '/lecture/lectureopen/:id',
			name: 'lectureopen',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/LectureOpen.vue'),
			},
			meta: { idx: '3' },
		},
		//수강현황 - 수강중 강의
		{
			path: '/lecture/signuplecture',
			name: 'signuplecture',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/SignUpLecture.vue'),
			},
			meta: { idx: '4' },
		},
		//수강현황 - 수강중 강의 : 수강현황
		{
			path: '/lecture/signuplecture/status/:id',
			name: 'signuplecture_status',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/SignUpLectureDetail.vue'),
			},
			meta: { idx: '4' },
		},
		//수강현황 - 수강예정 강의
		{
			path: '/lecture/expectedlecture',
			name: 'expectedlecture',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/ExpectedLecture.vue'),
			},
			meta: { idx: '4' },
		},
		//수강현황 - 종료된 강의
		{
			path: '/lecture/endlecture',
			name: 'endlecture',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/EndLecture.vue'),
			},
			meta: { idx: '4' },
		},
		//수강현황 - 종료된 강의 : 결과보기
		{
			path: '/lecture/endlecture/status/:id',
			name: 'endlecture_result',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/EndLectureDetail.vue'),
			},
			meta: { idx: '4' },
		},
		//내강의실 강의목록
		{
			path: '/lecturelist',
			name: 'mylecturelist',
			components: {
				ui,
				top,
				contents: () => import('@/views/myLecture/LectureList.vue'),
			},
			meta: { idx: '5' },
		},
		//내강의실 챕터 목록
		{
			path: '/chaptorlist/:id',
			name: 'chaptorlist',
			components: {
				ui,
				top,
				contents: () => import('@/views/myLecture/ChaptorList.vue'),
			},
			meta: { idx: '5' },
		},
		//내강의실 챕터 상세보기
		{
			path: '/chaptorlist/detail/:id',
			name: 'chaptordetail',
			components: {
				ui,
				top,
				contents: () => import('@/views/myLecture/ChaptorDetail.vue'),
			},
			meta: { idx: '5' },
		},
		//직원관리 : 직원목록
		{
			path: '/employeeinfo',
			name: 'employeeinfo',
			components: {
				ui,
				top,
				contents: () => import('@/views/info/EmployeeInfo.vue'),
			},
			meta: { idx: '8' },
		},
		//직원관리 : 운영자관리
		{
			path: '/admininfo',
			name: 'admininfo',
			components: {
				ui,
				top,
				contents: () => import('@/views/info/AdminInfo.vue'),
			},
			meta: { idx: '8' },
		},
		//설정 : 회사설정
		{
			path: '/companyinfo',
			name: 'companyinfo',
			components: {
				ui,
				top,
				contents: () => import('@/views/info/CompanyInfo.vue'),
			},
			meta: { idx: '9' },
		},
		//404
		{
			path: '*',
			name: 'pageNotFound',
			component: () => import('@/views/error/NotFoundPage.vue'),
			meta: { idx: '2' },
		},
		//스크랩강의 : 현재 미사용
		{
			path: '/lecture/lecturescrap',
			name: 'lecturescrap',
			components: {
				ui,
				top,
				contents: () => import('@/views/lecture/LectureScrap.vue'),
			},
			meta: { idx: '5' },
		},
	],
});

router.beforeEach(async (to, from, next) => {
	bus.$emit('start:spinner');
	//액세스 토큰이 없고 리프레시 토큰이 있을 경우
	if (getAccessTokenCookie() === null && getRefreshTokenCookie() !== null) {
		await refreshToken();
	}
	//액세스 토큰이 있을 경우
	if (getAccessTokenCookie() !== null) {
		const response = await accessTokenCheck();
		if (response.data === 'authCheck success') {
			console.log('유효성체크 확인');
			//권한설정
			const grant = getUserGrant();
			const uiGrant = getUiGrant();
			if (to.name !== 'login' && uiGrant !== null) {
				const powerIdx = uiGrant.split(',');
				let pageIdx = to.meta.idx;
				if (powerIdx.includes(pageIdx)) {
					return next();
				} else {
					if (grant == 3) {
						return next('/lecturelist');
					} else {
						return next('/lecture/lecturelist');
					}
				}
			}
		} else {
			console.log('유효성체크 실패');
			await refreshToken();
		}
	}

	//로그인 필요 없는 페이지
	if (to.matched.some(record => record.meta.unauthorized) || getAccessTokenCookie()) {
		return next();
	}

	//권한이 없을 경우
	return next('/login');
});

export default router;
