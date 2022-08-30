import {createApp} from 'vue';
import App from '/@/App.vue';
import eventBus from 'vue3-eventbus';

import mTree from '/@/components/mTree.vue';
import router from '/@/router';

const app = createApp(App);

app.component('mTree', mTree);
app.use(router).use(eventBus);
app.mount('#app');
