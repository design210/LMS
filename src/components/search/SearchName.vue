<template>
	<div class="search-wrap">
		<input type="text" v-model="keyword" :placeholder="placeholder" class="search-input" :style="{ width, width }" />
		<v-btn color="btn-search" dark class="ml5 person-search" @click="emitClick"><v-icon>mdi-magnify</v-icon></v-btn>
	</div>
</template>

<script>
import $ from 'jquery';
export default {
	props: {
		placeholderProp: String,
		widthProp: String,
	},
	data() {
		return {
			keyword: '',
			placeholder: '',
			width: '',
		};
	},
	watch: {
		keyword(value) {
			this.emitKeyword(value);
		},
	},
	mounted() {
		this.placeholder = this.placeholderProp;
		this.width = this.widthProp;
		$('.search-input').on('keypress', function (event) {
			if (event.which === 13) {
				$('.person-search').trigger('click');
				return false;
			}
		});
	},
	methods: {
		emitKeyword(data) {
			this.$emit('initkeyword', data);
		},
		emitClick() {
			this.$emit('onClick');
		},
	},
};
</script>

<style lang="scss" scoped>
.search-wrap {
	display: flex;
	& .select-width {
		width: 150px;
	}
}
</style>
