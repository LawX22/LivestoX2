<template>
    <div class="livestock-details-page bg-gray-50 min-h-screen">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" fill="var(--surface-ground)"
                animationDuration=".2s" aria-label="Loading" />
        </div>

        <div v-else class="container mx-auto px-4 py-6">
            <!-- Back button with improved styling -->
            <Button icon="pi pi-arrow-left" label="Back to Listings"
                class="p-button-text mb-6 hover:bg-green-50 transition-colors duration-200 font-medium"
                @click="goBack" />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Left column: Images and videos -->
                <div class="col-span-1 lg:col-span-2">
                    <div class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <!-- Main image and badges with improved styling -->
                        <div class="relative">
                            <img :src="livestock.imageUrl" :alt="livestock.title"
                                class="w-full h-72 md:h-96 object-cover" />
                            <span v-if="livestock.auction"
                                class="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm flex items-center">
                                <i class="pi pi-clock mr-1.5"></i> Auction
                            </span>
                            <span v-if="livestock.certified"
                                class="absolute top-4 left-4 bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-semibold shadow-sm flex items-center">
                                <i class="pi pi-check-circle mr-1.5"></i> Certified
                            </span>
                        </div>

                        <!-- Thumbnail gallery with improved styling -->
                        <div class="p-6">
                            <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                <i class="pi pi-images mr-2 text-green-600"></i> Photo Gallery
                            </h4>
                            <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                                <div v-for="(image, index) in additionalImages" :key="index"
                                    class="flex-shrink-0 cursor-pointer border-2 rounded-lg transition-all duration-200 hover:shadow-md"
                                    :class="selectedImage === index ? 'border-green-500 shadow-md' : 'border-transparent'"
                                    @click="selectImage(index)">
                                    <img :src="image" class="w-20 h-20 object-cover rounded-lg" />
                                </div>
                            </div>

                            <!-- Video preview with improved styling -->
                            <div v-if="livestock.videoUrl" class="mt-6">
                                <h4 class="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                    <i class="pi pi-video mr-2 text-green-600"></i> Video Preview
                                </h4>
                                <div class="relative bg-black rounded-lg overflow-hidden shadow-md group">
                                    <img :src="livestock.videoThumbnail"
                                        class="w-full h-48 object-cover opacity-80 rounded-lg group-hover:opacity-60 transition-opacity duration-300" />
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <Button icon="pi pi-play"
                                            class="p-button-rounded p-button-lg shadow-lg group-hover:scale-110 transition-transform duration-300"
                                            @click="playVideo" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right column: Livestock details and actions -->
                <div class="col-span-1">
                    <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6 border border-gray-100">
                        <div class="flex justify-between items-start">
                            <h1 class="text-2xl font-bold text-gray-800">{{ livestock.title }}</h1>
                            <Button icon="pi pi-heart" :class="[
                                'p-button-rounded p-button-lg shadow-sm transition-all duration-200',
                                livestock.isFavorite ? 'p-button-danger' : 'p-button-outlined p-button-secondary hover:bg-red-50'
                            ]" @click="toggleFavorite(livestock)" aria-label="Save Listing"
                                v-tooltip.top="livestock.isFavorite ? 'Remove from Favorites' : 'Save Listing'" />
                        </div>

                        <div class="flex items-center text-sm text-gray-600 mt-2 mb-4">
                            <i class="pi pi-map-marker mr-1 text-green-600"></i>
                            <span>{{ livestock.location }}</span>
                            <div class="mx-2 h-1 w-1 rounded-full bg-gray-400"></div>
                            <span>Listed {{ formatDate(livestock.listedDate) }}</span>
                        </div>

                        <div class="flex items-center">
                            <div class="text-3xl font-bold text-green-700">${{ formatPrice(livestock.price) }}</div>
                            <span v-if="livestock.negotiable"
                                class="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                Negotiable
                            </span>
                            <Badge v-if="livestock.availableImmediate" value="Available Now" severity="success"
                                class="ml-auto shadow-sm"></Badge>
                        </div>

                        <Divider class="my-4" />

                        <!-- Primary actions with enhanced design -->
                        <div class="flex gap-4 mb-6">
                            <Button label="Buy Now" icon="pi pi-shopping-cart"
                                class="p-button-success flex-1 p-button-raised shadow-md hover:shadow-lg transition-all duration-300 font-semibold text-base py-3 px-4 rounded-lg"
                                iconClass="mr-2" @click="buyNow" />
                            <Button label="Contact Seller" icon="pi pi-comments"
                                class="p-button-outlined flex-1 hover:bg-green-50 transition-all duration-300 font-semibold text-base py-3 px-4 rounded-lg border-2 border-green-500 text-green-600"
                                iconClass="mr-2" @click="contactSeller" />
                        </div>

                        <!-- Quantity selection with improved visual hierarchy and feedback -->
                        <div v-if="livestock.quantity > 1"
                            class="mb-5 bg-gray-50 p-5 rounded-xl border border-gray-200 shadow-sm">
                            <label class="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <i class="pi pi-th-large mr-2 text-green-600"></i> Select Quantity
                            </label>
                            <div class="flex ">
                                <Button icon="pi pi-minus"
                                    class="p-button-rounded p-button-outlined p-button-sm hover:bg-gray-100"
                                    @click="decrementQuantity" :disabled="selectedQuantity <= 1" />
                                <InputNumber v-model="selectedQuantity" :min="1" :max="livestock.quantity"
                                    class="w-20 px-2" :showButtons="false" />
                                <Button icon="pi pi-plus"
                                    class="p-button-rounded p-button-outlined p-button-sm hover:bg-gray-100"
                                    @click="incrementQuantity" :disabled="selectedQuantity >= livestock.quantity" />
                            </div>
                            <div class="mt-2 text-xs text-gray-500">
                                Select between 1 and {{ livestock.quantity }} items
                            </div>
                        </div>
                    </div>

                    <div
                        class="bg-white rounded-xl shadow-md overflow-hidden mb-6 p-6 border border-gray-200 hover:shadow-lg transition-all duration-300">
                        <h2 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <i class="pi pi-user mr-2 text-green-600"></i> Seller Information
                        </h2>

                        <div class="flex items-center mb-5">
                            <Avatar :image="seller.avatarUrl || '/src/assets/vue.svg'" shape="circle"
                                class="mr-4 shadow-sm border-2 border-white" style="width: 56px; height: 56px;" />
                            <div>
                                <div class="font-medium text-base text-gray-800">{{ seller.name }}</div>
                                <div class="flex items-center text-sm mt-1">
                                    <Rating v-model="seller.rating" :cancel="false" readonly :stars="5" class="mr-2" />
                                    <span class="text-gray-600">{{ seller.rating }} <span class="text-gray-400">({{
                                        seller.reviewCount }} reviews)</span></span>
                                </div>
                            </div>
                        </div>

                        <!-- Buttons in a row with improved spacing and styling -->
                        <div class="flex gap-4 mb-4 justify-center">
                            <Button icon="pi pi-user" v-tooltip.top="'View Profile'"
                                class="p-button-rounded p-button-outlined p-button-sm text-green-600 hover:bg-green-50 transition-colors duration-200"
                                @click="viewSellerProfile" />

                            <Button v-if="seller.showPhoneNumber" icon="pi pi-envelope" v-tooltip.top="'Message Seller'"
                                class="p-button-rounded p-button-outlined p-button-sm text-blue-600 hover:bg-blue-50 transition-colors duration-200"
                                @click="callSeller" />
                        </div>

                        <!-- Report listing with improved styling -->
                        <div class="text-center mt-3 border-t border-gray-100 pt-3">
                            <a href="#" @click.prevent="reportListing"
                                class="text-xs inline-flex items-center text-gray-400 hover:text-red-500 transition-colors duration-200">
                                <i class="pi pi-flag mr-1 text-xs"></i>
                                Report Listing
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Details tabs with improved styling -->
            <div class="mt-8">
                <TabView class="livestock-tabs">
                    <TabPanel header="Description">
                        <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                            <p class="text-gray-700 whitespace-pre-line leading-relaxed">{{ livestock.description }}</p>
                        </div>
                    </TabPanel>

                    <TabPanel header="Livestock Details">
                        <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div v-for="(detail, index) in livestockDetails" :key="index"
                                    class="flex flex-col p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                    <span class="text-sm text-gray-600">{{ detail.label }}</span>
                                    <span class="font-medium text-gray-800 mt-1">{{ detail.value }}</span>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel header="Location & Delivery">
                        <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                        <i class="pi pi-map-marker mr-2 text-green-600"></i> Location
                                    </h3>
                                    <p class="text-gray-700 mb-4 ml-6">
                                        {{ livestock.location }}
                                    </p>

                                    <!-- Map placeholder with improved styling -->
                                    <div
                                        class="bg-gray-100 rounded-xl h-56 flex items-center justify-center overflow-hidden shadow-sm border border-gray-200">
                                        <img src="/src/assets/vue.svg" alt="Location Map" class="rounded-xl" />
                                    </div>
                                </div>

                                <div>
                                    <h3 class="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                        <i class="pi pi-truck mr-2 text-green-600"></i> Delivery Options
                                    </h3>
                                    <div
                                        class="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                        <div class="flex items-center">
                                            <div>
                                                <div class="font-medium">{{ livestock.deliveryOption }}</div>
                                                <div class="text-sm text-gray-600 mt-1">{{ livestock.deliveryDetails }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 class="text-lg font-medium text-gray-800 mb-3 flex items-center">
                                        <i class="pi pi-info-circle mr-2 text-green-600"></i> Restrictions
                                    </h3>
                                    <div
                                        class="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-200">
                                        <div class="flex items-center">
                                            <div class="text-gray-700">{{ livestock.restrictions }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel header="Reviews">
                        <div class="p-6 bg-white rounded-xl shadow-md border border-gray-100">
                            <div v-if="reviews.length > 0">
                                <div v-for="(review, index) in reviews" :key="index"
                                    class="mb-6 pb-6 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition-colors duration-200">
                                    <div class="flex items-start">
                                        <Avatar :image="review.avatarUrl || '/src/assets/vue.svg'" shape="circle"
                                            class="mr-4 shadow-sm" style="width: 45px; height: 45px;" />
                                        <div class="flex-grow">
                                            <div class="flex justify-between items-center">
                                                <div class="font-medium">{{ review.username }}</div>
                                                <div class="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    {{ formatDate(review.date) }}
                                                </div>
                                            </div>
                                            <Rating :modelValue="review.rating" readonly :cancel="false" :stars="5"
                                                class="my-2" />
                                            <p class="mt-2 text-gray-700">{{ review.comment }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center py-10">
                                <i class="pi pi-comments text-5xl text-gray-300 mb-4"></i>
                                <p class="text-gray-500">No reviews yet for this listing</p>
                                <Button label="Be the first to review" icon="pi pi-pencil"
                                    class="p-button-text mt-4 hover:bg-green-50 transition-colors duration-200" />
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>

            <!-- Similar listings with improved styling -->
            <div class="mt-10">
                <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <i class="pi pi-clone mr-2 text-green-600"></i> Similar Listings
                </h2>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="listing in similarListings" :key="listing.id"
                        class="livestock-card bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col">
                        <div class="relative">
                            <!-- Image with gradient overlay -->
                            <div class="relative h-56 overflow-hidden">
                                <img :src="listing.imageUrl" :alt="listing.title"
                                    class="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />

                                <!-- Price badge -->
                                <div
                                    class="absolute bottom-3 left-3 bg-white/90 text-green-600 px-3 py-1.5 rounded-lg text-base font-bold shadow-md">
                                    ${{ formatPrice(listing.price) }}
                                </div>

                                <!-- Available now badge -->
                                <div v-if="listing.availableImmediate"
                                    class="absolute bottom-3 right-3 bg-green-100 text-green-800 px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center shadow-sm">
                                    <i class="pi pi-check-circle mr-1.5"></i> Available Now
                                </div>
                            </div>

                            <!-- Top badges -->
                            <div class="absolute top-3 left-3 right-3 flex justify-between">
                                <div class="flex gap-1.5">
                                    <span v-if="listing.certified"
                                        class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
                                        <i class="pi pi-check-circle mr-1.5"></i> Certified
                                    </span>
                                    <span v-if="listing.auction"
                                        class="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm">
                                        <i class="pi pi-clock mr-1.5"></i> Auction
                                    </span>
                                </div>

                                <!-- Favorite button -->
                                <button
                                    class="w-9 h-9 flex items-center justify-center rounded-full shadow-md transition-all duration-200"
                                    :class="[listing.isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-500 hover:bg-red-50 hover:text-red-500']"
                                    @click="toggleFavorite(listing)" aria-label="Toggle favorite">
                                    <i class="pi pi-heart-fill text-sm"></i>
                                </button>
                            </div>
                        </div>

                        <div class="p-5 flex-1 flex flex-col">
                            <!-- Title -->
                            <h3 class="text-lg font-bold text-gray-800 hover:text-green-600 transition-colors cursor-pointer line-clamp-2 mb-2"
                                @click="viewListing(listing.id)">
                                {{ listing.title }}
                            </h3>

                            <!-- Location and date -->
                            <div class="flex items-center text-xs text-gray-500 mb-4">
                                <i class="pi pi-map-marker mr-1.5 text-green-600"></i>
                                <span>{{ listing.location }}</span>
                                <div class="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
                                <span>{{ formatDate(listing.listedDate) }}</span>
                            </div>

                            <!-- Description -->
                            <div class="bg-gray-50 p-3 rounded-lg mb-4 border border-gray-100">
                                <p class="text-gray-700 text-xs line-clamp-2">{{ listing.description }}</p>
                            </div>

                            <!-- Key specs with improved styling -->
                            <div class="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-700 mb-4">
                                <div class="flex items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                                    <i class="pi pi-tag text-green-600 mr-1.5"></i>
                                    <span>{{ listing.category }}</span>
                                </div>
                                <div class="flex items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                                    <i class="pi pi-calendar text-green-600 mr-1.5"></i>
                                    <span>{{ listing.age }} {{ listing.ageUnit }}</span>
                                </div>
                                <div class="flex items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                                    <i class="pi pi-heart text-green-600 mr-1.5"></i>
                                    <span>{{ listing.healthStatus }}</span>
                                </div>
                                <div v-if="listing.quantity > 1"
                                    class="flex items-center bg-gray-100 px-2.5 py-1.5 rounded-full">
                                    <i class="pi pi-th-large text-green-600 mr-1.5"></i>
                                    <span>{{ listing.quantity }} Left </span>
                                </div>
                            </div>

                            <!-- Spacer to push button to bottom -->
                            <div class="flex-grow"></div>

                            <!-- Button with improved styling -->
                            <Button label="View Details" icon="pi pi-arrow-right" iconPos="right"
                                class="p-button-rounded p-button-success w-full font-medium text-sm mt-3 shadow-sm hover:shadow-md transition-shadow duration-200"
                                @click="viewListing(listing.id)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Dialog for contacting seller with improved styling -->
        <Dialog v-model:visible="contactDialogVisible" header="Contact Seller" :style="{ width: '450px' }"
            class="contact-dialog">
            <div class="p-5">
                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Your Message</label>
                    <textarea v-model="contactMessage" placeholder="Write your message to the seller"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                        rows="4"></textarea>
                </div>
                <Button label="Send Message" icon="pi pi-send"
                    class="w-full p-button-success shadow-md hover:shadow-lg transition-shadow duration-200"
                    @click="sendMessage" />
            </div>
        </Dialog>

        <!-- Dialog for video preview with improved styling -->
        <Dialog v-model:visible="videoDialogVisible" header="Video Preview" :style="{ width: '90%', maxWidth: '900px' }"
            class="video-dialog">
            <div class="p-4">
                <div class="relative bg-black w-full rounded-lg overflow-hidden shadow-lg" style="padding-top: 56.25%">
                    <img src="/src/assets/Bull.jpg" class="absolute inset-0 w-full h-full object-cover" />
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i
                            class="pi pi-play text-6xl text-white opacity-70 hover:opacity-100 transition-opacity duration-200 cursor-pointer"></i>
                    </div>
                </div>
                <div class="mt-4 text-center text-gray-700">
                    <p class="text-sm">{{ livestock.title }} - Video Preview</p>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Badge from 'primevue/badge';
import ProgressSpinner from 'primevue/progressspinner';
import Divider from 'primevue/divider';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Rating from 'primevue/rating';
import Avatar from 'primevue/avatar';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Tooltip from 'primevue/tooltip';

interface Livestock {
    id: number;
    title: string;
    description: string;
    category: string;
    breed: string;
    age: number;
    ageUnit: string;
    gender: string;
    weight: number;
    weightUnit: string;
    price: number;
    negotiable: boolean;
    quantity: number;
    location: string;
    healthStatus: string;
    feedingType: string;
    imageUrl: string;
    videoUrl?: string;
    videoThumbnail?: string;
    certified: boolean;
    auction: boolean;
    availableImmediate: boolean;
    isFavorite: boolean;
    listedDate: Date;
    deliveryOption: string;
    deliveryDetails: string;
    restrictions: string;
    sellerId: number;
}

interface Seller {
    id: number;
    name: string;
    avatarUrl?: string;
    rating: number;
    reviewCount: number;
    showPhoneNumber: boolean;
    phoneNumber?: string;
}

interface Review {
    id: number;
    username: string;
    avatarUrl?: string;
    rating: number;
    comment: string;
    date: Date;
}

export default defineComponent({
    name: 'LivestockDetailsPage',
    directives: {
        tooltip: Tooltip
    },
    components: {
        Card,
        Button,
        Badge,
        ProgressSpinner,
        Divider,
        TabView,
        TabPanel,
        Rating,
        Avatar,
        Dialog,
        InputText,
        InputNumber
    },
    props: {
        id: {
            type: Number,
            required: true
        }
    },
    setup(props) {
        const loading = ref(true);
        const livestock = ref<Livestock>({} as Livestock);
        const seller = ref<Seller>({} as Seller);
        const reviews = ref<Review[]>([]);
        const similarListings = ref<Livestock[]>([]);
        const selectedImage = ref(0);
        const additionalImages = ref<string[]>([]);
        const selectedQuantity = ref(1);
        const contactDialogVisible = ref(false);
        const videoDialogVisible = ref(false);
        const contactMessage = ref('');

        // Compute livestock details for display
        const livestockDetails = computed(() => {
            if (!livestock.value) return [];

            return [
                { label: 'Category', value: livestock.value.category },
                { label: 'Breed', value: livestock.value.breed },
                { label: 'Age', value: `${livestock.value.age} ${livestock.value.ageUnit}` },
                { label: 'Gender', value: livestock.value.gender },
                { label: 'Weight', value: `${livestock.value.weight} ${livestock.value.weightUnit}` },
                { label: 'Health Status', value: livestock.value.healthStatus },
                { label: 'Feeding Type', value: livestock.value.feedingType }
            ];
        });

        // Fetch livestock details
        const fetchLivestockDetails = () => {
            // In a real app, this would be an API call
            setTimeout(() => {
                // Mock data for livestock details
                livestock.value = {
                    id: props.id,
                    title: "Healthy Brahman Cow for Sale",
                    description: "This Brahman cow is 2 years old, fully vaccinated, and grass-fed. It has a strong build, is disease-free, and perfect for breeding or meat production. The cow has been well cared for in our farm and has excellent temperament. We provide all necessary documentation and health certificates.",
                    category: "Cattle",
                    breed: "Brahman",
                    age: 2,
                    ageUnit: "years",
                    gender: "Female",
                    weight: 450,
                    weightUnit: "kg",
                    price: 1200,
                    negotiable: true,
                    quantity: 5,
                    location: "Bogo City, Philippines",
                    healthStatus: "Vaccinated, Dewormed, Disease-free",
                    feedingType: "Grass-fed",
                    imageUrl: "/src/assets/Bull.jpg?text=Brahman+Cow",
                    videoThumbnail: "/src/assets/Bull.jpg?text=Video+Thumbnail",
                    videoUrl: "#",
                    certified: true,
                    auction: false,
                    availableImmediate: true,
                    isFavorite: false,
                    listedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
                    deliveryOption: "Pick-up only",
                    deliveryDetails: "Available for pick-up Monday to Saturday, 8am to 5pm",
                    restrictions: "Only available for buyers within Cebu",
                    sellerId: 123
                };

                // Generate additional images
                additionalImages.value = [
                    livestock.value.imageUrl,
                    "/src/assets/Bull.jpg?text=Brahman+Side+View",
                    "/src/assets/Bull.jpg?text=Brahman+Front+View",
                    "/src/assets/Bull.jpg?text=Brahman+Close+Up"
                ];

                // Mock seller data
                seller.value = {
                    id: 123,
                    name: "John Doe's Farm",
                    avatarUrl: "/src/assets/Bull.jpg?text=JD",
                    rating: 4.8,
                    reviewCount: 15,
                    showPhoneNumber: true,
                    phoneNumber: "+63 912 345 6789"
                };

                // Mock reviews
                reviews.value = [
                    {
                        id: 1,
                        username: "FarmerMike",
                        avatarUrl: "/src/assets/Bull.jpg?text=FM",
                        rating: 5,
                        comment: "Great quality livestock! Healthy and exactly as described. The seller was very knowledgeable and helpful.",
                        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
                    },
                    {
                        id: 2,
                        username: "RanchOwner22",
                        rating: 4,
                        comment: "Good cattle, slightly smaller than expected but overall healthy and good condition.",
                        date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000)
                    }
                ];

                // Similar listings
                fetchSimilarListings();

                loading.value = false;
            }, 1000);
        };

        // Fetch similar listings
        const fetchSimilarListings = () => {
            // In a real app, this would call an API with the current livestock's category/breed
            setTimeout(() => {
                const items: Livestock[] = [];
                for (let i = 0; i < 3; i++) {
                    items.push({
                        id: 1000 + i,
                        title: `${i % 2 === 0 ? 'Brahman' : 'Angus'} Cattle - ${i % 2 === 0 ? 'Female' : 'Male'}`,
                        description: "High-quality livestock raised in optimal conditions. Fully vaccinated and health-certified with proper documentation. Ideal for breeding or farm expansion.",
                        category: "Cattle",
                        breed: i % 2 === 0 ? "Brahman" : "Angus",
                        age: 2 + i,
                        ageUnit: "years",
                        gender: i % 2 === 0 ? "Female" : "Male",
                        weight: 450 + (i * 25),
                        weightUnit: "kg",
                        price: 900 + (i * 100),
                        negotiable: true,
                        quantity: 1 + i,
                        location: `${['Cebu City', 'Mandaue City', 'Lapu-Lapu City', 'Toledo City'][i]}, Philippines`,
                        healthStatus: "Healthy",
                        feedingType: "Grass-fed",
                        imageUrl: `/src/assets/Bull.jpg?text=Similar+${i + 1}`,
                        certified: i % 3 === 0,
                        auction: i % 4 === 0,
                        availableImmediate: i % 2 === 0,
                        isFavorite: false,
                        listedDate: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000),
                        deliveryOption: "Pick-up only",
                        deliveryDetails: "Available for pick-up Monday to Saturday, 8am to 5pm",
                        restrictions: "None",
                        sellerId: 123
                    });
                }
                similarListings.value = items;
            }, 500);
        };

        onMounted(() => {
            fetchLivestockDetails();
        });

        // Methods for interaction
        const selectImage = (index: number) => {
            selectedImage.value = index;
            livestock.value.imageUrl = additionalImages.value[index];
        };

        const toggleFavorite = (item: Livestock) => {
            item.isFavorite = !item.isFavorite;
            // In a real app, you would save this to your API
        };

        const incrementQuantity = () => {
            if (selectedQuantity.value < livestock.value.quantity) {
                selectedQuantity.value++;
            }
        };

        const decrementQuantity = () => {
            if (selectedQuantity.value > 1) {
                selectedQuantity.value--;
            }
        };

        const contactSeller = () => {
            contactDialogVisible.value = true;
        };

        const sendMessage = () => {
            // In a real app, this would send the message to your backend
            alert(`Message sent: ${contactMessage.value}`);
            contactMessage.value = '';
            contactDialogVisible.value = false;
        };

        const buyNow = () => {
            // In a real app, this would redirect to checkout or payment page
            alert(`Proceeding to purchase ${selectedQuantity.value} item(s) for $${formatPrice(livestock.value.price * selectedQuantity.value)}`);
        };

        const goBack = () => {
            // In a real app, this would navigate back to the listings page
            alert('Going back to listings page');
        };

        const viewSellerProfile = () => {
            // In a real app, this would navigate to the seller's profile
            alert(`Viewing profile for seller: ${seller.value.name}`);
        };

        const callSeller = () => {
            // In a real app, this would use the device's call functionality
            if (seller.value.phoneNumber) {
                alert(`Calling seller at: ${seller.value.phoneNumber}`);
            }
        };

        const reportListing = () => {
            // In a real app, this would open a report dialog
            alert('Opening report listing form');
        };

        const playVideo = () => {
            videoDialogVisible.value = true;
        };

        const viewListing = (id: number) => {
            // In a real app, this would navigate to the selected listing
            alert(`Navigating to listing with ID: ${id}`);
        };

        const formatDate = (date: Date) => {
            // Calculate days difference
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return 'Today';
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else if (diffDays < 30) {
                return `${Math.floor(diffDays / 7)} weeks ago`;
            } else {
                return `${Math.floor(diffDays / 30)} months ago`;
            }
        };

        const formatPrice = (price: number) => {
            return price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        };

        return {
            loading,
            livestock,
            seller,
            reviews,
            similarListings,
            selectedImage,
            additionalImages,
            selectedQuantity,
            contactDialogVisible,
            videoDialogVisible,
            contactMessage,
            livestockDetails,

            // Methods
            selectImage,
            toggleFavorite,
            incrementQuantity,
            decrementQuantity,
            contactSeller,
            sendMessage,
            buyNow,
            goBack,
            viewSellerProfile,
            callSeller,
            reportListing,
            playVideo,
            viewListing,
            formatDate,
            formatPrice
        };
    }
});
</script>

<style scoped>
.livestock-card {
    position: relative;
    transition: all 0.3s ease;
}

.livestock-card:hover {
    transform: translateY(-5px);
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .livestock-details-page .p-tabview-nav li {
        width: 50%;
    }
}
</style>