<script setup lang="ts">
import { ref } from 'vue';
import NavBar from '../../components/Main/NavBar.vue';

const showModal = ref(false);
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
        <!-- Fixed Navbar -->
        <div class="sticky top-0 z-50 w-full">
            <NavBar />
        </div>

        <!-- Hero section with parallax effect -->
        <div class="relative bg-gradient-to-r from-green-800 to-green-700 py-12 px-4 mb-8 shadow-xl overflow-hidden">
            <div class="container mx-auto max-w-full px-4 sm:px-6 lg:px-8 relative z-10">
                <h1 class="text-5xl font-bold text-white mb-3 tracking-tight">Livestock Forum</h1>
                <p class="text-green-100 text-xl max-w-3xl leading-relaxed">Connect with fellow farmers, ranchers, and
                    livestock enthusiasts to share knowledge and best practices in animal husbandry.</p>
            </div>
            <!-- Decorative farm silhouette with parallax effect -->
            <div
                class="absolute bottom-0 right-0 text-green-700 opacity-20 text-9xl transform translate-y-1/4 select-none">
                🏞️🐄🐑🐖🐔🐐
            </div>
            <!-- Subtle pattern overlay -->
            <div class="absolute inset-0 bg-green-900 opacity-10"
                style="background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48cGF0aCBkPSJNMzYgMzRjMCAxIDEgMiAyIDJoMmMxIDAgMi0xIDItMnYtNGgtNnY0em0tOCAwYzAgMSAxIDIgMiAyaDJjMSAwIDItMSAyLTJ2LTRoLTZ2NHptLTE4LTRoMnYtNGgtMnY0em0xOC0xMGMtMSAwLTIgMS0yIDJ2NGg2di00YzAtMS0xLTItMi0yaC0yem04IDBjLTEgMC0yIDEtMiAydjRoNnYtNGMwLTEtMS0yLTItMmgtMnptMTggNnYtNGgtMnY0aDJ6Ii8+PC9zdmc+');">
            </div>
        </div>

        <div class="container mx-auto px-4 max-w-full sm:px-6 lg:px-8 flex-grow">
            <div class="flex flex-col lg:flex-row gap-8">
                <!-- Sidebar -->
                <div class="lg:w-1/4 space-y-6">
                    <!-- Quick stats card -->
                    <div class="bg-white rounded-xl shadow-lg p-5 border border-green-100">
                        <h3 class="font-bold text-lg text-green-800 mb-4 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            Forum Statistics
                        </h3>
                        <div class="grid grid-cols-3 gap-4">
                            <div class="text-center p-3 bg-green-50 rounded-lg">
                                <div class="text-green-800 font-bold text-2xl">124</div>
                                <div class="text-xs text-gray-600 font-medium">Topics</div>
                            </div>
                            <div class="text-center p-3 bg-green-50 rounded-lg">
                                <div class="text-green-800 font-bold text-2xl">2,568</div>
                                <div class="text-xs text-gray-600 font-medium">Members</div>
                            </div>
                            <div class="text-center p-3 bg-green-50 rounded-lg">
                                <div class="text-green-800 font-bold text-2xl">47</div>
                                <div class="text-xs text-gray-600 font-medium">Online</div>
                            </div>
                        </div>
                    </div>

                    <!-- Categories -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                        <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3">
                            <h3 class="font-bold">Livestock Categories</h3>
                        </div>
                        <div class="p-4 space-y-1">
                            <button
                                v-for="category in ['all', 'cattle', 'poultry', 'sheep', 'swine', 'goats', 'horses']"
                                :key="category" :class="[
                                    'w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 flex items-center',
                                    'bg-green-100 text-green-800 font-medium'
                                ]">
                                <span class="mr-2 text-xl">
                                    {{ category === 'all' ? '🐾' :
                                        category === 'cattle' ? '🐄' :
                                            category === 'poultry' ? '🐔' :
                                                category === 'sheep' ? '🐑' :
                                                    category === 'swine' ? '🐖' :
                                                        category === 'goats' ? '🐐' :
                                    category === 'horses' ? '🐎' : '🐾' }}
                                </span>
                                {{ category === 'all' ? 'All Animals' : category.charAt(0).toUpperCase() +
                                category.slice(1) }}
                            </button>
                        </div>
                    </div>

                    <!-- Upcoming Events Card -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                        <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3">
                            <h3 class="font-bold">Upcoming Events</h3>
                        </div>
                        <div class="p-4 space-y-3">
                            <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                <div class="flex items-center mb-1">
                                    <span class="text-amber-500 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <div class="font-medium text-green-800">Annual Livestock Expo</div>
                                </div>
                                <div class="text-sm text-gray-600 ml-7">May 15-17, 2025 • Virtual</div>
                            </a>
                            <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                <div class="flex items-center mb-1">
                                    <span class="text-amber-500 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <div class="font-medium text-green-800">Cattle Breeders Conference</div>
                                </div>
                                <div class="text-sm text-gray-600 ml-7">June 10, 2025 • Chicago, IL</div>
                            </a>
                            <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                <div class="flex items-center mb-1">
                                    <span class="text-amber-500 mr-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <div class="font-medium text-green-800">Sustainable Farming Workshop</div>
                                </div>
                                <div class="text-sm text-gray-600 ml-7">July 5, 2025 • Online</div>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Main content area -->
                <div class="lg:w-3/4 space-y-6">
                    <!-- Actions Bar -->
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
                        <!-- Search -->
                        <div class="relative w-full sm:max-w-md">
                            <input type="text" placeholder="Search livestock topics..."
                                class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <!-- New Topic Button -->
                        <button
                            class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl shadow-md transition duration-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                            Start New Discussion
                        </button>
                    </div>

                    <!-- Topic List -->
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                        <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-4">
                            <h2 class="text-xl font-bold flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                </svg>
                                Discussion Topics
                            </h2>
                        </div>

                        <!-- Topic Item Example -->
                        <div class="border-b border-gray-200 hover:bg-green-50 transition-colors duration-150">
                            <div class="p-5 sm:p-6 grid grid-cols-12 gap-4 items-center">
                                <div class="col-span-12 md:col-span-7">
                                    <div class="flex items-start">
                                        <div class="flex-shrink-0 mr-4">
                                            <div
                                                class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                                                <span class="text-3xl">🐄</span>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="flex items-center">
                                                <span class="mr-2 text-amber-500">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                    </svg>
                                                </span>
                                                <a href="#"
                                                    class="text-xl font-medium text-green-800 hover:text-green-600 hover:underline transition-colors">Best
                                                    Practices for Cattle Nutrition During Winter</a>
                                            </div>
                                            <div class="mt-2 text-sm text-gray-600">
                                                Posted by <span class="font-medium text-gray-800">RanchHand</span> • 2
                                                hours ago
                                            </div>
                                            <div class="mt-3 flex flex-wrap gap-2">
                                                <span
                                                    class="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer">
                                                    cattle
                                                </span>
                                                <span
                                                    class="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer">
                                                    nutrition
                                                </span>
                                                <span
                                                    class="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer">
                                                    winter-care
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-span-4 md:col-span-2 flex items-center justify-center">
                                    <div class="text-center">
                                        <span class="block font-medium text-xl text-green-700">24</span>
                                        <span class="text-xs text-gray-500 font-medium">Replies</span>
                                    </div>
                                </div>
                                <div class="col-span-4 md:col-span-1 flex items-center justify-center">
                                    <div class="text-center">
                                        <span class="block text-gray-700">1352</span>
                                        <span class="text-xs text-gray-500 font-medium">Views</span>
                                    </div>
                                </div>
                                <div class="col-span-4 md:col-span-2 flex items-center justify-end">
                                    <a href="#"
                                        class="px-4 py-2 text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                                        Read More
                                    </a>
                                </div>
                            </div>
                        </div>

                        <!-- More topic items would be here -->

                        <!-- Empty State (example) -->
                        <div class="hidden px-6 py-16 text-center">
                            <div class="text-6xl mb-6 flex justify-center">🔍🐄</div>
                            <h3 class="text-xl font-medium text-gray-900">No livestock topics found</h3>
                            <p class="mt-2 text-gray-600 max-w-md mx-auto">Try adjusting your search or filter to find
                                what you're looking for.</p>
                            <button
                                class="mt-6 px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                                Show All Topics
                            </button>
                        </div>
                    </div>

                    <!-- Featured Resources Section -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                            <div
                                class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                <h3 class="font-bold">Veterinary Resources</h3>
                            </div>
                            <div class="p-4 space-y-2">
                                <a href="#"
                                    class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                    <div class="font-medium text-green-800">Common Livestock Diseases</div>
                                    <div class="text-sm text-gray-600">Recognition and prevention guide</div>
                                </a>
                                <a href="#"
                                    class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                    <div class="font-medium text-green-800">Vaccination Schedules</div>
                                    <div class="text-sm text-gray-600">By species and age</div>
                                </a>
                                <a href="#"
                                    class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                    <div class="font-medium text-green-800">Emergency Care</div>
                                    <div class="text-sm text-gray-600">First aid for farm animals</div>
                                </a>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                            <div
                                class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 class="font-bold">Nutrition & Feeding</h3>
                            </div>
                            <div class="p-4 space-y-2">
                                <a href="#"
                                    class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                    <div class="font-medium text-green-800">Feed Formulation</div>
                                    <div class="text-sm text-gray-600">Balanced diets for optimal growth</div>
                                </a>
                                <a href="#"
                                    class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                    <div class="font-medium text-green-800">Pasture Management</div>
                                    <div class="text-sm text-gray-600">Rotational grazing techniques</div>
                                </a>
                                <a href="#"
                                    class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                                    <div class="font-medium text-green-800">Water Requirements</div>
                                    <div class="text-sm text-gray-600">By species and climate</div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <!-- Pagination -->
                    <div class="flex justify-between items-center py-4">
                        <div class="text-sm text-gray-700 font-medium">
                            Showing <span class="font-bold text-green-800">5</span> of <span
                                class="font-bold text-green-800">5</span> topics
                        </div>
                        <div class="flex space-x-2">
                            <button
                                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 shadow-sm"
                                disabled>
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                class="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- New Topic Modal with improved design -->
        <div v-if="showModal" class="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
            <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"></div>

            <div
                class="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 p-6 z-10 transform transition-all">
                <div class="flex justify-between items-start mb-6">
                    <h3 class="text-2xl font-bold text-green-800">Create New Livestock Topic</h3>
                    <button
                        class="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="space-y-5">
                    <div>
                        <label for="topic-title" class="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input type="text" id="topic-title" placeholder="Enter topic title"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                    </div>
                    <div>
                        <label for="topic-category"
                            class="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select id="topic-category"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500">
                            <option value="" disabled selected>Select animal category</option>
                            <option value="cattle">Cattle</option>
                            <option value="poultry">Poultry</option>
                            <option value="sheep">Sheep</option>
                            <option value="swine">Swine</option>
                            <option value="goats">Goats</option>
                            <option value="horses">Horses</option>
                        </select>
                    </div>

                    <div>
                        <label for="topic-tags" class="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                        <input type="text" id="topic-tags" placeholder="Enter tags separated by commas"
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500" />
                        <p class="text-sm text-gray-500 mt-1">Example: nutrition, winter-care, breeding</p>
                    </div>

                    <div>
                        <label for="topic-content" class="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea id="topic-content" rows="6" placeholder="Enter your discussion details..."
                            class="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-green-500 focus:border-green-500"></textarea>
                    </div>

                    <div class="flex items-center">
                        <input type="checkbox" id="pin-topic"
                            class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500" />
                        <label for="pin-topic" class="ml-2 block text-sm text-gray-700">Request topic to be pinned
                            (subject to moderator approval)</label>
                    </div>
                </div>

                <div class="mt-8 flex justify-end space-x-4">
                    <button
                        class="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
                        Cancel
                    </button>
                    <button
                        class="px-5 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-lg shadow-md transition duration-200">
                        Create Topic
                    </button>
                </div>
            </div>
        </div>

        <!-- Footer -->
        <footer class="bg-green-800 text-white mt-16 py-12 px-4">
            <div class="container mx-auto max-w-full sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h4 class="text-xl font-bold mb-4">FarmConnect</h4>
                        <p class="text-green-200 mb-4">Connecting farmers and livestock enthusiasts worldwide since
                            2020.</p>
                        <div class="flex space-x-4">
                            <a href="#" class="text-white hover:text-green-200 transition-colors">
                                <span class="sr-only">Facebook</span>
                                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" class="text-white hover:text-green-200 transition-colors">
                                <span class="sr-only">Twitter</span>
                                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path
                                        d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                            <a href="#" class="text-white hover:text-green-200 transition-colors">
                                <span class="sr-only">Instagram</span>
                                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" class="text-white hover:text-green-200 transition-colors">
                                <span class="sr-only">YouTube</span>
                                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path fill-rule="evenodd"
                                        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418zM15.194 12 10 15V9l5.194 3z"
                                        clip-rule="evenodd" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 class="font-bold mb-4">Resources</h4>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Livestock
                                    Guides</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Veterinary
                                    Directory</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Equipment
                                    Reviews</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Breeding
                                    Resources</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Feed Suppliers</a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-bold mb-4">Community</h4>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Member
                                    Directory</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Events
                                    Calendar</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Success
                                    Stories</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Photo Gallery</a>
                            </li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Webinars</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 class="font-bold mb-4">Support</h4>
                        <ul class="space-y-2">
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Help Center</a>
                            </li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Contact Us</a>
                            </li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">FAQ</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Terms of
                                    Service</a></li>
                            <li><a href="#" class="text-green-200 hover:text-white transition-colors">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="border-t border-green-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <p class="text-green-200 text-sm">© 2025 FarmConnect. All rights reserved.</p>
                    <div class="mt-4 md:mt-0">
                        <a href="#" class="text-green-200 hover:text-white transition-colors text-sm mr-6">Privacy
                            Policy</a>
                        <a href="#" class="text-green-200 hover:text-white transition-colors text-sm mr-6">Terms of
                            Service</a>
                        <a href="#" class="text-green-200 hover:text-white transition-colors text-sm">Cookie Policy</a>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>