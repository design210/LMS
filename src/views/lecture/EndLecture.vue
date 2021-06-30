<template>
	<div class="contents-wrap signup-lecture">
		<top-btn></top-btn>
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">수강현황</span>
				<span class="page">수강종료 강의</span>
			</div>
			<h1>수강종료 강의</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<div class="contents-container">
			<div class="wrapper">
				<div class="d-flex justify-space-between mt30" style="height: 40px">
					<div class="d-flex">
						<span class="">총 {{ lectureTotal }}개</span>
					</div>
					<div class="d-flex align-self-center">
						<div class="date-group mr10">
							<div class="date-picker" v-if="dataRange">
								<span class="close"><v-icon color="white" @click="close">mdi-close</v-icon></span>
								<v-date-picker class="mt-0" v-model="lectureDates" locale="ko-KR" full-width range></v-date-picker>
							</div>
							<v-text-field
								@focus="dataRange = true"
								v-model="dateRangeText"
								prepend-inner-icon="mdi-calendar"
								readonly
								placeholder="날짜를 선택해주세요."
								outlined
							></v-text-field>
						</div>
						<search-name :placeholderProp="placeholder" :widthProp="width" @initkeyword="emitkeyword" @onClick="emitClick"></search-name>
					</div>
				</div>
				<ul class="list">
					<li class="d-flex" v-for="(item, index) in setLectureList" :key="index">
						<v-lazy class="thumbnail" v-if="item.lecture.lecture_thumbnails.length > 0">
							<img :src="item.lecture.lecture_thumbnails[0].aws_url" :alt="item.lecture.loc_subject" />
						</v-lazy>
						<v-lazy class="thumbnail" v-else>
							<img
								src="https://letuin-expert-cp.s3.ap-northeast-2.amazonaws.com/lecture_thumbnail/no_thumbnail.jpeg"
								:alt="item.lecture.loc_subject"
							/>
						</v-lazy>
						<div class="info-group">
							<div class="text-left">
								<v-chip class="ma-1" small label text-color="white" color="#ff6600">{{ item.lecture.mainCategory[0].value }}</v-chip>
								<v-chip class="ma-1" small label text-color="white" color="rgb(30, 177, 108)">{{ item.lecture.difficulty[0].value }}</v-chip>
								<v-chip class="ma-1" small label text-color="white" color="blue" v-if="item.lecture.provider_type === 22">사내강의</v-chip>
							</div>
							<h3 class="subject">{{ item.lecture.loc_subject }}</h3>
							<div class="date mt50"><v-icon>mdi-calendar-month</v-icon>{{ item.open_lecture_period }}</div>
							<div><v-icon>mdi-account-group</v-icon>{{ item.my_lecture_count }}명</div>
						</div>
						<div class="person-wrap d-flex">
							<div class="ml10">
								<span class="ok">수료 {{ item.my_lecture_completion_count }}명</span>
								<span class="not">/ 미수료 {{ item.my_lecture_non_completion_count }}명</span>
							</div>
							<router-link :to="{ path: `/lecture/endlecture/status/${item.idx}` }"><v-btn depressed color="success">결과보기</v-btn></router-link>
						</div>
					</li>
					<li v-if="lectureTotal < 1" class="no-lecture">강의가 없습니다.</li>
				</ul>
				<div class="more-view mt30" v-if="lectureTotal > 20">
					<v-icon class="mr10" @click="more">mdi-arrow-down-bold-circle-outline</v-icon>{{ lectureNum }}/{{ lectureTotal }} 개
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import SearchName from '@/components/search/SearchName.vue';
import TopBtn from '@/components/common/TopBtn.vue';
import { mapGetters } from 'vuex';
import bus from '@/utils/bus';
export default {
	components: { SearchName, TopBtn },
	mixins: [loading],
	computed: {
		...mapGetters('lectureOpenStore', ['lectureOpenInfo']),
		dateRangeText() {
			let date = this.lectureDates;
			let align = date.sort();
			let dateValue = align.join(' ~ ');
			return dateValue;
		},
	},
	data() {
		return {
			placeholder: '강의명을 입력해 주세요.',
			width: '400px',
			grpahPercent: 30,
			lectureTotal: 0,
			lectureNum: 0,
			lectureDates: [],
			dataRange: false,
			setLectureList: [],
			page: 1,
			paginate: 20,
			status: 19,
			search: '',
			order: '',
			search_start_date: '',
			search_end_date: '',
		};
	},
	watch: {
		lectureDates(newValue) {
			this.search_start_date = newValue[0];
			this.search_end_date = newValue[1];
		},
	},
	async mounted() {
		bus.$emit('start:spinner');
		await this.$store.dispatch('lectureOpenStore/LECTURE_ALL_LIST', {
			page: this.page,
			paginate: this.paginate,
			status: this.status,
			search: this.search,
			order: this.order,
		});

		bus.$emit('end:spinner');
		this.lectureTotal = this.lectureOpenInfo.count;
		this.setLectureList = this.lectureOpenInfo.rows;
		this.lectureNum = this.setLectureList.length;
	},
	methods: {
		close() {
			this.dataRange = false;
		},
		//검색어 emit
		emitkeyword(data) {
			this.search = data;
		},
		//검색버튼 클릭
		emitClick() {
			this.lectureLoad();
		},
		//검색시 강의 리로드
		async lectureLoad() {
			await this.$store.dispatch('lectureOpenStore/LECTURE_ALL_LIST', {
				page: this.page,
				paginate: this.paginate,
				status: this.status,
				search: this.search,
				order: this.order,
				search_start_date: this.search_start_date,
				search_end_date: this.search_end_date,
			});
			this.lectureTotal = this.lectureOpenInfo.count;
			this.setLectureList = this.lectureOpenInfo.rows;
			this.lectureNum = this.setLectureList.length;
		},
		//더보기 클릭시 추가 생성
		async more() {
			try {
				if (this.lectureNum < this.lectureTotal) {
					const oldLectureList = this.setLectureList;
					this.page += 1;
					//강의 리스트 호출
					bus.$emit('start:spinner');
					await this.lectureLoad();
					let addLectureList = this.lectureOpenInfo.rows;
					addLectureList.forEach(ele => {
						oldLectureList.push(ele);
					});
					this.setLectureList = oldLectureList;
					bus.$emit('end:spinner');
					this.lectureNum = oldLectureList.length;
				} else {
					alert('강의가 더이상 없습니다.');
				}
			} catch (error) {
				console.log(error);
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.date-group {
	& input {
		border: 1px solid red;
	}
}
.wrapper {
	background: #fff;
	border-radius: 10px;
	padding: 20px;
	position: relative;
	& .subject {
		max-width: 500px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	& .date-group {
		position: relative;
		& .date-picker {
			position: absolute;
			top: 35px;
			left: 0;
			z-index: 10;
			width: 400px;
			@include boxshadow(0px, 3px, 6px, 0px, rgba(0, 0, 0, 0.1));
		}
		& .close {
			position: absolute;
			right: 20px;
			top: 20px;
			z-index: 20;
		}
		& label {
			display: none !important;
		}
	}
	& .list {
		& li {
			border: 1px solid rgb(230, 230, 230);
			border-radius: 10px;
			margin-bottom: 10px;
			&.no-lecture {
				text-align: center;
				padding: 20px;
			}
			& .thumbnail {
				min-width: 250px;
				width: 250px;
				& img {
					width: 100%;
				}
			}
			& .info-group {
				width: calc(100% - 520px);
				padding: 5px 20px;
				& .subject {
					font-size: 2rem;
					margin: 3px 0;
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
					width: calc(100% - 80px);
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
			& .person-wrap {
				align-items: center;
				width: 320px;
				margin: 0 30px 0 20px;
				& .person {
					font-size: 2rem;
					margin-right: 10px;
				}
				& .ok {
					font-weight: 700;
					font-size: 2.2rem;
				}
				& .not {
					margin: 0 15px 0 5px;
				}
			}
		}
	}
	& .more-view {
		text-align: center;
	}
}
</style>
