import { createRouter, createWebHistory } from 'vue-router';
import LandingPage from '../views/auth/LandingPage.vue';
import SignIn from '../views/auth/SignIn.vue';
import SignUp from '../views/auth/SignUp.vue';
import Dashboard from '../views/Dashboard.vue';

const routes = [
  { path: '/', component: LandingPage }, 
  { path: '/signin', component: SignIn },
  { path: '/signup', component: SignUp },
  { path: '/dashboard', component: Dashboard }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
