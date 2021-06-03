<template>
	<div class="container404">
		<div>
			<div class="icon">
				<font-awesome-icon icon="ban" class="fa-5x color"></font-awesome-icon>
			</div>
			<div class="message">페이지를 찾을수 없습니다.</div>
		</div>
	</div>
</template>

<script>
import loading from '@/mixins/loading';
export default { mixins: [loading] };
</script>

<style lang="scss" scoped>
.container404 {
	background: #3a3361;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	& .message {
		color: #fff;
		font-size: 3rem;
		font-weight: 100;
		margin-top: 10px;
	}
	& .icon {
		text-align: center;
		& .color {
			color: Tomato;
		}
	}
}
</style>
