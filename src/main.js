import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faKey, faDoorOpen, faBan, faSortDown, faAdjust, faBookmark, faCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import vuetify from './plugins/vuetify';
import VModal from 'vue-js-modal';
Vue.use(VModal);
Vue.use(require('vue-moment'));

library.add(faKey, faDoorOpen, faBan, faSortDown, faAdjust, faBookmark, faCircle);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	VModal,
	render: h => h(App),
}).$mount('#app');
