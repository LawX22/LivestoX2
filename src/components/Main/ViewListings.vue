<template>
    <div class="livestock-details-page">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center items-center py-12">
            <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" fill="var(--surface-ground)"
                animationDuration=".5s" aria-label="Loading" />
        </div>

        <div v-else class="container mx-auto px-4 py-6">
            <!-- Back button -->
            <Button icon="pi pi-arrow-left" label="Back to Listings" class="p-button-text mb-4" @click="goBack" />

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Left column: Images and videos -->
                <div class="col-span-1 lg:col-span-2">
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
                        <!-- Main image and badges -->
                        <div class="relative">
                            <img :src="livestock.imageUrl" :alt="livestock.title"
                                class="w-full h-64 md:h-96 object-cover" />
                            <span v-if="livestock.auction"
                                class="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded text-sm font-semibold">
                                Auction
                            </span>
                            <span v-if="livestock.certified"
                                class="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded text-sm font-semibold">
                                Certified
                            </span>
                        </div>

                        <!-- Thumbnail gallery -->
                        <div class="p-4">
                            <h4 class="text-sm font-medium text-gray-700 mb-2">Photo Gallery</h4>
                            <div class="flex gap-2 overflow-x-auto pb-2">
                                <div v-for="(image, index) in additionalImages" :key="index"
                                    class="flex-shrink-0 cursor-pointer border-2 rounded"
                                    :class="selectedImage === index ? 'border-blue-500' : 'border-transparent'"
                                    @click="selectImage(index)">
                                    <img :src="image" class="w-16 h-16 object-cover rounded" />
                                </div>
                            </div>

                            <!-- Video preview if available -->
                            <div v-if="livestock.videoUrl" class="mt-4">
                                <h4 class="text-sm font-medium text-gray-700 mb-2">Video Preview</h4>
                                <div class="relative bg-black rounded">
                                    <img :src="livestock.videoThumbnail"
                                        class="w-full h-40 object-cover opacity-70 rounded" />
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <Button icon="pi pi-play" class="p-button-rounded p-button-lg"
                                            @click="playVideo" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right column: Livestock details and actions -->
                <div class="col-span-1">
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-4 p-4">
                        <div class="flex justify-between items-start">
                            <h1 class="text-2xl font-bold text-gray-800">{{ livestock.title }}</h1>
                            <Button icon="pi pi-heart" :class="[
                                'p-button-rounded',
                                livestock.isFavorite ? 'p-button-danger' : 'p-button-outlined p-button-secondary'
                            ]" @click="toggleFavorite(livestock)" aria-label="Save Listing"
                                v-tooltip.top="livestock.isFavorite ? 'Remove from Favorites' : 'Save Listing'" />
                        </div>

                        <div class="flex items-center text-sm text-gray-600 mt-1 mb-4">
                            <i class="pi pi-map-marker mr-1"></i>
                            <span>{{ livestock.location }}</span>
                            <div class="mx-2 h-1 w-1 rounded-full bg-gray-400"></div>
                            <span>Listed {{ formatDate(livestock.listedDate) }}</span>
                        </div>

                        <div class="flex items-center">
                            <div class="text-2xl font-bold text-green-700">${{ formatPrice(livestock.price) }}</div>
                            <span v-if="livestock.negotiable" class="ml-2 text-sm text-gray-500">(Negotiable)</span>
                            <Badge v-if="livestock.availableImmediate" value="Available Now" severity="success"
                                class="ml-auto"></Badge>
                        </div>

                        <Divider />

                        <!-- Primary actions -->
                        <div class="flex gap-2 mb-4">
                            <Button label="Buy Now" icon="pi pi-shopping-cart" class="p-button-success flex-1"
                                @click="buyNow" />
                            <Button label="Contact Seller" icon="pi pi-comments" class="p-button-outlined flex-1"
                                @click="contactSeller" />
                        </div>

                        <!-- Quantity selection if multiple available -->
                        <div v-if="livestock.quantity > 1" class="mb-4">
                            <label class="text-sm text-gray-700 block mb-1">Quantity:</label>
                            <div class="flex items-center">
                                <Button icon="pi pi-minus" class="p-button-outlined p-button-sm"
                                    @click="decrementQuantity" :disabled="selectedQuantity <= 1" />
                                <InputNumber v-model="selectedQuantity" :min="1" :max="livestock.quantity"
                                    class="w-20 mx-2" :showButtons="false" />
                                <Button icon="pi pi-plus" class="p-button-outlined p-button-sm"
                                    @click="incrementQuantity" :disabled="selectedQuantity >= livestock.quantity" />
                                <span class="ml-3 text-sm text-gray-600">
                                    {{ livestock.quantity }} available
                                </span>
                            </div>
                        </div>
                    </div>

                    <!-- Seller information -->
                    <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-4 p-4">
                        <h2 class="text-lg font-semibold text-gray-800 mb-3">Seller Information</h2>

                        <div class="flex items-center mb-4">
                            <Avatar :image="seller.avatarUrl || '/src/assets/vue.svg'" shape="circle" class="mr-3" />
                            <div>
                                <div class="font-medium">{{ seller.name }}</div>
                                <div class="flex items-center text-sm">
                                    <Rating v-model="seller.rating" :cancel="false" readonly :stars="5" class="mr-1" />
                                    <span>{{ seller.rating }} ({{ seller.reviewCount }} reviews)</span>
                                </div>
                            </div>
                        </div>

                        <Button label="View Seller Profile" icon="pi pi-user" class="p-button-text w-full"
                            @click="viewSellerProfile" />

                        <Button v-if="seller.showPhoneNumber" label="Call Seller" icon="pi pi-phone"
                            class="p-button-text w-full" @click="callSeller" />
                    </div>

                    <!-- Report listing -->
                    <div class="text-center">
                        <Button label="Report Listing" icon="pi pi-flag" class="p-button-text p-button-sm text-gray-600"
                            @click="reportListing" />
                    </div>
                </div>
            </div>

            <!-- Details tabs -->
            <div class="mt-6">
                <TabView>
                    <TabPanel header="Description">
                        <div class="p-4 bg-white rounded-lg shadow-sm">
                            <p class="text-gray-700 whitespace-pre-line">{{ livestock.description }}</p>
                        </div>
                    </TabPanel>

                    <TabPanel header="Livestock Details">
                        <div class="p-4 bg-white rounded-lg shadow-sm">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div v-for="(detail, index) in livestockDetails" :key="index"
                                    class="flex flex-col p-3 bg-gray-50 rounded-lg">
                                    <span class="text-sm text-gray-600">{{ detail.label }}</span>
                                    <span class="font-medium text-gray-800 mt-1">{{ detail.value }}</span>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel header="Location & Delivery">
                        <div class="p-4 bg-white rounded-lg shadow-sm">
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 class="text-lg font-medium text-gray-800 mb-2">Location</h3>
                                    <p class="text-gray-700 mb-4">
                                        <i class="pi pi-map-marker mr-1"></i> {{ livestock.location }}
                                    </p>

                                    <!-- Map placeholder -->
                                    <div class="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                                        <img src="/src/assets/vue.svg" alt="Location Map" class="rounded-lg" />
                                    </div>
                                </div>

                                <div>
                                    <h3 class="text-lg font-medium text-gray-800 mb-2">Delivery Options</h3>
                                    <div class="bg-gray-50 p-3 rounded-lg mb-3">
                                        <div class="flex items-center">
                                            <i class="pi pi-truck mr-2 text-gray-600"></i>
                                            <div>
                                                <div class="font-medium">{{ livestock.deliveryOption }}</div>
                                                <div class="text-sm text-gray-600">{{ livestock.deliveryDetails }}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <h3 class="text-lg font-medium text-gray-800 mb-2">Restrictions</h3>
                                    <div class="bg-gray-50 p-3 rounded-lg">
                                        <div class="flex items-center">
                                            <i class="pi pi-info-circle mr-2 text-gray-600"></i>
                                            <div class="text-gray-700">{{ livestock.restrictions }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </TabPanel>

                    <TabPanel header="Reviews">
                        <div class="p-4 bg-white rounded-lg shadow-sm">
                            <div v-if="reviews.length > 0">
                                <div v-for="(review, index) in reviews" :key="index"
                                    class="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                                    <div class="flex items-start">
                                        <Avatar :image="review.avatarUrl || '/src/assets/vue.svg'" shape="circle"
                                            class="mr-3" />
                                        <div class="flex-grow">
                                            <div class="flex justify-between items-center">
                                                <div class="font-medium">{{ review.username }}</div>
                                                <div class="text-sm text-gray-500">{{ formatDate(review.date) }}</div>
                                            </div>
                                            <Rating :modelValue="review.rating" readonly :cancel="false" :stars="5" />
                                            <p class="mt-2 text-gray-700">{{ review.comment }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center py-6">
                                <i class="pi pi-comments text-4xl text-gray-300 mb-2"></i>
                                <p class="text-gray-500">No reviews yet for this listing</p>
                            </div>
                        </div>
                    </TabPanel>
                </TabView>
            </div>

            <!-- Similar listings -->
            <div class="mt-6">
                <h2 class="text-xl font-semibold text-gray-800 mb-4">Similar Listings</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <Card v-for="item in similarListings" :key="item.id" class="livestock-card">
                        <template #header>
                            <div class="relative">
                                <img :src="item.imageUrl" :alt="item.title" class="w-full h-40 object-cover" />
                                <span v-if="item.certified"
                                    class="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
                                    Certified
                                </span>
                            </div>
                        </template>

                        <template #title>
                            <h3 class="text-base font-bold text-gray-800">{{ item.title }}</h3>
                        </template>

                        <template #subtitle>
                            <div class="flex items-center text-xs text-gray-600">
                                <i class="pi pi-map-marker mr-1"></i>
                                <span>{{ item.location }}</span>
                            </div>
                        </template>

                        <template #content>
                            <div class="mt-2 text-base font-bold text-green-700">${{ formatPrice(item.price) }}</div>
                        </template>

                        <template #footer>
                            <Button label="View Details" class="p-button-outlined p-button-sm w-full"
                                @click="viewListing(item.id)" />
                        </template>
                    </Card>
                </div>
            </div>
        </div>

        <!-- Dialog for contacting seller -->
        <Dialog v-model:visible="contactDialogVisible" header="Contact Seller" :style="{ width: '450px' }">
            <div class="p-4">
                <InputText v-model="contactMessage" placeholder="Write your message" class="w-full mb-4" />
                <Button label="Send Message" icon="pi pi-send" class="w-full" @click="sendMessage" />
            </div>
        </Dialog>

        <!-- Dialog for video preview -->
        <Dialog v-model:visible="videoDialogVisible" header="Video Preview"
            :style="{ width: '80%', maxWidth: '800px' }">
            <div class="p-4">
                <div class="relative bg-black w-full rounded overflow-hidden" style="padding-top: 56.25%">
                    <img src="/src/assets/vue.svg" class="absolute inset-0 w-full h-full object-cover" />
                    <div class="absolute inset-0 flex items-center justify-center">
                        <i class="pi pi-play text-6xl text-white opacity-50"></i>
                    </div>
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
                    imageUrl: "/api/placeholder/800/600?text=Brahman+Cow",
                    videoThumbnail: "/api/placeholder/800/450?text=Video+Thumbnail",
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
                    "/api/placeholder/800/600?text=Brahman+Side+View",
                    "/api/placeholder/800/600?text=Brahman+Front+View",
                    "/api/placeholder/800/600?text=Brahman+Close+Up"
                ];

                // Mock seller data
                seller.value = {
                    id: 123,
                    name: "John Doe's Farm",
                    avatarUrl: "/api/placeholder/64/64?text=JD",
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
                        avatarUrl: "/api/placeholder/48/48?text=FM",
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
                for (let i = 0; i < 4; i++) {
                    items.push({
                        id: 1000 + i,
                        title: `${i % 2 === 0 ? 'Brahman' : 'Angus'} Cattle - ${i % 2 === 0 ? 'Female' : 'Male'}`,
                        description: "Sample description",
                        category: "Cattle",
                        breed: i % 2 === 0 ? "Brahman" : "Angus",
                        age: 2,
                        ageUnit: "years",
                        gender: i % 2 === 0 ? "Female" : "Male",
                        weight: 450,
                        weightUnit: "kg",
                        price: 900 + (i * 100),
                        negotiable: true,
                        quantity: 1,
                        location: `${['Cebu City', 'Mandaue City', 'Lapu-Lapu City', 'Toledo City'][i]}, Philippines`,
                        healthStatus: "Healthy",
                        feedingType: "Grass-fed",
                        imageUrl: `/api/placeholder/400/300?text=Similar+${i + 1}`,
                        certified: i % 3 === 0,
                        auction: false,
                        availableImmediate: true,
                        isFavorite: false,
                        listedDate: new Date(),
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
            // In a real app, this would initiate the purchase process
            alert(`Proceeding to purchase ${selectedQuantity.value} ${livestock.value.title}`);
        };

        const viewSellerProfile = () => {
            // In a real app, this would navigate to the seller's profile
            alert(`Viewing profile for ${seller.value.name}`);
        };

        const callSeller = () => {
            // In a real app, this would initiate a call or show the phone number
            if (seller.value.phoneNumber) {
                alert(`Calling seller at ${seller.value.phoneNumber}`);
            }
        };

        const reportListing = () => {
            // In a real app, this would open a form to report the listing
            alert('Report listing functionality');
        };

        const playVideo = () => {
            videoDialogVisible.value = true;
        };

        const viewListing = (id: number) => {
            // In a real app, this would navigate to the listing
            alert(`Viewing listing ${id}`);
        };

        const goBack = () => {
            // In a real app, this would navigate back
            alert('Going back to listings');
        };

        const formatPrice = (price: number): string => {
            return price.toLocaleString();
        };

        const formatDate = (date: Date): string => {
            // Calculate days ago
            const now = new Date();
            const diffTime = Math.abs(now.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                return 'Today';
            } else if (diffDays === 1) {
                return 'Yesterday';
            } else if (diffDays < 7) {
                return `${diffDays} days ago`;
            } else {
                return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            }
        };

        return {
            loading,
            livestock,
            seller,
            reviews,
            similarListings,
            additionalImages,
            selectedImage,
            selectedQuantity,
            contactDialogVisible,
            videoDialogVisible,
            contactMessage,
            livestockDetails,
            selectImage,
            toggleFavorite,
            incrementQuantity,
            decrementQuantity,
            contactSeller,
            sendMessage,
            buyNow,
            viewSellerProfile,
            callSeller,
            reportListing,
            playVideo,
            viewListing,
            goBack,
            formatPrice,
            formatDate
        };
    }
});
</script>

<style scoped>
.livestock-card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.livestock-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

:deep(.p-card) {
    @apply border border-gray-200;
}

:deep(.p-tabview-nav) {
    @apply border-b border-gray-200;
}

:deep(.p-tabview-nav li.p-highlight .p-tabview-nav-link) {
    @apply border-blue-500 text-blue-600;
}

:deep(.p-tabview-panels) {
    @apply p-0;
}

:deep(.p-dropdown) {
    @apply text-sm;
}

:deep(.p-button-sm) {
    @apply text-xs py-1 px-2;
}

/* Style for the image gallery scroll behavior */
:deep(.overflow-x-auto) {
    -webkit-overflow-scrolling: touch;
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05);
}

:deep(.overflow-x-auto::-webkit-scrollbar) {
    height: 6px;
}

:deep(.overflow-x-auto::-webkit-scrollbar-track) {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
}

:deep(.overflow-x-auto::-webkit-scrollbar-thumb) {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 3px;
}
</style>