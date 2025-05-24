<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from './stores/authContext'
import { supabase } from './supabase'

const authStore = useAuthStore()

onMounted(async () => {
  await authStore.getSession()

  supabase.auth.onAuthStateChange((_, session) => {
    authStore.session = session
    authStore.user = session?.user || null
  })
})
</script>

<template>
  <router-view />
</template>
