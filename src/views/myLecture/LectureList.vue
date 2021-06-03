<template>
	<div class="contents-wrap">
		<div class="title-header blue">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">내 강의실</span>
				<span class="page">강의 리스트</span>
			</div>
			<h1>강의 리스트</h1>
			<v-icon>mdi-book-open-outline</v-icon>
		</div>
		<div class="contents-container">
			<table class="tbl-basic">
				<colgroup>
					<col width="100px" />
					<col width="*" />
					<col width="150px" />
					<col width="100px" />
				</colgroup>
				<caption>
					강좌 리스트
				</caption>
				<thead>
					<tr>
						<th>강의번호</th>
						<th>제목</th>
						<th>강사</th>
						<th>수강기간</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="(item, index) in myLectureList" :key="index">
						<td>{{ item.user_lecture.lecture.idx }}</td>
						<td class="subject">
							<a @click="setMyLectureIdx(item.user_lecture.lecture.idx, item.idx)">{{ item.user_lecture.lecture.loc_subject }}</a>
						</td>
						<td>{{ item.user_lecture.lecture.loc_tutor_info }}</td>
						<td>{{ item.user_lecture.lecture.loc_term }}</td>
					</tr>
				</tbody>
				<tfoot>
					<td colspan="4" v-if="myLectureList.length < 1">수강중인 강좌가 없습니다.</td>
				</tfoot>
			</table>
		</div>
	</div>
</template>

<script>
import loading from '@/mixins/loading';
import { mapGetters } from 'vuex';
export default {
	mixins: [loading],
	computed: {
		...mapGetters('lectureStore', ['myLectureList']),
	},
	data() {
		return {
			nodata: false,
		};
	},
	async mounted() {
		try {
			await this.$store.dispatch('lectureStore/LECTURELIST');
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		async setMyLectureIdx(lectureIdx, myLectureidx) {
			await this.$store.commit('commonStore/getMyLectureIdx', myLectureidx);
			this.$router.push('/chaptorlist/' + lectureIdx);
		},
	},
};
</script>

<style></style>
