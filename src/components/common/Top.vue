<template>
	<div class="contents-top">
		<div class="info-wrap">
			<span class="profile-img">
				<img src="@/assets/profile.jpg" alt="profile" />
			</span>
			<span class="welcome">
				<span class="name">{{ name }}</span>
				<span>님 환영합니다.</span>
			</span>
			<a href="javascript:;" @click="Logout" class="logout">로그아웃</a>
		</div>
	</div>
</template>

<script>
import { getUserName } from '@/utils/cookies';
export default {
	data() {
		return {
			name: '',
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
	},
};
</script>

<style lang="scss" scoped>
.contents-top {
	background: #ffffff;
	height: 60px;
	border-bottom: 1px solid #e3e5e6;
	@include boxshadow(0px, 3px, 6px, 0px, rgba(0, 0, 0, 0.2));
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
