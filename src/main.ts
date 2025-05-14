import { createApp } from 'vue';
import { createPinia } from 'pinia'
import router from './router';
import App from './App.vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

// Import PrimeVue CSS
import 'primevue/resources/themes/lara-light-blue/theme.css'; 
import 'primevue/resources/primevue.min.css';               
import 'primeicons/primeicons.css';                         

// Import CSS
import './assets/css/style.css';
import './assets/css/auth/auth.css';
import './assets/css/admin/UserManagement.css';
import './assets/css/main/LivestockMarket.css';

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);

app.use(pinia);
app.mount('#app');
