<script setup lang="ts">
import { ref, defineProps, defineEmits, onMounted } from 'vue';

// Define props
const props = defineProps<{
  categories: string[],
  username: string // Username from parent
}>();

// Define emits
const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', post: {
    title: string,
    content: string,
    author: string,
    date: string,
    category: string,
    images: File[]
  }): void
}>();

// Post form data
const title = ref('');
const content = ref('');
const category = ref(props.categories[0] || 'Cattle');
const images = ref<File[]>([]);
const imagePreviews = ref<string[]>([]);

// Validation state
const isSubmitting = ref(false);
const errors = ref({
  title: '',
  content: '',
  category: '',
  images: ''
});

// Image drag state
const isDragging = ref(false);

// Autofocus on title when modal opens
onMounted(() => {
  const titleInput = document.getElementById('post-title');
  if (titleInput) {
    titleInput.focus();
  }
});

// Reset form
const resetForm = () => {
  title.value = '';
  content.value = '';
  category.value = props.categories[0] || 'Cattle';
  images.value = [];
  imagePreviews.value = [];
  errors.value = {
    title: '',
    content: '',
    category: '',
    images: ''
  };
  isSubmitting.value = false;
};

// Validate form
const validateForm = (): boolean => {
  let isValid = true;
  errors.value = {
    title: '',
    content: '',
    category: '',
    images: ''
  };

  if (!title.value.trim()) {
    errors.value.title = 'Title is required';
    isValid = false;
  } else if (title.value.length < 5) {
    errors.value.title = 'Title must be at least 5 characters';
    isValid = false;
  }

  if (!content.value.trim()) {
    errors.value.content = 'Content is required';
    isValid = false;
  } else if (content.value.length < 10) {
    errors.value.content = 'Content must be at least 10 characters';
    isValid = false;
  }

  if (!category.value) {
    errors.value.category = 'Please select a category';
    isValid = false;
  }

  // Images validation - optional but with size and count check
  if (images.value.length > 0) {
    for (const image of images.value) {
      if (image.size > 5 * 1024 * 1024) { // 5MB limit per image
        errors.value.images = 'Each image should be less than 5MB';
        isValid = false;
        break;
      }
    }
    
    if (images.value.length > 10) {
      errors.value.images = 'Maximum 10 images allowed';
      isValid = false;
    }
  }

  return isValid;
};

// Handle form submission
const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  // Format the current date
  const today = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const formattedDate = `${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

  // Emit the new post data with images
  emit('submit', {
    title: title.value,
    content: content.value,
    author: props.username,
    date: formattedDate,
    category: category.value,
    images: images.value
  });

  // Reset form
  resetForm();
};

// Handle image selection
const handleImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    handleImageFiles(Array.from(input.files));
  }
};

// Handle file drop
const handleDrop = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
  
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    handleImageFiles(Array.from(event.dataTransfer.files));
  }
};

// Process image files
const handleImageFiles = (files: File[]) => {
  const newImages: File[] = [];
  const newPreviews: string[] = [];
  
  // Filter and validate files
  for (const file of files) {
    // Check if we've reached the maximum (10 images)
    if (images.value.length + newImages.length >= 10) {
      errors.value.images = 'Maximum 10 images allowed';
      break;
    }
    
    // Check if file is an image
    if (!file.type.match('image.*')) {
      errors.value.images = 'Please select only image files';
      continue;
    }
    
    // Check size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      errors.value.images = 'Each image should be less than 5MB';
      continue;
    }
    
    newImages.push(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      newPreviews.push(e.target?.result as string);
      if (newPreviews.length === newImages.length) {
        imagePreviews.value = [...imagePreviews.value, ...newPreviews];
      }
    };
    reader.readAsDataURL(file);
  }
  
  images.value = [...images.value, ...newImages];
};

// Remove selected image
const removeImage = (index: number) => {
  images.value.splice(index, 1);
  imagePreviews.value.splice(index, 1);
  errors.value.images = '';
};

// Drag events
const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = true;
};

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault();
  isDragging.value = false;
};

// Close modal
const closeModal = () => {
  resetForm();
  emit('close');
};

// Handle escape key to close modal
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal();
  }
};
</script>

<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" @keydown="handleKeyDown" tabindex="-1">
    <!-- Backdrop with improved transition -->
    <div class="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Modal container -->
    <div class="flex min-h-full items-center justify-center p-4">
      <div class="relative transform overflow-hidden rounded-lg bg-white shadow-xl transition-all w-full max-w-2xl">
        <!-- Header with improved design -->
        <div class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-bold text-white">Create New Post</h3>
            <button 
              @click="closeModal" 
              class="text-white hover:text-green-200 transition-colors focus:outline-none"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <!-- User info bar -->
        <div class="bg-green-50 px-6 py-3 border-b border-gray-200">
          <div class="flex items-center">
            <div class="bg-green-600 rounded-full h-9 w-9 flex items-center justify-center text-white font-medium shadow-sm">
              {{ props.username.charAt(0).toUpperCase() }}
            </div>
            <span class="ml-3 text-sm text-gray-600">Posting as <span class="font-medium text-gray-900">{{ props.username }}</span></span>
          </div>
        </div>

        <!-- Form content -->
        <form @submit.prevent="handleSubmit" class="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          <!-- Title field -->
          <div>
            <label for="post-title" class="block text-sm font-medium text-gray-700 mb-1.5">Post Title</label>
            <input
              type="text"
              id="post-title"
              v-model="title"
              placeholder="Enter an engaging title"
              class="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              :class="{'border-red-500 ring-1 ring-red-500': errors.title}"
            />
            <p v-if="errors.title" class="mt-1.5 text-sm text-red-600">{{ errors.title }}</p>
          </div>

          <!-- Category field -->
          <div>
            <label for="post-category" class="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <div class="relative">
              <select
                id="post-category"
                v-model="category"
                class="w-full pl-3 pr-10 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors appearance-none bg-white"
                :class="{'border-red-500 ring-1 ring-red-500': errors.category}"
              >
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p v-if="errors.category" class="mt-1.5 text-sm text-red-600">{{ errors.category }}</p>
          </div>

          <!-- Content field -->
          <div>
            <label for="post-content" class="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
            <textarea
              id="post-content"
              v-model="content"
              rows="6"
              placeholder="Share your knowledge, experiences, or questions..."
              class="w-full px-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
              :class="{'border-red-500 ring-1 ring-red-500': errors.content}"
            ></textarea>
            <p v-if="errors.content" class="mt-1.5 text-sm text-red-600">{{ errors.content }}</p>
          </div>

          <!-- Image upload field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1.5">Add Images (optional, max 10)</label>
            <div 
              class="relative border-2 border-dashed rounded-lg p-4"
              :class="[isDragging ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-400', {'border-red-500': errors.images}]"
              @dragover="handleDragOver"
              @dragleave="handleDragLeave"
              @drop="handleDrop"
            >
              <div v-if="imagePreviews.length === 0" class="text-center py-6">
                <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
                <div class="flex justify-center mt-4">
                  <input 
                    id="file-upload" 
                    type="file" 
                    accept="image/*" 
                    class="sr-only" 
                    @change="handleImageChange"
                    multiple
                  />
                  <label 
                    for="file-upload" 
                    class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 cursor-pointer"
                  >
                    Select Images
                  </label>
                </div>
                <p class="mt-2 text-xs text-gray-500">
                  PNG, JPG, GIF up to 5MB each
                </p>
                <p class="text-sm text-gray-500 mt-2">
                  Or drag and drop your images here
                </p>
              </div>

              <div v-else class="space-y-4">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div v-for="(preview, index) in imagePreviews" :key="index" class="relative group">
                    <img 
                      :src="preview" 
                      :alt="`Image preview ${index + 1}`" 
                      class="rounded-md h-32 w-full object-cover"
                    />
                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <button 
                        type="button" 
                        @click="removeImage(index)" 
                        class="bg-white rounded-full p-1 shadow-md hover:bg-gray-100 focus:outline-none"
                        title="Remove image"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="flex justify-center mt-4">
                  <input 
                    id="file-upload-more" 
                    type="file" 
                    accept="image/*" 
                    class="sr-only" 
                    @change="handleImageChange"
                    multiple
                  />
                  <label 
                    for="file-upload-more" 
                    class="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-green-500 cursor-pointer"
                  >
                    Add More Images
                  </label>
                </div>
              </div>
            </div>
            <p v-if="errors.images" class="mt-1.5 text-sm text-red-600">{{ errors.images }}</p>
            <p v-if="imagePreviews.length > 0" class="mt-1.5 text-sm text-gray-500">
              {{ imagePreviews.length }} image(s) selected
            </p>
          </div>

          <!-- Action buttons -->
          <div class="flex justify-end gap-3 pt-2">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-5 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors shadow-sm font-medium"
              :class="{'opacity-70 cursor-not-allowed': isSubmitting}"
            >
              <template v-if="isSubmitting">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Posting...
              </template>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-1 -ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clip-rule="evenodd" />
                </svg>
                Publish Post
              </template>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>