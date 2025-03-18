<script>
import { defineComponent } from 'vue';
import NavBar from '../../components/Landing/Navbar.vue';

export default defineComponent({
  name: 'LandingPage',
  components: {
    NavBar
  }
});
</script>

<template>
  <div>
    <!-- Include the NavBar at the top of the page -->
    <NavBar />
    
    <!-- Your existing landing page content -->
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-500">
      <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 class="text-3xl font-bold text-gray-800">Welcome to the Landing Page</h1>
        <p class="text-gray-600 mt-4">This is the landing page for the Vue.js application.</p>
      </div>
    </div>
  </div>
</template>

