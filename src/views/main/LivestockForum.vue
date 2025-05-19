<script setup lang="ts">
import NavBar from '../../components/Main/NavBar.vue';
import MainContent from '../../components/Main/Forum/MainContent.vue';
import Sidebar from '../../components/Main/Forum/SideBar.vue';
import Footer from '../../components/Main/Forum/Footer.vue';
</script>

<template>
    <div class="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex flex-col">
        <!-- Fixed Navbar -->
        <div class="sticky top-0 z-50 w-full">
            <NavBar />
        </div>

        <!-- Hero section with parallax effect -->
        <div class="relative bg-gradient-to-r from-green-500 to-green-800 py-12 px-4 mb-8 shadow-xl overflow-hidden">
            <div class="container mx-auto max-w-full px-4 sm:px-6 lg:px-8 relative z-10">
                <h1 class="text-5xl font-bold text-white mb-3 tracking-tight">Livestock Forum</h1>
                <p class="text-green-100 text-xl max-w-3xl leading-relaxed">Connect with fellow farmers, ranchers, and
                    livestock enthusiasts to share knowledge and best practices in animal husbandry.</p>
            </div>
            <!-- Decorative farm silhouette with parallax effect -->
            <div
                class="absolute bottom-0 right-0 text-green-700 opacity-20 text-9xl transform translate-y-1/4 -translate-x-1/4">
                <div class="flex space-x-4">
                    <span>🐄</span>
                    <span>🐑</span>
                    <span>🐔</span>
                    <span>🐖</span>
                    <span>🐐</span>
                </div>
            </div>
        </div>

        <!-- Main content area with sidebar -->
        <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col md:flex-row gap-6">
            <!-- Sidebar -->
            <Sidebar />

            <!-- Main content -->
            <MainContent />
        </div>

        <!-- Footer -->
        <Footer />
    </div>
</template>

