<template>
	<div class="modal-wrap">
		<div @click="close" class="close"><v-icon>mdi-close-thick</v-icon></div>
		<slot name="head"></slot>
		<hr class="mt5" />
		<div class="body">
			<slot name="body"></slot>
		</div>
		<slot name="footer"></slot>
	</div>
</template>

<script>
export default {
	methods: {
		close() {
			this.$emit('close');
		},
	},
};
</script>

<style lang="scss" scoped>
.modal-wrap {
	padding: 30px;
}
.close {
	position: absolute;
	right: 20px;
	top: 20px;
	cursor: pointer;
}
.subject {
	margin-bottom: 5px;
}
.body {
	padding: 20px 0 0 0;
}
</style>
