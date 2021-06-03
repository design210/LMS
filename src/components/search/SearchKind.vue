<template>
	<div class="search-wrap">
		<div class="select-width mr5">
			<v-select :items="items" v-model="searchKind" :value="items" label="직원검색" dense outlined></v-select>
		</div>
		<input type="text" v-model="keyword" class="search-input" />
		<v-btn color="btn-search" dark class="ml5 person-search" @click="emitClick"><v-icon>mdi-magnify</v-icon></v-btn>
	</div>
</template>

<script>
import $ from 'jquery';
export default {
	data() {
		return {
			items: ['이름', '아이디', '이메일', '연락처'],
			searchKind: '',
			keyword: '',
		};
	},
	mounted() {
		$('.search-input').on('keypress', function (event) {
			if (event.which === 13) {
				$('.person-search').trigger('click');
				return false;
			}
		});
	},
	watch: {
		searchKind(value) {
			this.emitKind(value);
		},
		keyword(value) {
			this.emitKeyword(value);
		},
	},
	methods: {
		emitKind(data) {
			this.$emit('selectKind', data);
		},
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
