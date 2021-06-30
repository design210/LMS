<template>
	<div class="login-container">
		<div class="login-box">
			<h1><img src="@/assets/logo_expert.png" alt="logo" class="logo" /> 회원 로그인</h1>
			<form @submit.prevent="submitLogin">
				<div class="mt20">
					<input type="text" v-model="username" placeholder="아이디를 입력하세요." />
				</div>
				<div class="mt5">
					<input type="password" v-model="password" placeholder="비밀번호를 입력하세요." />
				</div>
				<button type="submit" class="btn-login mt20" :disabled="!username || !password">로그인 하기</button>
				<p class="error-message">{{ logMessage }}</p>
			</form>
		</div>
	</div>
</template>

<script>
import loading from '@/mixins/loading';
import { mapGetters } from 'vuex';
import { getUserGrant } from '@/utils/cookies';
export default {
	mixins: [loading],
	computed: {
		...mapGetters('loginStore', ['resultMessage']),
	},
	data() {
		return {
			username: '',
			password: '',
			logMessage: '',
		};
	},
	methods: {
		async submitLogin() {
			try {
				const userData = {
					id: this.username,
					pw: this.password,
				};
				await this.$store.dispatch('loginStore/LOGIN', userData);
				await this.$store.dispatch('grantStore/GRANT');
				const loginFlag = this.resultMessage.loginFlag;
				const grant = getUserGrant();
				if (loginFlag == 'success') {
					if (grant == 3) {
						this.$router.push('/lecturelist');
					} else {
						this.$router.push('/lecture/lecturelist');
					}
				} else {
					this.logMessage = this.resultMessage.loginMessage;
					this.initForm();
				}
			} catch (error) {
				if (error.response.status === 401) {
					this.logMessage = '아이디/비밀번호를 확인해주세요.';
				}
			} finally {
				this.initForm();
			}
		},
		initForm() {
			this.username = '';
			this.password = '';
		},
	},
};
</script>
<style lang="scss" scoped>
.login-container {
	height: 100vh;
	background: url('../../assets/login_bg.jpg');
	background-size: cover;
	display: flex;
	align-items: center;
	justify-content: center;
	& .login-box {
		background: #fff;
		border-radius: 10px;
		padding: 30px;
		width: 400px;
		& h1 {
			text-align: center;
			& .logo {
				width: 80px;
				vertical-align: 0px;
				margin-right: 10px;
			}
		}
		& input {
			height: 45px !important;
			width: 100%;
		}
		& button {
			width: 100%;
			height: 50px;
			background: #ffbd3f;
			color: #fff;
			border-radius: 5px;
			font-size: 1.8rem;
			&:disabled {
				background: #ccc;
			}
		}
		.flex-between {
			& a {
				color: rgb(51, 51, 51);
			}
		}
		& .error-message {
			text-align: center;
			padding: 10px 0;
			color: red;
		}
	}
}
</style>
