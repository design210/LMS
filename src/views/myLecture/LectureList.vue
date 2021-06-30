<template>
	<div class="contents-wrap">
		<top-btn></top-btn>
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">내 강의실</span>
				<span class="page">강의 목록</span>
			</div>
			<h1>내 강의실</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<div class="contents-container lecture-list">
			<div class="d-flex justify-space-between">
				<section class="tab">
					<ul>
						<li @click="type(1)">개강예정</li>
						<li class="active" @click="type(2)">수강 중</li>
						<li @click="type(3)">수강 종료</li>
					</ul>
				</section>
				<search-name :placeholderProp="placeholder" :widthProp="width" @initkeyword="emitkeyword" @onClick="emitClick"></search-name>
			</div>
			<section class="lecture-align d-flex justify-space-between mt20">
				<div v-if="lectureTotal < 1">총 0 개</div>
				<div v-else>총 {{ lectureTotal }} 개</div>
				<div class="select-wrap" v-if="status === 18 || status === 17">
					<v-select class="select" :items="items" v-model="orderVal" label="날짜별 정렬" dense outlined></v-select>
				</div>
				<div class="select-wrap" v-if="status === 19">
					<v-select class="select" :items="itemsEnd" v-model="orderValEnd" label="날짜별 정렬" dense outlined></v-select>
				</div>
			</section>
			<section class="list">
				<ul>
					<li class="d-flex" v-for="(item, index) in lectureList" :key="index">
						<v-lazy class="thumbnail" v-if="item.user_lecture.lecture.lecture_thumbnails.length > 0">
							<img :src="item.user_lecture.lecture.lecture_thumbnails[0].aws_url" :alt="item.user_lecture.lecture.loc_subject" />
						</v-lazy>
						<v-lazy class="thumbnail" v-else>
							<img
								src="https://letuin-expert-cp.s3.ap-northeast-2.amazonaws.com/lecture_thumbnail/no_thumbnail.jpeg"
								:alt="item.user_lecture.lecture.loc_subject"
							/>
						</v-lazy>
						<div class="info-group">
							<div class="text-left">
								<v-chip class="ma-1" small label text-color="white" color="#ff6600">{{ item.user_lecture.lecture.mainCategory[0].value }}</v-chip>
								<v-chip class="ma-1" small label text-color="white" color="rgb(30, 177, 108)">{{
									item.user_lecture.lecture.difficulty[0].value
								}}</v-chip>
								<v-chip class="ma-1" small label text-color="white" color="blue" v-if="item.user_lecture.lecture.provider_type == 22"
									>사내강의</v-chip
								>
							</div>
							<h3 class="subject">
								<router-link :to="`/chaptorlist/${item.idx}`">{{ item.user_lecture.lecture.loc_subject }}</router-link>
							</h3>
							<div>
								<div class="d-day" v-if="status === 17">D - {{ item.open_lecture.started_days }}</div>
								<div v-if="status === 18" class="d-flex ing-info">
									<h3 class="ing-avg">{{ item.progress_rate_avg }}%</h3>
									<div class="ing-graph">
										<div>
											종료일까지 {{ item.open_lecture.expired_days }}일 남음 | <span class="eday">{{ item.open_lecture.open_lecture_period }}</span>
										</div>
										<div class="graph-wrap">
											<div class="graph" :style="{ width: item.progress_rate_avg + '%' }"></div>
										</div>
									</div>
									<div class="ing-current">
										<div class="current" v-if="item.latest_learning_date !== undefined">최근 학습일 : {{ item.latest_learning_date }}</div>
										<router-link :to="`/chaptorlist/${item.idx}`"
											><v-btn class="ma-2" color="primary" dark
												>수강하러 가기
												<v-icon dark right>mdi-checkbox-marked-circle</v-icon>
											</v-btn></router-link
										>
									</div>
								</div>
								<h3 v-show="item.status === 26 && myStatus === true">수료</h3>
								<h3 v-show="item.status === 27 && myStatus === true">미수료</h3>
								<div class="date d-flex justify-space-between" v-if="status === 17 || status === 19">
									<div class="mt10"><v-icon>mdi-calendar-month</v-icon>{{ item.open_lecture.open_lecture_period }}</div>
									<v-btn class="ma-2" color="orange darken-2" dark v-if="status === 19" @click="alert"> 만족도 설문 참여하기 </v-btn>
								</div>
							</div>
						</div>
					</li>
					<li v-if="lectureList.length === 0" class="no-data">해당하는 강의가 없습니다.</li>
				</ul>
				<div class="more-view mt30" v-if="lectureTotal > 20">
					<v-icon class="mr10" @click="more">mdi-arrow-down-bold-circle-outline</v-icon>{{ lectureNum }}/{{ lectureTotal }} 개
				</div>
			</section>
		</div>
	</div>
</template>

<script>
import loading from '@/mixins/loading';
import SearchName from '@/components/search/SearchName.vue';
import TopBtn from '@/components/common/TopBtn.vue';
import { mapGetters } from 'vuex';
import $ from 'jquery';
import bus from '@/utils/bus';
import unixTime from '@/utils/unixTime';
import { getPopupOpt } from '@/utils/popup';
import readyPopup from '@/components/popup/readyPopup.vue';
export default {
	components: { SearchName, TopBtn },
	mixins: [loading],
	computed: {
		...mapGetters('lectureStore', ['userLectureFilterList']),
	},
	data() {
		return {
			isActive: false,
			nodata: false,
			placeholder: '강의명을 입력해 주세요.',
			width: '400px',
			grpahPercent: 30,
			lectureLength: null,
			myStatus: false,
			items: ['최근 수강순', '최근 개강일 순', '종료 예정 순'],
			itemsEnd: ['최근 개강일 순', '최근 종료일 순'],
			orderVal: '',
			orderValEnd: '',
			lectureList: [],
			lectureNum: 0,
			lectureTotal: 0,
			search: '',
			page: 1,
			paginate: 20,
			status: 18,
			order: 1,
		};
	},
	watch: {
		orderVal(val) {
			if (val === '최근 수강순') {
				this.order = 1;
			} else if (val === '최근 개강일 순') {
				this.order = 2;
			} else {
				this.order = 3;
			}
			this.listAlign();
		},
		orderValEnd(val) {
			if (val === '최근 개강일 순') {
				this.order = 2;
			} else {
				this.order = 4;
			}
			this.listAlign();
		},
	},
	async mounted() {
		try {
			bus.$emit('start:spinner');
			await this.$store.dispatch('lectureStore/LECTURE_FILTER', {
				search: this.search,
				page: this.page,
				paginate: this.paginate,
				status: this.status,
				order: this.order,
			});
			bus.$emit('end:spinner');
			let Temp = this.userLectureFilterList.rows;
			console.log(Temp);
			Temp.forEach(ele => {
				if (ele.open_lecture.open_lecture_period !== '') {
					ele.open_lecture.open_lecture_period = ele.open_lecture.open_lecture_period.substr(0, 23);
				}
				if (ele.latest_learning_date !== undefined) {
					ele.latest_learning_date = unixTime(ele.latest_learning_date);
				}
				ele.open_lecture.expired_at = unixTime(ele.open_lecture.expired_at);
			});

			this.lectureList = Temp;
			this.lectureTotal = this.userLectureFilterList.count;
			//강의리스트 초기 넘버 설정
			this.lectureNum = Temp.length;
			if (this.lectureNum > this.paginate) {
				this.lectureNum = this.paginate;
			}
		} catch (error) {
			console.log(error);
		}
		const $menu = $('.lecture-list .tab li');
		$menu.click(function () {
			$menu.removeClass('active');
			$(this).addClass('active');
		});
	},
	methods: {
		//날짜별 정렬
		async listAlign() {
			await this.API_Patch();
			this.setLecture();
		},
		//검색어 emit
		emitkeyword(data) {
			this.search = data;
		},
		//검색버튼 클릭
		async emitClick() {
			this.page = 1;
			//강의 리스트 호출
			await this.API_Patch();
			this.setLecture();
		},
		//강의 탭메뉴 클릭시
		async type(select) {
			this.lectureList.forEach(ele => {
				return (ele.open_lecture.started_days = null);
			});
			if (select === 1) {
				this.status = 17;
				this.myStatus = false;
			} else if (select === 2) {
				this.order = 1;
				this.status = 18;
				this.myStatus = false;
			} else if (select === 3) {
				this.order = 4;
				this.status = 19;
				this.myStatus = true;
			}
			await this.API_Patch();
			this.setLecture();
		},
		//API 호출
		async API_Patch() {
			bus.$emit('start:spinner');
			await this.$store.dispatch('lectureStore/LECTURE_FILTER', {
				search: this.search,
				page: this.page,
				paginate: this.paginate,
				status: this.status,
				order: this.order,
			});
			bus.$emit('end:spinner');
		},
		//강의갯수 초기화 & 리스트 설정
		setLecture() {
			this.lectureTotal = this.userLectureFilterList.count;
			this.lectureNum = this.userLectureFilterList.rows.length;
			let Temp = this.userLectureFilterList.rows;
			Temp.forEach(ele => {
				if (ele.open_lecture.open_lecture_period !== '') {
					ele.open_lecture.open_lecture_period = ele.open_lecture.open_lecture_period.substr(0, 23);
				}
				if (ele.latest_learning_date !== undefined) {
					ele.latest_learning_date = unixTime(ele.latest_learning_date);
				}
				ele.open_lecture.expired_at = unixTime(ele.open_lecture.expired_at);
			});
			this.lectureList = Temp;
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
		alert() {
			this.$modal.show(readyPopup, {}, getPopupOpt('playerVideoPoup', '300px', '200px', false));
		},
	},
};
</script>

<style lang="scss" scoped>
.eday {
	color: rgb(148, 148, 148);
}
.tab {
	& ul {
		display: flex;
		border: 1px solid rgb(218, 218, 218);
		border-radius: 5px;
		background: #fff;
		& li {
			border-left: 1px solid rgb(218, 218, 218);
			padding: 0 20px;
			height: 40px;
			line-height: 38px;
			cursor: pointer;
			&:first-child {
				border-left: 0;
			}
			&.active {
				background: rgb(32, 154, 253);
				color: #fff;
			}
		}
	}
}
.lecture-align {
	align-items: center;
	height: 40px;
	& .select-wrap {
		width: 150px;
		& .select {
			background: #fff;
			height: 40px;
		}
	}
}
.more-view {
	text-align: center;
}
.list {
	margin-top: 10px;
	& li {
		border: 1px solid rgb(230, 230, 230);
		border-radius: 10px;
		margin-bottom: 10px;
		background: #fff;
		&.no-data {
			text-align: center;
			padding: 20px;
		}
		& .d-day {
			font-size: 2rem;
			font-weight: 700;
		}
		& .thumbnail {
			min-width: 250px;
			width: 250px;
			& img {
				width: 100%;
			}
		}
		& .info-group {
			width: calc(100% - 250px);
			padding: 5px 20px;
			& .subject {
				font-size: 2rem;
				margin: 3px 0;
				& a {
					color: #000;
					height: 60px;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}
			& .date {
				margin: right 5px;
				vertical-align: 0px;
			}
			& .data-wrap {
				margin-top: 15px;
				& .status {
					width: 80px;
					& .percent {
						font-size: 3rem;
					}
				}
			}
			& .graph-wrap {
				width: 100%;
				position: relative;
				height: 15px;
				background: rgb(226, 226, 226);
				border-radius: 3px;
				margin-top: 13px;
				& .graph {
					position: absolute;
					top: 0;
					left: 0;
					height: 15px;
					background: rgb(0, 121, 219);
					border-radius: 3px;
				}
			}
		}
	}
}
.ing-info {
	width: 100%;
	align-items: center;
	& .ing-avg {
		width: 50px;
	}
	& .ing-graph {
		width: calc(100% - 220px);
		& .graph-wrap {
			margin: 0 !important;
			width: 100%;
		}
	}
	& .ing-current {
		width: 120px;
		padding-left: 30px;
		& .current {
			white-space: nowrap;
		}
	}
}
</style>
