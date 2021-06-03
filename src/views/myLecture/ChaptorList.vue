<template>
	<div class="contents-wrap">
		<div class="title-header purple2">
			<div class="location">
				<v-icon color="white">mdi-map-marker-outline</v-icon>
				<span class="page">내 강의실</span>
				<span class="page">강의 리스트</span>
				<span class="page">차시 리스트</span>
			</div>
			<h1>차시 리스트</h1>
			<v-icon>mdi-television-play</v-icon>
		</div>
		<div class="contents-container">
			<div class="right">
				<router-link to="/lecturelist" class="btn-blue">강의목록 보기 </router-link>
			</div>
			<h2 class="mt20"><v-icon class="chaptor-icon">mdi-book-education</v-icon>{{ chaptorData.loc_subject }}</h2>
			<div class="tbl-info-wrap mt10">
				<table class="tbl-info">
					<colgroup>
						<col width="200px" />
						<col width="*" />
					</colgroup>
					<tr>
						<th>학습효과</th>
						<td v-html="chaptorData.loc_course_1"></td>
					</tr>
					<tr>
						<th>교육대상</th>
						<td>{{ chaptorData.loc_course_2 }}</td>
					</tr>
					<tr>
						<th>평가기준</th>
						<td>{{ chaptorData.loc_course_3 }}</td>
					</tr>
					<tr>
						<th>평가방법</th>
						<td>{{ chaptorData.loc_course_4 }}</td>
					</tr>
					<tr>
						<th>수료기준</th>
						<td>{{ chaptorData.loc_course_5 }}</td>
					</tr>
				</table>
			</div>
			<div class="listWrap mt30">
				<table class="tbl-basic">
					<colgroup>
						<col width="6%" />
						<col width="*" />
						<col width="10%" />
						<col width="10%" />
						<col width="10%" />
						<col width="15%" />
					</colgroup>
					<thead>
						<tr>
							<th>no</th>
							<th>제목</th>
							<th>레벨</th>
							<th>타입</th>
							<th>이름</th>
							<th>날짜</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(row, k) in chaptorList" :key="k">
							<td>{{ row.idx }}</td>
							<td class="subject">
								<a @click="showModalPopup" :dataIdx="row.idx">{{ row.lo_subject }}</a>
							</td>
							<td>{{ row.lo_level }}</td>
							<td>{{ row.lo_type }}</td>
							<td>{{ row.lo_instructor }}</td>
							<td>{{ row.lo_datetime }}</td>
						</tr>
						<tr v-if="chaptorList.length == 0">
							<td colspan="6">데이터가 없습니다.</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
<script>
import loading from '@/mixins/loading';
import { getPopupOpt } from '@/utils/popup';
import playerVideoPoup from '@/components/popup/PlayerVideoPopup';
import { mapGetters } from 'vuex';

export default {
	mixins: [loading],
	computed: {
		...mapGetters('chaptorStore', ['chaptorList', 'chaptorData']),
	},
	async mounted() {
		try {
			this.chaptorCode = this.$route.params.id;
			await this.$store.dispatch('chaptorStore/CHAPTORLIST', this.chaptorCode);
		} catch (error) {
			console.log(error);
		}
	},
	methods: {
		showModalPopup(event) {
			this.$modal.show(
				playerVideoPoup,
				{ chaptorIdx: event.target.getAttribute('dataIdx') },
				getPopupOpt('playerVideoPoup', '1000px', '800px', false),
			);
		},
	},
};
</script>

<style scoped lang="scss">
.chaptor-icon {
	color: rgb(105, 81, 161) !important;
	margin-right: 10px;
	font-size: 3rem;
	vertical-align: -2px !important;
}
</style>
