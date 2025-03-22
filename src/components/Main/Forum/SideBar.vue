<script setup lang="ts">
// Define props for the component
defineProps({
    topics: {
        type: Array as () => { category: string }[],
        required: true
    },
    activeCategory: {
        type: String,
        default: 'all'
    }
});

// Emit events to parent component
const emit = defineEmits(['category-selected']);

// Handle category selection
const selectCategory = (category: string) => {
    emit('category-selected', category);
};
</script>

<template>
    <div class="space-y-6">
        <!-- Quick stats card -->
        <div
            class="bg-white rounded-xl shadow-md p-6 border border-green-100 hover:shadow-lg transition-shadow duration-300">
            <h3 class="font-bold text-lg text-green-800 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Forum at a Glance
            </h3>
            <div class="grid grid-cols-3 gap-4">
                <div class="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                    <div class="text-green-800 font-bold text-2xl mb-1">{{ topics.length }}</div>
                    <div class="text-xs text-gray-600 font-medium uppercase tracking-wide">Topics</div>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                    <div class="text-green-800 font-bold text-2xl mb-1">2,568</div>
                    <div class="text-xs text-gray-600 font-medium uppercase tracking-wide">Members</div>
                </div>
                <div class="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-200">
                    <div class="text-green-800 font-bold text-2xl mb-1">47</div>
                    <div class="text-xs text-gray-600 font-medium uppercase tracking-wide">Online</div>
                </div>
            </div>
        </div>

        <!-- Categories -->
        <div
            class="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow duration-300">
            <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-4">
                <h3 class="font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Livestock Categories
                </h3>
            </div>
            <div class="p-4 space-y-2">
                <!-- Category buttons with animal icons -->
                <button class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center"
                    :class="[
                        'all' === activeCategory
                            ? 'bg-green-600 text-white font-medium shadow-md'
                            : 'bg-green-50 text-green-800 hover:bg-green-200 hover:shadow-sm'
                    ]" @click="selectCategory('all')">
                    <span class="text-xl mr-2">🐾</span>
                    <span class="capitalize font-medium">All</span>
                    <span :class="[
                        'ml-auto text-xs rounded-full px-2 py-1 font-semibold',
                        'all' === activeCategory
                            ? 'bg-white text-green-800'
                            : 'bg-green-600 text-white'
                    ]">
                        {{ topics.length }}
                    </span>
                </button>

                <button class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center"
                    :class="[
                        'cattle' === activeCategory
                            ? 'bg-green-600 text-white font-medium shadow-md'
                            : 'bg-green-50 text-green-800 hover:bg-green-200 hover:shadow-sm'
                    ]" @click="selectCategory('cattle')">
                    <span class="text-xl mr-2">🐄</span>
                    <span class="capitalize font-medium">Cattle</span>
                    <span :class="[
                        'ml-auto text-xs rounded-full px-2 py-1 font-semibold',
                        'cattle' === activeCategory
                            ? 'bg-white text-green-800'
                            : 'bg-green-600 text-white'
                    ]">
                        {{topics.filter(t => t.category === 'cattle').length}}
                    </span>
                </button>

                <button class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center"
                    :class="[
                        'poultry' === activeCategory
                            ? 'bg-green-600 text-white font-medium shadow-md'
                            : 'bg-green-50 text-green-800 hover:bg-green-200 hover:shadow-sm'
                    ]" @click="selectCategory('poultry')">
                    <span class="text-xl mr-2">🐔</span>
                    <span class="capitalize font-medium">Poultry</span>
                    <span :class="[
                        'ml-auto text-xs rounded-full px-2 py-1 font-semibold',
                        'poultry' === activeCategory
                            ? 'bg-white text-green-800'
                            : 'bg-green-600 text-white'
                    ]">
                        {{topics.filter(t => t.category === 'poultry').length}}
                    </span>
                </button>

                <button class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center"
                    :class="[
                        'sheep' === activeCategory
                            ? 'bg-green-600 text-white font-medium shadow-md'
                            : 'bg-green-50 text-green-800 hover:bg-green-200 hover:shadow-sm'
                    ]" @click="selectCategory('sheep')">
                    <span class="text-xl mr-2">🐑</span>
                    <span class="capitalize font-medium">Sheep</span>
                    <span :class="[
                        'ml-auto text-xs rounded-full px-2 py-1 font-semibold',
                        'sheep' === activeCategory
                            ? 'bg-white text-green-800'
                            : 'bg-green-600 text-white'
                    ]">
                        {{topics.filter(t => t.category === 'sheep').length}}
                    </span>
                </button>

                <button class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center"
                    :class="[
                        'swine' === activeCategory
                            ? 'bg-green-600 text-white font-medium shadow-md'
                            : 'bg-green-50 text-green-800 hover:bg-green-200 hover:shadow-sm'
                    ]" @click="selectCategory('swine')">
                    <span class="text-xl mr-2">🐖</span>
                    <span class="capitalize font-medium">Swine</span>
                    <span :class="[
                        'ml-auto text-xs rounded-full px-2 py-1 font-semibold',
                        'swine' === activeCategory
                            ? 'bg-white text-green-800'
                            : 'bg-green-600 text-white'
                    ]">
                        {{topics.filter(t => t.category === 'swine').length}}
                    </span>
                </button>

                <button class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center"
                    :class="[
                        'goats' === activeCategory
                            ? 'bg-green-600 text-white font-medium shadow-md'
                            : 'bg-green-50 text-green-800 hover:bg-green-200 hover:shadow-sm'
                    ]" @click="selectCategory('goats')">
                    <span class="text-xl mr-2">🐐</span>
                    <span class="capitalize font-medium">Goats</span>
                    <span :class="[
                        'ml-auto text-xs rounded-full px-2 py-1 font-semibold',
                        'goats' === activeCategory
                            ? 'bg-white text-green-800'
                            : 'bg-green-600 text-white'
                    ]">
                        {{topics.filter(t => t.category === 'goats').length}}
                    </span>
                </button>

                <button class="w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center"
                    :class="[
                        'horses' === activeCategory
                            ? 'bg-green-600 text-white font-medium shadow-md'
                            : 'bg-green-50 text-green-800 hover:bg-green-200 hover:shadow-sm'
                    ]" @click="selectCategory('horses')">
                    <span class="text-xl mr-2">🐎</span>
                    <span class="capitalize font-medium">Horses</span>
                    <span :class="[
                        'ml-auto text-xs rounded-full px-2 py-1 font-semibold',
                        'horses' === activeCategory
                            ? 'bg-white text-green-800'
                            : 'bg-green-600 text-white'
                    ]">
                        {{topics.filter(t => t.category === 'horses').length}}
                    </span>
                </button>
            </div>
        </div>

        <!-- Recent activity -->
        <div
            class="bg-white rounded-xl shadow-md overflow-hidden border border-green-100 hover:shadow-lg transition-shadow duration-300">
            <div class="bg-gradient-to-r from-green-700 to-green-600 text-white px-5 py-4">
                <h3 class="font-bold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Activity
                </h3>
            </div>
            <div class="p-4">
                <div v-for="i in 3" :key="i"
                    class="border-b border-gray-100 last:border-0 py-3 hover:bg-green-50 transition-colors duration-200 rounded-lg px-3">
                    <div class="flex items-start">
                        <div class="w-10 h-10 rounded-full bg-green-100 flex-shrink-0 mr-3 overflow-hidden">
                            <img src="/src/assets/Bull.jpg" alt="User avatar"
                                class="w-full h-full object-cover" />
                        </div>
                        <div>
                            <div class="text-sm font-medium">User posted in <span
                                    class="text-green-700 hover:text-green-900 transition-colors duration-200 hover:underline cursor-pointer">Topic
                                    Title</span></div>
                            <div class="text-xs text-gray-500 mt-1">{{ i === 1 ? '2 hours ago' : i === 2 ? '4 hours ago'
                                : 'Yesterday' }}</div>
                        </div>
                    </div>
                </div>
                <div class="mt-3 text-center">
                    <button class="text-sm text-green-700 hover:text-green-900 font-medium hover:underline px-4 py-2">
                        View All Activity
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>