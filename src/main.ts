import { createApp } from 'vue';
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
import './assets/css/auth/SignIn.css';
import './assets/css/auth/SignUp.css';

const app = createApp(App);
app.use(router);
app.use(PrimeVue);
app.use(ToastService);

app.mount('#app');
