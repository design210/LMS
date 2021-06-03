<template>
	<div class="contents-wrap">
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">강의 관리</span>
				<span class="page">강의 목록</span>
			</div>
			<h1>강의 목록</h1>
			<v-icon>mdi-book-open-outline</v-icon>
			<v-btn icon color="#ccc" @click="myLecture()">*</v-btn>
		</div>
		<div class="contents-container">
			<div class="search-wraper">
				<v-layout justify-left>
					<div class="select-width mr5">
						<v-select @change="categorySelect1" :items="category1" v-model="filter.categoryItems1" label="대분류" dense outlined></v-select>
					</div>
					<div class="select-width mr5">
						<v-select :items="category2" v-model="filter.categoryItems2" label="중분류" dense outlined></v-select>
					</div>
					<v-btn depressed color="primary" @click="reset" class="btn-reset"> 검색 초기화 </v-btn>
				</v-layout>
				<v-layout justify-left class="multi-select mt10">
					<div class="select-width mr5 mt5">
						<v-select :items="supplyCompany" v-model="filter.common" label="난이도" multiple outlined></v-select>
					</div>
					<search-name :placeholderProp="placeholder" :widthProp="width" @initkeyword="emitkeyword" @onClick="emitClick"></search-name>
				</v-layout>
			</div>
			<v-card-text class="grey lighten-4 no-padding">
				<v-sheet class="mx-auto">
					<v-container class="fill-height" fluid>
						<div class="right"><v-switch v-model="inner" label="사내강의만 보기"></v-switch></div>
						<v-fade-transition mode="out-in">
							<v-row>
								<v-col cols="3" v-for="(item, index) in setLectureList" :key="index">
									<v-card class="mx-auto" max-width="450">
										<div class="imageBox">
											<v-img
												src="https://cdn.vuetifyjs.com/images/cards/house.jpg"
												:aspect-ratio="16 / 9"
												@click="$router.push('/lecture/lectureinfo/' + item.lecture.idx)"
											>
											</v-img>
											<!-- <v-chip class="onlineLabel ma-1" small label text-color="white" color="#333">{{ item.lecture.loc_type }}</v-chip> -->
											<!-- 스크랩 주석처리 <div class="bookmark" v-show="item.is_scraping === 0">
												<v-btn icon color="#ccc" @click="scraping(item.lecture_idx)">
													<v-icon>mdi-bookmark-minus</v-icon>
												</v-btn>
											</div> -->
										</div>
										<div class="text-left mt-2">
											<v-chip class="ma-1" small label text-color="white" color="#ff6600">{{ item.lecture.mainCategory[0].value }}</v-chip>
											<v-chip class="ma-1" small label text-color="white" color="rgb(30, 177, 108)">{{ item.lecture.difficulty[0].value }}</v-chip>
											<v-chip class="ma-1" small label text-color="white" color="blue">사내강의</v-chip>
										</div>

										<v-divider class="mt-2 mx-4"></v-divider>
										<v-card-title>
											<div class="display-0">
												{{ item.lecture.loc_subject }}
											</div>
										</v-card-title>
									</v-card>
								</v-col>
							</v-row>
						</v-fade-transition>
						<div class="more-view">
							<v-icon @click="more" class="mr10">mdi-arrow-down-bold-circle-outline</v-icon>{{ lectureNum }}/{{ lectureTotal }} 개
						</div>
					</v-container>
				</v-sheet>
			</v-card-text>
		</div>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import { mapGetters } from 'vuex';
import SearchName from '@/components/search/SearchName.vue';
import bus from '@/utils/bus';
export default {
	components: { SearchName },
	mixins: [loading],
	computed: {
		...mapGetters('lectureStore', ['lectureManageList', 'lectureCategories']),
	},
	data() {
		return {
			nodata: false,
			supplyCompany: [],
			category1: [],
			category2: ['대분류를 선택해주세요'],
			items: [],
			placeholder: '강의명을 입력해 주세요.',
			width: '200px',
			categories: '',
			setLectureList: [],
			lectureTotal: 0,
			lectureNum: 0,
			//search
			page: 1,
			paginate: 4,
			filter: {
				search: '',
				categoryItems1: '',
				categoryItems2: '',
				common: [],
				provider_type: null,
			},
			inner: false,
		};
	},
	async mounted() {
		try {
			await this.$store.dispatch('lectureStore/LECTURE_CATEGORIES');
			let categories1 = [];
			const originCategories = this.lectureCategories.categorys;
			const originDifficulty = this.lectureCategories.difficulty;
			originCategories.forEach(ele => {
				categories1.push(ele.value);
			});
			let difficulty = [];
			originDifficulty.forEach(ele => {
				difficulty.push(ele.value);
			});
			this.supplyCompany = difficulty;
			this.category1 = categories1;
			this.categories = this.lectureCategories.categorys;
			bus.$emit('start:spinner');
			await this.$store.dispatch('lectureStore/LECTURE_MANAGE_LIST', {
				page: this.page,
				paginate: this.paginate,
				filter: {
					search: this.filter.search,
					mainCategory: this.filter.categoryItems1,
					subCategory: this.filter.categoryItems2,
					difficulty: this.filter.common,
					provider_type: this.filter.provider_type,
				},
			});
			this.lectureNum = this.lectureManageList.count;
			if (this.lectureNum > 4) {
				this.lectureNum = 4;
			}
			this.setLectureList = this.lectureManageList.rows;
			this.lectureTotal = this.lectureManageList.count;
			bus.$emit('end:spinner');
		} catch (error) {
			console.log(error);
		}
	},
	watch: {
		inner(newValue) {
			if (newValue === true) {
				this.filter.provider_type = 21;
			} else {
				this.filter.provider_type = null;
			}
		},
	},
	methods: {
		async reset() {
			bus.$emit('start:spinner');
			this.page = 1;
			await this.$store.dispatch('lectureStore/LECTURE_MANAGE_LIST', {
				page: this.page,
				paginate: this.paginate,
				filter: {
					search: '',
					mainCategory: '',
					subCategory: '',
					difficulty: [],
					provider_type: null,
				},
			});
			this.lectureNum = this.lectureManageList.count;
			if (this.lectureNum > 4) {
				this.lectureNum = 4;
			}
			this.setLectureList = this.lectureManageList.rows;
			this.lectureTotal = this.lectureManageList.count;
			this.filter.search = '';
			this.filter.categoryItems1 = '';
			this.filter.categoryItems2 = '';
			this.filter.common = '';
			this.filter.provider_type = null;
			this.inner = false;
			bus.$emit('end:spinner');
		},
		categorySelect1() {
			let categories = [];
			const originCategories2 = this.lectureCategories.categorys;
			originCategories2.forEach(ele => {
				if (this.filter.categoryItems1 == ele.value) {
					ele.childs.forEach(ele => {
						categories.push(ele.value);
					});
				}
			});
			this.category2 = categories;
		},
		emitkeyword(data) {
			this.filter.search = data;
		},
		async more() {
			try {
				if (this.lectureNum < this.lectureTotal) {
					const oldLectureList = this.setLectureList;
					this.page += 1;
					await this.$store.dispatch('lectureStore/LECTURE_MANAGE_LIST', {
						page: this.page,
						paginate: this.paginate,
						filter: {
							search: this.filter.search,
							mainCategory: this.filter.categoryItems1,
							subCategory: this.filter.categoryItems2,
							difficulty: this.filter.common,
							provider_type: this.filter.provider_type,
						},
					});
					let addLectureList = this.lectureManageList.rows;
					addLectureList.forEach(ele => {
						oldLectureList.push(ele);
					});
					this.setLectureList = oldLectureList;
					this.lectureNum = oldLectureList.length;
				} else {
					alert('강의가 더이상 없습니다.');
				}
			} catch (error) {
				console.log(error);
			}
		},
		async emitClick() {
			this.page = 1;
			await this.$store.dispatch('lectureStore/LECTURE_MANAGE_LIST', {
				page: this.page,
				paginate: this.paginate,
				filter: {
					search: this.filter.search,
					mainCategory: this.filter.categoryItems1,
					subCategory: this.filter.categoryItems2,
					difficulty: this.filter.common,
					provider_type: this.filter.provider_type,
				},
			});
			this.lectureTotal = this.lectureManageList.count;
			this.lectureNum = this.lectureManageList.rows.length;
			this.setLectureList = this.lectureManageList.rows;
		},
		//스크랩 주석처리
		// async scraping(idx) {
		// 	try {
		// 		const data = Array({ idx: idx, is_scraping: true });
		// 		await this.$store.dispatch('lectureStore/SCRAPING', data);
		// 		await this.$store.dispatch('lectureStore/LECTUREALL');
		// 		alert('스크랩이 완료되었습니다.');
		// 	} catch (error) {
		// 		alert('스크랩중 오류가 발생되었습니다.! \n\n' + error);
		// 		console.log(error);
		// 	}
		// },
		//TODO : 관리자 페이지가 없어 임의로 강의를 보여지게 처리함 / 실제 상용 적용시 로직 삭제 필요
		async myLecture() {
			try {
				const idx = prompt('강의 IDX를 입력하면 강좌가 보여진다.', '');
				await this.$store.dispatch('lectureStore/LECTURE_PUT', { idx });
				await this.$store.dispatch('lectureStore/LECTUREALL');
			} catch (error) {
				alert(error.name);
				console.log(error);
			}
		},
	},
};
</script>
<style scoped>
.right {
	width: 100%;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
}
.search-wraper {
	position: relative;
}
.btn-reset {
	position: absolute;
	right: 20px;
	top: 20px;
}
.more-view {
	text-align: center;
	margin: 30px auto 30px;
	font-size: 16px;
}
.display-0 {
	display: inline-block;
	overflow: hidden;
	text-overflow: ellipsis;
	text-align: left;
	word-wrap: break-word;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.no-padding {
	padding: 0 !important;
	margin-top: 20px;
}
.search-wraper {
	background: #fff;
	border-radius: 10px;
	padding: 20px;
	height: 135px;
}
.search-wrap {
	margin-top: -40px;
}
.multi-select {
	display: flex;
	align-items: center;
}
.select-width {
	max-width: 200px;
}
.select-width1 {
	max-width: 250px;
}
.select-width1 button {
	vertical-align: bottom;
}
.imageBox {
	position: relative;
}
.onlineLabel {
	position: absolute;
	top: 3px;
	left: 3px;
}
.bookmark {
	position: absolute;
	top: 3px;
	right: 3px;
}
.v-text-field--outlined > .v-input__control > .v-input__slot {
	align-items: stretch;
	min-height: 38px !important;
}
.v-card.v-sheet {
	min-height: 300px;
}
@media (max-width: 1500px) {
	.v-card.v-sheet {
		min-height: 270px;
	}
}
@media (max-width: 1320px) {
	.v-card.v-sheet {
		min-height: 248px;
	}
}
</style>
