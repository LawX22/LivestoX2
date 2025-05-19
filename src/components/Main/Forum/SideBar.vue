
<script setup lang="ts">
interface ForumStat {
  label: string;
  value: string;
}
interface Activity {
  title: string;
  author: string;
  timeAgo: string;
}
interface Contributor {
  name: string;
  posts: number;
  avatar: string;
}

defineProps<{
  forumStats: ForumStat[];
  recentActivity: Activity[];
  topContributors: Contributor[];
  tags: string[];
}>();

const emit = defineEmits(['search', 'newTopic', 'viewAllActivity', 'tagClick', 'topicClick', 'contributorClick']);


const handleTagClick = (tag: string) => {
  emit('tagClick', tag);
};

const handleTopicClick = (activity: any) => {
  emit('topicClick', activity);
};

const handleContributorClick = (contributor: any) => {
  emit('contributorClick', contributor);
};

const handleViewAllActivity = () => {
  emit('viewAllActivity');
};
</script>

<template>
  <div class="md:w-72 flex-shrink-0">
    <div class="sticky top-20 space-y-4">
      <!-- Forum Stats -->
      <div class="bg-white rounded-lg shadow-md p-5 border border-green-200">
        <h2 class="font-bold text-lg text-green-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Forum Stats
        </h2>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="(stat, index) in forumStats" :key="index" class="bg-green-50 rounded-lg p-3 text-center">
            <div class="text-green-800 font-bold text-xl">{{ stat.value }}</div>
            <div class="text-green-600 text-sm">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white rounded-lg shadow-md p-5 border border-green-200">
        <h2 class="font-bold text-lg text-green-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recent Activity
        </h2>
        <div>
          <div v-for="(activity, index) in recentActivity" :key="index" class="mb-3">
            <a href="#" @click.prevent="handleTopicClick(activity)" class="font-medium text-green-700 hover:text-green-900 block">
              {{ activity.title }}
            </a>
            <div class="flex items-center text-gray-500 text-sm mt-1 space-x-2">
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {{ activity.author }}
              </span>
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {{ activity.timeAgo }}
              </span>
            </div>
          </div>
        </div>
        <a href="#" @click.prevent="handleViewAllActivity" 
           class="text-green-600 hover:text-green-800 text-sm font-medium flex items-center justify-center mt-4">
          View All Activity
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>

      <!-- Top Contributors -->
      <div class="bg-white rounded-lg shadow-md p-5 border border-green-200">
        <h2 class="font-bold text-lg text-green-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Top Contributors
        </h2>
        <ul class="space-y-3">
          <li v-for="(contributor, index) in topContributors" :key="index" 
              @click="handleContributorClick(contributor)"
              class="flex items-center justify-between bg-green-50 rounded-lg p-2 hover:bg-green-100 transition-colors cursor-pointer">
            <div class="flex items-center">
              <span class="flex items-center justify-center h-8 w-8 bg-green-200 rounded-full text-lg mr-3">
                {{ contributor.avatar }}
              </span>
              <span class="text-green-800 font-medium">{{ contributor.name }}</span>
            </div>
            <span class="bg-green-600 text-white text-xs rounded-full px-2 py-1 font-bold">{{ contributor.posts }}</span>
          </li>
        </ul>
      </div>

      <!-- Popular Tags -->
      <div class="bg-white rounded-lg shadow-md p-5 border border-green-200">
        <h2 class="font-bold text-lg text-green-800 mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Popular Tags
        </h2>
        <div class="flex flex-wrap gap-2">
          <a v-for="(tag, index) in tags" :key="index" href="#" 
             @click.prevent="handleTagClick(tag)"
             class="bg-green-100 hover:bg-green-500 hover:text-white text-green-700 px-3 py-1.5 rounded-full text-sm transition-colors flex items-center">
            <span class="mr-1">#</span>{{ tag }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>