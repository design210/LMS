<template>
	<defaultPopup @close="close">
		<template slot="head">
			<h2>안내</h2>
		</template>
		<template slot="body">
			<div>서비스 준비중입니다.</div>
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
	},
};
</script>

<style></style>
