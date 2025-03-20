<template>
  <div class="main-container">
    <!-- Include the NavBar component at the top -->
    <NavBar />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from '../../components/Main/NavBar.vue'; 

export default defineComponent({
  name: 'LivestockMarket',
  components: {
    NavBar
  }
});
</script>

<style scoped>

</style>