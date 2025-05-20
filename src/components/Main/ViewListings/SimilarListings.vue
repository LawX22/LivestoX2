<script lang="ts">
import { defineComponent } from 'vue';

type Listing = {
    id: number | string;
    imageUrl: string;
    title: string;
    certified?: boolean;
    isFavorite?: boolean;
    price: number;
    negotiable?: boolean;
    location: string;
    breed: string;
    age: number | string;
    ageUnit: string;
};

export default defineComponent({
    name: 'SimilarListings',
    props: {
        listings: {
            type: Array as () => Listing[],
            required: true,
            default: () => []
        }
    },
    emits: ['viewListing', 'toggleFavorite']
});
</script>

<template>
    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-6">
            <h3 class="text-xl font-bold text-white flex items-center">
                <i class="pi pi-objects-column mr-2"></i> Similar Listings You Might Like
            </h3>
        </div>
        <div class="p-8">
            <div v-if="listings.length === 0" class="text-center py-12">
                <i class="pi pi-search text-6xl text-gray-300 mb-4"></i>
                <p class="text-gray-500 text-lg">No similar listings found</p>
            </div>
            <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div v-for="listing in listings" :key="listing.id"
                    class="bg-gradient-to-br from-white to-emerald-50 rounded-xl overflow-hidden shadow-sm border border-emerald-100 cursor-pointer transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300"
                    @click="$emit('viewListing', listing.id)">
                    <div class="relative aspect-video">
                        <img :src="listing.imageUrl" :alt="listing.title" class="w-full h-full object-cover" />
                        <div v-if="listing.certified"
                            class="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            <i class="pi pi-verified mr-1"></i> Certified
                        </div>
                        <button
                            class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-rose-500 transition-all"
                            @click.stop="$emit('toggleFavorite', listing)">
                            <i :class="listing.isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'"></i>
                        </button>
                    </div>
                    <div class="p-4">
                        <h4 class="font-semibold text-gray-800 mb-2 line-clamp-2">{{ listing.title }}</h4>
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-xl font-bold text-emerald-600">₱{{ listing.price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) }}</span>
                            <span v-if="listing.negotiable"
                                class="text-xs text-emerald-600 bg-emerald-100 px-2 py-1 rounded-full">Negotiable</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-500 mb-3">
                            <i class="pi pi-map-marker mr-1"></i>
                            <span class="truncate">{{ listing.location }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                            <span class="text-gray-600">{{ listing.breed }}</span>
                            <span class="text-gray-600">{{ listing.age }} {{ listing.ageUnit }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
