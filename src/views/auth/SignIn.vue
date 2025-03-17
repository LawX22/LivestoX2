<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';
import Divider from 'primevue/divider';
import ProgressSpinner from 'primevue/progressspinner';

export default defineComponent({
    name: 'SignInPage',
    components: {
        Toast,
        InputText,
        Password,
        Button,
        Checkbox,
        Card,
        Avatar,
        Divider,
        ProgressSpinner
    },
    setup() {
        const router = useRouter();
        const toast = useToast();

        const email = ref<string>('');
        const password = ref<string>('');
        const loading = ref<boolean>(false);
        const submitted = ref<boolean>(false);
        const rememberMe = ref<boolean>(false);
        const currentSlide = ref<number>(0);
        const autoplayInterval = ref<number | null>(null);

        const carouselSlides = [
            {
                image: "https://images.unsplash.com/photo-1516467508483-a7212febe31a",
                title: "Welcome Back to LivestoX",
                subtitle: "Your trusted Livestock Online Marketplace",
                quote: "Healthy livestock, thriving farms - our animals are the heart of our fields.",
                author: "John Farmer",
                role: "Livestock Specialist"
            },
            {
                image: "https://images.unsplash.com/photo-1558343434-a78f1bc6c604",
                title: "Quality Livestock",
                subtitle: "Connect with verified breeders",
                quote: "LivestoX has transformed how I source quality livestock for my farm.",
                author: "Sarah Williams",
                role: "Ranch Owner"
            },
            {
                image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30",
                title: "Grow Your Business",
                subtitle: "Reach more buyers nationwide",
                quote: "Since joining LivestoX, my sales have increased by 40% in just six months.",
                author: "Michael Thompson",
                role: "Cattle Breeder"
            },
            {
                image: "https://images.unsplash.com/photo-1605152276897-4f618f831968",
                title: "Secure Transactions",
                subtitle: "Safe and verified marketplace",
                quote: "The secure payment system gives me peace of mind with every transaction.",
                author: "Emma Rodriguez",
                role: "Farm Manager"
            }
        ];

        const nextSlide = () => {
            currentSlide.value = (currentSlide.value + 1) % carouselSlides.length;
        };

        const prevSlide = () => {
            currentSlide.value = (currentSlide.value - 1 + carouselSlides.length) % carouselSlides.length;
        };

        const setSlide = (index: number) => {
            currentSlide.value = index;
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval.value = window.setInterval(() => {
                nextSlide();
            }, 5000);
        };

        const stopAutoplay = () => {
            if (autoplayInterval.value) {
                clearInterval(autoplayInterval.value);
                autoplayInterval.value = null;
            }
        };

        const handleSubmit = async () => {
            submitted.value = true;

            if (!email.value || !password.value) {
                toast.add({
                    severity: 'warn',
                    summary: 'Missing Information',
                    detail: 'Please fill in all required fields',
                    life: 3000
                });
                return;
            }

            try {
                loading.value = true;

                // Replace with your actual authentication logic
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock successful login
                toast.add({
                    severity: 'success',
                    summary: 'Welcome Back',
                    detail: `You have successfully signed in to LivestoX, ${email.value}!`,
                    life: 3000
                });

                // Navigate to dashboard or home page
                router.push('/dashboard');
            } catch (error) {
                toast.add({
                    severity: 'error',
                    summary: 'Authentication Failed',
                    detail: 'Please check your email and password',
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            startAutoplay();
            // Show a welcome toast when component mounts
            setTimeout(() => {
                toast.add({
                    severity: 'info',
                    summary: 'Welcome',
                    detail: 'Welcome to LivestoX, your livestock marketplace',
                    life: 3000
                });
            }, 500);
        });

        return {
            email,
            password,
            loading,
            submitted,
            rememberMe,
            handleSubmit,
            carouselSlides,
            currentSlide,
            nextSlide,
            prevSlide,
            setSlide,
            startAutoplay,
            stopAutoplay
        };
    }
});
</script>

<template>
    <div class="flex min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <Toast position="top-right" />
        <div class="flex flex-col md:flex-row bg-white rounded-3xl shadow-2xl m-auto w-full max-w-6xl overflow-hidden">
            <!-- Left side with form -->
            <div class="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative">
                <!-- Background pattern -->
                <div class="absolute inset-0 opacity-5 z-0">
                    <div class="absolute inset-0"
                        style="background-image: url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%239AE6B4\' fill-opacity=\'0.4\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E');">
                    </div>
                </div>

                <!-- Content -->
                <div class="relative z-10">
                    <div class="mb-8 text-center">
                        <div class="flex justify-center items-center mb-6">
                            <div class="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-md">
                                <img src="C:\Users\mrlaw\Desktop\livestox_v2.1\src\assets\vue.svg" alt="Logo"
                                    class="w-16 h-16 object-contain">
                            </div>
                        </div>

                        <h1 class="text-3xl font-bold mb-3 text-green-700">Welcome back</h1>
                        <p class="text-gray-600">Please enter your details to access your account.</p>
                    </div>

                    <form @submit.prevent="handleSubmit" class="w-full max-w-md mx-auto">
                        <div class="mb-6">
                            <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
                            <InputText id="email" v-model="email" placeholder="Enter your email address"
                                class="w-full p-3" :class="{ 'p-invalid': submitted && !email }"
                                aria-describedby="email-error" />
                            <small id="email-error" v-if="submitted && !email" class="p-error block mt-1">Email
                                is required.</small>
                        </div>

                        <div class="mb-6">
                            <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
                            <Password id="password" v-model="password" placeholder="Enter your password" class="w-full"
                                :feedback="true" toggleMask :class="{ 'p-invalid': submitted && !password }"
                                aria-describedby="password-error" inputClass="p-3" />
                            <small id="password-error" v-if="submitted && !password" class="p-error block mt-1">Password
                                is required.</small>
                        </div>

                        <div class="flex justify-between mb-6">
                            <div class="flex items-center">
                                <Checkbox v-model="rememberMe" inputId="rememberMe" binary
                                    class="mr-2 border border-gery-500 rounded-md" />
                                <label for="rememberMe" class="text-gray-700">Remember me</label>
                            </div>

                            <router-link to="/forgot-password"
                                class="text-green-600 hover:text-green-800 font-medium transition-colors">
                                Forgot password?
                            </router-link>
                        </div>

                        <Button type="submit" label="Sign In" class="w-full mb-6 p-3 shadow-lg" :loading="loading" />

                        <Divider align="center">
                            <span class="p-tag bg-white text-gray-500 border border-gray-200 px-3 py-1 rounded-full">Or
                                continue with</span>
                        </Divider>

                        <div class="flex justify-center gap-4 my-8">
                            <Button type="button" icon="pi pi-google" class="p-button-outlined p-button-rounded p-3" />
                            <Button type="button" icon="pi pi-facebook"
                                class="p-button-outlined p-button-rounded p-3" />
                            <Button type="button" icon="pi pi-apple" class="p-button-outlined p-button-rounded p-3" />
                        </div>

                        <div class="text-center mt-6">
                            <p class="text-gray-700">
                                Don't have an account?
                                <router-link to="/signup"
                                    class="text-green-600 hover:text-green-800 font-medium ml-1 transition-colors">
                                    Create Account
                                </router-link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Right side with carousel -->
            <div class="w-full md:w-1/2 relative bg-green-800 overflow-hidden">
                <div class="carousel-container h-full">
                    <transition-group name="slide">
                        <div v-for="(slide, index) in carouselSlides" :key="index" v-show="currentSlide === index"
                            class="carousel-slide absolute inset-0" @mouseenter="stopAutoplay"
                            @mouseleave="startAutoplay">
                            <div
                                class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black bg-opacity-60 z-10">
                            </div>
                            <div
                                class="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-8 text-center">
                                <div class="flex justify-center items-center mb-6">
                                    <div class="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-md">
                                        <img src="C:\Users\mrlaw\Desktop\livestox_v2.1\src\assets\vue.svg" alt="Logo"
                                            class="w-16 h-16 object-contain">
                                    </div>
                                </div>

                                <h2 class="text-4xl font-bold mb-4 drop-shadow-lg">{{ slide.title }}</h2>
                                <p class="text-xl mb-8 drop-shadow">{{ slide.subtitle }}</p>
                                <div class="max-w-md transform hover:scale-105 transition-transform duration-300">
                                    <Card class="bg-opacity-10 backdrop-filter backdrop-blur-sm border-0 shadow-xl">
                                        <template #content>
                                            <i class="pi pi-quote-left text-green-300 text-2xl mb-2"></i>
                                            <p class="text-lg mb-4 text-green-200">{{ slide.quote }}</p>
                                            <div class="flex items-center">
                                                <Avatar icon="pi pi-user" shape="circle" class="bg-green-500" />
                                                <div class="ml-3">
                                                    <h4 class="font-medium mb-0 text-green-200">{{ slide.author }}</h4>
                                                    <p class="text-sm text-green-200">{{ slide.role }}</p>
                                                </div>
                                            </div>
                                        </template>
                                    </Card>
                                </div>
                            </div>
                            <img :src="`${slide.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=2652&q=80`"
                                :alt="slide.title"
                                class="w-full h-full object-cover transform scale-105 animate-slow-zoom" />
                        </div>
                    </transition-group>

                    <!-- Carousel indicators -->
                    <div class="absolute bottom-6 left-0 right-0 flex justify-center z-30">
                        <div v-for="(slide, index) in carouselSlides" :key="`dot-${index}`" @click="setSlide(index)"
                            class="w-3 h-3 mx-1 rounded-full cursor-pointer transition-all duration-300"
                            :class="currentSlide === index ? 'bg-white scale-125' : 'bg-white bg-opacity-50'"></div>
                    </div>

                    <!-- Carousel navigation arrows -->
                    <button @click="prevSlide"
                        class="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 text-white transition-all duration-300 hover:scale-110">
                        <i class="pi pi-chevron-left"></i>
                    </button>
                    <button @click="nextSlide"
                        class="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-30 hover:bg-opacity-50 rounded-full p-3 text-white transition-all duration-300 hover:scale-110">
                        <i class="pi pi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
:deep(.p-password-input) {
    width: 100%;
}

:deep(.p-password .p-password-panel) {
    border-radius: 12px;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

:deep(.p-inputtext) {
    border: 1px solid #898b8957;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

:deep(.p-inputtext:enabled:hover) {
    border-color: #a7f3d0;
}

:deep(.p-button) {
    background-color: #34d399;
    border-color: #34d399;
    transition: all 0.3s ease;
    font-weight: 600;
    border-radius: 12px;
    padding: 0.75rem 1.5rem;
    font-size: 1.05rem;
}

:deep(.p-button:hover) {
    background-color: #10b981;
    border-color: #10b981;
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(52, 211, 153, 0.3);
}

:deep(.p-button:active) {
    transform: translateY(0);
    box-shadow: 0 4px 8px rgba(52, 211, 153, 0.2);
}

:deep(.p-inputtext:focus) {
    border-color: #34d399;
    box-shadow: 0 0 0 2px rgba(52, 211, 153, 0.2);
}

:deep(.p-button-outlined) {
    color: #34d399;
    background: #f0fdf4;
    border: 1px solid #a7f3d0;
}

:deep(.p-button-outlined:hover) {
    background: #dcfce7;
    border-color: #34d399;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(52, 211, 153, 0.15);
}

:deep(.p-card) {
    background-color: rgba(255, 255, 255, 0.348);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    border-radius: 16px;
}

/* Removed floating label styles since we're using static labels now */

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight) {
    border-color: #34d399;
    background: #34d399;
}

:deep(.p-checkbox:not(.p-checkbox-disabled) .p-checkbox-box.p-highlight:hover) {
    border-color: #10b981;
    background: #10b981;
}

:deep(.p-divider .p-divider-content) {
    background-color: white;
}

:deep(.p-toast .p-toast-message) {
    border-radius: 12px;
    backdrop-filter: blur(4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

:deep(.p-toast .p-toast-message.p-toast-message-info) {
    background: rgba(165, 243, 252, 0.9);
    border-left: 6px solid #06b6d4;
}

:deep(.p-toast .p-toast-message.p-toast-message-success) {
    background: rgba(167, 243, 208, 0.9);
    border-left: 6px solid #10b981;
}

:deep(.p-toast .p-toast-message.p-toast-message-warn) {
    background: rgba(254, 215, 170, 0.9);
    border-left: 6px solid #f59e0b;
}

:deep(.p-toast .p-toast-message.p-toast-message-error) {
    background: rgba(252, 165, 165, 0.9);
    border-left: 6px solid #ef4444;
}

:deep(.p-toast .p-toast-message .p-toast-message-content .p-toast-summary) {
    font-weight: 600;
}

:deep(.p-toast .p-toast-message .p-toast-message-content .p-toast-detail) {
    margin-top: 0.25rem;
}

/* Carousel transitions */
.slide-enter-active,
.slide-leave-active {
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.slide-enter-to,
.slide-leave-from {
    opacity: 1;
    transform: translateX(0);
}

/* Shadow and other UI effects */
.shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Animation for background image */
@keyframes slow-zoom {
    0% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.05);
    }

    100% {
        transform: scale(1);
    }
}

.animate-slow-zoom {
    animation: slow-zoom 20s infinite ease-in-out;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .carousel-container {
        height: 300px;
    }

    :deep(.p-toast) {
        width: 90%;
        max-width: 300px;
    }
}
</style>