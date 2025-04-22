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
import { useRouter } from 'vue-router';

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
        const router = useRouter();
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
            router.back(); // This will go back one step in the browser history
            // Alternatively, you can use: router.back();
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

<template>
    <div class="livestock-details-page min-h-screen bg-gradient-to-b from-green-50 to-white">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <ProgressSpinner style="width: 60px; height: 60px" strokeWidth="4" fill="var(--surface-ground)"
                animationDuration=".2s" aria-label="Loading" />
        </div>

        <div v-else class="container mx-auto px-4 py-8">
            <!-- Header and navigation -->
            <div class="flex items-center justify-between mb-8">
                <Button icon="pi pi-arrow-left" label="Back to Listings"
                    class="p-button-text text-green-700 bg-white shadow-sm rounded-full px-6 hover:bg-green-50 transition-colors duration-200"
                    @click="goBack" />
                
                <div class="flex items-center gap-2">
                    <Button icon="pi pi-share-alt" 
                        class="p-button-text p-button-rounded p-button-sm"
                        v-tooltip.top="'Share Listing'" />
                    <Button icon="pi pi-flag" 
                        class="p-button-text p-button-rounded p-button-sm"
                        @click="reportListing"
                        v-tooltip.top="'Report Listing'" />
                </div>
            </div>

            <!-- Main product showcase - REDESIGNED -->
            <div class="bg-white rounded-2xl shadow-xl overflow-hidden mb-10">
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-0">
                    <!-- Left column: Main image gallery -->
                    <div class="lg:col-span-3 h-full">
                        <div class="relative aspect-video lg:aspect-auto lg:h-full">
                            <img :src="livestock.imageUrl" :alt="livestock.title"
                                class="w-full h-full object-cover" />
                            
                            <!-- Badges -->
                            <div class="absolute top-4 left-4 flex gap-2 flex-wrap">
                                <div v-if="livestock.certified" 
                                    class="bg-green-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg flex items-center">
                                    <i class="pi pi-verified text-xl mr-2"></i> Certified
                                </div>
                                <div v-if="livestock.auction" 
                                    class="bg-amber-500 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg flex items-center">
                                    <i class="pi pi-clock text-xl mr-2"></i> Auction
                                </div>
                            </div>
                            
                            <!-- Favorite button -->
                            <Button :icon="livestock.isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'" 
                                :class="[
                                    'absolute top-4 right-4 p-button-rounded shadow-lg transition-all duration-300',
                                    livestock.isFavorite ? 'p-button-danger' : 'p-button-outlined bg-white/80'
                                ]"
                                @click="toggleFavorite(livestock)" 
                                v-tooltip.left="livestock.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'" />
                            
                            <!-- Available now indicator -->
                            <div v-if="livestock.availableImmediate" 
                                class="absolute bottom-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold flex items-center">
                                <i class="pi pi-check-circle mr-2"></i> Available Now
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right column: Details and CTA -->
                    <div class="lg:col-span-2 p-8 flex flex-col">
                        <div class="flex items-center gap-2 text-sm text-green-600 font-medium mb-1">
                            <i class="pi pi-tag"></i>
                            <span>{{ livestock.category }} / {{ livestock.breed }}</span>
                        </div>
                        
                        <h1 class="text-3xl font-bold text-gray-800 mb-4">{{ livestock.title }}</h1>
                        
                        <div class="flex items-center gap-2 text-gray-500 text-sm mb-6">
                            <div class="flex items-center">
                                <i class="pi pi-map-marker mr-1 text-green-600"></i>
                                <span>{{ livestock.location }}</span>
                            </div>
                            <div class="h-1 w-1 rounded-full bg-gray-300"></div>
                            <div>
                                <span>Listed {{ formatDate(livestock.listedDate) }}</span>
                            </div>
                        </div>
                        
                        <!-- Price section -->
                        <div class="bg-green-50 rounded-xl p-5 mb-6">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="text-sm text-gray-500 mb-1">Price</div>
                                    <div class="flex items-center">
                                        <span class="text-3xl font-bold text-green-700">${{ formatPrice(livestock.price) }}</span>
                                        <span v-if="livestock.negotiable" 
                                            class="ml-2 bg-white text-green-600 px-3 py-1 rounded-full text-xs font-medium">
                                            Negotiable
                                        </span>
                                    </div>
                                </div>
                                
                                <div v-if="livestock.quantity > 1" class="text-center">
                                    <div class="text-sm text-gray-500 mb-1">Available</div>
                                    <div class="font-bold text-gray-800">{{ livestock.quantity }} items</div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Key specs summary -->
                        <div class="flex flex-wrap gap-4 mb-8">
                            <div class="flex-1 min-w-[80px] bg-gray-50 rounded-lg p-3 text-center">
                                <div class="text-sm text-gray-500">Age</div>
                                <div class="font-semibold text-gray-800">{{ livestock.age }} {{ livestock.ageUnit }}</div>
                            </div>
                            <div class="flex-1 min-w-[80px] bg-gray-50 rounded-lg p-3 text-center">
                                <div class="text-sm text-gray-500">Gender</div>
                                <div class="font-semibold text-gray-800">{{ livestock.gender }}</div>
                            </div>
                            <div class="flex-1 min-w-[80px] bg-gray-50 rounded-lg p-3 text-center">
                                <div class="text-sm text-gray-500">Weight</div>
                                <div class="font-semibold text-gray-800">{{ livestock.weight }} {{ livestock.weightUnit }}</div>
                            </div>
                        </div>
                        
                        <!-- Quantity selector -->
                        <div v-if="livestock.quantity > 1" class="mb-8">
                            <label class="text-sm font-medium text-gray-700 mb-2 block">Select Quantity</label>
                            <div class="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 flex-shrink-0"
                                    @click="decrementQuantity"
                                    :disabled="selectedQuantity <= 1">
                                    <i class="pi pi-minus"></i>
                                </button>
                                <div class="flex-grow text-center py-2 font-medium">{{ selectedQuantity }}</div>
                                <button
                                    class="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-50 flex-shrink-0"
                                    @click="incrementQuantity"
                                    :disabled="selectedQuantity >= livestock.quantity">
                                    <i class="pi pi-plus"></i>
                                </button>
                            </div>
                        </div>
                        
                        <!-- CTA buttons -->
                        <div class="flex gap-4">
                            <Button label="Buy Now" icon="pi pi-shopping-cart"
                                class="p-button-raised flex-1 bg-green-600 hover:bg-green-700 border-green-600 shadow-lg text-base py-3"
                                @click="buyNow" />
                            <Button label="Contact" icon="pi pi-comments"
                                class="p-button-outlined flex-1 border-green-600 text-green-600 hover:bg-green-50 text-base py-3"
                                @click="contactSeller" />
                        </div>
                    </div>
                </div>
                
                <!-- Thumbnail gallery - redesigned as a horizontal strip -->
                <div class="p-4 bg-gray-50 border-t border-gray-100">
                    <div class="flex overflow-x-auto gap-3 pb-2 scrollbar-thin">
                        <div v-for="(image, index) in additionalImages" :key="index"
                            class="flex-shrink-0 cursor-pointer transition-all duration-200"
                            @click="selectImage(index)">
                            <div class="relative w-20 h-20 rounded-lg overflow-hidden"
                                :class="selectedImage === index ? 'ring-2 ring-green-500 ring-offset-2' : 'opacity-70 hover:opacity-100'">
                                <img :src="image" class="w-full h-full object-cover" />
                            </div>
                        </div>
                        
                        <div v-if="livestock.videoUrl" 
                            class="flex-shrink-0 cursor-pointer transition-all duration-200"
                            @click="playVideo">
                            <div class="relative w-20 h-20 rounded-lg overflow-hidden bg-black opacity-70 hover:opacity-100">
                                <img :src="livestock.videoThumbnail" class="w-full h-full object-cover opacity-80" />
                                <div class="absolute inset-0 flex items-center justify-center">
                                    <i class="pi pi-play text-white"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Left side content - REDESIGNED -->
                <div class="lg:col-span-8">
                    <!-- Seller information - Repositioned and redesigned -->
                    <div class="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-green-500">
                        <div class="flex items-center">
                            <Avatar :image="seller.avatarUrl" shape="circle" class="mr-4" size="large" />
                            <div class="flex-grow">
                                <h3 class="text-lg font-bold text-gray-800">{{ seller.name }}</h3>
                                <div class="flex items-center mt-1">
                                    <Rating :modelValue="seller.rating" readonly :cancel="false" :stars="5" class="mr-2" />
                                    <span class="text-sm text-gray-600">{{ seller.rating }} ({{ seller.reviewCount }} reviews)</span>
                                </div>
                            </div>
                            <div class="flex gap-2">
                                <Button icon="pi pi-user" 
                                    class="p-button-rounded p-button-outlined border-green-500 text-green-600 hover:bg-green-50"
                                    v-tooltip="'View Profile'"
                                    @click="viewSellerProfile" />
                                <Button icon="pi pi-envelope" 
                                    class="p-button-rounded p-button-outlined border-blue-500 text-blue-600 hover:bg-blue-50"
                                    v-tooltip="'Contact Seller'"
                                    @click="contactSeller" />
                                <Button v-if="seller.showPhoneNumber" icon="pi pi-phone" 
                                    class="p-button-rounded p-button-outlined border-green-500 text-green-600 hover:bg-green-50"
                                    v-tooltip="'Call Seller'"
                                    @click="callSeller" />
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tabbed content with enhanced design -->
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        <TabView class="livestock-tabs product-tabs">
                            <TabPanel header="Description">
                                <div class="p-6">
                                    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <i class="pi pi-info-circle mr-2 text-green-600"></i> About this Livestock
                                    </h3>
                                    <p class="text-gray-700 leading-relaxed">{{ livestock.description }}</p>
                                </div>
                            </TabPanel>

                            <TabPanel header="Specifications">
                                <div class="p-6">
                                    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <i class="pi pi-list mr-2 text-green-600"></i> Detailed Specifications
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div v-for="(detail, index) in livestockDetails" :key="index"
                                            class="bg-gray-50 rounded-xl overflow-hidden">
                                            <div class="bg-green-100 py-2 px-4 border-l-4 border-green-500">
                                                <span class="font-medium text-gray-700">{{ detail.label }}</span>
                                            </div>
                                            <div class="py-3 px-4">
                                                <span class="text-gray-800">{{ detail.value }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel header="Location & Delivery">
                                <div class="p-6">
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                                <i class="pi pi-map-marker mr-2 text-green-600"></i> Location
                                            </h3>
                                            <div class="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                                                <div class="h-56 bg-gray-200 flex items-center justify-center">
                                                    <img src="/src/assets/vue.svg" alt="Location Map" class="h-full" />
                                                </div>
                                                <div class="p-4 font-medium">
                                                    {{ livestock.location }}
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                                <i class="pi pi-truck mr-2 text-green-600"></i> Delivery Information
                                            </h3>
                                            <div class="bg-gray-50 rounded-xl overflow-hidden shadow-sm mb-6">
                                                <div class="bg-blue-50 p-3 border-l-4 border-blue-500">
                                                    <span class="font-medium text-gray-800">{{ livestock.deliveryOption }}</span>
                                                </div>
                                                <div class="p-4">
                                                    <p class="text-gray-700">{{ livestock.deliveryDetails }}</p>
                                                </div>
                                            </div>

                                            <div class="bg-gray-50 rounded-xl overflow-hidden shadow-sm">
                                                <div class="bg-amber-50 p-3 border-l-4 border-amber-500">
                                                    <span class="font-medium text-gray-800">Restrictions</span>
                                                </div>
                                                <div class="p-4">
                                                    <p class="text-gray-700">{{ livestock.restrictions }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel header="Reviews">
                                <div class="p-6">
                                    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <i class="pi pi-star mr-2 text-green-600"></i> Customer Reviews
                                    </h3>
                                    
                                    <div v-if="reviews.length > 0">
                                        <div v-for="review in reviews" :key="review.id"
                                            class="border-b border-gray-200 py-4 last:border-0">
                                            <div class="flex items-start">
                                                <Avatar :image="review.avatarUrl" icon="pi pi-user" shape="circle" class="mr-3" />
                                                <div class="flex-grow">
                                                    <div class="flex items-center justify-between">
                                                        <h4 class="font-medium text-gray-800">{{ review.username }}</h4>
                                                        <span class="text-sm text-gray-500">{{ formatDate(review.date) }}</span>
                                                    </div>
                                                    <Rating :modelValue="review.rating" readonly :cancel="false" :stars="5" class="my-2" />
                                                    <p class="text-gray-700">{{ review.comment }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div v-else class="bg-gray-50 rounded-xl p-8 text-center">
                                        <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
                                        <h4 class="text-lg font-medium text-gray-800 mb-2">No Reviews Yet</h4>
                                        <p class="text-gray-600">Be the first to review this livestock listing</p>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>

                <!-- Right side content - REDESIGNED -->
                <div class="lg:col-span-4">
                    <!-- Similar listings section -->
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
                        <div class="p-5 bg-green-50 border-b border-green-100">
                            <h3 class="font-bold text-gray-800 flex items-center">
                                <i class="pi pi-clone mr-2 text-green-600"></i> Similar Listings
                            </h3>
                        </div>
                        
                        <div class="p-5">
                            <div v-for="(item, index) in similarListings" :key="item.id"
                                class="flex items-start gap-3 py-4"
                                :class="{'border-b border-gray-200': index < similarListings.length - 1}">
                                <div class="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                                    <img :src="item.imageUrl" :alt="item.title" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-grow">
                                    <h4 class="font-medium text-gray-800 mb-1 line-clamp-1">{{ item.title }}</h4>
                                    <div class="text-green-700 font-bold mb-1">${{ formatPrice(item.price) }}</div>
                                    <div class="flex items-center text-sm text-gray-500">
                                        <i class="pi pi-map-marker mr-1"></i>
                                        <span class="line-clamp-1">{{ item.location }}</span>
                                    </div>
                                </div>
                                <Button icon="pi pi-arrow-right" 
                                    class="p-button-rounded p-button-text text-green-600 hover:bg-green-50 flex-shrink-0"
                                    @click="viewListing(item.id)" />
                            </div>
                        </div>
                        
                        <div class="px-5 py-4 bg-gray-50 text-center">
                            <Button label="View More Listings" 
                                class="p-button-text p-button-sm text-green-600 hover:bg-green-50" />
                        </div>
                    </div>

                    <!-- Safety tips widget -->
                    <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div class="p-5 bg-amber-50 border-b border-amber-100">
                            <h3 class="font-bold text-gray-800 flex items-center">
                                <i class="pi pi-shield mr-2 text-amber-600"></i> Marketplace Safety Tips
                            </h3>
                        </div>
                        
                        <div class="p-5">
                            <ul class="space-y-3 text-gray-700">
                                <li class="flex">
                                    <i class="pi pi-check-circle text-green-600 mr-2 mt-1"></i>
                                    <span>Meet in a public location and inspect livestock before purchase</span>
                                </li>
                                <li class="flex">
                                    <i class="pi pi-check-circle text-green-600 mr-2 mt-1"></i>
                                    <span>Request health certificates and documentation</span>
                                </li>
                                <li class="flex">
                                    <i class="pi pi-check-circle text-green-600 mr-2 mt-1"></i>
                                    <span>Never send money as a deposit before seeing the livestock</span>
                                </li>
                                <li class="flex">
                                    <i class="pi pi-check-circle text-green-600 mr-2 mt-1"></i>
                                    <span>Be wary of prices that seem too good to be true</span>
                                </li>
                                <li class="flex">
                                    <i class="pi pi-check-circle text-green-600 mr-2 mt-1"></i>
                                    <span>Use our secure payment system when possible</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact seller dialog -->
        <Dialog v-model:visible="contactDialogVisible" header="Contact Seller" :style="{width: '500px'}" :modal="true"
            class="p-fluid">
            <div class="field mb-4">
                <label for="message" class="font-medium mb-2 block">Message</label>
                <textarea id="message" v-model="contactMessage" rows="5" class="w-full border rounded-lg p-3" 
                    placeholder="Hello, I'm interested in your Brahman cow. Is it still available?"></textarea>
            </div>
            <div class="field mb-2">
                <div class="flex items-center bg-blue-50 p-3 rounded-lg text-blue-800">
                    <i class="pi pi-info-circle mr-2"></i>
                    <span>Your contact information will be shared with the seller.</span>
                </div>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="contactDialogVisible = false" />
                <Button label="Send Message" icon="pi pi-send" class="p-button-success" @click="sendMessage" />
            </template>
        </Dialog>

        <!-- Video dialog -->
        <Dialog v-model:visible="videoDialogVisible" header="Livestock Video" :style="{width: '90%', maxWidth: '800px'}" :modal="true">
            <div class="aspect-video bg-black flex items-center justify-center">
                <i class="pi pi-video text-6xl text-gray-300"></i>
                <!-- In a real app, this would be a video player -->
                <p class="text-white">Video player would be displayed here</p>
            </div>
            <template #footer>
                <Button label="Close" icon="pi pi-times" class="p-button-text" @click="videoDialogVisible = false" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
/* Custom styles for the tabs */
:deep(.p-tabview) {
    border-radius: 0;
}

:deep(.p-tabview .p-tabview-nav) {
    border: none;
    background-color: #f9fafb;
    padding: 0 1rem;
    border-bottom: 1px solid #e5e7eb;
}

:deep(.p-tabview .p-tabview-nav li .p-tabview-nav-link) {
    border: none;
    color: #4b5563;
    font-weight: 500;
    padding: 1rem 1.5rem;
    transition: all 0.3s ease;
}

:deep(.p-tabview .p-tabview-nav li.p-highlight .p-tabview-nav-link) {
    border: none;
    border-bottom: 2px solid #16a34a;
    color: #16a34a;
    background-color: transparent;
}

:deep(.p-tabview .p-tabview-nav li:not(.p-highlight):not(.p-disabled):hover .p-tabview-nav-link) {
    background-color: transparent;
    border: none;
    color: #16a34a;
}

/* For the horizontal scrollable thumbnails */
.scrollbar-thin::-webkit-scrollbar {
    height: 6px;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
}

/* Line clamp utilities */
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>









