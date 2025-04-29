<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Toast from 'primevue/toast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Divider from 'primevue/divider';
import ProgressSpinner from 'primevue/progressspinner';
import Carousel from '../../components/Landing/Carousel.vue';
import { signIn } from '../../lib/aut';
import imageUrl from '/src/assets/vue.svg';
import { useAuthStore } from '../../stores/authContext';

export default defineComponent({
    name: 'SignInPage',
    components: {
        Toast,
        InputText,
        Password,
        Button,
        Checkbox,
        Divider,
        ProgressSpinner,
        Carousel
    },
    setup() {
        const router = useRouter();
        const toast = useToast();

        const email = ref<string>('');
        const password = ref<string>('');
        const loading = ref<boolean>(false);
        const submitted = ref<boolean>(false);
        const rememberMe = ref<boolean>(false);
        
        // Define carousel slides data
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

        const authStore = useAuthStore();

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
                // await new Promise(resolve => setTimeout(resolve, 1000));
                await signIn(email.value, password.value);

                // Mock successful login
                toast.add({
                    severity: 'success',
                    summary: 'Welcome Back',
                    detail: `You have successfully signed in to LivestoX, ${email.value}!`,
                    life: 3000
                });

                // Navigate to dashboard or home page
                router.push('/main/LivestockMarket');
            } catch (error) {
                const errorMessage = (error instanceof Error) ? error.message : 'Authentication Failed. Please try again.';
                toast.add({
                    severity: 'error',
                    summary: 'Authentication Failed',
                    detail: errorMessage,
                    life: 3000
                });
            } finally {
                loading.value = false;
            }
        };

        onMounted(() => {
            if(authStore.session) {
                router.push('/main/LivestockMarket');
            };
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
            logoPath: imageUrl
        };
    }
});
</script>

<template>
    <div class="flex min-h-screen bg-gradient-to-b from-green-200 to-green-900">
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
                                <img :src="logoPath" alt="Logo" class="w-16 h-16 object-contain">
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

                            <router-link to="/forgotpassword"
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

            <!-- Right side with carousel component -->
            <div class="w-full md:w-1/2">
                <Carousel :slides="carouselSlides" :logo-path="logoPath" />
            </div>
        </div>
    </div>
</template>