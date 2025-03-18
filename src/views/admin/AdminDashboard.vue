<script lang="ts">
import { defineComponent, ref } from 'vue';
import SideBar from '../../components/Admin/SideBar.vue';

export default defineComponent({
  name: 'SidebarOnly',
  components: {
    SideBar
  },
  setup() {
    const sidebarCollapsed = ref(false);

    const handleSidebarCollapse = (collapsed: boolean) => {
      sidebarCollapsed.value = collapsed;
    };

    return {
      sidebarCollapsed,
      handleSidebarCollapse
    };
  }
});
</script>

<template>
  <div class="layout">
    <!-- Sidebar -->
    <SideBar :collapsed="sidebarCollapsed" @collapse-change="handleSidebarCollapse" />

    <!-- Main Content -->
    <div class="content">
      <h1>Welcome to the Admin Panel</h1>
      <p>Manage users, view reports, and configure settings.</p>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.content {
  flex-grow: 1;
  padding: 20px;
  transition: margin-left 0.3s ease;
}
</style>
