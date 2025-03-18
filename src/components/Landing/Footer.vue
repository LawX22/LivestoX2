<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AppFooter',
  setup() {
    const footerLinks = [
      { name: 'About', href: '#' },
      { name: 'Farmers', href: '#' },
      { name: 'Livestock', href: '#' },
      { name: 'Mission & Vision', href: '#' },
      { name: 'Contact', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' }
    ];

    const socialLinks = [
      { name: 'Facebook', icon: 'pi-facebook', href: '#' },
      { name: 'Instagram', icon: 'pi-instagram', href: '#' },
      { name: 'Twitter', icon: 'pi-twitter', href: '#' }
    ];

    return {
      footerLinks,
      socialLinks,
      currentYear: new Date().getFullYear()
    };
  }
});
</script>

<template>
  <footer class="bg-green-900">
    <div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav class="flex flex-wrap justify-center -mx-5 -my-2">
        <div v-for="link in footerLinks" :key="link.name" class="px-5 py-2">
          <a :href="link.href" class="text-base text-green-200 hover:text-white transition duration-300">
            {{ link.name }}
          </a>
        </div>
      </nav>
      
      <div class="mt-8 flex justify-center space-x-6">
        <a v-for="social in socialLinks" :key="social.name" :href="social.href" class="text-green-200 hover:text-white transition duration-300">
          <span class="sr-only">{{ social.name }}</span>
          <i :class="['pi', social.icon, 'text-xl']"></i>
        </a>
      </div>
      
      <p class="mt-8 text-center text-base text-green-200">
        &copy; {{ currentYear }} LivestoX. All rights reserved.
      </p>
    </div>
  </footer>
</template>