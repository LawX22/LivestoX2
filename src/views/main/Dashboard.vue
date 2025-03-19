<template>
  <div class="dashboard-container">
    <!-- Include the NavBar component at the top -->
    <NavBar />

    <!-- Your existing dashboard content -->
    <div class="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-500">
      <div class="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <h1 class="text-3xl font-bold text-gray-800">Welcome to the Dashboard page</h1>
        <p class="text-gray-600 mt-4">For the home page of LivestoX, I recommend including the following key elements to
          create an engaging and useful landing experience for buyers:

          Featured Livestock Listings - A carousel or grid showcasing premium livestock currently available for
          purchase, with high-quality images and basic details
          Upcoming Auctions - A section highlighting time-sensitive auctions with countdown timers to create urgency
          Market Price Trends - Simple charts or indicators showing recent price trends for different livestock
          categories
          New Sellers - A section featuring recently joined sellers to help expand buyer networks
          Personalized Recommendations - Based on the buyer's browsing history and saved preferences
          Quick Search Filters - Category-based filters (cattle, sheep, etc.) for quick access to specific livestock
          types
          Recent Activity Feed - Updates on recent transactions, price changes, or forum discussions
          Educational Content - Tips for buyers, livestreaming buying guides, or market analysis articles
          Special Promotions - Any current deals, discounts, or special offers from verified sellers
          Seasonal Highlights - Featured content based on the current season or upcoming agricultural events

          This structure provides a balance of immediate buying opportunities, market information, and personalized
          content to engage both new and returning buyers. The home page should serve as a comprehensive dashboard that
          gives buyers a quick overview of what's happening in the marketplace while making it easy to dive deeper into
          specific areas of interest.</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from '../../components/Main/NavBar.vue'; // Use @/ alias for src directory

export default defineComponent({
  name: 'Dashboard',
  components: {
    NavBar
  }
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Adjust the content area to account for the navbar */
.dashboard-container>div.flex {
  flex: 1;
  padding-top: 1rem;
}
</style>