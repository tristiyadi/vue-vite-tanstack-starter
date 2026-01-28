<script setup lang="ts">
import { Hammer, Mail, Clock, ArrowLeft } from 'lucide-vue-next';
import Button from '@/components/ui/Button.vue';
</script>

<template>
  <div class="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
    <!-- Abstract Background Decorations -->
    <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>

    <div class="max-w-2xl w-full text-center space-y-8 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <!-- Icon Container -->
      <div class="inline-flex p-4 rounded-3xl bg-primary/10 border border-primary/20 shadow-2xl shadow-primary/10 mb-4 animate-bounce-slow">
        <Hammer class="h-12 w-12 text-primary" />
      </div>

      <div class="space-y-4">
        <h1 class="text-4xl md:text-6xl font-black tracking-tight text-foreground">
          Under <span class="text-primary italic">Maintenance</span>
        </h1>
        <p class="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
          We're currently fine-tuning our system to provide you with a even better experience. We'll be back shortly!
        </p>
      </div>

      <!-- Info Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-xl mx-auto">
        <div class="glass p-6 rounded-2xl border border-white/10 shadow-xl space-y-2">
          <div class="flex items-center gap-2 text-primary font-bold">
            <Clock class="h-4 w-4" />
            Estimated Return
          </div>
          <p class="text-sm text-muted-foreground">Approx. 2 hours from now. We appreciate your patience.</p>
        </div>
        
        <div class="glass p-6 rounded-2xl border border-white/10 shadow-xl space-y-2">
          <div class="flex items-center gap-2 text-primary font-bold">
            <Mail class="h-4 w-4" />
            Contact Support
          </div>
          <p class="text-sm text-muted-foreground">If you need urgent assistance, please email support@example.com.</p>
        </div>
      </div>

      <div class="pt-8">
        <Button as-child variant="outline" class="gap-2 rounded-full px-8 hover:scale-105 transition-transform">
          <router-link to="/">
            <ArrowLeft class="h-4 w-4" />
            Try Refreshing
          </router-link>
        </Button>
      </div>
    </div>

    <!-- Footer Quote -->
    <div class="absolute bottom-8 text-center w-full px-6">
      <p class="text-xs text-muted-foreground/50 uppercase tracking-[0.3em] font-bold">
        Quality is worth the wait
      </p>
    </div>
  </div>
</template>

<style scoped>
.glass {
  background: rgba(var(--primary), 0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.animate-bounce-slow {
  animation: bounce-slow 3s infinite ease-in-out;
}

@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}
</style>
