<script setup lang="ts">
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import PostModal from '../../Main/Forum/PostModal.vue';
import Comments from '../../Main/Forum/CommentModal.vue';

// Interface for forum posts
interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  avatar: string;
  date: string;
  category: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  images?: string[];
  commentList?: Comment[];
  isExpanded?: boolean; // Flag to track expanded content
  currentImageIndex?: number; // Track current image in gallery
}

// Interface for comments
interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  images?: string[];
}

// Demo forum posts data
const forumPosts = ref<ForumPost[]>([
  {
    id: 1,
    title: "Best practices for cattle nutrition during winter months",
    content: "I'm preparing for the upcoming winter season and looking for advice on supplementing nutrition for my cattle herd when grass is scarce. What supplements do you recommend? I've been considering various hay types and protein supplements but would appreciate input from more experienced ranchers about what has worked well for their herds in similar climate conditions.",
    author: "RanchHand42",
    avatar: "/src/assets/Bull.jpg",
    date: "May 15, 2025",
    category: "Cattle",
    likes: 24,
    comments: 12,
    isLiked: false,
    isExpanded: false,
    currentImageIndex: 0,
    images: ["/src/assets/Bull.jpg"],
    commentList: [
      {
        id: 1,
        author: "CattleExpert",
        avatar: "/src/assets/Bull.jpg",
        content: "I've had great success with alfalfa hay supplemented with a good mineral mix. Make sure they have access to fresh water that isn't frozen.",
        date: "May 16, 2025",
        likes: 5,
        isLiked: false
      },
      {
        id: 2,
        author: "RanchOwner",
        avatar: "/src/assets/Bull.jpg",
        content: "Don't forget about windbreaks! Proper shelter can reduce feed requirements by up to 15%.",
        date: "May 16, 2025",
        likes: 3,
        isLiked: true
      }
    ]
  },
  {
    id: 2,
    title: "Organic treatments for common poultry parasites",
    content: "I'm trying to maintain organic certification and need alternatives to conventional treatments for mites and lice in my chicken flock. Has anyone had success with diatomaceous earth or other natural remedies?",
    author: "OrganicFarmer",
    avatar: "/src/assets/Bull.jpg",
    date: "May 12, 2025",
    category: "Poultry",
    likes: 18,
    comments: 8,
    isLiked: true,
    isExpanded: false,
    currentImageIndex: 0,
    images: ["/src/assets/chicken-flock.jpg", "/src/assets/chicken-coop.jpg"],
    commentList: [
      {
        id: 1,
        author: "ChickenWhisperer",
        avatar: "/src/assets/Bull.jpg",
        content: "Diatomaceous earth works great! Apply it to their dust bathing areas and they'll do the work themselves.",
        date: "May 13, 2025",
        likes: 4,
        isLiked: false
      }
    ]
  },
  {
    id: 3,
    title: "Recommendations for small-scale sheep milking equipment",
    content: "I'm expanding into sheep dairy with a small flock of 15 ewes. Looking for recommendations on affordable milking equipment that would work for a beginner.",
    author: "NewShepherd",
    avatar: "/src/assets/Bull.jpg",
    date: "May 10, 2025",
    category: "Sheep",
    likes: 12,
    comments: 6,
    isLiked: false,
    isExpanded: false,
    currentImageIndex: 0,
    commentList: []
  },
  {
    id: 4,
    title: "Managing heat stress in pigs during summer",
    content: "With temperatures starting to rise, I'm concerned about heat stress in my pig herd. What cooling systems work best for you? I currently use shade structures and misters but looking for other effective methods.",
    author: "PigFarmer101",
    avatar: "/src/assets/Bull.jpg",
    date: "May 8, 2025",
    category: "Pigs",
    likes: 30,
    comments: 15,
    isLiked: false,
    isExpanded: false,
    currentImageIndex: 0,
    images: ["/src/assets/pig-shade.jpg"],
    commentList: []
  }
]);

// Image loading state tracking
const imageLoadingStates = ref<Record<string, boolean>>({});

// Filter states
const selectedCategory = ref('All');
const searchQuery = ref('');
const sortOption = ref('newest');

// Categories for filtering
const categories = [
  'All',
  'Cattle',
  'Sheep',
  'Goats',
  'Pigs',
  'Poultry',
  'Equine',
  'Other'
];

// Modal states
const isPostModalOpen = ref(false);
const activeCommentPostId = ref<number | null>(null);
const selectedPostId = ref<number | null>(null);

// Content length limit for preview (characters)
const contentPreviewLimit = 150;

// Store for tracking created object URLs for cleanup
const createdObjectURLs = new Set<string>();

// Computed property for filtered posts
const filteredPosts = computed(() => {
  let result = forumPosts.value;
  
  // Apply category filter
  if (selectedCategory.value !== 'All') {
    result = result.filter(post => post.category === selectedCategory.value);
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(post => 
      post.title.toLowerCase().includes(query) || 
      post.content.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query)
    );
  }
  
  // Apply sorting
  switch (sortOption.value) {
    case 'newest':
      // For demo purposes, we're assuming the array is already in date order
      break;
    case 'mostLiked':
      result = [...result].sort((a, b) => b.likes - a.likes);
      break;
    case 'mostComments':
      result = [...result].sort((a, b) => b.comments - a.comments);
      break;
  }
  
  return result;
});

// Image navigation functions
const nextImage = (postId: number) => {
  const post = forumPosts.value.find(p => p.id === postId);
  if (post && post.images && post.images.length > 1) {
    post.currentImageIndex = (post.currentImageIndex || 0 + 1) % post.images.length;
  }
};

const prevImage = (postId: number) => {
  const post = forumPosts.value.find(p => p.id === postId);
  if (post && post.images && post.images.length > 1) {
    const currentIndex = post.currentImageIndex || 0;
    post.currentImageIndex = currentIndex === 0 ? post.images.length - 1 : currentIndex - 1;
  }
};

const goToImage = (postId: number, index: number) => {
  const post = forumPosts.value.find(p => p.id === postId);
  if (post) {
    post.currentImageIndex = index;
  }
};

// Image loading handlers
const handleImageLoad = (imageId: string) => {
  imageLoadingStates.value[imageId] = false;
};

const handleImageStart = (imageId: string) => {
  imageLoadingStates.value[imageId] = true;
};

// Toggle like on a post
const toggleLike = (postId: number) => {
  const post = forumPosts.value.find(p => p.id === postId);
  if (post) {
    post.isLiked = !post.isLiked;
    post.likes += post.isLiked ? 1 : -1;
  }
};

// Toggle like on a comment
const toggleCommentLike = (postId: number, commentId: number) => {
  const post = forumPosts.value.find(p => p.id === postId);
  if (post && post.commentList) {
    const comment = post.commentList.find(c => c.id === commentId);
    if (comment) {
      comment.isLiked = !comment.isLiked;
      comment.likes += comment.isLiked ? 1 : -1;
    }
  }
};

// Open post modal
const openPostModal = () => {
  isPostModalOpen.value = true;
};

// Toggle comments section for a specific post
const toggleComments = (postId: number) => {
  // If clicking on the same post that's already open, close it
  if (activeCommentPostId.value === postId) {
    activeCommentPostId.value = null;
  } else {
    // Open comments for the clicked post
    activeCommentPostId.value = postId;
    selectedPostId.value = postId;
  }
};

// Toggle expanded content for "Read more"
const toggleExpandContent = (postId: number) => {
  const post = forumPosts.value.find(p => p.id === postId);
  if (post) {
    post.isExpanded = !post.isExpanded;
  }
};

// Improved function to create object URLs for uploaded image files
const createImageURL = (imageFile: File): string => {
  const url = URL.createObjectURL(imageFile);
  createdObjectURLs.add(url);
  return url;
};

// Improved function to process images from various formats
const processImages = (images: any): string[] => {
  if (!images) return [];
  
  // If it's already an array of strings (URLs), return as is
  if (Array.isArray(images) && images.every(img => typeof img === 'string')) {
    return images;
  }
  
  // If it's an array of File objects, convert to URLs
  if (Array.isArray(images) && images.every(img => img instanceof File)) {
    return images.map(img => createImageURL(img));
  }
  
  // If it's a single File object, convert to URL array
  if (images instanceof File) {
    return [createImageURL(images)];
  }
  
  // If it's a single string (URL), return as array
  if (typeof images === 'string') {
    return [images];
  }
  
  return [];
};

// Improved function to handle image loading errors
const handleImageError = (event: Event, postId: number, imageIndex: number) => {
  const img = event.target as HTMLImageElement;
  const imageId = `${postId}-${imageIndex}`;
  console.warn(`Failed to load image ${imageIndex} for post ${postId}:`, img.src);
  
  // Mark image as not loading
  imageLoadingStates.value[imageId] = false;
  
  // Remove the failed image from the post
  const post = forumPosts.value.find(p => p.id === postId);
  if (post && post.images) {
    post.images.splice(imageIndex, 1);
    if (post.images.length === 0) {
      delete post.images;
      delete post.currentImageIndex;
    } else if (post.currentImageIndex && post.currentImageIndex >= post.images.length) {
      post.currentImageIndex = 0;
    }
  }
};

// Handle new post submission from modal
const handleNewPost = (newPost: any) => {
  // Create a new post with default values
  const post: ForumPost = {
    id: forumPosts.value.length + 1,
    title: newPost.title,
    content: newPost.content,
    author: newPost.author,
    date: newPost.date,
    category: newPost.category,
    avatar: "/src/assets/Bull.jpg",
    likes: 0,
    comments: 0,
    isLiked: false,
    isExpanded: false,
    currentImageIndex: 0,
    commentList: []
  };
  
  // Process uploaded images with improved handling
  if (newPost.images && newPost.images.length > 0) {
    post.images = processImages(newPost.images);
  } else if (newPost.image) {
    // Backward compatibility for single image
    post.images = processImages(newPost.image);
  }
  
  forumPosts.value.unshift(post); // Add to the beginning of the array
  isPostModalOpen.value = false;
};

// Handle new comment submission with optional images
const handleNewComment = (postId: number, commentData: { content: string, images?: File[] }) => {
  const post = forumPosts.value.find(p => p.id === postId);
  if (!post) return;
  
  // Initialize commentList if it doesn't exist
  if (!post.commentList) {
    post.commentList = [];
  }
  
  // Create new comment
  const newComment: Comment = {
    id: post.commentList.length + 1,
    author: "RanchHand42", // Current user
    avatar: "/src/assets/Bull.jpg",
    content: commentData.content,
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    likes: 0,
    isLiked: false
  };
  
  // Process images if any with improved handling
  if (commentData.images && commentData.images.length > 0) {
    newComment.images = processImages(commentData.images);
  }
  
  post.commentList.push(newComment);
  post.comments += 1;
};

// Check if content needs "Read more" button
const needsReadMore = (content: string) => {
  return content.length > contentPreviewLimit;
};

// Get truncated content for preview
const getTruncatedContent = (content: string) => {
  if (content.length <= contentPreviewLimit) return content;
  return content.substring(0, contentPreviewLimit) + '...';
};

// Clean up object URLs when component is unmounted
const cleanupObjectURLs = () => {
  createdObjectURLs.forEach(url => {
    URL.revokeObjectURL(url);
  });
  createdObjectURLs.clear();
};

onMounted(() => {
  console.log('Forum main content mounted');
});

// Clean up URLs when component is unmounted
onBeforeUnmount(() => {
  cleanupObjectURLs();
});
</script>

<template>
  <main class="flex-grow w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
    <!-- Top controls bar -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div class="flex items-center gap-2 w-full md:w-auto">
        <div class="relative flex-grow">
          <input type="text" v-model="searchQuery" placeholder="Search forum posts..." 
            class="w-full md:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
          <div class="absolute left-3 top-2.5 text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <select v-model="selectedCategory" 
          class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option v-for="category in categories" :key="category" :value="category">
            {{ category }}
          </option>
        </select>
        
        <select v-model="sortOption" 
          class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
          <option value="newest">Newest</option>
          <option value="mostLiked">Most Liked</option>
          <option value="mostComments">Most Comments</option>
        </select>
      </div>
      
      <button @click="openPostModal" 
        class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Post
      </button>
    </div>
    
    <!-- Post listing -->
    <div v-if="filteredPosts.length > 0" class="space-y-6">
      <div v-for="post in filteredPosts" :key="post.id" 
        class="p-5 border border-gray-200 hover:border-green-300 rounded-lg transition-all hover:shadow-md overflow-hidden">
        <div class="flex items-start">
          <img :src="post.avatar" :alt="post.author" class="w-10 h-10 rounded-full mr-4" />
          <div class="flex-grow">
            <div class="flex items-center gap-2">
              <span class="font-semibold text-gray-800">{{ post.author }}</span>
              <span class="text-sm text-gray-500">{{ post.date }}</span>
              <span class="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">{{ post.category }}</span>
            </div>
            <h3 class="text-xl font-semibold mt-2 text-gray-900">{{ post.title }}</h3>
            
            <!-- Post content with functional "Read more" -->
            <p class="mt-2 text-gray-700">
              <template v-if="post.isExpanded">
                {{ post.content }}
                <button @click="toggleExpandContent(post.id)" 
                  class="text-green-600 hover:text-green-800 font-medium ml-1">
                  Show less
                </button>
              </template>
              <template v-else>
                {{ needsReadMore(post.content) ? getTruncatedContent(post.content) : post.content }}
                <button v-if="needsReadMore(post.content)" 
                  @click="toggleExpandContent(post.id)"
                  class="text-green-600 hover:text-green-800 font-medium ml-1">
                  Read more
                </button>
              </template>
            </p>
            
            <!-- Enhanced Images gallery with navigation -->
            <div v-if="post.images && post.images.length > 0" class="mt-4">
              <!-- Multiple images: Gallery with navigation -->
              <div v-if="post.images.length > 1" class="relative">
                <!-- Main image display -->
                <div class="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                  <div 
                    v-for="(image, index) in post.images" 
                    :key="`${post.id}-image-${index}`"
                    class="absolute inset-0 transition-opacity duration-300"
                    :class="{ 'opacity-100': index === (post.currentImageIndex || 0), 'opacity-0': index !== (post.currentImageIndex || 0) }"
                  >
                    <!-- Loading placeholder (only show when loading) -->
                    <div 
                      v-if="imageLoadingStates[`${post.id}-${index}`]"
                      class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
                    >
                      <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <img 
                      :src="image" 
                      :alt="`Post image ${index + 1}`" 
                      class="w-full h-full object-cover"
                      @load="handleImageLoad(`${post.id}-${index}`)"
                      @loadstart="handleImageStart(`${post.id}-${index}`)"
                      @error="(event) => handleImageError(event, post.id, index)"
                      loading="lazy"
                    />
                  </div>
                  
                  <!-- Navigation arrows -->
                  <button 
                    @click="prevImage(post.id)"
                    class="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    @click="nextImage(post.id)"
                    class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                  
                  <!-- Image counter -->
                  <div class="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                    {{ (post.currentImageIndex || 0) + 1 }} / {{ post.images.length }}
                  </div>
                </div>
                
                <!-- Thumbnail navigation -->
                <div class="flex gap-2 mt-2 overflow-x-auto pb-2">
                  <button
                    v-for="(image, index) in post.images"
                    :key="`${post.id}-thumb-${index}`"
                    @click="goToImage(post.id, index)"
                    class="flex-shrink-0 relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all"
                    :class="{ 
                      'border-green-500': index === (post.currentImageIndex || 0),
                      'border-gray-300 hover:border-gray-400': index !== (post.currentImageIndex || 0)
                    }"
                  >
                    <img 
                      :src="image" 
                      :alt="`Thumbnail ${index + 1}`" 
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                </div>
              </div>
              
              <!-- Single image: Simple display -->
              <div v-else class="relative rounded-lg overflow-hidden bg-gray-100 aspect-video">
                <!-- Loading placeholder (only show when loading) -->
                <div 
                  v-if="imageLoadingStates[`${post.id}-0`]"
                  class="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
                >
                  <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <img 
                  :src="post.images[0]" 
                  :alt="'Post image'" 
                  class="w-full h-full object-cover transition-transform hover:scale-105"
                  @load="handleImageLoad(`${post.id}-0`)"
                  @loadstart="handleImageStart(`${post.id}-0`)"
                  @error="(event) => handleImageError(event, post.id, 0)"
                  loading="lazy"
                />
              </div>
            </div>
            
            <div class="mt-4 flex items-center gap-6">
              <button @click="toggleLike(post.id)" class="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :fill="post.isLiked ? 'currentColor' : 'none'" 
                  :class="{ 'text-green-600': post.isLiked }" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{{ post.likes }} likes</span>
              </button>
              
              <button @click="toggleComments(post.id)" class="flex items-center gap-1 text-gray-600 hover:text-green-600 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{{ post.comments }} comments</span>
              </button>
            </div>
            
            <!-- Comments component -->
            <Comments 
              v-if="activeCommentPostId === post.id"
              :comments="post.commentList || []"
              :post-id="post.id"
              :current-user-avatar="'/src/assets/Bull.jpg'"
              @toggle-like="toggleCommentLike"
              @add-comment="commentData => handleNewComment(post.id, commentData)"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <h3 class="mt-4 text-xl font-medium text-gray-900">No posts found</h3>
      <p class="mt-2 text-gray-500">
        Try changing your search terms or filters, or create a new post to start the conversation.
      </p>
      <button @click="openPostModal" class="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
        Create New Post
      </button>
    </div>
    
    <!-- Post Modal -->
    <PostModal 
      v-if="isPostModalOpen" 
      @close="isPostModalOpen = false"
      @submit="handleNewPost" 
      :categories="categories.filter(c => c !== 'All')" 
      username="RanchHand42"
    />
  </main>
</template>