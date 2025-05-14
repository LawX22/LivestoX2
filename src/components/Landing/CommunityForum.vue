<script lang="ts">
import { defineComponent, PropType } from 'vue';

interface ForumPost {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  likes: number;
  comments: number;
  authorImage: string;
  category: string;
}

export default defineComponent({
  name: 'CommunityForum',
  props: {
    forumPosts: {
      type: Array as PropType<ForumPost[]>,
      required: true
    },
    title: {
      type: String,
      default: 'Community Forum'
    },
    description: {
      type: String,
      default: 'Connect with experienced farmers, share knowledge, and get advice from our thriving farming community.'
    }
  }
});
</script>

<template>
  <section class="py-20 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <span class="text-emerald-600 font-semibold uppercase tracking-wider">Knowledge sharing</span>
        <h2 class="text-4xl font-extrabold text-gray-900 mt-2">{{ title }}</h2>
        <p class="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">{{ description }}</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div v-for="post in forumPosts" :key="post.id"
          class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
          <div class="p-6">
            <div class="flex items-center space-x-2 mb-4">
              <img :src="post.authorImage" :alt="post.author" class="w-10 h-10 rounded-full">
              <div>
                <h4 class="font-medium text-gray-900">{{ post.author }}</h4>
                <p class="text-sm text-gray-500">{{ post.date }}</p>
              </div>
            </div>

            <span class="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium rounded-full mb-4">
              {{ post.category }}
            </span>

            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ post.title }}</h3>
            <p class="text-gray-600 mb-6">{{ post.excerpt }}</p>

            <div class="flex justify-between items-center border-t border-gray-100 pt-4">
              <div class="flex items-center space-x-4">
                <div class="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {{ post.likes }}
                </div>
                <div class="flex items-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  {{ post.comments }}
                </div>
              </div>

              <a href="#" class="text-emerald-600 font-medium hover:text-emerald-700 hover:underline">Read Post</a>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center">
        <a href="#"
          class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 md:py-4 md:text-lg md:px-10 transition-colors duration-300 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
          </svg>
          Explore All Forum Topics
        </a>
      </div>
    </div>
  </section>
</template>