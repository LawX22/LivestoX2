<script setup lang="ts">
import { ref, computed, reactive } from 'vue';

// Props to receive data from parent
const props = defineProps({
    topics: {
        type: Array,
        required: true
    },
    selectedCategory: {
        type: String,
        required: true
    }
});

// Emits for parent communication
const emit = defineEmits(['increment-views', 'add-topic']);

// State management
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Modal state
const showModal = ref(false);

// Form state
const newTopic = reactive({
    title: '',
    category: '',
    tags: '',
    content: '',
    pinned: false
});

// Computed topics based on filters
interface Topic {
    id: number;
    title: string;
    category: string;
    tags: string[];
    pinned: boolean;
    author: string;
    postedTime: string;
    replies: number;
    views: number;
    emoji: string;
}

const filteredTopics = computed(() => {
    let result: Topic[] = [...props.topics as Topic[]];

    // Filter by search query
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter(topic =>
            topic.title.toLowerCase().includes(query) ||
            topic.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }

    // Sort pinned topics first
    result.sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return 0;
    });

    return result;
});

// Pagination
const totalPages = computed(() => {
    return Math.ceil(filteredTopics.value.length / itemsPerPage.value);
});

const paginatedTopics = computed(() => {
    const startIdx = (currentPage.value - 1) * itemsPerPage.value;
    const endIdx = startIdx + itemsPerPage.value;
    return filteredTopics.value.slice(startIdx, endIdx);
});

// Functions
const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const resetFilters = () => {
    searchQuery.value = '';
    currentPage.value = 1;
};

const openModal = () => {
    showModal.value = true;
    // Reset form
    Object.assign(newTopic, {
        title: '',
        category: '',
        tags: '',
        content: '',
        pinned: false
    });

    // Prevent scrolling on the main body when modal is open
    document.body.style.overflow = 'hidden';
};

const closeModal = () => {
    showModal.value = false;

    // Re-enable scrolling when modal is closed
    document.body.style.overflow = '';
};

const createTopic = () => {
    // Validate form
    if (!newTopic.title.trim() || !newTopic.category || !newTopic.content.trim()) {
        alert('Please fill in all required fields.');
        return;
    }

    // Create new topic
    const tagArray = newTopic.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);

    const newTopicObj = {
        id: Date.now(), // Use timestamp for unique ID
        title: newTopic.title,
        author: 'CurrentUser', // In a real app, this would be the logged-in user
        postedTime: 'Just now',
        category: newTopic.category,
        tags: tagArray.length > 0 ? tagArray : [newTopic.category],
        replies: 0,
        views: 1,
        pinned: false, // Start unpinned, moderator can pin later
        emoji: getCategoryEmoji(newTopic.category)
    };

    // Emit event to parent to add the new topic
    emit('add-topic', newTopicObj);

    // Close modal
    closeModal();
};

const getCategoryEmoji = (category: string) => {
    const emojiMap: { [key: string]: string } = {
        'cattle': '🐄',
        'poultry': '🐔',
        'sheep': '🐑',
        'swine': '🐖',
        'goats': '🐐',
        'horses': '🐎'
    };

    return emojiMap[category] || '🐾';
};

const incrementViews = (topicId: number) => {
    emit('increment-views', topicId);
};

// Stop propagation of events when clicking on the modal content
const stopPropagation = (event: Event) => {
    event.stopPropagation();
};
</script>

<template>
    <div class="space-y-6 w-full" :class="{ 'pointer-events-none': showModal }">
        <!-- Actions Bar -->
        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 mb-2">
            <!-- Search -->
            <div class="relative w-full sm:max-w-md">
                <input type="text" placeholder="Search livestock topics..." v-model="searchQuery"
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
            <button @click="openModal"
                class="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-medium rounded-xl shadow-md transition duration-200 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Start New Discussion
            </button>
        </div>

        <!-- Topic List -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
            <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-4">
                <h2 class="text-xl font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                    Discussion Topics
                </h2>
            </div>

            <!-- Topic Items -->
            <div v-for="topic in paginatedTopics" :key="topic.id"
                class="border-b border-gray-200 hover:bg-green-50 transition-colors duration-150">
                <div class="p-5 sm:p-6 grid grid-cols-12 gap-4 items-center">
                    <div class="col-span-12 md:col-span-7">
                        <div class="flex items-start">
                            <div class="flex-shrink-0 mr-4">
                                <div
                                    class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl overflow-hidden shadow-inner">
                                    <span class="text-3xl">{{ topic.emoji }}</span>
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center">
                                    <span v-if="topic.pinned" class="mr-2 text-amber-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </span>
                                    <a href="#"
                                        class="text-xl font-medium text-green-800 hover:text-green-600 hover:underline transition-colors"
                                        @click="incrementViews(topic.id)">{{ topic.title }}</a>
                                </div>
                                <div class="mt-2 text-sm text-gray-600">
                                    Posted by <span class="font-medium text-gray-800">{{ topic.author }}</span> • {{
                                        topic.postedTime }}
                                </div>
                                <div class="mt-3 flex flex-wrap gap-2">
                                    <span v-for="tag in topic.tags" :key="tag"
                                        class="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors cursor-pointer"
                                        @click="searchQuery = tag">
                                        {{ tag }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-span-4 md:col-span-2 flex items-center justify-center">
                        <div class="text-center">
                            <span class="block font-medium text-xl text-green-700">{{ topic.replies }}</span>
                            <span class="text-xs text-gray-500 font-medium">Replies</span>
                        </div>
                    </div>
                    <div class="col-span-4 md:col-span-1 flex items-center justify-center">
                        <div class="text-center">
                            <span class="block text-gray-700">{{ topic.views }}</span>
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

            <!-- Empty State -->
            <div v-if="paginatedTopics.length === 0" class="px-6 py-16 text-center">
                <div class="text-6xl mb-6 flex justify-center">🔍🐄</div>
                <h3 class="text-xl font-medium text-gray-900">No livestock topics found</h3>
                <p class="mt-2 text-gray-600 max-w-md mx-auto">Try adjusting your search to find what you're looking
                    for.
                </p>
                <button @click="resetFilters"
                    class="mt-6 px-5 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
                    Show All Topics
                </button>
            </div>
        </div>

        <!-- Featured Resources Section -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <h3 class="font-bold">Veterinary Resources</h3>
                </div>
                <div class="p-4 space-y-2">
                    <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                        <div class="font-medium text-green-800">Common Livestock Diseases</div>
                        <div class="text-sm text-gray-600">Recognition and prevention guide</div>
                    </a>
                    <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                        <div class="font-medium text-green-800">Vaccination Schedules</div>
                        <div class="text-sm text-gray-600">By species and age</div>
                    </a>
                    <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                        <div class="font-medium text-green-800">Emergency Care</div>
                        <div class="text-sm text-gray-600">First aid for farm animals</div>
                    </a>
                </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg overflow-hidden border border-green-100">
                <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-3 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <h3 class="font-bold">Nutrition & Feeding</h3>
                </div>
                <div class="p-4 space-y-2">
                    <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                        <div class="font-medium text-green-800">Feed Formulation</div>
                        <div class="text-sm text-gray-600">Balanced diets for optimal growth</div>
                    </a>
                    <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                        <div class="font-medium text-green-800">Pasture Management</div>
                        <div class="text-sm text-gray-600">Rotational grazing techniques</div>
                    </a>
                    <a href="#" class="block hover:bg-green-50 p-3 rounded-lg transition-colors duration-150">
                        <div class="font-medium text-green-800">Water Requirements</div>
                        <div class="text-sm text-gray-600">By species and climate</div>
                    </a>
                </div>
            </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center py-4">
            <div class="text-sm text-gray-700 font-medium">
                Showing <span class="font-bold text-green-800">{{ Math.min(paginatedTopics.length, itemsPerPage)
                    }}</span>
                of <span class="font-bold text-green-800">{{ filteredTopics.length }}</span> topics
            </div>
            <div class="flex space-x-2">
                <button @click="prevPage"
                    class="px-4 py-2 rounded-lg border border-green-300 hover:bg-green-100 transition-colors"
                    :disabled="currentPage <= 1" :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button @click="nextPage"
                    class="px-4 py-2 rounded-lg border border-green-300 hover:bg-green-100 transition-colors"
                    :disabled="currentPage >= totalPages"
                    :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>

        <!-- New Topic Modal -->
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center" aria-labelledby="modal-title"
            role="dialog" aria-modal="true">
            <!-- Background overlay with blur effect -->
            <div class="fixed inset-0 bg-gray-500 bg-opacity-60 backdrop-blur-sm transition-opacity" aria-hidden="true"
                @click="closeModal"></div>

            <!-- Modal panel with fixed height and overflow handling -->
            <div class="relative bg-white rounded-xl text-left shadow-2xl sm:max-w-lg sm:w-full pointer-events-auto border border-gray-100 max-h-[90vh] flex flex-col"
                @click="stopPropagation">
                <!-- Header section -->
                <div class="bg-white px-6 pt-6 pb-4 sm:p-6 sm:pb-4">
                    <div class="sm:flex sm:items-start">
                        <div
                            class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                            <h3 class="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                                Create New Topic
                            </h3>
                        </div>
                    </div>
                </div>

                <!-- Scrollable content area -->
                <div class="flex-1 overflow-y-auto px-6">
                    <div class="space-y-5">
                        <!-- Title with floating label effect -->
                        <div class="relative">
                            <input type="text" id="topic-title" v-model="newTopic.title"
                                class="peer w-full border border-gray-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-transparent"
                                placeholder="Title">
                            <label for="topic-title"
                                class="absolute top-0 left-2 -translate-y-1/2 px-1 text-sm font-medium text-gray-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm transition-all bg-white">
                                Title <span class="text-red-500">*</span>
                            </label>
                        </div>

                        <!-- Category with icons -->
                        <div class="relative">
                            <label for="topic-category"
                                class="absolute top-0 left-2 -translate-y-1/2 px-1 text-sm font-medium text-gray-700 bg-white z-10">
                                Category <span class="text-red-500">*</span>
                            </label>
                            <select id="topic-category" v-model="newTopic.category"
                                class="w-full appearance-none bg-white border border-gray-300 rounded-lg shadow-sm py-3 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-gray-700">
                                <option value="">Select a category</option>
                                <option value="cattle">🐄 Cattle</option>
                                <option value="poultry">🐔 Poultry</option>
                                <option value="sheep">🐑 Sheep</option>
                                <option value="swine">🐖 Swine</option>
                                <option value="goats">🐐 Goats</option>
                                <option value="horses">🐎 Horses</option>
                            </select>
                            <!-- Category icon placeholder that updates based on selection -->
                            <div
                                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path
                                        d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                            </div>
                            <!-- Custom dropdown icon -->
                            <div
                                class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>

                        <!-- Tags with improved styling -->
                        <div class="relative">
                            <input type="text" id="topic-tags" v-model="newTopic.tags"
                                class="peer w-full border border-gray-300 rounded-lg shadow-sm py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-transparent"
                                placeholder="Tags">
                            <label for="topic-tags"
                                class="absolute top-0 left-2 -translate-y-1/2 px-1 text-sm font-medium text-gray-700 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-sm transition-all bg-white z-10">
                                Tags (comma separated)
                            </label>
                            <!-- Tags icon -->
                            <div
                                class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                            <p class="mt-1 text-xs text-gray-500">Example: nutrition, breeding, health</p>
                        </div>

                        <!-- Content with improved textarea styling -->
                        <div class="relative">
                            <textarea id="topic-content" v-model="newTopic.content" rows="5"
                                class="peer w-full border border-gray-300 rounded-lg shadow-sm py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-transparent"
                                placeholder="Content"></textarea>
                            <label for="topic-content"
                                class="absolute top-0 left-2 -translate-y-1/2 px-1 text-sm font-medium text-gray-700 bg-white z-10">
                                Content <span class="text-red-500">*</span>
                            </label>
                            <!-- Content icon -->
                            <div class="pointer-events-none absolute top-3 left-0 flex items-center pl-3 text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20"
                                    fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                        clip-rule="evenodd" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer section with buttons - always visible -->
                <div class="bg-gray-50 px-6 py-4 sm:px-6 sm:flex sm:flex-row-reverse border-t border-gray-100">
                    <button type="button"
                        class="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                        @click="createTopic">
                        Create Topic
                    </button>
                    <button type="button"
                        class="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 shadow-sm px-5 py-3 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                        @click="closeModal">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>