import './assets/main.css'

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import VueMaterial from 'vue-material';
import 'vue-material/dist/vue-material.min.css';
import 'vue-material/dist/theme/default.css';
import clickOutside from './directives/click-outside';

const app = createApp(App);

app.use(VueMaterial);
app.use(router);
app.mount('#app');

app.directive('click-outside', clickOutside);
