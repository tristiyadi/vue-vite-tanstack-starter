<script setup lang="ts">
import PublicNavbar from './PublicNavbar.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background">
    <PublicNavbar />
    
    <main class="flex-grow">
      <router-view v-slot="{ Component }">
        <transition 
          enter-active-class="transform transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transform transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />
  </div>
</template>
