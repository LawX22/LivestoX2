<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';

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

const props = defineProps<{
    comments: Comment[];
    postId: number;
    currentUserAvatar: string;
}>();

const emit = defineEmits(['toggle-like', 'add-comment']);

const contentPreviewLimit = 150;

const commentText = ref('');
const commentImages = ref<File[]>([]);
const previewImages = ref<string[]>([]);
const expandedComments = ref<Set<number>>(new Set());

const toggleLike = (commentId: number) => {
    emit('toggle-like', props.postId, commentId);
};

const handleImageUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (!target.files) return;

    const files = Array.from(target.files);
    files.forEach((file) => {
        // Check file size (optional - limit to 5MB per image)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select only image files');
            return;
        }

        commentImages.value.push(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                previewImages.value.push(e.target.result as string);
            }
        };
        reader.readAsDataURL(file);
    });

    // Clear the input so the same file can be selected again if needed
    target.value = '';
};

const removeImage = (index: number) => {
    commentImages.value.splice(index, 1);
    previewImages.value.splice(index, 1);
};

const submitComment = () => {
    if (!commentText.value.trim() && commentImages.value.length === 0) return;

    // Pass both the text content and the actual file objects
    emit('add-comment', {
        postId: props.postId,
        content: commentText.value,
        images: commentImages.value.length > 0 ? commentImages.value : undefined,
    });

    // Clear form after submission
    commentText.value = '';
    commentImages.value = [];
    previewImages.value = [];
};

const toggleExpandComment = (commentId: number) => {
    if (expandedComments.value.has(commentId)) {
        expandedComments.value.delete(commentId);
    } else {
        expandedComments.value.add(commentId);
    }
};

const needsReadMore = (content: string) => content.length > contentPreviewLimit;

const getTruncatedContent = (content: string) =>
    content.length <= contentPreviewLimit ? content : content.substring(0, contentPreviewLimit) + '...';

const isCommentExpanded = (commentId: number) => expandedComments.value.has(commentId);

// Helper function to format file size for display (optional)
const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
</script>

<template>
    <div class="mt-6 border-t border-gray-200 pt-4">
        <h4 class="font-medium text-gray-900 mb-4">Comments</h4>

        <div v-if="comments && comments.length > 0" class="space-y-4">
            <div v-for="comment in comments" :key="`comment-${comment.id}`"
                class="flex items-start gap-3 pb-3 border-b border-gray-100">
                <img :src="comment.avatar" :alt="comment.author" class="w-8 h-8 rounded-full object-cover"
                    loading="lazy" />
                <div class="flex-grow">
                    <div class="flex items-center gap-2">
                        <span class="font-medium text-gray-800">{{ comment.author }}</span>
                        <span class="text-xs text-gray-500">{{ comment.date }}</span>
                    </div>

                    <p class="mt-1 text-gray-700">
                        <template v-if="isCommentExpanded(comment.id)">
                            {{ comment.content }}
                            <button v-if="needsReadMore(comment.content)" @click="toggleExpandComment(comment.id)"
                                class="text-green-600 hover:text-green-800 font-medium ml-1 underline">
                                Show less
                            </button>
                        </template>
                        <template v-else>
                            {{ needsReadMore(comment.content) ? getTruncatedContent(comment.content) : comment.content
                            }}
                            <button v-if="needsReadMore(comment.content)" @click="toggleExpandComment(comment.id)"
                                class="text-green-600 hover:text-green-800 font-medium ml-1 underline">
                                Show more
                            </button>
                        </template>
                    </p>

                    <!-- Comment images display -->
                    <div v-if="comment.images && comment.images.length > 0" class="mt-2">
                        <div class="flex flex-wrap gap-2">
                            <div v-for="(image, index) in comment.images" :key="`comment-${comment.id}-img-${index}`"
                                class="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                                <img :src="image" :alt="`Comment image ${index + 1}`" class="w-full h-full object-cover"
                                    loading="lazy" />
                            </div>
                        </div>
                    </div>

                    <button @click="toggleLike(comment.id)"
                        class="mt-2 flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 transition-all"
                            :fill="comment.isLiked ? 'currentColor' : 'none'"
                            :class="{ 'text-green-600': comment.isLiked, 'scale-110': comment.isLiked }"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{{ comment.likes }}</span>
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2 text-gray-300" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>No comments yet. Be the first to comment!</p>
        </div>

        <!-- Comment form -->
        <div class="mt-6 bg-gray-50 rounded-lg p-4">
            <div class="flex gap-3">
                <img :src="currentUserAvatar" alt="Current user"
                    class="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div class="flex-grow">
                    <textarea placeholder="Share your thoughts..."
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows="3" v-model="commentText"></textarea>

                    <!-- Image preview area -->
                    <div v-if="previewImages.length > 0" class="mt-3">
                        <div class="flex flex-wrap gap-2">
                            <div v-for="(preview, index) in previewImages" :key="`preview-${index}`"
                                class="relative w-20 h-20 rounded-lg overflow-hidden group border border-gray-200">
                                <img :src="preview" class="w-full h-full object-cover" alt="Preview" />
                                <button @click="removeImage(index)"
                                    class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors shadow-md"
                                    type="button" title="Remove image">
                                    ×
                                </button>
                                <div
                                    class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {{ formatFileSize(commentImages[index]?.size || 0) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-3 flex justify-between items-center">
                        <label
                            class="cursor-pointer text-green-600 hover:text-green-800 flex items-center gap-2 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span class="text-sm font-medium">Add Images</span>
                            <input type="file" accept="image/*" multiple @change="handleImageUpload" class="hidden" />
                        </label>

                        <button @click="submitComment" type="button"
                            :disabled="!commentText.trim() && commentImages.length === 0"
                            class="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors">
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>