<template>
	<section class="search-group">
		<div class="filter-group">
			<v-btn dark class="ml5 btn-filter"><v-icon>mdi-filter-outline</v-icon></v-btn>
			<input v-model="searchWord" type="text" class="ml5 search-input" />
			<v-btn color="btn-search" dark class="person-search ml5"><v-icon>mdi-magnify</v-icon></v-btn>
		</div>
		<div class="search-opt-wrap v-application">
			<div><v-btn x-small color="primary" dark class="opt-close">선택완료</v-btn></div>
			<h3>부서 <v-btn x-small color="success" dark class="part-all">전체보기</v-btn></h3>
			<div class="search-options team mt5">
				<span v-for="(item, index) in departmentData" :key="index">{{ item }}</span>
			</div>
			<h3 class="mt20">직급 <v-btn x-small color="success" dark class="pos-all">전체보기</v-btn></h3>
			<div class="search-options position mt5">
				<span v-for="(item, index) in designationData" :key="index">{{ item }}</span>
			</div>
		</div>
	</section>
</template>

<script>
import $ from 'jquery';
export default {
	data() {
		return {
			searchWord: '', //검색어
		};
	},
	props: {
		department: Array,
		designation: Array,
	},
	computed: {
		departmentData() {
			return this.department;
		},
		designationData() {
			return this.designation;
		},
	},
	watch: {
		searchWord(value) {
			this.emitSearch(value);
		},
	},
	methods: {
		emitSearch(data) {
			this.$emit('searchData', data);
		},
		emitPositionOne(data) {
			this.$emit('positionOne', data);
		},
		emitPositionOneDel(data) {
			this.$emit('positionOneDel', data);
		},
		emitPositionAll() {
			this.$emit('positionAll');
		},
		emitTeamOne(data) {
			this.$emit('teamOne', data);
		},
		emitTeamOneDel(data) {
			this.$emit('teamOneDel', data);
		},
		emitTeamAll() {
			this.$emit('teamAll');
		},
	},
	async mounted() {
		const _this = this;
		//전체보기
		$('.part-all').on('click', function () {
			$('.search-options.team span').removeClass('active');
			_this.emitTeamAll();
		});
		$('.pos-all').on('click', function () {
			$('.search-options.position span').removeClass('active');
			_this.emitPositionAll();
		});
		//검색버튼 클릭시
		$('.btn-search').on('click', function () {
			if ($('.search-input').val() !== '') {
				$('.employee-list li').removeClass('hidden');
			}
			if (!$('.search-options span').hasClass('active')) {
				$('.employee-list li').removeClass('hidden');
			}
		});
		//검색필드 감지
		$('.search-input').on('change keyup paste', function () {
			if ($(this).val() !== '') {
				$('.employee-info .v-input').hide();
			} else {
				if (!$('.search-options span').hasClass('active')) {
					$('.employee-info .v-input').show();
				}
				$('.person-search').trigger('click');
			}
		});
		//필터 보이기
		$('.filter-group .btn-filter').on('click', function () {
			$('.search-opt-wrap').show();
		});
		//필터 없애기
		$('.search-opt-wrap .opt-close').on('click', function () {
			$('.search-opt-wrap').hide();
			if ($('.search-options span').hasClass('active')) {
				$('.btn-filter').addClass('active');
			} else {
				$('.btn-filter').removeClass('active');
				$('.employee-info .v-input').show();
			}
			$('.person-search').trigger('click');
		});
		//직급 선택
		$(document).on('click', '.search-options.position span', function () {
			let select = $(this).text();
			$(this).toggleClass('active');
			if ($(this).hasClass('active')) {
				_this.emitPositionOne(select);
			} else {
				_this.emitPositionOneDel(select);
			}
			if ($('.search-options.position span.active').length < 1) {
				_this.emitTeamAll();
			}
		});
		//부서 선택
		$(document).on('click', '.search-options.team span', function () {
			let select = $(this).text();
			$('.part-all').removeClass('active');
			$(this).toggleClass('active');
			if ($(this).hasClass('active')) {
				_this.emitTeamOne(select);
			} else {
				_this.emitTeamOneDel(select);
			}
			if ($('.search-options.team span.active').length < 1) {
				_this.emitPositionAll();
			}
		});
	},
};
</script>

<style lang="scss" scpoed>
.search-group {
	position: relative;
	padding: 5px 0 5px 1px;
	border-radius: 5px 5px 0 0;
	& .filter-group {
		display: flex;
	}
	& .search-opt-wrap {
		display: none;
		position: absolute;
		top: 50px;
		left: 0;
		z-index: 2;
		background: #fff;
		border: 1px solid #ccc;
		padding: 20px 10px 15px 10px;
		max-width: 660px;
		& .opt-close {
			position: absolute;
			right: 10px;
			top: 10px;
			cursor: pointer;
		}
		& h3 {
			font-size: 1.4rem;
			margin-bottom: 3px;
			padding-left: 5px;
		}
		& .search-options {
			& span {
				cursor: pointer;
				border: 1px solid #ccc;
				height: 25px;
				line-height: 23px;
				border-radius: 13px;
				padding: 0 10px;
				margin-bottom: 5px;
				margin-right: 10px;
				&.active {
					background: rgb(51, 104, 219);
					color: #fff;
					border-color: rgb(51, 104, 219);
				}
				&:last-child {
					margin-right: 0;
				}
			}
		}
	}
}
</style>
