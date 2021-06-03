<template>
	<div>
		<search-options
			@positionOne="searchPositionAddOne"
			@positionOneDel="searchPositionOneDel"
			@positionAll="searchPositionAll"
			@teamOne="searchTeamAddOne"
			@teamOneDel="searchTeamOneDel"
			@teamAll="searchTeamAll"
			@searchData="searchWordEmit"
			:department="departmentOrigin"
			:designation="designationOrigin"
		></search-options>
		<div class="power-wrap">
			<section class="employee-list">
				<div class="employee-info">
					<span
						>전체<span class="employee-num">{{ notAdmins.length }}</span
						>명</span
					>
					<div class="v-application"><v-checkbox v-model="employeeCheckAll" label="전체선택" color="indigo darken-3 all"></v-checkbox></div>
				</div>
				<ul>
					<li v-for="(item, index) in notAdmins" :key="index" :class="item.number" class="active">
						<v-checkbox v-model="employee" :value="item.idx" class="ck-indigo"></v-checkbox>
						<span class="name">{{ item.name }}</span>
						<span class="department">{{ item.department.title }}</span>
						<span class="designation">{{ item.designation.title }}</span>
					</li>
					<li v-if="notAdmins.length === 0">직원이 없습니다.</li>
				</ul>
			</section>
			<div class="control">
				<div class="add" @click="add"><v-icon color="#23a4ef">mdi-arrow-right-thin-circle-outline</v-icon></div>
				<div class="remove" @click="remove"><v-icon color="#bcbcbc">mdi-arrow-left-thin-circle-outline</v-icon></div>
			</div>
			<section class="admin-list">
				<div class="admin-info">
					<span
						>전체<span class="admin-num">{{ admins.length }}</span
						>명</span
					>
					<div class="v-application"><v-checkbox v-model="adminCheckAll" label="전체선택" color="indigo darken-3 all"></v-checkbox></div>
				</div>
				<ul>
					<li v-for="(admin, index) in admins" :key="index" :class="admin.number">
						<v-checkbox v-model="administrator" :value="admin.idx" class="ck-indigo"></v-checkbox>
						<span class="name">{{ admin.name }}</span>
						<span class="department">{{ admin.department.title }}</span>
						<span class="designation">{{ admin.designation.title }}</span>
					</li>
					<li v-if="admins.length === 0">추가된 직원이 없습니다.</li>
				</ul>
			</section>
		</div>
		<!-- 테스트
		<div>관리자 설정 변경된 아아디 값 : {{ power }}</div>
		<div>일반유저 아이디 값 : {{ user }}</div>
		<div>관리자에 추가된 아이디 :{{ addPowerUserIdx }}</div>
		<div>유저에 추가된 아이디 :{{ addUserIdx }}</div>
		<div>관리자 고정값: {{ adminOrigin }}</div>
		<div>사용자 고정값: {{ userOrigin }}</div>
		<div>팀 {{ departmentOrigin }}</div>
		<div>부서 {{ designationOrigin }}</div> -->
		<!-- <div>부서 :{{ searchPosition }}</div>
		<div>직급 :{{ searchTeam }}</div> -->
		<!-- <div>직원 선택 : {{ employee }}</div>
		<div>관리자 선택 : {{ administrator }}</div>
		<div>직원 전체 선택 : {{ employeeCheckAll }}</div>
		<div>관리자 전체 선택 : {{ adminCheckAll }}</div> -->
	</div>
</template>

<script>
import SearchOptions from './SearchOptions.vue';
import $ from 'jquery';
export default {
	components: { SearchOptions },
	props: {
		notAdminsData: Array,
		adminsData: Array,
		powerprop: Array,
		userprop: Array,
		reset: Boolean,
		oriAdminProp: Array,
		oriUserProp: Array,
		department: Array,
		designation: Array,
	},
	data() {
		return {
			searchWord: '', //검색어
			searchPosition: [], //검색용 직급
			searchTeam: [], //검색용
			employeeCheckAll: false, //직원 전체 선택
			adminCheckAll: false, //관리자 전체 선택
			employee: [], //직원 체크 확인
			administrator: [], //관리자 체크 확인
			addPowerUserIdx: [], //관리자에 추가된 아이디
			addUserIdx: [], //일반직원에 추가된 아이디
		};
	},
	computed: {
		notAdmins() {
			return this.notAdminsData;
		},
		admins() {
			return this.adminsData;
		},
		power() {
			return this.powerprop;
		},
		user() {
			return this.userprop;
		},
		resetCheck() {
			return this.reset;
		},
		adminOrigin() {
			return this.oriAdminProp;
		},
		userOrigin() {
			return this.oriUserProp;
		},
		departmentOrigin() {
			return this.department;
		},
		designationOrigin() {
			return this.designation;
		},
	},
	watch: {
		employeeCheckAll(newValue) {
			if (newValue === true) {
				let checkId = [];
				this.notAdmins.forEach(element => {
					checkId.push(element.idx);
				});
				this.employee = checkId;
			} else {
				this.employee = [];
			}
		},
		adminCheckAll(newValue) {
			if (newValue === true) {
				let checkId = [];
				this.admins.forEach(element => {
					checkId.push(element.idx);
				});
				this.administrator = checkId;
			} else {
				this.administrator = [];
			}
		},
		resetCheck() {
			this.administrator = [];
			this.employee = [];
			this.adminCheckAll = false;
			this.employeeCheckAll = false;
		},
		employee(newValue) {
			if (newValue == '') {
				this.$emit('employee', 'none');
			} else {
				this.$emit('employee', 'data');
			}
		},
		administrator(newValue) {
			if (newValue == '') {
				this.$emit('administrator', 'none');
			} else {
				this.$emit('employee', 'data');
			}
		},
	},
	methods: {
		addAdmins(difference) {
			this.$emit('addAdmin', difference);
		},
		addUsers(difference) {
			this.$emit('addUser', difference);
		},
		add() {
			const _this = this;
			$('.employee-list li input:checkbox').each(function () {
				if ($(this).is(':checked')) {
					let val = $(this).val();
					val *= 1;
					let del = _this.user.indexOf(val);
					let del2 = _this.addUserIdx.indexOf(val);
					_this.notAdmins.forEach(function (value, index) {
						if (value.idx == val) {
							_this.user.splice(del, 1);
							_this.addPowerUserIdx.push(val);
							_this.power.push(val);
							_this.admins.push(value);
							_this.notAdmins.splice(index, 1);
							_this.administrator = [];
							_this.employee = [];
							_this.adminCheckAll = false;
							_this.employeeCheckAll = false;
							if (del2 > -1) {
								_this.addUserIdx.splice(del2, 1);
							}
						}
					});
				}
			});
			let difference = _this.power.filter(x => !_this.adminOrigin.includes(x));
			_this.addPowerUserIdx = difference;
			_this.addAdmins(difference);
		},
		remove() {
			const _this = this;
			$('.admin-list li input:checkbox').each(function () {
				if ($(this).is(':checked')) {
					let val = $(this).val();
					val *= 1;
					let del = _this.power.indexOf(val);
					let del2 = _this.addPowerUserIdx.indexOf(val);
					_this.admins.forEach(function (value, index) {
						if (value.idx == val) {
							_this.power.splice(del, 1);
							_this.addUserIdx.push(val);
							_this.user.push(val);
							_this.notAdmins.push(value);
							_this.admins.splice(index, 1);
							_this.administrator = [];
							_this.employee = [];
							_this.adminCheckAll = false;
							_this.employeeCheckAll = false;
							if (del2 > -1) {
								_this.addPowerUserIdx.splice(del2, 1);
							}
						}
					});
				}
			});
			let difference = _this.user.filter(x => !_this.userOrigin.includes(x));
			_this.addUserIdx = difference;
			_this.addUsers(difference);
		},
		emitPower(data) {
			this.$emit('powerData', data);
		},
		searchWordEmit(data) {
			this.searchWord = data;
		},
		searchPositionAddOne(data) {
			this.searchPosition.push(data);
		},
		searchPositionOneDel(data) {
			let del = this.searchPosition.indexOf(data);
			this.searchPosition.splice(del, 1);
		},
		searchTeamAddOne(data) {
			this.searchTeam.push(data);
		},
		searchTeamOneDel(data) {
			let del = this.searchTeam.indexOf(data);
			this.searchTeam.splice(del, 1);
		},
		searchPositionAll() {
			this.searchPosition = [];
		},
		searchTeamAll() {
			this.searchTeam = [];
		},
	},
	mounted() {
		//검색버튼 트리거;
		$('.search-input').on('keypress', function (event) {
			if (event.which === 13) {
				$('.person-search').trigger('click');
				return false;
			}
		});
		const _this = this;
		//직원 검색
		$('.person-search').on('click', () => {
			_this.employee = [];
			$('.search-opt-wrap').hide();
			$('.employee-list li').each(function () {
				let word = _this.searchWord;
				let name = $(this).find('.name').text();
				let department = $(this).find('.department').text();
				let designation = $(this).find('.designation').text();
				//이름검색
				if (name.indexOf(word) != -1) {
					$(this).addClass('active');
					$(this).removeClass('hidden');
					//부서,직책 동시 검색
					if (_this.searchTeam.length > 0 && _this.searchPosition.length > 0) {
						let teamlist = _this.searchTeam;
						let positionlist = _this.searchPosition;
						if (teamlist.includes(department) && positionlist.includes(designation)) {
							$(this).removeClass('hidden');
							$(this).addClass('active');
						} else {
							$(this).addClass('hidden');
							$(this).removeClass('active');
						}
					} else {
						//부서 검색
						if (_this.searchTeam.length > 0) {
							let teamlist = _this.searchTeam;
							if (teamlist.includes(department)) {
								$(this).removeClass('hidden');
								$(this).addClass('active');
							} else {
								$(this).addClass('hidden');
								$(this).removeClass('active');
							}
						}
						//직책 검색
						if (_this.searchPosition.length > 0) {
							let positionlist = _this.searchPosition;
							if (positionlist.includes(designation)) {
								$(this).removeClass('hidden');
								$(this).addClass('active');
							} else {
								$(this).addClass('hidden');
								$(this).removeClass('active');
							}
						}
					}
				} else {
					$(this).addClass('hidden');
					$(this).removeClass('active');
				}
			});
			if (!$('.employee-list li').hasClass('active')) {
				$('.employee-list ul').append('<li class="no-result">검색결과가 없습니다.</li>');
			} else {
				$('.employee-list ul .no-result').remove();
			}
			var numItems = $('.employee-list li.active').length;
			$('.employee-list .employee-num').text(numItems);
		});
	},
};
</script>

<style lang="scss" scoped>
.power-wrap {
	display: flex;
	& .employee-list {
		margin-top: 10px;
		width: calc(50% - 27px);
		& .employee-info {
			display: flex;
			justify-content: space-between;
			& .v-application {
				height: 30px !important;
			}
		}
		& ul {
			border: 1px solid rgb(207, 207, 207);
			min-width: 100%;
			padding: 10px;
			height: 300px;
			overflow-y: auto;
			& li {
				height: 35px;
				display: flex;
				& .name {
					margin-right: 2px;
				}
				& .position {
					margin-right: 15px;
				}
				&.no-result {
					background: #f4f4f4;
					text-align: center;
					padding: 5px 0;
				}
				&.no-data {
					background: #f4f4f4;
					text-align: center;
					padding: 5px 0;
				}
			}
		}
	}
	& .control {
		margin: 0 30px;
		cursor: pointer;
		& .add {
			margin-top: 150px;
		}
		& .remove {
			margin-top: 10px;
		}
	}
	& .admin-list {
		margin-top: 10px;
		width: calc(50% - 27px);
		& .admin-info {
			display: flex;
			justify-content: space-between;
			& .v-application {
				height: 30px !important;
			}
		}
		& ul {
			border: 1px solid blue;
			width: 100%;
			padding: 10px;
			height: 300px;
			overflow-y: auto;
			& li {
				height: 35px;
				display: flex;
				& .v-input__control {
					display: none;
				}
				& .name {
					margin-right: 2px;
				}
				& .position {
					margin-right: 15px;
				}
			}
		}
		& .delete {
			border: 1px solid #000;
			cursor: pointer;
		}
	}
}
</style>
