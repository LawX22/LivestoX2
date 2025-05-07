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
    <div class="livestock-details-page min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-16">
            <div class="text-center">
                <ProgressSpinner style="width: 70px; height: 70px" strokeWidth="4" fill="var(--surface-ground)"
                    animationDuration=".4s" aria-label="Loading" class="mb-4" />
                <p class="text-emerald-700 animate-pulse">Loading your livestock details...</p>
            </div>
        </div>

        <div v-else class="container mx-auto px-4 py-8">
            <!-- Header and navigation -->
            <div class="flex items-center justify-between mb-8">
                <Button icon="pi pi-arrow-left" label="Back to Listings"
                    class="p-button font-medium text-white bg-emerald-700 hover:bg-emerald-800 border border-emerald-800 shadow-md rounded-full px-5 py-2 transition duration-300 ease-in-out"
                    @click="goBack" />


                <div class="flex items-center gap-3">
                    <Button icon="pi pi-share-alt"
                        class="p-button-rounded p-button-outlined border-emerald-400 text-emerald-600 hover:bg-emerald-50"
                        v-tooltip.top="'Share Listing'" />
                    <Button icon="pi pi-flag"
                        class="p-button-rounded p-button-outlined border-rose-400 text-rose-600 hover:bg-rose-50"
                        @click="reportListing" v-tooltip.top="'Report Listing'" />
                </div>
            </div>

            <!-- Main product showcase -->
            <div class="bg-white rounded-3xl shadow-xl overflow-hidden mb-10">
                <div class="grid grid-cols-1 lg:grid-cols-5 gap-0">
                    <!-- Left column: Main image gallery -->
                    <div class="lg:col-span-3 h-full">
                        <div class="relative aspect-video lg:aspect-auto lg:h-full">
                            <img :src="livestock.imageUrl" :alt="livestock.title" class="w-full h-full object-cover" />

                            <!-- Badges -->
                            <div class="absolute top-5 left-5 flex gap-2 flex-wrap">
                                <div v-if="livestock.certified"
                                    class="bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center">
                                    <i class="pi pi-verified text-xl mr-2"></i> Certified
                                </div>
                                <div v-if="livestock.auction"
                                    class="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg backdrop-blur-sm flex items-center">
                                    <i class="pi pi-clock text-xl mr-2"></i> Auction
                                </div>
                            </div>

                            <!-- Favorite button -->
                            <Button :icon="livestock.isFavorite ? 'pi pi-heart-fill' : 'pi pi-heart'" :class="[
                                'absolute top-5 right-5 p-button-rounded shadow-lg transform transition-all duration-300 hover:scale-110',
                                livestock.isFavorite ? 'p-button-danger' : 'bg-white/80 hover:bg-white border-0 text-rose-500'
                            ]" @click="toggleFavorite(livestock)"
                                v-tooltip.left="livestock.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'" />

                            <!-- Available now indicator -->
                            <div v-if="livestock.availableImmediate"
                                class="absolute bottom-5 right-5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold flex items-center">
                                <i class="pi pi-check-circle mr-2"></i> Available Now
                            </div>
                        </div>
                    </div>

                    <!-- Right column: Details and CTA -->
                    <div class="lg:col-span-2 p-8 flex flex-col bg-gradient-to-br from-white to-emerald-50">
                        <div class="flex items-center gap-2 text-sm text-emerald-600 font-medium mb-2">
                            <i class="pi pi-tag"></i>
                            <span>{{ livestock.category }} / {{ livestock.breed }}</span>
                        </div>

                        <h1 class="text-3xl font-bold text-gray-800 mb-4 leading-tight">{{ livestock.title }}</h1>

                        <div class="flex items-center gap-3 text-gray-500 text-sm mb-6">
                            <div class="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                                <i class="pi pi-map-marker mr-1"></i>
                                <span>{{ livestock.location }}</span>
                            </div>
                            <div class="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                <i class="pi pi-calendar mr-1"></i>
                                <span>{{ formatDate(livestock.listedDate) }}</span>
                            </div>
                        </div>

                        <!-- Price section -->
                        <div class="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 mb-6 shadow-inner">
                            <div class="flex justify-between items-center">
                                <div>
                                    <div class="text-sm text-emerald-700 font-medium mb-1">Price</div>
                                    <div class="flex items-center">
                                        <span class="text-3xl font-bold text-emerald-800">${{
                                            formatPrice(livestock.price) }}</span>
                                        <span v-if="livestock.negotiable"
                                            class="ml-2 bg-white text-emerald-600 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                                            Negotiable
                                        </span>
                                    </div>
                                </div>

                                <div v-if="livestock.quantity > 1" class="text-center">
                                    <div class="text-sm text-emerald-700 font-medium mb-1">Available</div>
                                    <div class="font-bold text-emerald-800">{{ livestock.quantity }} items</div>
                                </div>
                            </div>
                        </div>

                        <!-- Key specs summary -->
                        <div class="flex flex-wrap gap-4 mb-8">
                            <div
                                class="flex-1 min-w-[80px] bg-gradient-to-b from-white to-emerald-50 rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                                <div class="text-sm text-emerald-700 font-medium">Age</div>
                                <div class="font-semibold text-gray-800 mt-1">{{ livestock.age }} {{ livestock.ageUnit
                                    }}</div>
                            </div>
                            <div
                                class="flex-1 min-w-[80px] bg-gradient-to-b from-white to-emerald-50 rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                                <div class="text-sm text-emerald-700 font-medium">Gender</div>
                                <div class="font-semibold text-gray-800 mt-1">{{ livestock.gender }}</div>
                            </div>
                            <div
                                class="flex-1 min-w-[80px] bg-gradient-to-b from-white to-emerald-50 rounded-2xl p-4 text-center shadow-sm border border-emerald-100">
                                <div class="text-sm text-emerald-700 font-medium">Weight</div>
                                <div class="font-semibold text-gray-800 mt-1">{{ livestock.weight }} {{
                                    livestock.weightUnit }}</div>
                            </div>
                        </div>

                        <!-- Quantity selector -->
                        <div v-if="livestock.quantity > 1" class="mb-8">
                            <label class="text-sm font-medium text-gray-700 mb-2 block">Select Quantity</label>
                            <div
                                class="flex items-center border border-emerald-200 rounded-full overflow-hidden shadow-sm bg-white">
                                <button
                                    class="px-4 py-2 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 flex-shrink-0"
                                    @click="decrementQuantity" :disabled="selectedQuantity <= 1">
                                    <i class="pi pi-minus"></i>
                                </button>
                                <div class="flex-grow text-center py-2 font-medium text-gray-800">{{ selectedQuantity }}
                                </div>
                                <button
                                    class="px-4 py-2 text-emerald-700 hover:bg-emerald-100 transition-colors disabled:opacity-50 flex-shrink-0"
                                    @click="incrementQuantity" :disabled="selectedQuantity >= livestock.quantity">
                                    <i class="pi pi-plus"></i>
                                </button>
                            </div>
                        </div>

                        <!-- CTA buttons -->
                        <div class="flex gap-4">
                            <Button label="Buy Now" icon="pi pi-shopping-cart"
                                class="p-button-raised flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 border-0 shadow-lg text-base py-3 rounded-full font-medium transition-all duration-300 transform hover:translate-y-[-2px]"
                                @click="buyNow" />
                            <Button label="Contact" icon="pi pi-comments"
                                class="p-button-outlined flex-1 border-emerald-500 text-emerald-600 hover:bg-emerald-50 text-base py-3 rounded-full font-medium transition-all duration-300"
                                @click="contactSeller" />
                        </div>
                    </div>
                </div>

                <!-- Thumbnail gallery - redesigned as a horizontal strip -->
                <div class="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100">
                    <div class="flex overflow-x-auto gap-4 pb-2 scrollbar-thin">
                        <div v-for="(image, index) in additionalImages" :key="index"
                            class="flex-shrink-0 cursor-pointer transition-all duration-300"
                            @click="selectImage(index)">
                            <div class="relative w-24 h-24 rounded-xl overflow-hidden shadow-sm transform hover:scale-105"
                                :class="selectedImage === index ? 'ring-3 ring-emerald-500 ring-offset-2' : 'opacity-80 hover:opacity-100'">
                                <img :src="image" class="w-full h-full object-cover" />
                            </div>
                        </div>

                        <div v-if="livestock.videoUrl" class="flex-shrink-0 cursor-pointer transition-all duration-300"
                            @click="playVideo">
                            <div
                                class="relative w-24 h-24 rounded-xl overflow-hidden bg-black shadow-sm transform hover:scale-105">
                                <img :src="livestock.videoThumbnail" class="w-full h-full object-cover opacity-80" />
                                <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                                    <div class="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center">
                                        <i class="pi pi-play text-emerald-600"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Seller information - Repositioned above main content -->
            <div
                class="bg-white rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-emerald-500 transform hover:shadow-xl transition-all duration-300">
                <div class="flex items-center">
                    <Avatar :image="seller.avatarUrl" shape="circle" class="mr-4" size="large" />
                    <div class="flex-grow">
                        <h3 class="text-lg font-bold text-gray-800">{{ seller.name }}</h3>
                        <div class="flex items-center mt-1">
                            <Rating :modelValue="seller.rating" readonly :cancel="false" :stars="5" class="mr-2" />
                            <span class="text-sm text-gray-600">{{ seller.rating }} ({{ seller.reviewCount }}
                                reviews)</span>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <Button icon="pi pi-user"
                            class="p-button-rounded p-button-outlined border-emerald-500 text-emerald-600 hover:bg-emerald-50 transform hover:scale-110 transition-all duration-300"
                            v-tooltip="'View Profile'" @click="viewSellerProfile" />
                        <Button icon="pi pi-envelope"
                            class="p-button-rounded p-button-outlined border-blue-500 text-blue-600 hover:bg-blue-50 transform hover:scale-110 transition-all duration-300"
                            v-tooltip="'Contact Seller'" @click="contactSeller" />
                        <Button v-if="seller.showPhoneNumber" icon="pi pi-phone"
                            class="p-button-rounded p-button-outlined border-emerald-500 text-emerald-600 hover:bg-emerald-50 transform hover:scale-110 transition-all duration-300"
                            v-tooltip="'Call Seller'" @click="callSeller" />
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Left side content -->
                <div class="lg:col-span-8">
                    <!-- Tabbed content with enhanced design -->
                    <div
                        class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform hover:shadow-xl transition-all duration-300">
                        <TabView class="livestock-tabs product-tabs">
                            <TabPanel header="Description">
                                <div class="p-8">
                                    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                                        <i class="pi pi-info-circle mr-2 text-emerald-600"></i> About this Livestock
                                    </h3>
                                    <p class="text-gray-700 leading-relaxed text-lg">{{ livestock.description }}</p>
                                </div>
                            </TabPanel>

                            <TabPanel header="Specifications">
                                <div class="p-8">
                                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <i class="pi pi-list mr-2 text-emerald-600"></i> Detailed Specifications
                                    </h3>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div v-for="(detail, index) in livestockDetails" :key="index"
                                            class="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl overflow-hidden shadow-sm transform hover:translate-y-[-2px] transition-all duration-300">
                                            <div
                                                class="bg-gradient-to-r from-emerald-200 to-teal-200 py-3 px-4 border-l-4 border-emerald-500">
                                                <span class="font-medium text-gray-800">{{ detail.label }}</span>
                                            </div>
                                            <div class="py-3 px-4">
                                                <span class="text-gray-800 font-medium">{{ detail.value }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel header="Location & Delivery">
                                <div class="p-8">
                                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <i class="pi pi-map-marker mr-2 text-emerald-600"></i> Location & Delivery
                                        Information
                                    </h3>

                                    <div class="mb-8">
                                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Pickup Location</h4>
                                        <div class="bg-blue-50 rounded-xl p-4 border-l-4 border-blue-500">
                                            <div class="flex items-start">
                                                <i class="pi pi-map-marker text-blue-600 text-xl mt-1 mr-3"></i>
                                                <div>
                                                    <p class="text-gray-800 font-medium mb-1">{{ livestock.location }}
                                                    </p>
                                                    <p class="text-gray-600 text-sm">Exact location will be shared after
                                                        purchase confirmation</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="mb-8">
                                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Delivery Options</h4>
                                        <div class="bg-emerald-50 rounded-xl p-4 border-l-4 border-emerald-500">
                                            <div class="flex items-start">
                                                <i class="pi pi-truck text-emerald-600 text-xl mt-1 mr-3"></i>
                                                <div>
                                                    <p class="text-gray-800 font-medium mb-1">{{
                                                        livestock.deliveryOption }}</p>
                                                    <p class="text-gray-600">{{ livestock.deliveryDetails }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="livestock.restrictions">
                                        <h4 class="text-lg font-semibold text-gray-800 mb-3">Restrictions</h4>
                                        <div class="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
                                            <div class="flex items-start">
                                                <i
                                                    class="pi pi-exclamation-triangle text-amber-600 text-xl mt-1 mr-3"></i>
                                                <div>
                                                    <p class="text-gray-700">{{ livestock.restrictions }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>

                            <TabPanel header="Reviews">
                                <div class="p-8">
                                    <h3 class="text-xl font-bold text-gray-800 mb-6 flex items-center">
                                        <i class="pi pi-star mr-2 text-emerald-600"></i> Customer Reviews
                                    </h3>

                                    <div v-if="reviews.length === 0" class="text-center py-6">
                                        <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                                        <p class="text-gray-500">No reviews yet. Be the first to review!</p>
                                    </div>

                                    <div v-else class="space-y-6">
                                        <div v-for="review in reviews" :key="review.id"
                                            class="bg-gradient-to-r from-gray-50 to-white rounded-xl p-5 shadow-sm transform hover:shadow-md transition-all duration-300">
                                            <div class="flex items-start">
                                                <Avatar v-if="review.avatarUrl" :image="review.avatarUrl" shape="circle"
                                                    class="mr-4" />
                                                <Avatar v-else :label="review.username.charAt(0)" shape="circle"
                                                    class="mr-4"
                                                    style="background-color: var(--emerald-500); color: #ffffff" />

                                                <div class="flex-grow">
                                                    <div class="flex justify-between items-start">
                                                        <h4 class="font-semibold text-gray-800">{{ review.username }}
                                                        </h4>
                                                        <span class="text-xs text-gray-500">{{ formatDate(review.date)
                                                            }}</span>
                                                    </div>
                                                    <Rating :modelValue="review.rating" readonly :cancel="false"
                                                        :stars="5" class="my-2" />
                                                    <p class="text-gray-700 mt-2">{{ review.comment }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TabPanel>
                        </TabView>
                    </div>
                </div>

                <!-- Right side sidebar -->
                <div class="lg:col-span-4">
                    <!-- Similar listings -->
                    <div
                        class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8 transform hover:shadow-xl transition-all duration-300">
                        <div class="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600">
                            <h3 class="text-lg font-bold text-white flex items-center">
                                <i class="pi pi-tag mr-2"></i> Similar Listings
                            </h3>
                        </div>

                        <div class="p-4">
                            <div v-if="similarListings.length === 0" class="text-center py-6">
                                <i class="pi pi-inbox text-4xl text-gray-300 mb-3"></i>
                                <p class="text-gray-500">No similar listings found</p>
                            </div>

                            <div v-else class="space-y-4">
                                <div v-for="item in similarListings" :key="item.id"
                                    class="bg-gradient-to-r from-gray-50 to-white rounded-xl overflow-hidden shadow-sm transform hover:translate-y-[-2px] transition-all duration-300 hover:shadow-md cursor-pointer"
                                    @click="viewListing(item.id)">
                                    <div class="flex">
                                        <div class="w-24 h-24 flex-shrink-0">
                                            <img :src="item.imageUrl" :alt="item.title"
                                                class="w-full h-full object-cover" />
                                        </div>
                                        <div class="p-3 flex-grow">
                                            <h4 class="font-medium text-gray-800 line-clamp-1">{{ item.title }}</h4>
                                            <div class="flex items-center text-sm text-emerald-600 font-medium mt-1">
                                                <i class="pi pi-tag mr-1 text-xs"></i>
                                                <span>{{ item.breed }}</span>
                                            </div>
                                            <div class="flex justify-between items-center mt-2">
                                                <span class="font-bold text-emerald-700">${{ formatPrice(item.price)
                                                    }}</span>
                                                <span class="text-xs text-gray-500">{{ formatDate(item.listedDate)
                                                    }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Help & Support -->
                    <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg p-6 text-white">
                        <h3 class="text-lg font-bold mb-4 flex items-center">
                            <i class="pi pi-question-circle mr-2"></i> Need Help?
                        </h3>
                        <p class="mb-4 text-white/90">Have questions about this livestock or the buying process? Our
                            support team is here to help.</p>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <i class="pi pi-envelope mr-3 text-lg"></i>
                                <span>support@livestockmarket.com</span>
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-phone mr-3 text-lg"></i>
                                <span>+63 912 345 6789</span>
                            </div>
                            <div class="flex items-center">
                                <i class="pi pi-clock mr-3 text-lg"></i>
                                <span>Available 7 days a week, 8am-8pm</span>
                            </div>
                        </div>
                        <Button label="Contact Support" icon="pi pi-comments"
                            class="mt-4 w-full p-button-outlined border-white text-white hover:bg-white/20" />
                    </div>
                </div>
            </div>
        </div>

        <!-- Contact Dialog -->
        <Dialog v-model:visible="contactDialogVisible" modal header="Contact Seller" class="contact-dialog"
            :style="{ width: '90%', maxWidth: '550px' }">
            <div class="p-fluid">
                <div class="field mb-6">
                    <label for="message" class="font-medium text-gray-700 mb-2 block">Your Message</label>
                    <textarea id="message" v-model="contactMessage" rows="5"
                        class="w-full p-3 rounded-lg border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-200 focus:ring-opacity-50"
                        placeholder="I'm interested in your Brahman Cow. Is it still available?"></textarea>
                </div>

                <div class="flex gap-4">
                    <Button label="Send" icon="pi pi-send"
                        class="p-button-raised bg-emerald-600 hover:bg-emerald-700 border-0" @click="sendMessage" />
                    <Button label="Cancel" class="p-button-outlined border-gray-300 text-gray-700 hover:bg-gray-50"
                        @click="contactDialogVisible = false" />
                </div>
            </div>
        </Dialog>

        <!-- Video Dialog -->
        <Dialog v-model:visible="videoDialogVisible" modal header="Video Preview" class="video-dialog"
            :style="{ width: '90%', maxWidth: '800px' }">
            <div class="aspect-video bg-black rounded-lg flex items-center justify-center">
                <p class="text-white">Video player would be implemented here</p>
                <!-- In a real app, you would use a video player component here -->
                <!-- <video controls class="w-full h-full">
                    <source :src="livestock.videoUrl" type="video/mp4">
                    Your browser does not support the video tag.
                </video> -->
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
.livestock-details-page {
    min-height: 100vh;
}

.livestock-tabs :deep(.p-tabview-nav) {
    background: linear-gradient(to right, rgba(16, 185, 129, 0.1), rgba(20, 184, 166, 0.1));
    border-bottom: 2px solid rgba(16, 185, 129, 0.2);
    padding: 0 1rem;
}

.livestock-tabs :deep(.p-tabview-nav li .p-tabview-nav-link) {
    background: transparent;
    border: none;
    color: #374151;
    font-weight: 500;
    padding: 1rem 1.25rem;
    transition: all 0.3s;
}

.livestock-tabs :deep(.p-tabview-nav li .p-tabview-nav-link:hover) {
    background: rgba(16, 185, 129, 0.1);
    border-color: transparent;
    color: #047857;
}

.livestock-tabs :deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
    background: #fff;
    border-radius: 0.5rem 0.5rem 0 0;
    border-bottom: 3px solid #10b981;
    color: #047857;
    font-weight: 600;
}

.contact-dialog :deep(.p-dialog-header) {
    background: #10b981;
    color: white;
}

/* For the gallery thumbnails scrollbar */
.scrollbar-thin::-webkit-scrollbar {
    height: 6px;
    cursor: pointer;
}

.scrollbar-thin::-webkit-scrollbar-track {
    background-color: rgba(16, 185, 129, 0.1);
    border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
    background-color: rgba(16, 185, 129, 0.4);
    border-radius: 10px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
    background-color: rgba(16, 185, 129, 0.6);
}

/* Line clamp for text truncation */
.line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>