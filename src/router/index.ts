import { createRouter, createWebHistory } from 'vue-router';

// Auth Pages
import LandingPage from '../views/auth/LandingPage.vue';
import SignIn from '../views/auth/SignIn.vue';
import SignUp from '../views/auth/SignUp.vue';

// Admin Pages
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import UserManagement from '../views/admin/UserManagement.vue';

// Main Pages
import LivestockDashboard from '../views/main/LivestockDashboard.vue';  
import FarmerLivestockDashboard from '../views/main/FarmerLivestockDashboard.vue';  
import LivestockMarket from '../views/main/LivestockMarket.vue';
import Message from '../views/main/Message.vue';
import LivestockForum from '../views/main/LivestockForum.vue';
import ViewListings from '../views/main/ViewListings.vue';
import PostLivestockForms from '../views/main/PostLivestockForms.vue';
import FarmerSignupForm from '../views/main/FarmerSignupForm.vue';

// Utility Pages
import UnderConstructionPage from '../views/utility/UnderConstructionPage.vue';

// Define Routes
const routes = [
  // Auth Routes
  { path: '/', component: LandingPage, name: 'LandingPage' },
  { path: '/signin', component: SignIn, name: 'SignIn' },
  { path: '/signup', component: SignUp, name: 'SignUp' },

  // Main Routes
  { path: '/main/LivestockMarket', component: LivestockMarket, name: 'LivestockMarket' },
  { path: '/main/FarmerLivestockDashboard', component: FarmerLivestockDashboard, name: 'FarmerLivestockDashboard' },
  { path: '/main/LivestockDashboard', component: LivestockDashboard, name: 'LivestockDashboard' },
  { path: '/main/Message', component: Message, name: 'Message' },
  { path: '/main/LivestockForum', component: LivestockForum, name: 'LivestockForum' },
  { path: '/main/ViewListings', component: ViewListings, name: 'ViewListings' },
  { path: '/main/PostLivestockForms', component: PostLivestockForms, name: 'PostLivestockForms' },
  { path: '/main/FarmerSignupForm', component: FarmerSignupForm, name: 'FarmerSignupForm' },

  // Admin Routes
  { path: '/admin/adminDashboard', component: AdminDashboard, name: 'AdminDashboard' },
  { path: '/admin/userManagement', component: UserManagement, name: 'UserManagement' },

  // Under Construction Routes
  { path: '/coming-soon', component: UnderConstructionPage, name: 'ComingSoon' },
  { path: '/under-development/:feature', component: UnderConstructionPage, name: 'UnderDevelopment', props: true },

  // Catch-all route for 404
  { path: '/:pathMatch(.*)*', component: UnderConstructionPage, name: 'NotFound', props: { isError: true } }
];

// Create Router
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top when navigating
    return { top: 0 }
  }
});

export default router;