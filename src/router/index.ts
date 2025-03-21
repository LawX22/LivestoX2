import { createRouter, createWebHistory } from 'vue-router';

// Auth Pages
import LandingPage from '../views/auth/LandingPage.vue';
import SignIn from '../views/auth/SignIn.vue';
import SignUp from '../views/auth/SignUp.vue';

// Admin Pages
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import UserManagement from '../views/admin/UserManagement.vue';

// Main Pages
import LivestockMarket from '../views/main/LivestockMarket.vue';
import Message from '../views/main/Message.vue';
import LivestockForum from '../views/main/LivestockForum.vue';

// Define Routes
const routes = [
  // Auth Routes
  { path: '/', component: LandingPage, name: 'LandingPage' },
  { path: '/signin', component: SignIn, name: 'SignIn' },
  { path: '/signup', component: SignUp, name: 'SignUp' },

  // Main Route
  { path: '/main/LivestockMarket', component: LivestockMarket, name: 'LivestockMarket' },
  { path: '/main/Message', component: Message, name: 'Message' },
  { path: '/main/LivestockForum', component: LivestockForum, name: 'LivestockForum' },

  // Admin Routes
  { path: '/admin/adminDashboard', component: AdminDashboard, name: 'AdminDashboard' },
  { path: '/admin/userManagement', component: UserManagement, name: 'UserManagement' }
];

// Create Router
const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
