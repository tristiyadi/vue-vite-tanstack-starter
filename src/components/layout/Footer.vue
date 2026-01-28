<script setup lang="ts">
import { Zap } from 'lucide-vue-next'
</script>

<template>
  <footer class="border-t border-border bg-background py-12 md:py-16">
    <div class="container">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        <div class="col-span-2 lg:col-span-2">
          <div class="flex items-center gap-2 font-bold text-xl mb-4">
            <div class="rounded-lg bg-primary p-1">
              <Zap class="h-5 w-5 text-primary-foreground" />
            </div>
            <span>VueStarter</span>
          </div>
          <p class="text-muted-foreground text-sm max-w-xs mb-6">
            Building the future of web applications with Vue 3, Tailwind CSS v4, and modern engineering practices.
          </p>
        </div>
        
        <div>
          <h4 class="font-bold text-sm mb-4">Product</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#features" class="hover:text-primary transition-colors">Features</a></li>
            <li><a href="#pricing" class="hover:text-primary transition-colors">Pricing</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Documentation</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-sm mb-4">Company</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-primary transition-colors">About</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Blog</a></li>
            <li><a href="https://trimogo.com" target="_blank" class="hover:text-primary transition-colors">Trimogo</a></li>
          </ul>
        </div>

        <div>
          <h4 class="font-bold text-sm mb-4">Legal</h4>
          <ul class="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" class="hover:text-primary transition-colors">Privacy</a></li>
            <li><a href="#" class="hover:text-primary transition-colors">Terms</a></li>
          </ul>
        </div>
      </div>
      
      <div class="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
        <p>© 2026 VueStarter. All rights reserved.</p>
        <div class="flex gap-6">
          <a href="https://twitter.com/ekotristiyadi" target="_blank" class="hover:text-primary transition-colors">Twitter</a>
          <a href="https://github.com/tristiyadi" target="_blank" class="hover:text-primary transition-colors">GitHub</a>
          <a href="https://linkedin.com/in/ekotristiyadi" target="_blank" class="hover:text-primary transition-colors">LinkedIn</a>
        </div>
      </div>
    </div>
  </footer>
</template>
