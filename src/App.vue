<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { supabase } from './lib/supabaseClient'

const session = ref()
onMounted(() => {
    supabase.auth.getSession().then(({ data }) => {
        session.value = data.session
        if (data.session?.user) {
          console.log('User Metadata:', data.session.user.user_metadata);  // Accessing user metadata
        }
    })
    supabase.auth.onAuthStateChange((_, _session) => {
        session.value = _session
    })
})
</script>
<template>
    <router-view></router-view>
</template>