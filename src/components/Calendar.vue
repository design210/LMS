<template>
	<v-row class="fill-height">
		<v-col>
			<v-sheet height="64">
				<v-toolbar flat>
					<!-- 오늘날짜 보기 -->
					<v-btn outlined class="mr-4" color="grey darken-2" @click="setToday"> 오늘 </v-btn>
					<!-- 간격 -->
					<v-spacer></v-spacer>
					<!-- 이전 보기 -->
					<v-btn fab text small color="grey darken-2" @click="prev">
						<v-icon small> mdi-chevron-left </v-icon>
					</v-btn>
					<!-- 현재 연,월 표기 -->
					<v-toolbar-title v-if="$refs.calendar" class="calendar-title">
						{{ title }}
					</v-toolbar-title>
					<!-- 다음 보기 -->
					<v-btn fab text small color="grey darken-2" @click="next">
						<v-icon small> mdi-chevron-right </v-icon>
					</v-btn>
					<!-- 간격 -->
					<v-spacer></v-spacer>
					<!-- 뷰 변경 : 일, 주, 월, 4일 -->
					<v-menu bottom right>
						<template v-slot:activator="{ on, attrs }">
							<v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
								<span>{{ typeToLabel[type] }}</span>
								<v-icon right> mdi-menu-down </v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item @click="type = 'month'">
								<v-list-item-title>월</v-list-item-title>
							</v-list-item>
							<v-list-item @click="type = 'week'">
								<v-list-item-title>주</v-list-item-title>
							</v-list-item>
							<v-list-item @click="type = 'day'">
								<v-list-item-title>일</v-list-item-title>
							</v-list-item>
							<v-list-item @click="type = '4day'">
								<v-list-item-title>4일</v-list-item-title>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-toolbar>
			</v-sheet>
			<v-sheet height="800">
				<!-- 캘린더 본문 -->
				<span>{{ formattedDate }}</span>
				<v-calendar
					ref="calendar"
					v-model="focus"
					color="primary"
					locale="ko-KR"
					:events="events"
					:event-color="getEventColor"
					:type="type"
					@click:event="showEvent"
					@click:more="viewDay"
					@click:date="viewDay"
					@change="updateRange"
				></v-calendar>
				<!-- 이벤트 클릭시 모달 생성 -->
				<v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
					<v-card color="grey lighten-4" min-width="350px" flat>
						<v-toolbar :color="selectedEvent.color" dark>
							<v-icon>mdi-calendar-month</v-icon>
							<!-- 타이틀 -->
							<v-toolbar-title v-html="selectedEvent.name" class="calendar-subject"></v-toolbar-title>
							<v-spacer></v-spacer>
							<!-- 수정 버튼 -->
							<v-btn icon>
								<v-icon>mdi-pencil-outline</v-icon>
							</v-btn>
							<!-- 삭제 버튼 -->
							<v-btn icon>
								<v-icon>mdi-trash-can-outline</v-icon>
							</v-btn>
						</v-toolbar>
						<v-card-text>
							<span v-html="selectedEvent.details"></span>
						</v-card-text>
						<v-card-actions class="flex-center">
							<!-- 닫기 -->
							<v-btn text color="secondary" @click="selectedOpen = false"> 창닫기 </v-btn>
							<v-btn text color="secondary"> 저장 </v-btn>
						</v-card-actions>
					</v-card>
				</v-menu>
			</v-sheet>
		</v-col>
	</v-row>
</template>
<script>
export default {
	data: () => ({
		focus: '',
		type: 'month',
		typeToLabel: {
			month: '월',
			week: '주',
			day: '일',
			'4day': '4일',
		},
		selectedEvent: {},
		selectedElement: null,
		selectedOpen: false,
		events: [],
		colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
		start: null,
		end: null,
	}),
	computed: {
		title() {
			const { start, end } = this;
			if (!start || !end) {
				return '';
			}
			const startMonth = this.monthFormatter(start);
			const startYear = start.year;
			switch (this.type) {
				case 'month':
					return `${startYear}년 ${startMonth} `;
			}
			return '';
		},
		monthFormatter() {
			return this.$refs.calendar.getFormatter({
				timeZone: 'UTC',
				month: 'long',
			});
		},
	},
	mounted() {
		this.$refs.calendar.checkChange();
	},
	methods: {
		viewDay({ date }) {
			this.focus = date;
			this.type = 'day';
		},
		getEventColor(event) {
			return event.color;
		},
		setToday() {
			this.focus = '';
		},
		prev() {
			this.$refs.calendar.prev();
		},
		next() {
			this.$refs.calendar.next();
		},
		showEvent({ nativeEvent, event }) {
			console.log(event);
			const open = () => {
				this.selectedEvent = event;
				this.selectedElement = nativeEvent.target;
				requestAnimationFrame(() => requestAnimationFrame(() => (this.selectedOpen = true)));
			};

			if (this.selectedOpen) {
				this.selectedOpen = false;
				requestAnimationFrame(() => requestAnimationFrame(() => open()));
			} else {
				open();
			}

			nativeEvent.stopPropagation();
		},
		updateRange({ start, end }) {
			this.start = start;
			this.end = end;
			this.events = [
				{
					name: '월급날',
					start: new Date('2021/5/2 14:50'),
					end: new Date('2021/5/4 14:50'),
					color: 'blue',
					timed: true,
					details: '월급 1번째 받는날',
				},
				{
					name: '월급날2',
					start: new Date('2021/5/3 14:50'),
					end: new Date('2021/5/4 14:50'),
					color: 'cyan',
					timed: true,
					details: '월급 2번째 받는날',
				},
				{
					name: '월급날3',
					start: new Date('2021/5/3 19:50'),
					end: new Date('2021/5/3 20:50'),
					color: 'orange',
					timed: true,
					details: '월급 3번째 받는날',
				},
				{
					name: '휴무일',
					start: new Date('2021/5/5'),
					end: new Date('2021/5/6'),
					color: 'indigo',
					timed: false,
					details: '오늘은 휴무일입니다 열심히 놉시다',
				},
			];
		},
	},
};
</script>

<style lang="scss">
.v-card__text {
	padding: 20px 16px !important;
	& span {
		font-size: 1.4rem;
	}
}
.v-calendar {
	&.v-calendar-events {
		& .v-calendar-weekly__head-weekday,
		.v-calendar-weekly__day {
			margin-right: 0 !important;
		}
	}
}
.v-calendar-weekly__head-weekday {
	font-size: 13px !important;
	padding-top: 15px;
	color: #000 !important;
	&.primary--text {
		color: #000 !important;
	}
}
.v-btn__content,
.v-list-item .v-list-item__title,
.v-list-item .v-list-item__subtitle {
	font-size: 1.4rem;
}
.v-toolbar__title {
	&.calendar-subject {
		font-size: 2rem;
		margin-left: 10px;
	}
	&.calendar-title {
		font-size: 2rem;
	}
}
.v-calendar-weekly__head {
	& > div {
		&:first-child {
			color: red !important;
		}
	}
	& > div {
		&:last-child {
			color: blue !important;
		}
	}
}
.v-calendar-weekly__week {
	& > div {
		&:first-child {
			& span {
				color: red !important;
			}
		}
	}
	& > div {
		&:last-child {
			& span {
				color: blue !important;
			}
		}
	}
	& .v-outside {
		& > div {
			& button {
				& span {
					color: #b9b9b9 !important;
				}
			}
		}
	}
}
</style>
