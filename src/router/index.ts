import { createRouter, createWebHistory } from 'vue-router';

// Auth Pages
import SignIn from '../views/auth/SignIn.vue';
import SignUp from '../views/auth/SignUp.vue';
import ForgotPassword from '../views/auth/ForgotPassword.vue';
import FarmerUpgradeAccount from '../views/auth/FarmerUpgradeAccount.vue';

// Admin Pages
import AdminDashboard from '../views/admin/AdminDashboard.vue';
import UserManagement from '../views/admin/UserManagement.vue';

// Main Pages
import LandingPage from '../views/main/LandingPage.vue';
import LivestockDashboard from '../views/main/LivestockDashboard.vue';   
import LivestockMarket from '../views/main/LivestockMarket.vue';
import Message from '../views/main/Message.vue';
import LivestockForum from '../views/main/LivestockForum.vue';
import ViewListings from '../views/main/ViewListings.vue';

import PurchaseHistory from '../views/main/PurchaseHistory.vue';
import UserProfile from '../views/main/UserProfile.vue';


// Farmer Pages
import FarmerLivestockDashboard from '../views/farmer/FarmerLivestockDashboard.vue'; 
import PostLivestockForms from '../views/farmer/PostLivestockForms.vue';

// Utility Pages
import UnderConstructionPage from '../views/utility/UnderConstructionPage.vue';

// Define Routes
const routes = [
  // Auth Routes
  { path: '/signin', component: SignIn, name: 'SignIn' },
  { path: '/signup', component: SignUp, name: 'SignUp' },
  { path: '/forgotpassword', component: ForgotPassword, name: 'ForgotPassword' },
  { path: '/FarmerUpgradeAccount', component: FarmerUpgradeAccount, name: 'FarmerUpgradeAccount.vue' },

  // Main Routes
  { path: '/', component: LandingPage, name: 'LandingPage' },
  { path: '/main/LivestockMarket', component: LivestockMarket, name: 'LivestockMarket' },
  { path: '/main/LivestockDashboard', component: LivestockDashboard, name: 'LivestockDashboard' },
  { path: '/main/Message', component: Message, name: 'Message' },
  { path: '/main/LivestockForum', component: LivestockForum, name: 'LivestockForum' },
  { path: '/main/ViewListings', component: ViewListings, name: 'ViewListings' },

  { path: '/main/PurchaseHistory', component: PurchaseHistory, name: 'PurchaseHistory' },
  { path: '/main/UserProfile', component: UserProfile, name: 'UserProfile' },


  // Farmer Routes
  { path: '/farmer/FarmerLivestockDashboard', component: FarmerLivestockDashboard, name: 'FarmerLivestockDashboard' },
  { path: '/farmer/PostLivestockForms', component: PostLivestockForms, name: 'PostLivestockForms' },

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