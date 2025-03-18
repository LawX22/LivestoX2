<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, PropType } from 'vue';
import Card from 'primevue/card';
import Avatar from 'primevue/avatar';

interface CarouselSlide {
    image: string;
    title: string;
    subtitle: string;
    quote: string;
    author: string;
    role: string;
}

export default defineComponent({
    name: 'CarouselComponent',
    components: {
        Card,
        Avatar
    },
    props: {
        slides: {
            type: Array as PropType<CarouselSlide[]>,
            required: true
        },
        autoplayDuration: {
            type: Number,
            default: 5000
        },
        logoPath: {
            type: String,
            default: ''
        }
    },
    setup(props) {
        const currentSlide = ref<number>(0);
        const autoplayInterval = ref<number | null>(null);

        const nextSlide = () => {
            currentSlide.value = (currentSlide.value + 1) % props.slides.length;
        };

        const prevSlide = () => {
            currentSlide.value = (currentSlide.value - 1 + props.slides.length) % props.slides.length;
        };

        const setSlide = (index: number) => {
            currentSlide.value = index;
        };

        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval.value = window.setInterval(() => {
                nextSlide();
            }, props.autoplayDuration);
        };

        const stopAutoplay = () => {
            if (autoplayInterval.value) {
                clearInterval(autoplayInterval.value);
                autoplayInterval.value = null;
            }
        };

        onMounted(() => {
            startAutoplay();
        });

        onBeforeUnmount(() => {
            stopAutoplay();
        });

        return {
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
    <div class="carousel-container h-full relative bg-green-800 overflow-hidden">
        <transition-group name="slide">
            <div v-for="(slide, index) in slides" :key="index" v-show="currentSlide === index"
                class="carousel-slide absolute inset-0" @mouseenter="stopAutoplay"
                @mouseleave="startAutoplay">
                <div
                    class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black bg-opacity-60 z-10">
                </div>
                <div
                    class="absolute inset-0 flex flex-col justify-center items-center text-white z-20 p-8 text-center">
                    <div class="flex justify-center items-center mb-6">
                        <div class="bg-green-500 bg-opacity-20 p-4 rounded-full shadow-md">
                            <slot name="logo">
                                <!-- Default logo or use passed logo path -->
                                <img v-if="logoPath" :src="logoPath" alt="Logo" class="w-16 h-16 object-contain">
                                <div v-else class="w-16 h-16 flex items-center justify-center text-white">
                                    <i class="pi pi-home text-4xl"></i>
                                </div>
                            </slot>
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
            <div v-for="(_, index) in slides" :key="`dot-${index}`" @click="setSlide(index)"
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
</template>