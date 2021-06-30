<template>
	<div class="top" @click="top">
		<p><v-icon>mdi-chevron-up</v-icon></p>
		<p class="text">Top</p>
	</div>
</template>

<script>
import $ from 'jquery';
export default {
	methods: {
		top() {
			var body = document.getElementsByTagName('body')[0];
			window.scroll({
				behavior: 'smooth',
				left: 0,
				top: body.offsetTop,
			});
		},
	},
	mounted() {
		$(window).scroll(function () {
			var scrollValue = $(document).scrollTop();
			if (scrollValue > 30) {
				$('.top').stop().fadeIn('fast');
			} else {
				$('.top').stop().fadeOut('fast');
			}
		});
	},
};
</script>

<style lang="scss" scoped>
.top {
	display: none;
	border: 1px solid rgb(228, 228, 228);
	border-radius: 50%;
	width: 50px;
	height: 50px;
	position: fixed;
	right: 30px;
	bottom: 30px;
	background: #fff;
	z-index: 999;
	text-align: center;
	padding-top: 5px;
	cursor: pointer;
	line-height: 0px;
	box-shadow: 0px 3px 6px 0px rgba(0, 0, 0, 0.1);
}
.text {
	font-size: 1.2rem;
}
</style>
