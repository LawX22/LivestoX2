<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';
import Footer from '../../components/Landing/Footer.vue';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
  };
}

interface Statistic {
  id: number;
  value: string;
  label: string;
  icon: string;
}

interface CompanyValue {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  farm: string;
  avatar: string;
}

// Core content
const missionStatement = ref("Our mission is to connect livestock farmers with buyers through a simple, transparent, and efficient online marketplace.");
const aboutDescription = ref("Founded in 2022, FarmStock is the premier online marketplace for livestock trading. We bridge the gap between farmers and buyers, providing a platform where quality livestock can be showcased and sold with ease. Our team of agricultural experts and tech enthusiasts work together to ensure the best experience for both sellers and buyers.");

// Enhanced team members with social links and improved profile info
const teamMembers = ref<TeamMember[]>([
  {
    id: 1,
    name: "John Meadows",
    role: "Founder & CEO",
    bio: "John has over 20 years of experience in livestock farming before founding FarmStock to modernize the industry.",
    imageUrl: "/api/placeholder/120/120",
    socialLinks: {
      linkedin: "https://linkedin.com/in/johnmeadows",
      twitter: "https://twitter.com/johnmeadows"
    }
  },
  {
    id: 2,
    name: "Sarah Thompson",
    role: "Head of Farmer Relations",
    bio: "Former agricultural extension officer passionate about supporting family farms across the country.",
    imageUrl: "/api/placeholder/120/120",
    socialLinks: {
      linkedin: "https://linkedin.com/in/sarahthompson",
      twitter: "https://twitter.com/sarahthompson"
    }
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Chief Technology Officer",
    bio: "Tech innovator focused on creating user-friendly platforms for traditional agricultural businesses.",
    imageUrl: "/api/placeholder/120/120",
    socialLinks: {
      linkedin: "https://linkedin.com/in/michaelrodriguez"
    }
  },
  {
    id: 4,
    name: "Emily Chen",
    role: "Market Analyst",
    bio: "Agricultural economist specializing in livestock market trends and sustainable farming practices.",
    imageUrl: "/api/placeholder/120/120",
    socialLinks: {
      linkedin: "https://linkedin.com/in/emilychen",
      twitter: "https://twitter.com/emilychen"
    }
  }
]);

// Statistics with improved icons
const statistics = ref<Statistic[]>([
  { id: 1, value: "15,000+", label: "Registered Farmers", icon: "users" },
  { id: 2, value: "50,000+", label: "Animals Listed", icon: "tag" },
  { id: 3, value: "25", label: "States Covered", icon: "map" },
  { id: 4, value: "98%", label: "Customer Satisfaction", icon: "thumbs-up" }
]);

// Company values with icons
const companyValues = ref<CompanyValue[]>([
  { id: 1, title: "Transparency", description: "We believe in complete transparency in all transactions between farmers and buyers.", icon: "eye" },
  { id: 2, title: "Quality", description: "We ensure all listings meet our high standards for animal health and proper documentation.", icon: "award" },
  { id: 3, title: "Community", description: "Supporting local farming communities is at the heart of everything we do.", icon: "users" },
  { id: 4, title: "Innovation", description: "Continuously improving our platform to better serve modern agricultural needs.", icon: "lightbulb" }
]);

// Enhanced testimonials
const testimonials = ref<Testimonial[]>([
  { id: 1, quote: "FarmStock has completely transformed how I sell my cattle. I've expanded my customer base beyond my local area and increased profits by 30%.", author: "Robert Miller", farm: "Miller Family Ranch, Texas", avatar: "/api/placeholder/60/60" },
  { id: 2, quote: "As a first-generation farmer, I needed a simple way to market my livestock. This platform made it possible for me to compete with established farms.", author: "Lisa Johnson", farm: "Green Pastures Farm, Iowa", avatar: "/api/placeholder/60/60" },
  { id: 3, quote: "The verification process gives buyers confidence in my livestock quality, and I've seen a significant increase in repeat business.", author: "James Wilson", farm: "Wilson Heritage Farm, Kentucky", avatar: "/api/placeholder/60/60" },
  { id: 4, quote: "I appreciate how the platform handles payment processing and verification. It eliminates a lot of the stress from livestock transactions.", author: "Maria Gutierrez", farm: "Sunrise Ranch, Arizona", avatar: "/api/placeholder/60/60" }
]);

// Animation and UI state
const isVisible = ref(false);
const activeTab = ref('mission');
const scrollY = ref(0);
const windowWidth = ref(window.innerWidth);

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth);
});

// Clean up event listener
import { onUnmounted } from 'vue';
onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth);
});

// Fixed function to handle tab changes across mobile and desktop
const setActiveTab = (tab: string) => {
  activeTab.value = tab;

  // Scroll to section for desktop view
  const element = document.getElementById(tab);
  if (element) {
    const topOffset = element.getBoundingClientRect().top + window.pageYOffset - 100;
    window.scrollTo({ top: topOffset, behavior: 'smooth' });
  }
};

// Icon mapping function
const getIcon = (iconName: string) => {
  const icons: Record<string, string> = {
    users: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
    tag: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>',
    map: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>',
    'thumbs-up': '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>',
    eye: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>',
    award: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>',
    lightbulb: '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>',
    linkedin: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>',
    twitter: '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>'
  };

  return { html: icons[iconName] || '?' };
};

// Improved scroll handling
const handleScroll = () => {
  scrollY.value = window.scrollY;

  // Automatic tab activation for desktop scroll
  if (window.innerWidth >= 768) { // md breakpoint
    const sections = ['mission', 'team', 'values', 'testimonials'];
    const currentSection = sections.find(section => {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        return rect.top <= 150 && rect.bottom >= 150;
      }
      return false;
    });

    if (currentSection) {
      activeTab.value = currentSection;
    }
  }
};

// Enhanced lifecycle hooks
onMounted(() => {
  // Fade-in animation
  setTimeout(() => {
    isVisible.value = true;
  }, 100);

  // Set up scroll event listener
  window.addEventListener('scroll', handleScroll);

  // Initialize scroll position
  handleScroll();

  // Handle URL hash for direct section navigation
  const hash = window.location.hash.substring(1);
  if (hash && ['mission', 'team', 'values', 'testimonials'].includes(hash)) {
    setActiveTab(hash);
  }
});

// Watch for mobile tab changes to improve responsiveness
watch(activeTab, (newTab) => {
  if (window.innerWidth < 768) { // For mobile only
    const element = document.getElementById(newTab);
    if (element) {
      setTimeout(() => {
        const topOffset = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({ top: topOffset, behavior: 'smooth' });
      }, 100);
    }
  }
});
</script>

<template>
  <div class="font-sans text-gray-800 bg-gray-50 antialiased">
    <NavBar />

    <!-- Hero Section with Enhanced Parallax Effect -->
    <section class="relative bg-gradient-to-r from-green-800 to-green-600 text-white overflow-hidden">
      <!-- Subtle grain texture overlay for depth -->
      <div class="absolute inset-0 overflow-hidden">
        <div
          class="absolute inset-0 bg-black opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDYwIEwgNjAgMCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIHN0cm9rZS1vcGFjaXR5PSIwLjAyIiBmaWxsPSJub25lIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')]">
        </div>
      </div>

      <div class="relative container mx-auto px-4 py-32 md:py-40">
        <div
          :class="['transition-all duration-1000 transform', isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0']">
          <h1 class="text-4xl md:text-6xl font-bold mb-6 text-shadow">About FarmStock</h1>
          <div class="h-1 w-24 bg-white opacity-80 mb-8"></div>
          <p class="text-xl md:text-2xl max-w-2xl leading-relaxed mb-8 font-light">Connecting farmers and buyers through
            a modern livestock marketplace</p>
          <button
            class="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition duration-300 mt-4 shadow-lg transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
            Join Our Community
          </button>
        </div>
      </div>

      <!-- Improved decorative elements -->
      <div class="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent opacity-10"></div>
      <div class="absolute -bottom-8 left-0 right-0 h-16 bg-white rounded-tl-full rounded-tr-full"></div>

      <!-- Decorative farm icons (subtle background elements) -->
      <div class="absolute bottom-12 right-12 opacity-10 hidden lg:block">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </div>
      <div class="absolute top-12 left-12 opacity-10 hidden lg:block">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>
    </section>

    <!-- Improved Navigation Tabs - Mobile -->
    <div class="md:hidden bg-white sticky top-0 z-10 shadow-md">
      <div class="flex overflow-x-auto no-scrollbar py-1">
        <button @click="setActiveTab('mission')"
          :class="['px-4 py-4 flex-1 text-center font-medium transition-all duration-200 rounded-md mx-1', activeTab === 'mission' ? 'text-green-700 bg-green-50 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-600 hover:bg-green-50']">Our
          Mission</button>
        <button @click="setActiveTab('team')"
          :class="['px-4 py-4 flex-1 text-center font-medium transition-all duration-200 rounded-md mx-1', activeTab === 'team' ? 'text-green-700 bg-green-50 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-600 hover:bg-green-50']">Our
          Team</button>
        <button @click="setActiveTab('values')"
          :class="['px-4 py-4 flex-1 text-center font-medium transition-all duration-200 rounded-md mx-1', activeTab === 'values' ? 'text-green-700 bg-green-50 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-600 hover:bg-green-50']">Values</button>
        <button @click="setActiveTab('testimonials')"
          :class="['px-4 py-4 flex-1 text-center font-medium transition-all duration-200 rounded-md mx-1', activeTab === 'testimonials' ? 'text-green-700 bg-green-50 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-600 hover:bg-green-50']">Testimonials</button>
      </div>
    </div>
    <!-- Improved Navigation Tabs - Desktop with active indicators -->
    <div class="hidden md:block bg-white border-b sticky top-0 z-10 shadow-sm">
      <div class="container mx-auto px-4">
        <div class="flex justify-center">
          <a href="#mission" @click.prevent="setActiveTab('mission')"
            :class="['px-6 py-5 font-medium transition-all duration-200', activeTab === 'mission' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-700 hover:border-b-2 hover:border-green-500']">Our
            Mission</a>
          <a href="#team" @click.prevent="setActiveTab('team')"
            :class="['px-6 py-5 font-medium transition-all duration-200', activeTab === 'team' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-700 hover:border-b-2 hover:border-green-500']">Our
            Team</a>
          <a href="#values" @click.prevent="setActiveTab('values')"
            :class="['px-6 py-5 font-medium transition-all duration-200', activeTab === 'values' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-700 hover:border-b-2 hover:border-green-500']">Our
            Values</a>
          <a href="#testimonials" @click.prevent="setActiveTab('testimonials')"
            :class="['px-6 py-5 font-medium transition-all duration-200', activeTab === 'testimonials' ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-600 hover:text-green-700 hover:border-b-2 hover:border-green-500']">Testimonials</a>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-16">
      <!-- Mission Section - Enhanced -->
      <section id="mission"
        :class="['md:block transition-opacity duration-500', { 'hidden': activeTab !== 'mission' && windowWidth < 768 }]">
        <div class="max-w-4xl mx-auto">
          <div class="text-center mb-16">
            <span class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">Our
              Vision</span>
            <h2 class="text-3xl md:text-4xl font-bold text-green-800 mb-4">Our Mission</h2>
            <div class="h-1 w-20 bg-green-600 mx-auto"></div>
          </div>

          <p class="text-xl text-gray-700 mb-16 text-center max-w-3xl mx-auto leading-relaxed font-light">{{
            missionStatement }}</p>

          <!-- Improved card design with subtle hover effects -->
          <div
            class="bg-white rounded-2xl shadow-xl p-8 md:p-10 mb-20 transform transition-all duration-300 hover:shadow-2xl border border-gray-100 group">
            <div class="flex items-center mb-6">
              <div class="h-10 w-1 bg-green-500 mr-4 rounded-full group-hover:h-14 transition-all duration-300"></div>
              <h3 class="text-2xl font-semibold text-gray-800">About FarmStock</h3>
            </div>
            <p class="text-gray-600 leading-relaxed text-lg">{{ aboutDescription }}</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            <div v-for="stat in statistics" :key="stat.id"
              class="bg-white rounded-xl shadow-lg p-6 text-center border-t-4 border-green-500 transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
              <div
                class="text-green-600 text-3xl mb-3 bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto transition-all duration-300 hover:bg-green-200">
                <span v-html="getIcon(stat.icon).html"></span>
              </div>
              <div class="text-3xl font-bold text-gray-800 mb-1">{{ stat.value }}</div>
              <div class="text-gray-500 font-medium">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Section - Enhanced -->
      <section id="team"
        :class="['md:block transition-opacity duration-500', { 'hidden': activeTab !== 'team' && windowWidth < 768 }]">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <span class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">Meet
              The Team</span>
            <h2 class="text-3xl md:text-4xl font-bold text-green-800 mb-4">Our Leadership</h2>
            <div class="h-1 w-20 bg-green-600 mx-auto mb-6"></div>
            <p class="text-gray-600 max-w-2xl mx-auto">Our diverse team brings expertise from agriculture, technology,
              and business to create the best platform for livestock trading.</p>
          </div>

          <!-- Improved team member cards with hover effects -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div v-for="member in teamMembers" :key="member.id"
              class="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div class="p-4 bg-gradient-to-br from-green-50 to-green-100">
                <img :src="member.imageUrl" :alt="member.name"
                  class="w-28 h-28 mx-auto rounded-full border-4 border-white shadow-md object-cover" />
              </div>
              <div class="p-6 text-center">
                <h3 class="text-xl font-semibold text-gray-800 mb-1">{{ member.name }}</h3>
                <p class="text-green-600 font-medium text-sm mb-4">{{ member.role }}</p>
                <p class="text-gray-600 text-sm">{{ member.bio }}</p>
                <div class="px-6 py-3 bg-gray-50 flex justify-center space-x-4">
                  <a v-if="member.socialLinks.linkedin" :href="member.socialLinks.linkedin" target="_blank"
                    rel="noopener noreferrer" class="text-gray-400 hover:text-blue-600 transition-colors duration-300">
                    <span v-html="getIcon('linkedin').html"></span>
                  </a>
                  <a v-if="member.socialLinks.twitter" :href="member.socialLinks.twitter" target="_blank"
                    rel="noopener noreferrer" class="text-gray-400 hover:text-blue-400 transition-colors duration-300">
                    <span v-html="getIcon('twitter').html"></span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Values Section - Enhanced -->
      <section id="values"
        :class="['md:block transition-opacity duration-500', { 'hidden': activeTab !== 'values' && windowWidth < 768 }]">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <span class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">What
              We Stand For</span>
            <h2 class="text-3xl md:text-4xl font-bold text-green-800 mb-4">Our Core Values</h2>
            <div class="h-1 w-20 bg-green-600 mx-auto mb-6"></div>
            <p class="text-gray-600 max-w-2xl mx-auto">These principles guide everything we do as we build the future of
              livestock trading.</p>
          </div>

          <!-- Improved value cards with icons and animations -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div v-for="value in companyValues" :key="value.id"
              class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl group">
              <div class="flex items-start p-6">
                <div class="flex-shrink-0 mr-6">
                  <span v-html="getIcon(value.icon).html"></span>
                </div>
                <div>
                  <h3
                    class="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-300">
                    {{ value.title }}</h3>
                  <p class="text-gray-600">{{ value.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section - Enhanced -->
      <section id="testimonials"
        :class="['md:block transition-opacity duration-500', { 'hidden': activeTab !== 'testimonials' && windowWidth < 768 }]">
        <div class="max-w-6xl mx-auto">
          <div class="text-center mb-16">
            <span
              class="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">Success
              Stories</span>
            <h2 class="text-3xl md:text-4xl font-bold text-green-800 mb-4">What Our Farmers Say</h2>
            <div class="h-1 w-20 bg-green-600 mx-auto mb-6"></div>
            <p class="text-gray-600 max-w-2xl mx-auto">Hear from livestock producers who have transformed their
              businesses through our platform.</p>
          </div>

          <!-- Enhanced testimonial cards with improved styling -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <div v-for="testimonial in testimonials" :key="testimonial.id"
              class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transform transition-all duration-300 hover:shadow-xl p-6">
              <div class="mb-6">
                <svg class="h-8 w-8 text-green-400 opacity-50" fill="currentColor" viewBox="0 0 32 32">
                  <path
                    d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p class="text-gray-600 italic mb-6 leading-relaxed">{{ testimonial.quote }}</p>
              <div class="flex items-center">
                <img :src="testimonial.avatar" :alt="testimonial.author"
                  class="w-12 h-12 rounded-full mr-4 border-2 border-green-100" />
                <div>
                  <p class="font-semibold text-gray-800">{{ testimonial.author }}</p>
                  <p class="text-gray-500 text-sm">{{ testimonial.farm }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Call-to-action banner -->
          <div
            class="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-10 text-white text-center mb-10">
            <h3 class="text-2xl font-bold mb-4">Ready to join our growing community?</h3>
            <p class="text-green-100 mb-6 max-w-2xl mx-auto">Join thousands of farmers who've already discovered the
              benefits of selling livestock on FarmStock.</p>
            <button
              class="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition duration-300 shadow-lg transform hover:scale-105">
              Create Your Account
            </button>
          </div>
        </div>
      </section>
    </div>

    <Footer />
  </div>
</template>
