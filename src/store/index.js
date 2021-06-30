import Vue from 'vue';
import Vuex from 'vuex';
import commonStore from '@/store/modules/commonStore.js';
import loginStore from '@/store/modules/loginStore.js';
import lectureStore from '@/store/modules/lectureStore.js';
import chaptorStore from '@/store/modules/chaptorStore.js';
import resourceStore from '@/store/modules/resourceStore.js';
import companyStore from '@/store/modules/companyStore.js';
import grantStore from '@/store/modules/grantStore.js';
import lectureOpenStore from '@/store/modules/lectureOpenStore.js';
Vue.use(Vuex);
export default new Vuex.Store({
	modules: {
		commonStore,
		companyStore,
		loginStore,
		lectureStore,
		chaptorStore,
		resourceStore,
		grantStore,
		lectureOpenStore,
	},
});
