<template>
	<defaultPopup @close="close">
		<template slot="head">
			<h2>강의삭제</h2>
		</template>
		<template slot="body">
			<div>
				<p>해당 강의를 삭제하시겠습니까?</p>
			</div>
		</template>
		<template slot="footer">
			<div class="v-application mt20 align d-flex">
				<v-btn small @click="close">취소</v-btn>
				<v-btn small color="primary" @click="del" class="ml10">확인</v-btn>
			</div>
		</template>
	</defaultPopup>
</template>

<script>
import defaultPopup from '@/components/popup/defaultPopup';
import bus from '@/utils/bus';
export default {
	components: {
		defaultPopup,
	},
	props: {
		idx: Number,
	},
	methods: {
		close() {
			this.$emit('close');
		},
		del() {
			this.$emit('close');
			bus.$emit('del', this.idx);
		},
	},
};
</script>

<style scoped>
.align {
	justify-content: center;
}
</style>
