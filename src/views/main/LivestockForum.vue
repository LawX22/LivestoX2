<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';
import MainContent from '../../components/Main/Forum/MainContent.vue';
import Sidebar from '../../components/Main/Forum/SideBar.vue';
import Footer from '../../components/Main/Forum/Footer.vue';

// State management
const selectedCategory = ref('all');

// Sample data
const allTopics = ref([
    {
        id: 1,
        title: 'Best Practices for Cattle Nutrition During Winter',
        author: 'RanchHand',
        postedTime: '2 hours ago',
        category: 'cattle',
        tags: ['cattle', 'nutrition', 'winter-care'],
        replies: 24,
        views: 1352,
        pinned: true,
        emoji: '🐄'
    },
    {
        id: 2,
        title: 'Egg Production in Free-Range Systems',
        author: 'ChickenFarmer',
        postedTime: '1 day ago',
        category: 'poultry',
        tags: ['poultry', 'eggs', 'free-range'],
        replies: 18,
        views: 876,
        pinned: false,
        emoji: '🐔'
    },
    {
        id: 3,
        title: 'Sustainable Wool Production Methods',
        author: 'SheepWhisperer',
        postedTime: '3 days ago',
        category: 'sheep',
        tags: ['sheep', 'wool', 'sustainable'],
        replies: 12,
        views: 645,
        pinned: false,
        emoji: '🐑'
    },
    {
        id: 4,
        title: 'Managing Swine Reproduction Cycles',
        author: 'PigExpert',
        postedTime: '1 week ago',
        category: 'swine',
        tags: ['swine', 'breeding', 'reproduction'],
        replies: 31,
        views: 1289,
        pinned: false,
        emoji: '🐖'
    },
    {
        id: 5,
        title: 'Goat Milk Quality Improvement Tips',
        author: 'GoatDairy',
        postedTime: '2 weeks ago',
        category: 'goats',
        tags: ['goats', 'dairy', 'milk-quality'],
        replies: 27,
        views: 932,
        pinned: false,
        emoji: '🐐'
    }
]);

// Computed property for filtered topics
const filteredTopics = computed(() => {
    if (selectedCategory.value === 'all') {
        return allTopics.value;
    } else {
        return allTopics.value.filter(topic => topic.category === selectedCategory.value);
    }
});

// Handle category selection from sidebar
const handleCategorySelected = (category: string) => {
    selectedCategory.value = category;
    console.log(`Category selected: ${category}`);
};

const incrementViews = (topicId: number) => {
    const topic = allTopics.value.find(t => t.id === topicId);
    if (topic) {
        topic.views++;
    }
};

const addNewTopic = (newTopic: any) => {
    // Add to topics list
    allTopics.value.unshift(newTopic);
};

onMounted(() => {
    // Initialize any data or fetch from an API
    console.log('Livestock Forum component mounted');
});
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
        <!-- Fixed Navbar -->
        <div class="sticky top-0 z-50 w-full">
            <NavBar />
        </div>

        <!-- Hero section with parallax effect -->
        <div class="relative bg-gradient-to-r from-green-500 to-green-800 py-12 px-4 mb-8 shadow-xl overflow-hidden">
            <div class="container mx-auto max-w-full px-4 sm:px-6 lg:px-8 relative z-10">
                <h1 class="text-5xl font-bold text-white mb-3 tracking-tight">Livestock Forum</h1>
                <p class="text-green-100 text-xl max-w-3xl leading-relaxed">Connect with fellow farmers, ranchers, and
                    livestock enthusiasts to share knowledge and best practices in animal husbandry.</p>
            </div>
            <!-- Decorative farm silhouette with parallax effect -->
            <div
                class="absolute bottom-0 right-0 text-green-700 opacity-20 text-9xl transform translate-y-1/4 -translate-x-1/4">
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
            <!-- Sidebar -->
            <div class="md:w-1/4 w-full">
                <Sidebar :selectedCategory="selectedCategory" :topics="allTopics"
                    @category-selected="handleCategorySelected" />
            </div>

            <!-- Main content -->
            <div class="md:w-3/4 w-full">
                <MainContent :topics="filteredTopics" :selectedCategory="selectedCategory" @view-topic="incrementViews"
                    @add-topic="addNewTopic" />
            </div>
        </div>

        <!-- Footer -->
        <Footer />
    </div>
</template>

<style scoped>
/* Any component-specific styles */
.sticky {
    position: sticky;
    top: 0;
}
</style>