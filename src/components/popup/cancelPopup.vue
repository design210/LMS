<template>
	<defaultPopup @close="close">
		<template slot="head">
			<h2>강의개설 취소</h2>
		</template>
		<template slot="body">
			<div>
				<p>중간 저장되지 않습니다.</p>
				<p>그래도 취소하시겠습니까?</p>
			</div>
		</template>
		<template slot="footer">
			<div class="v-application mt20 align d-flex">
				<v-btn small @click="close">취소</v-btn>
				<v-btn small color="primary" @click="move" class="ml10">확인</v-btn>
			</div>
		</template>
	</defaultPopup>
</template>

<script>
import defaultPopup from '@/components/popup/defaultPopup';
export default {
	components: {
		defaultPopup,
	},
	methods: {
		close() {
			this.$emit('close');
		},
		move() {
			this.$emit('close');
			this.$router.push('/lecture/lecturelist');
		},
	},
};
</script>

<style scoped>
.align {
	justify-content: center;
}
</style>
