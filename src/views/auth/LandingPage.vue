<script>
import { defineComponent, ref } from 'vue';
import NavBar from '../../components/Landing/Navbar.vue';
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
        avatar: 'src/assets/vue.svg'
      },
      {
        id: 2,
        name: 'Sarah Williams',
        role: 'Livestock Specialist',
        content: 'The livestock tracking features have saved me countless hours. I can monitor health trends and optimize feeding schedules efficiently.',
        avatar: 'src/assets/vue.svg'
      },
      {
        id: 3,
        name: 'Michael Chen',
        role: 'Organic Farmer',
        content: 'As an organic farmer, I appreciate the detailed reports and sustainable farming resources. It helps me maintain certification standards.',
        avatar: 'src/assets/vue.svg'
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

    return {
      testimonials,
      livestockCategories,
      features
    };
  }
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-green-100 to-green-800">
    <!-- Include the NavBar at the top of the page -->
    <NavBar />

    <!-- Hero Section -->
    <div class="relative overflow-hidden py-12 sm:py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="lg:flex lg:items-center lg:space-x-8">
          <div class="lg:w-1/2">
            <div class="bg-white bg-opacity-90 rounded-xl shadow-xl p-6 sm:p-8 lg:p-10">
              <h1 class="text-3xl sm:text-4xl md:text-5xl font-extrabold text-green-900">
                <span class="block">Supporting Farmers</span>
                <span class="block text-green-600">Managing Livestock</span>
              </h1>
              <p class="mt-4 text-base sm:text-lg text-green-800 max-w-xl">
                Connect with farmers, track livestock, and access agricultural resources all in one place. Join our community of sustainable farming practices.
              </p>
              <div class="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:space-x-4">
                <a href="#" class="mb-4 sm:mb-0 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-700 hover:bg-green-800 shadow-md transition duration-300">
                  Get Started
                </a>
                <a href="#" class="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-green-900 bg-green-100 hover:bg-green-200 shadow-md transition duration-300">
                  Learn More
                </a>
              </div>
            </div>
          </div>
          <div class="mt-10 lg:mt-0 lg:w-1/2">
            <div class="relative rounded-xl overflow-hidden shadow-xl">
              <img class="w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover" 
                   src="/src/assets/Bull.jpg" 
                   alt="Farming landscape">
              <div class="absolute inset-0 bg-gradient-to-t from-green-900 to-transparent opacity-30"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Livestock Categories -->
    <div class="py-12 bg-white bg-opacity-10">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="text-base text-green-100 font-semibold tracking-wide uppercase">Livestock Management</h2>
          <p class="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Track all your animals in one place
          </p>
        </div>
        
        <div class="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
          <div v-for="category in livestockCategories" :key="category.name" 
               class="bg-white bg-opacity-90 overflow-hidden shadow-lg rounded-xl p-4 sm:p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-2xl">
            <div class="text-4xl mb-3">{{ category.icon }}</div>
            <dt class="text-lg font-medium text-green-900">{{ category.name }}</dt>
            <dd class="mt-1 text-2xl font-semibold text-green-600">{{ category.count }}</dd>
            <p class="mt-2 text-sm text-green-700">registered on our platform</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Section -->
    <div class="py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-green-100 font-semibold tracking-wide uppercase">Our Platform</h2>
          <p class="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Everything you need to manage your farm
          </p>
          <p class="mt-4 max-w-2xl mx-auto text-lg text-green-200">
            Comprehensive tools designed specifically for farmers and livestock management.
          </p>
        </div>

        <div class="mt-12 grid gap-8 md:grid-cols-2 lg:gap-x-12 lg:gap-y-10">
          <div v-for="feature in features" :key="feature.title" 
               class="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-6 shadow-lg transform transition duration-300 hover:bg-opacity-30">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <div class="flex items-center justify-center h-12 w-12 rounded-lg bg-white text-green-800 shadow-md">
                  <i :class="['pi', feature.icon, 'text-xl']"></i>
                </div>
              </div>
              <div class="ml-4">
                <h3 class="text-xl font-semibold text-white">{{ feature.title }}</h3>
                <p class="mt-2 text-base text-green-100">
                  {{ feature.description }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Testimonials Section -->
    <div class="py-12 bg-green-900 bg-opacity-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h2 class="text-base text-green-100 font-semibold tracking-wide uppercase">Testimonials</h2>
          <p class="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Trusted by farmers worldwide
          </p>
        </div>
        <div class="mt-10 grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div v-for="testimonial in testimonials" :key="testimonial.id" 
               class="bg-white bg-opacity-95 overflow-hidden shadow-lg rounded-xl p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <div class="flex items-center">
              <img class="h-12 w-12 rounded-full shadow-md object-cover" :src="testimonial.avatar" :alt="testimonial.name">
              <div class="ml-4">
                <div class="text-lg font-medium text-green-900">{{ testimonial.name }}</div>
                <div class="text-green-700">{{ testimonial.role }}</div>
              </div>
            </div>
            <div class="mt-4 text-green-800 italic">
              "{{ testimonial.content }}"
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission & Vision Banner -->
    <div class="bg-white bg-opacity-10 backdrop-filter backdrop-blur-sm border-t border-b border-green-200 border-opacity-20">
      <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-14 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <div>
          <h2 class="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span class="block">Our Mission</span>
            <span class="block text-green-200">Supporting sustainable agriculture through technology</span>
          </h2>
          <p class="mt-4 text-lg text-green-100 max-w-xl">
            We're committed to empowering farmers with tools that promote sustainable practices and improve operational efficiency.
          </p>
        </div>
        <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div class="inline-flex rounded-md shadow">
            <a href="#" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-green-900 bg-white hover:bg-green-50 transition duration-300">
              Learn More
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="py-12">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-green-700 rounded-2xl shadow-xl overflow-hidden">
          <div class="px-6 py-12 sm:px-12 lg:px-16">
            <div class="lg:flex lg:items-center lg:justify-between">
              <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                <span class="block">Ready to get started?</span>
                <span class="block text-green-200">Join our farming community today.</span>
              </h2>
              <div class="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                <div class="inline-flex rounded-md shadow">
                  <a href="#" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-green-900 bg-white hover:bg-green-50 transition duration-300">
                    Sign Up
                  </a>
                </div>
                <div class="ml-3 inline-flex rounded-md shadow">
                  <a href="#" class="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-green-800 hover:bg-green-900 transition duration-300">
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>