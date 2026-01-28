<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import ThemeToggle from './ThemeToggle.vue'
</script>

<template>
  <nav class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div class="container flex h-16 items-center justify-between">
      <div class="flex items-center gap-2">
        <router-link to="/" class="flex items-center gap-2 font-bold text-xl">
          <div class="rounded-lg bg-primary p-1">
            <Zap class="h-6 w-6 text-primary-foreground" />
          </div>
          <span class="gradient-primary bg-clip-text text-transparent">VueStarter</span>
        </router-link>
      </div>

      <div class="hidden md:flex items-center gap-6 text-sm font-medium">
        <a href="#features" class="transition-colors hover:text-primary">Features</a>
        <a href="#pricing" class="transition-colors hover:text-primary">Pricing</a>
        <a href="https://trimogo.com" target="_blank" class="transition-colors hover:text-primary">Trimogo</a>
      </div>

      <div class="flex items-center gap-4">
        <ThemeToggle />
        
        <div class="hidden sm:flex items-center gap-2">
          <Button variant="ghost" as-child>
            <router-link to="/login">Login</router-link>
          </Button>
          <Button as-child>
            <router-link to="/register">Get Started</router-link>
          </Button>
        </div>
      </div>
    </div>
  </nav>
</template>
