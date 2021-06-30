<template>
	<defaultPopup @close="close">
		<template slot="head">
			<div class="top">
				<h2>{{ chaprots.userName }}님 교육결과</h2>
				<span v-if="chaprots.status === 24" class="i-not ml10 mt3">수강전</span>
				<span v-if="chaprots.status === 27" class="i-not ml10 mt3">미수료</span>
				<span v-if="chaprots.status === 25" class="i-ing ml10 mt3">수강중</span>
				<span v-if="chaprots.status === 26" class="i-end ml10 mt3">수료</span>
			</div>
		</template>
		<template slot="body">
			<div class="subject">{{ chaprots.subject }}</div>
			<div class="v-application mt10"><v-icon>mdi-calendar-month</v-icon> {{ chaprots.lecture_period }}</div>
			<div class="info-box mt15">
				<p class="percent">{{ chaprots.progress_rate }}%</p>
				<p>전체 진도율</p>
			</div>
			<div class="tbl-wrap mt10">
				<table class="tbl-basic">
					<caption>
						수강생 정보
					</caption>
					<colgroup>
						<col width="80" />
						<col width="*" />
						<col width="80" />
						<col width="80" />
					</colgroup>
					<thead>
						<tr>
							<th>차시번호</th>
							<th>차시명</th>
							<th>차시시간</th>
							<th>진도율</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in chaprots.chapters" :key="index">
							<td>{{ item.order_number }}</td>
							<td class="subject">{{ item.subject }}</td>
							<td>{{ item.time }}</td>
							<td>{{ item.progress_rate }}%</td>
						</tr>
					</tbody>
				</table>
			</div>
		</template>
	</defaultPopup>
</template>

<script>
import defaultPopup from '@/components/popup/defaultPopup';
import { mapGetters } from 'vuex';
import timeSet from '@/utils/time';
import bus from '@/utils/bus';
export default {
	computed: {
		...mapGetters('lectureOpenStore', ['chaptorInfo']),
	},
	components: {
		defaultPopup,
	},
	props: {
		idx: Number,
	},
	data() {
		return {
			chaprots: [],
		};
	},
	methods: {
		close() {
			this.$emit('close');
		},
		timeTrans(data) {
			console.log('time:', data);
		},
	},
	async mounted() {
		try {
			bus.$emit('start:spinner');
			await this.$store.dispatch('lectureOpenStore/CHAPTOR_INFO', { idx: this.idx });
			this.chaprots = this.chaptorInfo;
			this.chaprots.chapters.forEach(ele => {
				let change = timeSet(ele.time);
				ele.time = change;
			});
			bus.$emit('end:spinner');
		} catch (error) {
			console.log(error);
		}
	},
};
</script>

<style lang="scss" scoped>
.tbl-wrap {
	max-height: 510px;
	overflow-y: auto;
}
.top {
	display: flex;
	align-items: center;
	& span {
		white-space: nowrap;
	}
}
.subject {
	font-size: 1.8rem;
}
.info-box {
	color: #fff;
	padding: 20px 30px;
	border-radius: 10px;
	background: rgb(32, 28, 51);
	display: inline-block;
	& .percent {
		font-weight: 700;
		font-size: 3rem;
	}
}
</style>
