<template>
	<div class="contents-wrap">
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">강의 목록</span>
				<span class="page">스크랩 강의</span>
			</div>
			<h1>스크랩 강의</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<div class="contents-container">
			<div class="v-application">
				<div class="scrap-wrap">
					<div class="header">
						<div class="ch-all">
							<v-checkbox v-model="allSelected" :input-value="active" @click="selectAll" color="primary" label="강의 전체 선택"></v-checkbox>
						</div>
						<div class="select">
							선택한 강의 <span>{{ selected.length }}</span
							>개
						</div>
					</div>
					<div class="body">
						<table class="list">
							<colgroup>
								<col width="50" />
								<col width="*" />
								<col width="80" />
								<col width="90" />
								<col width="50" />
							</colgroup>
							<tr v-for="(item, index) in myScrapListResult" :key="index">
								<td class="checkbox-align">
									<v-checkbox :input-value="false" v-model="selected" :value="item.lecture_idx" color="primary"></v-checkbox>
								</td>
								<td class="subject">
									<div>{{ item.lecture.loc_subject }}</div>
									<div>{{ item.lecture.loc_memo }}</div>
								</td>
								<!--//TODO:총차시갯수와 평가갯수 부분은 API로직이 만들어지면 구현해야함-->
								<td>총 5차시</td>
								<td>평가 2개</td>
								<td>
									<v-btn icon color="#999" @click="scripDelete(item.lecture_idx)"><v-icon>mdi-close-box-outline</v-icon></v-btn>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
			<div class="text-right">
				<v-btn class="ma-2" color="secondary" @click="scrapDeleteChoice()">선택강의 스크랩 해제</v-btn>
				<v-btn class="ma-2" color="success" @click="scrapLectureAction()">선택강의 개설</v-btn>
			</div>
		</div>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import { mapGetters } from 'vuex';
export default {
	mixins: [loading],
	computed: {
		...mapGetters('lectureStore', ['myScrapListResult']),
		...mapGetters('commonStore', ['scrapList']),
	},
	data() {
		return {
			active: '',
			settings: [],
			selected: [],
			allSelected: false,
		};
	},
	async mounted() {
		try {
			await this.$store.dispatch('lectureStore/SCRAPINGLIST');
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		selectAll: function () {
			this.selected = [];
			if (this.allSelected) {
				for (const index in this.myScrapListResult) {
					this.selected.push(this.myScrapListResult[index].lecture_idx);
				}
			} else {
				this.selected = [];
			}
		},
		scripDelete(lecture_idx) {
			let data = Array({ idx: lecture_idx, is_scraping: false });
			console.log(lecture_idx);
			this.scrapDeleteAction(data);
		},
		async scrapDeleteChoice() {
			const scrapDelList = [];
			await this.selected.forEach(item => {
				scrapDelList.push({ idx: item, is_scraping: false });
			});
			console.log(scrapDelList);
			await this.scrapDeleteAction(scrapDelList);
		},
		async scrapDeleteAction(data) {
			console.log('scrapDeleteAction==>', data);
			try {
				await this.$store.dispatch('lectureStore/SCRAPING', data);
				await this.$store.dispatch('lectureStore/SCRAPINGLIST');
				this.selected = [];
				this.allSelected = false;
			} catch (error) {
				console.log(error);
			}
		},
		async scrapLectureAction() {
			const scrapItem = [];
			this.selected.forEach(item => {
				for (let i = 0; i < this.myScrapListResult.length; i++) {
					if (item == this.myScrapListResult[i].lecture_idx) {
						scrapItem.push(this.myScrapListResult[i]);
					}
				}
			});
			if (scrapItem.length <= 0) {
				alert('개설할 강의를 선택해 주세요!');
				return;
			}
			await this.$store.dispatch('commonStore/SCRAPLIST', scrapItem);
			//console.log(this.scrapList);
			this.$router.push('/lecture/lectureopen');
		},
	},
};
</script>
<style lang="scss" scoped>
.header {
	background: rgb(187, 207, 243);
	display: flex;
	padding: 15px;
	border-radius: 5px 5px 0 0;
	justify-content: space-between;
	& .ch-all {
		& .v-input {
			height: 24px;
			margin-top: 0;
			padding-top: 0;
		}
	}
	& .select {
		font-size: 16px;
	}
}
.body {
	& .list {
		& tr {
			& td {
				background: rgb(236, 236, 236);
				text-align: center;
				padding: 7px;
				&.subject {
					text-align: left;
				}
			}
			&:nth-child(even) {
				& td {
					background: #fff;
				}
			}
		}
	}
}
</style>
