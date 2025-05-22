<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'CommunityForum',
  props: {
    forumPosts: {
      type: Array as PropType<Array<{
        id: number | string;
        category: string;
        title: string;
        excerpt: string;
        author: string;
        authorImage: string;
        date: string;
        likes: number;
        comments: number;
      }>>,
      required: true
    },
    platformStats: {
      type: Object as PropType<{
        forumPosts: number;
        countries: number;
        farmersHelped: number;
      }>,
      required: true
    },
    activeUsersByTime: {
      type: Object,
      required: true
    }
  }
});
</script>

<template>
  <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div v-for="post in forumPosts" :key="post.id"
      class="bg-white border border-slate-200 rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group">
      <!-- Category Badge -->
      <div
        class="inline-block bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold uppercase mb-6">
        {{ post.category }}
      </div>

      <h3 class="text-xl font-bold mb-4 text-slate-800 group-hover:text-emerald-600 transition-colors leading-tight">
        {{ post.title }}
      </h3>

      <p class="text-slate-600 mb-6 leading-relaxed">
        {{ post.excerpt }}
      </p>

      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center space-x-3">
          <img :src="post.authorImage" :alt="post.author" class="w-10 h-10 rounded-full object-cover">
          <div>
            <div class="font-bold text-slate-800">{{ post.author }}</div>
            <div class="text-xs text-slate-500">{{ post.date }}</div>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-between pt-4 border-t border-slate-100">
        <div class="flex items-center space-x-6 text-slate-500">
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
            <span class="font-medium">{{ post.likes }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clip-rule="evenodd" />
            </svg>
            <span class="font-medium">{{ post.comments }}</span>
          </div>
        </div>
        <button class="text-emerald-600 hover:text-emerald-700 font-bold text-sm">
          READ MORE →
        </button>
      </div>
    </div>
  </div>

  <!-- Forum Stats -->
  <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
    <div class="text-center">
      <div class="text-4xl font-black mb-2 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
        {{ platformStats.forumPosts.toLocaleString() }}
      </div>
      <div class="text-slate-600 font-medium">Forum Posts</div>
    </div>
    <div class="text-center">
      <div class="text-4xl font-black mb-2 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
        {{ activeUsersByTime.today.toLocaleString() }}
      </div>
      <div class="text-slate-600 font-medium">Daily Active Users</div>
    </div>
    <div class="text-center">
      <div class="text-4xl font-black mb-2 bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent">
        {{ platformStats.countries }}
      </div>
      <div class="text-slate-600 font-medium">Countries</div>
    </div>
    <div class="text-center">
      <div class="text-4xl font-black mb-2 bg-gradient-to-r from-pink-600 to-emerald-600 bg-clip-text text-transparent">
        {{ platformStats.farmersHelped.toLocaleString() }}
      </div>
      <div class="text-slate-600 font-medium">Farmers Helped</div>
    </div>
  </div>

  <!-- Join Forum CTA -->
  <div class="text-center mt-16">
    <slot name="button"></slot>
  </div>
</template>