<template>
	<defaultPopup @close="close">
		<template slot="head">
			<h2>내 정보</h2>
		</template>
		<template slot="body">
			<div class="wrap">
				<div class="photo-wrap">
					<div class="photo">
						<img src="@/assets/contact.png" alt="profile" />
						<div class="profile sub-menu">
							<div class="write"><v-icon color="#fff">mdi-lead-pencil</v-icon></div>
							<div class="menu">
								<a href="javascript:;" id="button" class="btn">사진 업로드</a>
								<a href="javascript:;" class="btn">기본 이미지로 변경</a>
							</div>
						</div>
						<input type="file" id="file" ref="file" @change="handleFileUpload" />
					</div>
				</div>
				<div class="info-wrap">
					<table>
						<caption>
							내정보
						</caption>
						<colgroup>
							<col width="100" />
							<col width="*" />
						</colgroup>
						<tr>
							<td>이름</td>
							<td>{{ this.userInfo.user_name }}</td>
						</tr>
						<tr>
							<td>아이디</td>
							<td>{{ this.userInfo.user_id }}</td>
						</tr>
						<tr>
							<td>휴대전화</td>
							<td>{{ this.userInfo.user_phone }}</td>
						</tr>
						<tr>
							<td>생년월일</td>
							<td>{{ this.userInfo.user_birth }}</td>
						</tr>
						<tr>
							<td colspan="2" class="line"></td>
						</tr>
						<tr>
							<td>회사명</td>
							<td>{{ this.userInfo.company_name }}</td>
						</tr>
						<tr>
							<td>부서</td>
							<td>{{ this.userInfo.department_name }}</td>
						</tr>
						<tr>
							<td>직급</td>
							<td>{{ this.userInfo.designation_name }}</td>
						</tr>
						<tr>
							<td>입사일</td>
							<td>{{ this.userInfo.user_join_date }}</td>
						</tr>
					</table>
				</div>
			</div>
		</template>
	</defaultPopup>
</template>

<script>
import defaultPopup from '@/components/popup/defaultPopup';
import { mapGetters } from 'vuex';
import $ from 'jquery';
export default {
	props: {
		idx: String,
	},
	computed: {
		...mapGetters('grantStore', ['userInfo']),
	},
	components: {
		defaultPopup,
	},
	data() {
		return {
			file: '',
		};
	},
	methods: {
		close() {
			this.$emit('close');
		},
		handleFileUpload() {
			this.file = this.$refs.file.files[0];
			let formData = new FormData();
			formData.append('file', this.file);
		},
	},
	async mounted() {
		try {
			await this.$store.dispatch('grantStore/USERINFO', { idx: this.idx });
		} catch (error) {
			console.log(error);
		}
		let $menu = $('.profile.sub-menu');
		$menu.click(function () {
			$('.profile .menu').show();
		});
		$('html').click(function (e) {
			if (!$(e.target).hasClass('profile') && !$(e.target).hasClass('v-icon') && !$(e.target).hasClass('btn')) {
				$('.profile .menu').hide();
			}
		});
		document.getElementById('button').addEventListener('click', () => {
			document.getElementById('file').click();
		});
	},
};
</script>

<style lang="scss" scoped>
.wrap {
	display: flex;
	& #file {
		display: none;
	}
	& .info-wrap {
		margin-left: 50px;
		& table {
			& td {
				height: 40px;
				&.line {
					border-top: 1px solid #ccc;
					height: 0;
				}
			}
		}
	}
	& .photo-wrap {
		position: relative;
		& .photo {
			width: 120px;
			height: 120px;
			border-radius: 50%;
			position: relative;
			& img {
				width: 100%;
				border-radius: 50%;
			}
			& .sub-menu {
				width: 30px;
				height: 30px;
				border-radius: 50%;
				background: rgb(36, 37, 82);
				position: absolute;
				right: 0px;
				bottom: 0px;
				cursor: pointer;
				& .v-icon {
					font-size: 1.6rem;
					position: absolute;
					top: 23%;
					left: 52%;
					transform: translate(-50%);
				}
				& .menu {
					display: none;
					background: #fff;
					position: absolute;
					top: 20px;
					left: 25px;
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
		}
	}
}
</style>
