<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Zap, ChevronDown, LayoutDashboard, LogOut, User } from 'lucide-vue-next'
import Cookies from 'js-cookie'
import { useLogout } from '@/composables/auth/useAuth'
import Button from '@/components/ui/Button.vue'
import ThemeToggle from './ThemeToggle.vue'

const userDropdownOpen = ref(false)
const userDropdownRef = ref<HTMLDivElement | null>(null)
const logoutAction = useLogout()

const token = computed(() => Cookies.get('token'))
const userRaw = computed(() => Cookies.get('user'))
const user = computed(() => userRaw.value ? JSON.parse(userRaw.value) : null)

const dashboardPath = computed(() => {
  if (!user.value) return '/login'
  return Number(user.value.role_id) === 1 ? '/admin/dashboard' : '/portal/dashboard'
})

const userInitial = computed(() => {
  if (!user.value?.name) return '??'
  return user.value.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    logoutAction()
    userDropdownOpen.value = false
  }
}

const handleClickOutside = (event: MouseEvent) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target as Node)) {
    userDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
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
        
        <!-- Authenticated User Dropdown -->
        <div v-if="token && user" class="relative" ref="userDropdownRef">
          <button
            @click="userDropdownOpen = !userDropdownOpen"
            class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <div class="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <span class="text-xs font-semibold text-primary uppercase">{{ userInitial }}</span>
            </div>
            <span class="hidden sm:block text-sm font-medium">{{ user?.name }}</span>
            <ChevronDown class="h-4 w-4 text-muted-foreground" />
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-2"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-2"
          >
            <div v-if="userDropdownOpen" class="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden p-1.5 space-y-0.5">
              <div class="px-3 py-2 border-b border-border/50 mb-1">
                <p class="text-sm font-bold truncate">{{ user?.name }}</p>
                <p class="text-[10px] text-muted-foreground truncate">{{ user?.email }}</p>
              </div>
              
              <router-link 
                :to="dashboardPath" 
                class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group"
                @click="userDropdownOpen = false"
              >
                <LayoutDashboard class="h-4 w-4 group-hover:text-primary" />
                <span>Go to Dashboard</span>
              </router-link>

              <router-link 
                :to="`${dashboardPath.replace('/dashboard', '/profile')}`" 
                class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group"
                @click="userDropdownOpen = false"
              >
                <User class="h-4 w-4 group-hover:text-primary" />
                <span>My Profile</span>
              </router-link>

              <div class="h-[1px] bg-border my-1 mx-2"></div>

              <button 
                @click="handleLogout"
                class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors group"
              >
                <LogOut class="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span class="font-medium">Sign out</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- Guest Buttons -->
        <div v-else class="hidden sm:flex items-center gap-2">
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
