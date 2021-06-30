<template>
	<div class="contents-wrap">
		<top-btn></top-btn>
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">강의 관리</span>
				<span class="page">강의 목록</span>
			</div>
			<h1>강의 목록</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<div class="contents-container">
			<div class="search-wraper media">
				<v-layout class="first">
					<div class="select-width mr5">
						<v-select @change="categorySelect1" :items="category1" v-model="filter.categoryItems1" label="대분류" dense outlined></v-select>
					</div>
					<div class="select-width height mr5">
						<v-select :items="category2" v-model="filter.categoryItems2" label="중분류" multiple outlined></v-select>
					</div>
					<v-btn depressed color="primary" @click="reset" class="btn-reset"> 검색 초기화 </v-btn>
				</v-layout>
				<v-layout justify-left class="multi-select mt10 second">
					<div class="select-width diffculty mr5 mt5">
						<v-select :items="supplyCompany" v-model="filter.common" label="난이도" multiple outlined></v-select>
					</div>
					<search-name
						:placeholderProp="placeholder"
						:widthProp="width"
						@initkeyword="emitkeyword"
						@onClick="emitClick"
						class="search-input"
					></search-name>
				</v-layout>
			</div>
			<v-card-text class="grey lighten-4 no-padding">
				<v-sheet class="mx-auto">
					<v-container class="fill-height pb30" fluid>
						<div class="right"><v-switch v-model="inner" label="사내강의만 보기"></v-switch></div>
						<v-fade-transition mode="out-in">
							<v-row>
								<v-col cols="3" v-for="(item, index) in setLectureList" :key="index">
									<v-card class="mx-auto" max-width="450" @click="$router.push('/lecture/lectureinfo/' + item.lecture.idx)">
										<div class="imageBox" v-if="item.lecture.lecture_thumbnails.length > 0">
											<v-img :src="item.lecture.lecture_thumbnails[0].aws_url" :aspect-ratio="16 / 12"> </v-img>
										</div>
										<div class="imageBox" v-else>
											<v-img
												src="https://letuin-expert-cp.s3.ap-northeast-2.amazonaws.com/lecture_thumbnail/no_thumbnail.jpeg"
												:aspect-ratio="16 / 12"
											>
											</v-img>
										</div>
										<div class="text-left mt-2">
											<v-chip class="ma-1" small label text-color="white" color="#ff6600">{{ item.lecture.mainCategory[0].value }}</v-chip>
											<v-chip class="ma-1" small label text-color="white" color="rgb(30, 177, 108)">{{ item.lecture.difficulty[0].value }}</v-chip>
											<v-chip class="ma-1" small label text-color="white" color="blue" v-if="item.lecture.provider_type === 22">사내강의</v-chip>
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
						<div class="no-data" v-if="lectureTotal < 1">해당하는 강의가 없습니다.</div>
						<div class="more-view" v-if="lectureTotal > 20">
							<v-icon @click="more" class="mr10">mdi-arrow-down-bold-circle-outline</v-icon>{{ lectureNum }}/{{ lectureTotal }}
							개
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
import $ from 'jquery';
import TopBtn from '../../components/common/TopBtn.vue';
export default {
	components: { SearchName, TopBtn },
	mixins: [loading],
	computed: {
		...mapGetters('lectureStore', ['lectureManageList', 'lectureCategories']),
	},
	data() {
		return {
			nodata: false,
			supplyCompany: [],
			category1: [],
			category2: [],
			items: [],
			placeholder: '강의명을 입력해 주세요.',
			width: '200px',
			categories: '',
			setLectureList: [],
			lectureTotal: 0,
			lectureNum: 0,
			//search
			page: 1,
			paginate: 20,
			filter: {
				search: '',
				categoryItems1: '',
				categoryItems2: [],
				common: [],
				provider_type: null,
			},
			inner: false,
		};
	},
	async mounted() {
		try {
			//카테고리 호출
			await this.$store.dispatch('lectureStore/LECTURE_CATEGORIES');
			//카테고리 설정
			let categories1 = [];
			const originCategories = this.lectureCategories.categorys;
			originCategories.forEach(ele => {
				categories1.push(ele.value);
			});
			//난이도 설정
			let difficulty = [];
			const originDifficulty = this.lectureCategories.difficulty;
			originDifficulty.forEach(ele => {
				difficulty.push(ele.value);
			});
			//기본 데이터 설정
			this.supplyCompany = difficulty;
			this.category1 = categories1;
			this.categories = this.lectureCategories.categorys;
			bus.$emit('start:spinner');
			//강의 리스트 호출
			await this.API_Patch(this.filter.search, this.filter.categoryItems1, this.filter.categoryItems2, this.filter.common, this.filter.provider_type);
			//강의리스트 초기 넘버 설정
			this.lectureNum = this.lectureManageList.count;
			if (this.lectureNum > this.paginate) {
				this.lectureNum = this.paginate;
			}
			//강의 데이터 설정
			this.setLectureList = this.lectureManageList.rows;
			//강의 총갯수 설정
			this.lectureTotal = this.lectureManageList.count;
			bus.$emit('end:spinner');
		} catch (error) {
			console.log(error);
		}
	},
	watch: {
		//사내강의만 보기
		async inner(newValue) {
			//검색 초기화
			this.page = 1;
			if (newValue === true) {
				this.filter.provider_type = 22;
			} else {
				this.filter.provider_type = null;
			}
			//강의 리스트 호출
			await this.API_Patch(this.filter.search, this.filter.categoryItems1, this.filter.categoryItems2, this.filter.common, this.filter.provider_type);
			this.setLecture();
		},
	},
	methods: {
		//API 호출
		async API_Patch(keyword, mainC, subC, diff, prov) {
			await this.$store.dispatch('lectureStore/LECTURE_MANAGE_LIST', {
				page: this.page,
				paginate: this.paginate,
				filter: {
					search: keyword,
					mainCategory: mainC,
					subCategory: subC,
					difficulty: diff,
					provider_type: prov,
				},
			});
		},
		//검색 리셋
		async reset() {
			bus.$emit('start:spinner');
			this.page = 1;
			await this.API_Patch('', '', [], [], null);
			this.lectureNum = this.lectureManageList.count;
			if (this.lectureNum > this.paginate) {
				this.lectureNum = this.paginate;
			}
			this.setLectureList = this.lectureManageList.rows;
			this.lectureTotal = this.lectureManageList.count;
			this.filter.search = '';
			this.filter.categoryItems1 = '';
			this.filter.categoryItems2 = [];
			this.filter.common = '';
			this.filter.provider_type = null;
			this.inner = false;
			this.category2 = [];
			bus.$emit('end:spinner');
			$('.search-input').val('');
		},
		//카테고리 선택
		categorySelect1() {
			let categories = [];
			this.filter.categoryItems2 = [];
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
		//검색어 emit
		emitkeyword(data) {
			this.filter.search = data;
		},
		//검색버튼 클릭
		async emitClick() {
			this.page = 1;
			//강의 리스트 호출
			await this.API_Patch(this.filter.search, this.filter.categoryItems1, this.filter.categoryItems2, this.filter.common, this.filter.provider_type);
			this.setLecture();
		},
		//더보기 클릭시 추가 생성
		async more() {
			try {
				if (this.lectureNum < this.lectureTotal) {
					const oldLectureList = this.setLectureList;
					this.page += 1;
					//강의 리스트 호출
					await this.API_Patch(
						this.filter.search,
						this.filter.categoryItems1,
						this.filter.categoryItems2,
						this.filter.common,
						this.filter.provider_type,
					);
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
		//강의갯수 초기화 & 리스트 설정
		setLecture() {
			this.lectureTotal = this.lectureManageList.count;
			this.lectureNum = this.lectureManageList.rows.length;
			this.setLectureList = this.lectureManageList.rows;
		},
	},
};
</script>
<style scoped>
.select-width.height {
	height: 70px;
}
.no-data {
	width: 100%;
	text-align: center;
	font-size: 1.6rem;
	margin-bottom: 30px;
}
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
@media (min-width: 1400px) {
	.v-card.v-sheet {
		min-height: 405px;
	}
	.media {
		display: flex;
		justify-content: flex-start;
		height: 80px;
	}
	.first {
		flex: none !important;
	}
	.second {
		margin-top: 20px !important;
	}
}
@media (max-width: 1500px) {
	.v-card.v-sheet {
		min-height: 320px;
	}
}
@media (max-width: 1320px) {
	.v-card.v-sheet {
		min-height: 285px;
	}
}
</style>
