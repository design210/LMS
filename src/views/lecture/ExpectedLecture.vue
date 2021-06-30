<template>
	<div class="contents-wrap signup-lecture">
		<top-btn></top-btn>
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">수강현황</span>
				<span class="page">개강예정 강의</span>
			</div>
			<h1>개강예정 강의</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<div class="contents-container">
			<div class="wrapper">
				<div class="d-flex justify-space-between">
					<div class="d-flex align-self-center">
						<span class="mt5 mr10">총 {{ lectureTotal }}개</span>
						<!-- <v-select :items="items" v-model="orderName" label="날짜별 정렬" dense outlined></v-select> -->
					</div>
					<search-name :placeholderProp="placeholder" :widthProp="width" @initkeyword="emitkeyword" @onClick="emitClick"></search-name>
				</div>
				<ul class="list mt20">
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
							<v-btn depressed color="error" @click="cancel(item.idx)"> <v-icon>mdi-trash-can-outline</v-icon> 삭제 </v-btn>
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
import { getPopupOpt } from '@/utils/popup';
import lectureDeletePopup from '@/components/popup/lectureDeletePopup.vue';
export default {
	components: { SearchName, TopBtn },
	mixins: [loading],
	computed: {
		...mapGetters('lectureOpenStore', ['lectureOpenInfo']),
	},
	created() {
		bus.$on('del', this.del);
	},
	beforeDestroy() {
		bus.$off('del', this.del);
	},
	data() {
		return {
			items: ['개강일 순', '종료일 순'],
			placeholder: '강의명을 입력해 주세요.',
			width: '400px',
			grpahPercent: 30,
			lectureTotal: 0,
			lectureNum: 0,
			orderName: '',
			setLectureList: [],
			page: 1,
			paginate: 20,
			status: 17,
			search: '',
			order: 1,
		};
	},
	watch: {
		orderName(newValue) {
			this.page = 1;
			if (newValue === '개강일 순') {
				this.order = 1;
			} else {
				this.order = 2;
			}
			this.lectureLoad();
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
		cancel(idx) {
			this.$modal.show(lectureDeletePopup, { idx: idx }, getPopupOpt('lectureDeletePopup', '300px', '200px', false));
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
			this.page = 1;
			await this.$store.dispatch('lectureOpenStore/LECTURE_ALL_LIST', {
				page: this.page,
				paginate: this.paginate,
				status: this.status,
				search: this.search,
				order: this.order,
			});
			this.lectureTotal = this.lectureOpenInfo.count;
			this.setLectureList = this.lectureOpenInfo.rows;
			this.lectureNum = this.lectureOpenInfo.rows.length;
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
		//강의 삭제
		async del(lectureIdx) {
			try {
				bus.$emit('start:spinner');
				await this.$store.dispatch('lectureOpenStore/DEL_LECTURE', { idx: lectureIdx });
				await this.lectureLoad();
				bus.$emit('end:spinner');
				alert('강의가 삭제 되었습니다');
			} catch (error) {
				console.log(error);
			}
		},
	},
};
</script>
<style lang="scss" scoped>
.wrapper {
	background: #fff;
	border-radius: 10px;
	padding: 20px;
	& .subject {
		max-width: 500px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
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
				width: calc(100% - 290px);
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
				width: 90px;
				margin: 0 30px 0 20px;
				& .person {
					font-size: 2rem;
					margin-right: 10px;
				}
			}
		}
	}
	& .more-view {
		text-align: center;
	}
}
</style>
