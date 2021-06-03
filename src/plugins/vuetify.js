import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import VueI18n from 'vue-i18n';
Vue.use(Vuetify);
Vue.use(VueI18n);

const messages = {
	ko: {
		$vuetify: {
			dataTable: {
				itemsPerPageText: '페이지 당 행 갯수',
				ariaLabel: {
					sortDescending: '내림차순 정렬.',
					sortAscending: '오름차순 정렬.',
					sortNone: '정렬하지 않음.',
					activateNone: '정렬을 취소하려면 활성화하세요.',
					activateDescending: '내림차순 정렬을 위해 활성화하세요.',
					activateAscending: '오름차순 정렬을 위해 활성화하세요.',
				},
				sortBy: 'Sort by',
			},
			dataFooter: {
				itemsPerPageText: '페이지 당 항목 수:',
				itemsPerPageAll: '전체',
				nextPage: '다음 페이지',
				prevPage: '이전 페이지',
				firstPage: '첫 페이지',
				lastPage: '마지막 페이지',
				pageText: '{2} 중 {0}-{1}',
			},
			noDataText: '게시물이 없습니다.',
			datePicker: {
				itemsSelected: '날짜선택 완료',
				nextMonthAriaLabel: '다음 달',
				nextYearAriaLabel: '내년',
				prevMonthAriaLabel: '지난달',
				prevYearAriaLabel: '전년도',
			},
			dataIterator: {
				noResultsText: '검색 결과가 없습니다.',
			},
		},
	},
};

// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: 'ko', // set locale
	messages, // set locale messages
});

export default new Vuetify({
	lang: {
		t: (key, ...params) => i18n.t(key, params),
	},
});

//export default new Vuetify({});
