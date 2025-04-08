<script>
import { defineComponent, ref } from 'vue';
import NavBar from '../../components/Landing/NavBar.vue';
import Footer from '../../components/Landing/Footer.vue';

export default defineComponent({
  name: 'LandingPage',
  components: {
    NavBar,
    Footer
  },
  setup() {
    const testimonials = ref([
      {
        id: 1,
        name: 'John Peterson',
        role: 'Dairy Farmer',
        content: 'This platform has completely transformed how I manage my dairy farm. The tools and community support are invaluable.',
        avatar: '/src/assets/vue.svg',
        rating: 5
      },
      {
        id: 2,
        name: 'Sarah Williams',
        role: 'Livestock Specialist',
        content: 'The livestock tracking features have saved me countless hours. I can monitor health trends and optimize feeding schedules efficiently.',
        avatar: '/src/assets/vue.svg',
        rating: 5
      },
      {
        id: 3,
        name: 'Michael Chen',
        role: 'Organic Farmer',
        content: 'As an organic farmer, I appreciate the detailed reports and sustainable farming resources. It helps me maintain certification standards.',
        avatar: '/src/assets/vue.svg',
        rating: 5
      }
    ]);

    const livestockCategories = ref([
      { name: 'Cattle', count: '2,500+', icon: '🐄' },
      { name: 'Poultry', count: '10,000+', icon: '🐔' },
      { name: 'Sheep', count: '3,200+', icon: '🐑' },
      { name: 'Goats', count: '1,800+', icon: '🐐' }
    ]);

    const features = ref([
      { 
        title: 'Farmer Community',
        description: 'Connect with other farmers, share insights, and collaborate on projects.',
        icon: 'pi-users'
      },
      { 
        title: 'Advanced Analytics',
        description: 'Track performance metrics, analyze trends, and make data-driven decisions.',
        icon: 'pi-chart-bar'
      },
      { 
        title: 'Scheduling & Planning',
        description: 'Organize feeding schedules, veterinary visits, and breeding programs.',
        icon: 'pi-calendar'
      },
      { 
        title: 'Mobile Access',
        description: 'Manage your farm operations from anywhere with our mobile-friendly platform.',
        icon: 'pi-mobile'
      }
    ]);

    const bestSellingLivestock = ref([
      {
        id: 1,
        name: 'Holstein-Friesian Cow',
        type: 'Dairy Cattle',
        price: '$1,200 - $1,500',
        description: 'Known for exceptional milk production, these dairy cows are popular among commercial dairy operations.',
        image: '/src/assets/Bull.jpg',
        seller: 'Davidson Family Farm',
        tags: ['dairy', 'high-yield', 'commercial']
      },
      {
        id: 2,
        name: 'Boer Goat',
        type: 'Meat Goat',
        price: '$300 - $500',
        description: 'Fast-growing meat goats with excellent feed conversion efficiency, ideal for small-scale farmers.',
        image: '/src/assets/Bull.jpg',
        seller: 'Green Valley Ranch',
        tags: ['meat', 'efficient', 'small-scale']
      },
      {
        id: 3,
        name: 'Berkshire Pig',
        type: 'Heritage Swine',
        price: '$250 - $400',
        description: 'Premium heritage breed known for marbled meat quality and excellent foraging abilities.',
        image: '/src/assets/Bull.jpg',
        seller: 'Oakridge Farm',
        tags: ['heritage', 'premium', 'foraging']
      }
    ]);

    const forumDiscussions = ref([
      {
        id: 1,
        title: 'Best practices for sustainable cattle grazing',
        category: 'Sustainable Farming',
        author: 'Emma Johnson',
        avatar: '/src/assets/vue.svg',
        replies: 42,
        views: 1257,
        lastActive: '2 hours ago',
        tags: ['cattle', 'grazing', 'sustainable']
      },
      {
        id: 2,
        title: 'Dealing with seasonal poultry diseases',
        category: 'Animal Health',
        author: 'Robert Chen',
        avatar: '/src/assets/vue.svg',
        replies: 38,
        views: 982,
        lastActive: '5 hours ago',
        tags: ['poultry', 'disease-prevention', 'healthcare']
      },
      {
        id: 3,
        title: 'Organic certification process - Tips and tricks',
        category: 'Certifications',
        author: 'Lisa Martinez',
        avatar: '/src/assets/vue.svg',
        replies: 56,
        views: 1782,
        lastActive: 'Yesterday',
        tags: ['organic', 'certification', 'standards']
      },
      {
        id: 4,
        title: 'Innovative feed solutions for dairy production',
        category: 'Nutrition',
        author: 'David Thompson',
        avatar: '/src/assets/vue.svg',
        replies: 29,
        views: 876,
        lastActive: '3 days ago',
        tags: ['dairy', 'nutrition', 'feed']
      }
    ]);

    const forumCategories = ref([
      { name: 'Livestock Health', topics: 235, icon: '🩺' },
      { name: 'Crop Management', topics: 189, icon: '🌱' },
      { name: 'Equipment', topics: 142, icon: '🚜' },
      { name: 'Market Trends', topics: 98, icon: '📈' },
      { name: 'Sustainability', topics: 176, icon: '♻️' },
      { name: 'Technology', topics: 124, icon: '💻' }
    ]);

    // Added resources section
    const farmingResources = ref([
      {
        title: 'Seasonal Growing Guide',
        description: 'Our comprehensive guide to seasonal crops and optimal growing conditions.',
        icon: 'pi-calendar',
        link: '#'
      },
      {
        title: 'Livestock Health Manual',
        description: 'Essential health information for maintaining thriving livestock.',
        icon: 'pi-heart',
        link: '#'
      },
      {
        title: 'Sustainability Practices',
        description: 'Learn how to implement eco-friendly farming practices.',
        icon: 'pi-globe',
        link: '#'
      }
    ]);

    // Added stats section
    const platformStats = ref([
      { label: 'Registered Farms', value: '12,500+', icon: 'pi-home' },
      { label: 'Monthly Active Users', value: '28,000+', icon: 'pi-users' },
      { label: 'Community Posts', value: '35,800+', icon: 'pi-comments' },
      { label: 'Products Traded', value: '$3.2M+', icon: 'pi-shopping-cart' },
    ]);

    return {
      testimonials,
      livestockCategories,
      features,
      bestSellingLivestock,
      forumDiscussions,
      forumCategories,
      farmingResources,
      platformStats
    };
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-50 via-green-100 to-green-800">
    <!-- Include the NavBar at the top of the page -->
    <NavBar />

    <!-- Hero Section - Enhanced with modern design and animation -->
    <div class="relative overflow-hidden bg-gradient-to-br from-green-50 to-green-100 py-16 sm:py-24">
      <!-- Background patterns -->
      <div class="absolute inset-0 z-0">
        <div class="w-full h-full bg-green-900 opacity-5 pattern-dots pattern-green-800 pattern-size-4 pattern-opacity-20"></div>
      </div>
      <!-- Animated floating elements -->
      <div class="hidden lg:block absolute top-20 right-10 animate-float-slow">
        <div class="text-9xl opacity-20 text-green-600">🌱</div>
      </div>
      <div class="hidden lg:block absolute bottom-10 left-10 animate-float-medium">
        <div class="text-6xl opacity-20 text-green-600">🐄</div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="bg-white/50 backdrop-blur-md rounded-3xl shadow-xl border border-green-200 min-h-screen p-6 md:p-12 overflow-hidden">
          <div class="flex flex-col lg:flex-row items-center gap-12">
            <!-- Left Content Section -->
            <div class="lg:w-1/2 space-y-8">
              <!-- Badge -->
              <div class="inline-flex items-center px-3 py-1.5 bg-green-100 border border-green-200 rounded-full shadow-sm">
                <span class="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                <span class="text-sm font-semibold text-green-800 uppercase tracking-wider">Farming Community Platform</span>
              </div>
              
              <!-- Heading with animated underline -->
              <h1 class="text-5xl md:text-6xl font-bold text-green-900 leading-tight">
                <span class="block">Supporting</span>
                <span class="relative inline-block text-green-600">
                  Farming
                  <svg class="absolute -bottom-2 left-0 w-full animate-pulse" height="6" viewBox="0 0 200 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3C50.5 3 50.5 3 100 3C149.5 3 149.5 3 197 3" stroke="#10B981" stroke-width="5" stroke-linecap="round"/>
                  </svg>
                </span>
                <span class="text-green-600">Communities</span>
              </h1>
              
              <!-- Description with improved typography -->
              <p class="text-xl text-green-800 leading-relaxed">
                Connect with farmers, track livestock, and access agricultural resources all in one place. Join our thriving community of sustainable farming practices.
              </p>
              
              <!-- Stats Bar with enhanced design -->
              <div class="flex items-center gap-8 p-5 bg-white rounded-xl shadow-lg border border-green-100 hover:shadow-xl transition-all duration-300">
                <div>
                  <div class="text-green-800 text-sm font-medium">Active Farmers</div>
                  <div class="text-2xl font-bold text-green-900 flex items-center gap-1">
                    15,000+
                    <span class="text-green-500 text-sm animate-bounce">↑</span>
                  </div>
                </div>
                <div class="w-px h-12 bg-green-200"></div>
                <div>
                  <div class="text-green-800 text-sm font-medium">Community Members</div>
                  <div class="text-2xl font-bold text-green-900 flex items-center gap-1">
                    3,200+
                    <span class="text-green-500 text-sm animate-bounce">↑</span>
                  </div>
                </div>
              </div>
              
              <!-- CTA Buttons with improved design -->
              <div class="flex flex-col sm:flex-row gap-4">
                <a href="#" class="inline-flex justify-center items-center px-6 py-3.5 rounded-lg bg-green-600 text-white font-medium transition-all duration-300 hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/20 transform hover:-translate-y-1 group">
                  Get Started
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </a>
                <a href="#" class="inline-flex justify-center items-center px-6 py-3.5 rounded-lg bg-white border border-green-200 text-green-800 font-medium transition-all duration-300 hover:bg-green-50 hover:border-green-300 hover:shadow-md transform hover:-translate-y-1">
                  See Livestock
                </a>
              </div>
            </div>
            
            <!-- Right Image Section with enhanced visuals -->
            <div class="lg:w-1/2">
              <div class="relative rounded-2xl overflow-hidden shadow-2xl group">
                <!-- Main Image with parallax effect -->
                <img class="w-full h-96 object-cover transform transition duration-700 group-hover:scale-105" 
                     src="/src/assets/Bull.jpg" 
                     alt="Farming landscape">
                
                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-green-900/80 via-green-900/40 to-transparent"></div>
                
                <!-- Bottom Card with improved design -->
                <div class="absolute bottom-6 left-6 right-6">
                  <div class="bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-lg flex items-center gap-3 transform transition-all duration-300 group-hover:translate-y-2">
                    <div class="p-2 bg-green-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <span class="text-green-800 font-medium">Join thousands of farmers worldwide</span>
                  </div>
                </div>
                
                <!-- Floating Badge with animation -->
                <div class="absolute top-6 right-6 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg transform transition duration-500 hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm font-medium">Sustainable Practices</span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- LIVESTOCK TRACKING SECTION with improved visual design -->
          <div class="mt-24">
            <div class="text-center mb-12">
              <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium uppercase tracking-wide inline-block mb-2">Animal Tracking</span>
              <h2 class="text-3xl font-bold text-green-900 relative inline-block">
                Track All Your Animals
                <div class="absolute -bottom-2 left-0 right-0 mx-auto w-24 h-1 bg-green-400 rounded-full"></div>
              </h2>
              <p class="mt-6 max-w-2xl mx-auto text-lg text-green-700">
                Comprehensive tracking system for all your livestock with real-time updates and health monitoring
              </p>
            </div>
            
            <div class="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
              <div v-for="category in livestockCategories" :key="category.name" 
                   class="bg-white overflow-hidden shadow-xl rounded-xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:shadow-2xl group border-b-4 border-green-500">
                <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4 transition-all duration-500 transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:bg-green-200 group-hover:shadow-lg">
                  <div class="text-3xl">{{ category.icon }}</div>
                </div>
                <dt class="text-lg font-bold text-green-900">{{ category.name }}</dt>
                <dd class="mt-2 text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">{{ category.count }}</dd>
                <div class="mt-3 text-xs font-semibold text-green-700 bg-green-50 rounded-lg py-1 px-2 inline-block">registered</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- NEW STATS SECTION -->
    <div class="py-16 bg-gradient-to-br from-green-700 to-green-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" fill="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" stroke-width="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-4">
          <div v-for="stat in platformStats" :key="stat.label" 
               class="bg-white/10 backdrop-blur-sm overflow-hidden shadow-lg rounded-xl p-6 text-center transform transition-all duration-500 hover:scale-105 hover:bg-white/20 border border-white/10">
            <div class="w-12 h-12 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3 transition-all duration-500">
              <i :class="['pi', stat.icon, 'text-xl text-white']"></i>
            </div>
            <p class="mt-2 text-3xl font-extrabold text-white">{{ stat.value }}</p>
            <p class="text-sm font-medium text-green-100">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- NEW FORUM SECTION with improved cards and visual hierarchy -->
    <div class="py-16 bg-white relative overflow-hidden">
      <div class="absolute inset-0 opacity-5">
        <div class="w-full h-full bg-gradient-to-br from-green-200 to-green-50"></div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-12">
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium uppercase tracking-wide inline-block mb-4">Community</span>
          <h2 class="mt-2 text-4xl font-extrabold tracking-tight text-green-900 sm:text-5xl">
            Farmer's Forum
          </h2>
          <p class="mt-6 max-w-2xl mx-auto text-lg text-green-800">
            Join conversations with farmers around the world, share your expertise, and learn from others' experiences
          </p>
        </div>
        
        <!-- Forum Categories with improved design -->
        <div class="mb-16">
          <h3 class="text-2xl font-bold text-green-800 mb-6 flex items-center">
            <span class="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
            Popular Categories
          </h3>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div v-for="category in forumCategories" :key="category.name" 
                class="bg-white border border-green-100 rounded-xl shadow-md p-6 text-center transition-all duration-300 hover:shadow-xl hover:border-green-300 hover:-translate-y-1 group">
              <div class="text-3xl mb-2 transform transition-all duration-300 group-hover:scale-125">{{ category.icon }}</div>
              <h4 class="font-bold text-green-900">{{ category.name }}</h4>
              <p class="text-green-600 text-sm mt-2 bg-green-50 rounded-full py-1 px-2">{{ category.topics }} topics</p>
            </div>
          </div>
        </div>
        
        <!-- Recent Forum Discussions with improved cards -->
        <div>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-green-800 flex items-center">
              <span class="w-2 h-8 bg-green-500 rounded-full mr-3"></span>
              Recent Discussions
            </h3>
            <a href="#" class="text-green-600 hover:text-green-800 flex items-center text-sm font-medium bg-green-50 py-2 px-4 rounded-lg hover:bg-green-100 transition-all duration-300">
              View all discussions
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
          
          <div class="space-y-6">
            <div v-for="discussion in forumDiscussions" :key="discussion.id" 
                 class="bg-white border border-green-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-green-300 group">
              <div class="p-6">
                <div class="flex items-center justify-between mb-2">
                  <span class="bg-green-100 text-green-800 text-xs font-medium px-3 py-1.5 rounded-full">{{ discussion.category }}</span>
                  <span class="text-green-600 text-sm flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {{ discussion.lastActive }}
                  </span>
                </div>
                <h4 class="text-xl font-bold text-green-900 mt-3 group-hover:text-green-600 transition-colors duration-300 flex items-center">
                  <a href="#">{{ discussion.title }}</a>
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </h4>
                <div class="flex flex-wrap gap-2 mt-4">
                  <span v-for="tag in discussion.tags" :key="tag" class="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-100">
                    #{{ tag }}
                  </span>
                </div>
                <div class="flex items-center justify-between mt-5 pt-4 border-t border-green-50">
                  <div class="flex items-center">
                    <img class="h-9 w-9 rounded-full border-2 border-green-100" :src="discussion.avatar" :alt="discussion.author">
                    <span class="ml-2 text-green-800 font-medium">{{ discussion.author }}</span>
                  </div>
                  <div class="flex items-center space-x-4 text-sm text-green-600">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      {{ discussion.replies }} replies
                    </div>
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {{ discussion.views }} views
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Create Thread Button with improved design -->
          <div class="mt-10 text-center">
            <a href="#" class="inline-flex items-center justify-center px-6 py-3.5 border border-transparent text-base font-medium rounded-xl text-white bg-green-700 hover:bg-green-800 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-green-200/50 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 transition-all duration-300 group-hover:rotate-90" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
              Start a New Discussion
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- NEW RESOURCES SECTION -->
    <div class="py-16 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
      <div class="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="1.5" fill="#16a34a" opacity="0.3" />
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#dots)" />
</svg>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-12">
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium uppercase tracking-wide inline-block mb-4">Knowledge Hub</span>
          <h2 class="mt-2 text-4xl font-extrabold tracking-tight text-green-900 sm:text-5xl">
            Farming Resources
          </h2>
          <p class="mt-6 max-w-2xl mx-auto text-lg text-green-800">
            Access expert guides, tutorials, and resources to improve your farming operations
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="resource in farmingResources" :key="resource.title" 
               class="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
            <div class="p-6">
              <div class="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors duration-300">
                <i :class="['pi', resource.icon, 'text-2xl text-green-600']"></i>
              </div>
              <h3 class="text-xl font-bold text-green-900 mb-2">{{ resource.title }}</h3>
              <p class="text-green-700">{{ resource.description }}</p>
              <a :href="resource.link" class="mt-4 inline-flex items-center text-green-600 hover:text-green-800 font-medium">
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- BESTSELLING LIVESTOCK SECTION -->
    <div class="py-16 bg-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium uppercase tracking-wide inline-block mb-4">Marketplace</span>
          <h2 class="mt-2 text-4xl font-extrabold tracking-tight text-green-900 sm:text-5xl">
            Best Selling Livestock
          </h2>
          <p class="mt-6 max-w-2xl mx-auto text-lg text-green-800">
            Browse our most popular livestock listings from trusted sellers
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="item in bestSellingLivestock" :key="item.id" 
               class="bg-white border border-green-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-green-300 group">
            <div class="relative">
              <img :src="item.image" :alt="item.name" class="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500">
              <div class="absolute top-4 right-4 bg-green-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                {{ item.price }}
              </div>
            </div>
            <div class="p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="text-xl font-bold text-green-900">{{ item.name }}</h3>
                <span class="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">{{ item.type }}</span>
              </div>
              <p class="text-green-700 mb-4">{{ item.description }}</p>
              <div class="flex flex-wrap gap-2 mb-4">
                <span v-for="tag in item.tags" :key="tag" class="bg-green-50 text-green-600 text-xs px-2 py-1 rounded-full border border-green-100">
                  #{{ tag }}
                </span>
              </div>
              <div class="pt-4 border-t border-green-100 flex justify-between items-center">
                <span class="text-sm text-green-800 font-medium">Seller: {{ item.seller }}</span>
                <a href="#" class="text-green-600 hover:text-green-800 font-medium text-sm inline-flex items-center">
                  View Details
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1 group-hover:ml-2 transition-all duration-300" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- View All Button -->
        <div class="mt-10 text-center">
          <a href="#" class="inline-flex items-center justify-center px-6 py-3 border border-green-600 text-base font-medium rounded-lg text-green-700 bg-white hover:bg-green-50 shadow-md transition-all duration-300 hover:-translate-y-1">
            Browse All Livestock
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </div>

    <!-- TESTIMONIALS SECTION -->
    <div class="py-16 bg-gradient-to-br from-green-700 to-green-800 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <defs>
            <pattern id="wave" width="100" height="10" patternUnits="userSpaceOnUse">
              <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="white" fill="none" stroke-width="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave)" />
        </svg>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center mb-12">
          <span class="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium uppercase tracking-wide inline-block mb-4 backdrop-blur-sm">Testimonials</span>
          <h2 class="mt-2 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            What Farmers Are Saying
          </h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="testimonial in testimonials" :key="testimonial.id" 
               class="bg-white/10 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/10 transition-all duration-300 hover:bg-white/20 hover:-translate-y-2">
            <div class="flex items-center mb-4">
              <div class="flex">
                <svg v-for="n in testimonial.rating" :key="n" class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <blockquote class="text-white text-lg mb-6 italic">
              "{{ testimonial.content }}"
            </blockquote>
            <div class="flex items-center mt-6">
              <img class="h-12 w-12 rounded-full border-2 border-white/30" :src="testimonial.avatar" :alt="testimonial.name">
              <div class="ml-3">
                <h4 class="text-white font-bold">{{ testimonial.name }}</h4>
                <p class="text-green-100">{{ testimonial.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA SECTION -->
    <div class="py-16 bg-white relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-gradient-to-br from-green-600 to-green-700 rounded-3xl shadow-2xl overflow-hidden">
          <div class="px-6 py-16 sm:p-16 md:flex md:items-center md:justify-between lg:py-24 lg:px-20">
            <div class="md:w-2/3 md:pr-10">
              <h2 class="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                Ready to transform your farming experience?
              </h2>
              <p class="mt-4 text-lg text-green-100 max-w-3xl">
                Join thousands of farmers who are already benefiting from our platform. 
                Get access to livestock tracking, community support, and farming resources.
              </p>
            </div>
            <div class="mt-8 md:mt-0 md:w-1/3 flex flex-col space-y-4">
              <a href="#" class="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-bold rounded-lg text-green-700 bg-white hover:bg-green-50 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                Get Started Now
              </a>
              <a href="#" class="inline-flex items-center justify-center px-6 py-4 border border-white text-base font-medium rounded-lg text-white hover:bg-white/10 transition-all duration-300">
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Include the Footer at the bottom of the page -->
    <Footer />
  </div>
</template>