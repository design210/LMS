<template>
	<div class="side-bar">
		<div class="logo"><router-link to="/main">Letuin</router-link></div>
		<nav>
			<ul>
				<li v-if="grantPower.indexOf(1) !== -1">
					<a href="javascript:;" class="ready" @click="alert"
						><span class="icon"><v-icon>mdi-google-classroom</v-icon></span
						>교육인사이트<v-icon class="lock">mdi-lock-outline</v-icon></a
					>
				</li>
				<li v-if="grantPower.indexOf(2) !== -1">
					<a href="javascript:;" class="ready" @click="alert"
						><span class="icon"><v-icon>mdi-monitor-dashboard</v-icon></span
						>교육로드맵<v-icon class="lock">mdi-lock-outline</v-icon></a
					>
				</li>
				<li class="init-depths" v-if="grantPower.indexOf(3) !== -1">
					<router-link to="/lecture/lecturelist"
						><span class="icon"><v-icon>mdi-presentation-play</v-icon></span
						>강의 관리<span class="arrow"></span
					></router-link>
					<!-- <ul class="depths2">
						<li><router-link to="/lecture/lecturelist">강의 목록</router-link></li>
						<li><router-link to="/lecture/lecturescrap">스크랩 강의</router-link></li>
					</ul> -->
				</li>
				<li class="init-depths" v-if="grantPower.indexOf(4) !== -1">
					<a href="javascript:;" class="depths1"
						><span class="icon"><v-icon>mdi-movie-star</v-icon></span
						>수강 현황<span class="arrow"><v-icon>mdi-chevron-down</v-icon></span></a
					>
					<ul class="depths2">
						<li><router-link to="/lecture/signuplecture">수강 중 강의</router-link></li>
						<li><router-link to="/lecture/expectedlecture">개강예정 강의</router-link></li>
						<li><router-link to="/lecture/endlecture">수강종료 강의</router-link></li>
					</ul>
				</li>
				<li v-if="grantPower.indexOf(5) !== -1">
					<router-link to="/lecturelist">
						<span class="icon"><v-icon>mdi-account-edit-outline</v-icon></span
						>내강의실</router-link
					>
				</li>
				<li v-if="grantPower.indexOf(6) !== -1">
					<a href="javascript:;" class="ready" @click="alert"
						><span class="icon"><v-icon>mdi-chart-box-outline</v-icon></span
						>교육결과 보고서<v-icon class="lock">mdi-lock-outline</v-icon></a
					>
				</li>
				<li v-if="grantPower.indexOf(7) !== -1">
					<a href="javascript:;" class="ready" @click="alert"
						><span class="icon"><v-icon>mdi-clipboard-list-outline</v-icon></span
						>사내 게시판<v-icon class="lock">mdi-lock-outline</v-icon></a
					>
				</li>
				<li class="init-depths" v-if="grantPower.indexOf(8) !== -1">
					<a href="javascript:;" class="depths1"
						><span class="icon"><v-icon>mdi-account-group-outline</v-icon></span
						>직원관리<span class="arrow"><v-icon>mdi-chevron-down</v-icon></span></a
					>
					<ul class="depths2">
						<li><router-link to="/employeeinfo">직원 목록</router-link></li>
						<li><router-link to="/admininfo">운영자 관리</router-link></li>
						<!-- <li><router-link to="/">수강생그룹 관리</router-link></li> -->
					</ul>
				</li>
				<li class="init-depths" v-if="grantPower.indexOf(9) !== -1">
					<a href="javascript:;" class="depths1"
						><span class="icon"><v-icon>mdi-cog-transfer-outline</v-icon></span
						>설정<span class="arrow"><v-icon>mdi-chevron-down</v-icon></span></a
					>
					<ul class="depths2">
						<li><router-link to="/companyinfo">회사정보</router-link></li>
						<li></li>
					</ul>
				</li>
				<li v-if="grantPower.indexOf(10) !== -1">
					<router-link to="/myinfo"
						><span class="icon"><v-icon>mdi-account-box-outline</v-icon></span
						>내정보<span class="arrow"></span
					></router-link>
				</li>
			</ul>
		</nav>
	</div>
</template>

<script>
import $ from 'jquery';
import { getGrantList } from '@/utils/cookies';
import { getPopupOpt } from '@/utils/popup';
import readyPopup from '@/components/popup/readyPopup.vue';
export default {
	data() {
		return {
			grantPower: '',
		};
	},
	mounted() {
		const grantList = getGrantList();
		var afterStr = grantList.split(',');
		const uiSet = afterStr.map(x => parseFloat(x));
		this.grantPower = uiSet;
		//메뉴동작 script
		$(function () {
			var depths1 = $('nav > ul > li > a');
			var depths2 = $('.depths2 > li > a');
			depths1.click(function () {
				if (!$(this).hasClass('depths1')) {
					$('nav > ul > li > a').removeClass('active');
					$('nav > ul > li > a').removeClass('router-link-exact-active');
					$('.side-bar .depths2').slideUp('fast');
					$(this).addClass('active');
					depths2.removeClass('active');
				} else {
					depths1.not($(this)).removeClass('active');
					depths1.not($(this)).removeClass('router-link-exact-active');
					depths1.not($(this)).next().slideUp('fast');
					$(this).toggleClass('active');
					$(this).next().stop().slideToggle('fast');
				}
			});
			depths2.click(function () {
				depths2.removeClass('active');
				$(this).addClass('active');
				$(this).closest('.init-depths').find('.depths1').addClass('router-link-exact-active');
			});
		});
	},
	methods: {
		alert() {
			this.$modal.show(readyPopup, {}, getPopupOpt('playerVideoPoup', '300px', '200px', false));
		},
	},
};
</script>

<style lang="scss" scoped>
.v-icon {
	color: #a0a2a9 !important;
	font-size: 2rem !important;
	vertical-align: -2px !important;
	margin-right: 3px;
}
.side-bar {
	position: relative;
	min-width: 230px;
	width: 230px;
	background: #111729;
	min-height: calc(100vh + 100px);
	& .logo {
		text-align: center;
		padding: 20px 0;
		& a {
			@include Roboto(3, 700, #646cba);
		}
	}
	& nav {
		& > ul {
			& > li {
				position: relative;
				padding: 0 10px;
				& > a {
					color: #ededec;
					display: block;
					padding: 15px 10px;
					font-size: 15px;
					border-radius: 10px;
					&:hover {
						background: #2e3343;
						& .v-icon {
							color: #fff !important;
						}
					}
					& .arrow {
						position: absolute;
						right: 15px;
						top: 13px;
					}
					& .icon {
						margin-right: 7px;
					}
					&.active {
						background: #2e3343;
						& .arrow {
							& .v-icon {
								transform: rotate(180deg);
							}
						}
						& .v-icon {
							color: #fff !important;
						}
					}
					&.router-link-exact-active {
						background: #2e3343;
					}
					& .lock {
						position: absolute;
						right: 15px;
						top: 15px;
					}
				}
				&.init-depths {
					& .depths2 {
						display: none;
						& li {
							padding: 8px 10px 8px 35px;
							& a {
								color: #fff;
								display: block;
								position: relative;
								&:before {
									content: '';
									position: absolute;
									left: -15px;
									top: -10px;
									width: 1px;
									height: 37px;
									background: #2e3343;
									display: inline-block;
								}
								&:hover {
									&:before {
										background: #fff;
									}
								}
								&.active {
									&:before {
										background: #fff;
									}
								}
								&.router-link-exact-active {
									&:before {
										background: #fff;
									}
								}
							}
							&:first-child {
								& a {
									&:before {
										top: 3px;
										height: 24px;
									}
								}
							}
							&:last-child {
								& a {
									&:before {
										top: -10px;
										height: 27px;
									}
								}
							}
						}
					}
				}
			}
		}
	}
}
</style>
