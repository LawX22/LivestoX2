<script setup>
// Example of how to import and use the ForumSidebar component
import SideBar from '../../components/Main/Forum/SideBar.vue';
import NavBar from '../../components/Main/NavBar.vue';
import MainContent from '../../components/Main/Forum/MainContent.vue';
import Footer from '../../components/Main/Forum/Footer.vue';

// Example data (you can move this to a store or API call)
const forumStats = [
  { label: 'Total Topics', value: '1,234' },
  { label: 'Total Posts', value: '8,765' },
  { label: 'Active Users', value: '543' },
  { label: 'New Today', value: '47' }
];

const recentActivity = [
  { title: 'Winter feed supplements for cattle', author: 'RanchHand', timeAgo: '5 min ago' },
  { title: 'Goat kidding season preparations', author: 'GoatFarmer', timeAgo: '2 hours ago' },
  { title: 'Pasture rotation strategies', author: 'GrasslandGuru', timeAgo: '4 hours ago' }
];

const topContributors = [
  { name: 'FarmExpert', posts: 287, avatar: '👨‍🌾' },
  { name: 'LivestockPro', posts: 234, avatar: '👩‍🌾' },
  { name: 'RuralVet', posts: 192, avatar: '👨‍⚕️' },
  { name: 'OrganicRancher', posts: 175, avatar: '🧑‍🌾' }
];

const tags = [
  'breeding', 'pasture', 'organic', 'medication', 'winter-care', 
  'equipment', 'housing', 'market', 'regulations', 'sustainability'
];

// Event handlers
const handleSearch = (searchQuery) => {
  console.log('Search query:', searchQuery);
  // Implement search functionality
};

const handleNewTopic = () => {
  console.log('New topic button clicked');
  // Implement navigation to new topic creation page
};

const handleViewAllActivity = () => {
  console.log('View all activity clicked');
  // Implement navigation to all activity page
};

const handleTagClick = (tag) => {
  console.log('Tag clicked:', tag);
  // Implement tag filtering
};

const handleTopicClick = (topic) => {
  console.log('Topic clicked:', topic);
  // Implement navigation to topic page
};

const handleContributorClick = (contributor) => {
  console.log('Contributor clicked:', contributor);
  // Implement navigation to contributor profile
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col font-sans text-gray-800 bg-gray-50 antialiased">
    <!-- Fixed Navbar -->
    <div class="fixed top-0 left-0 w-full z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg">
      <NavBar />
    </div>

    <!-- Hero section with parallax effect -->
    <div class="relative bg-gradient-to-r from-green-500 to-green-800 py-12 px-4 mb-8 mt-10 shadow-xl overflow-hidden">
      <div class="container mx-auto max-w-full px-4 sm:px-6 lg:px-8 relative z-10">
        <h1 class="text-5xl font-bold text-white mb-3 tracking-tight">Livestock Forum</h1>
        <p class="text-green-100 text-xl max-w-3xl leading-relaxed">Connect with fellow farmers, ranchers, and
          livestock enthusiasts to share knowledge and best practices in animal husbandry.</p>
      </div>
      <!-- Decorative farm silhouette with parallax effect -->
      <div class="absolute bottom-0 right-0 text-green-700 opacity-20 text-9xl transform translate-y-1/4 -translate-x-1/4">
        <div class="flex space-x-4">
          <span>🐄</span>
          <span>🐑</span>
          <span>🐔</span>
          <span>🐖</span>
          <span>🐐</span>
        </div>
      </div>
    </div>

    <!-- Main content area with sidebar -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col md:flex-row gap-6">
      <!-- Sidebar Component -->
      <SideBar 
        :forumStats="forumStats"
        :recentActivity="recentActivity"
        :topContributors="topContributors"
        :tags="tags"
        @newTopic="handleNewTopic"
        @viewAllActivity="handleViewAllActivity"
        @tagClick="handleTagClick"
        @topicClick="handleTopicClick"
        @contributorClick="handleContributorClick"
      />

      <!-- Main content -->
      <MainContent />
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>