<template>
	<div class="contents-top">
		<div class="info-wrap">
			<span class="profile-img ml5">
				<img src="@/assets/profile.jpg" alt="profile" />
			</span>
			<span class="welcome">
				<span class="name">{{ name }} 님</span>
			</span>
			<span class="my-more ml5">
				<v-icon v-if="down">mdi-arrow-down-drop-circle</v-icon>
				<v-icon v-if="up">mdi-arrow-up-drop-circle</v-icon>
				<div class="sub-menu">
					<a href="javascript:;" @click="showModalPopup" v-if="grantPower.indexOf(10) !== -1">내 정보</a>
					<a href="javascript:;" @click="Logout">로그아웃</a>
				</div>
			</span>
		</div>
	</div>
</template>

<script>
import { getUserName } from '@/utils/cookies';
import { getGrantList } from '@/utils/cookies';
import { getPopupOpt } from '@/utils/popup';
import myInfoPopup from '@/components/popup/myInfoPopup.vue';
import { getUserIdx } from '@/utils/cookies';
import $ from 'jquery';
export default {
	data() {
		return {
			down: true,
			up: false,
			grantPower: '',
			ind: null,
		};
	},
	created() {
		this.name = getUserName();
	},
	methods: {
		Logout() {
			this.$store.commit('loginStore/clearCookie');
			this.$router.push('/login');
		},
		showModalPopup(data) {
			this.$modal.show(myInfoPopup, { idx: this.idx }, getPopupOpt('myInfoPopup', '800px', 'auto', false));
		},
	},
	mounted() {
		this.idx = getUserIdx();
		const grantList = getGrantList();
		var afterStr = grantList.split(',');
		const uiSet = afterStr.map(x => parseFloat(x));
		this.grantPower = uiSet;
		const _this = this;
		let set = 0;
		$('.my-more').click(function () {
			_this.down = !_this.down;
			_this.up = !_this.up;
			if (set === 0) {
				set = 1;
				$('.my-more .sub-menu').show();
			} else {
				set = 0;
				$('.my-more .sub-menu').hide();
			}
		});
		$('.my-more .sub-menu a').click(function () {
			$('.my-more .sub-menu').hide();
		});
	},
};
</script>

<style lang="scss" scoped>
.contents-top {
	background: #ffffff;
	height: 60px;
	border-bottom: 1px solid #e3e5e6;
	@include boxshadow(0px, 3px, 6px, 0px, rgba(0, 0, 0, 0.2));
	& .my-more {
		position: relative;
		& .sub-menu {
			display: none;
			background: #fff;
			position: absolute;
			top: 40px;
			right: 0;
			z-index: 10;
			border-radius: 3px;
			@include boxshadow(0px, 3px, 6px, 0px, rgba(0, 0, 0, 0.2));
			overflow: hidden;
			& a {
				display: block;
				white-space: nowrap;
				padding: 2px 20px;
				color: #000;
				border-bottom: 1px dotted #ccc;
				font-size: 1.3rem;
				&:last-child {
					border-bottom: 0;
				}
				&:hover {
					background: #f4f4f4;
				}
			}
		}
	}
	& .info-wrap {
		font-size: 1.4rem;
		padding: 0 30px;
		height: 100%;
		align-items: center;
		display: flex;
		justify-content: flex-end;
		& .profile-img {
			color: #001737;
			width: 40px;
			height: 40px;
			& img {
				width: 100%;
				height: 100%;
				border-radius: 50%;
			}
		}
		& .welcome {
			margin-left: 5px;
		}
		& .logout {
			margin-left: 20px;
			background: rgb(151, 151, 151);
			height: 30px;
			line-height: 30px;
			color: #fff;
			padding: 0 20px;
			border-radius: 15px;
		}
	}
}
</style>
