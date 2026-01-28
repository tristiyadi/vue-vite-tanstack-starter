<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { 
  Bell, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  Search, 
  Settings, 
  ShieldCheck, 
  Users, 
  X,
  List,
  ChevronDown,
  ChevronRight,
  UserCog
} from "lucide-vue-next";
import { useLogout } from "../../composables/auth/useAuth";
import Cookies from "js-cookie";
import Button from '@/components/ui/Button.vue';
import ThemeToggle from './ThemeToggle.vue';

const sidebarOpen = ref(true);
const userDropdownOpen = ref(false);
const notificationsOpen = ref(false);
const route = useRoute();
const logoutAction = useLogout();

const userRaw = Cookies.get('user');
const user = userRaw ? JSON.parse(userRaw) : null;

const userInitial = computed(() => {
  if (!user?.name) return '??';
  return user.name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
});

interface NavItem {
  icon: any;
  label: string;
  path?: string;
  children?: { icon: any; label: string; path: string }[];
}

const expandedGroups = ref<Record<string, boolean>>({
  'User Managements': true
});

const toggleGroup = (label: string) => {
  if (!sidebarOpen.value) {
    sidebarOpen.value = true;
  }
  expandedGroups.value[label] = !expandedGroups.value[label];
};

const currentPrefix = computed(() => route.path.startsWith('/portal') ? '/portal' : '/admin');

const filteredNavItems = computed(() => {
  const prefix = currentPrefix.value;

  const baseItems: NavItem[] = [
    { icon: LayoutDashboard, label: "Dashboard", path: `${prefix}/dashboard` },
    { 
      label: "User Managements", 
      icon: UserCog,
      children: [
        { icon: Users, label: "Users", path: `${prefix}/users` },
        { icon: ShieldCheck, label: "Roles", path: `${prefix}/roles` },
        { icon: List, label: "Menus", path: `${prefix}/menus` },
      ]
    },
    { icon: Settings, label: "Settings", path: `${prefix}/settings` },
  ];

  if (user?.role_id === 1) {
    return baseItems;
  }
  
  return baseItems.filter(item => 
      item.label === "Dashboard" || item.label === "Settings"
  );
});

const isActive = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/');
};

const isGroupActive = (item: any) => {
  if (!item.children) return isActive(item.path);
  return item.children.some((child: any) => isActive(child.path));
};

const handleLogout = () => {
  if (confirm('Are you sure you want to logout?')) {
    logoutAction();
  }
};

// Outside click handling
import { onMounted, onUnmounted } from 'vue';

const userDropdownRef = ref<HTMLDivElement | null>(null);
const notificationsRef = ref<HTMLDivElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (userDropdownRef.value && !userDropdownRef.value.contains(event.target as Node)) {
    userDropdownOpen.value = false;
  }
  if (notificationsRef.value && !notificationsRef.value.contains(event.target as Node)) {
    notificationsOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});
</script>

<template>
  <div class="min-h-screen flex bg-background">
    <!-- Sidebar -->
    <aside
      :class="[
        sidebarOpen ? 'w-64' : 'w-20',
        'bg-card border-r border-border transition-all duration-300 flex flex-col sticky top-0 h-screen'
      ]"
    >
      <div class="h-16 flex items-center justify-between px-4 border-b border-border">
        <span v-if="sidebarOpen" class="font-bold text-lg text-foreground tracking-tight">AdminPanel</span>
        <Button
          variant="ghost"
          size="icon"
          @click="sidebarOpen = !sidebarOpen"
        >
          <X v-if="sidebarOpen" class="h-4 w-4" />
          <Menu v-else class="h-4 w-4" />
        </Button>
      </div>
      
      <nav class="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
        <template v-for="item in filteredNavItems" :key="item.label">
          <router-link
            v-if="!item.children && item.path"
            :to="item.path"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all"
            :class="[
              isActive(item.path)
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
          >
            <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
            <span v-if="sidebarOpen" class="font-medium">{{ item.label }}</span>
          </router-link>

          <!-- Group Item -->
          <div v-else class="space-y-1">
            <button
              @click="toggleGroup(item.label)"
              class="w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group"
              :class="[
                isGroupActive(item)
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              ]"
            >
              <div class="flex items-center gap-3">
                <component :is="item.icon" class="h-5 w-5 flex-shrink-0" />
                <span v-if="sidebarOpen" class="font-medium text-left line-clamp-1">{{ item.label }}</span>
              </div>
              <component 
                v-if="sidebarOpen"
                :is="expandedGroups[item.label] ? ChevronDown : ChevronRight" 
                class="h-4 w-4 text-muted-foreground/50 group-hover:text-foreground transition-colors"
              />
            </button>
            
            <!-- Children with Animation -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 -translate-y-2"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 -translate-y-2"
            >
              <div v-if="sidebarOpen && expandedGroups[item.label]" class="space-y-1 pl-4 ml-2 border-l border-border/50">
                <router-link
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg transition-all"
                  :class="[
                    isActive(child.path)
                      ? 'text-primary font-semibold bg-primary/10 border-l-2 border-primary ml-[-1px] rounded-l-none'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  ]"
                >
                  <component :is="child.icon" class="h-4 w-4 flex-shrink-0" />
                  <span class="text-sm">{{ child.label }}</span>
                </router-link>
              </div>
            </transition>
          </div>
        </template>
      </nav>

      <div class="p-3 border-t border-border">
        <button
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
        >
          <LogOut class="h-5 w-5 group-hover:scale-110 transition-transform" />
          <span v-if="sidebarOpen" class="font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Top Header -->
      <header class="h-16 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
        <div class="flex items-center gap-4">
          <div class="relative hidden md:block">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search..." 
              class="pl-10 w-64 h-9 rounded-md border border-input bg-background/50 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <ThemeToggle />
          
          <div class="relative" ref="notificationsRef">
            <Button variant="ghost" size="icon" @click="notificationsOpen = !notificationsOpen" class="relative">
              <Bell class="h-5 w-5 text-muted-foreground" />
              <span class="absolute top-1.5 right-1.5 h-2 w-2 bg-primary rounded-full ring-2 ring-card"></span>
            </Button>

            <!-- Notifications Dropdown -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-2"
            >
              <div v-if="notificationsOpen" class="absolute right-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
                <div class="p-4 border-b border-border flex items-center justify-between">
                  <h3 class="font-bold">Notifications</h3>
                  <span class="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">0 New</span>
                </div>
                <div class="p-8 text-center space-y-3">
                  <div class="h-12 w-12 bg-muted rounded-full flex items-center justify-center mx-auto text-muted-foreground">
                    <Bell class="h-6 w-6" />
                  </div>
                  <div class="space-y-1">
                    <p class="text-sm font-medium">All caught up!</p>
                    <p class="text-xs text-muted-foreground leading-relaxed">You don't have any new notifications at the moment.</p>
                  </div>
                </div>
                <div class="p-2 border-t border-border bg-muted/30">
                  <button class="w-full text-center py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors">
                    View All Notifications
                  </button>
                </div>
              </div>
            </transition>
          </div>

          <div class="h-8 w-[1px] bg-border mx-2"></div>

          <div class="relative" ref="userDropdownRef">
            <div 
              class="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-muted rounded-lg transition-colors"
              @click="userDropdownOpen = !userDropdownOpen"
            >
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium leading-none">{{ user?.name || 'User' }}</p>
                <p class="text-xs text-muted-foreground mt-1">{{ user?.email }}</p>
              </div>
              
              <div class="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 overflow-hidden relative group">
                <span class="text-sm font-semibold text-primary uppercase">{{ userInitial }}</span>
                <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ChevronDown class="h-4 w-4 text-primary" />
                </div>
              </div>
            </div>

            <!-- User Dropdown Menu -->
            <transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 scale-95 translate-y-2"
              enter-to-class="opacity-100 scale-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 scale-100 translate-y-0"
              leave-to-class="opacity-0 scale-95 translate-y-2"
            >
              <div v-if="userDropdownOpen" class="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden p-1.5 space-y-0.5">
                <div class="px-3 py-2 border-b border-border/50 mb-1 sm:hidden">
                  <p class="text-sm font-bold truncate">{{ user?.name || 'User' }}</p>
                  <p class="text-[10px] text-muted-foreground truncate">{{ user?.email }}</p>
                </div>
                
                <router-link :to="`${currentPrefix}/profile`" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group" @click="userDropdownOpen = false">
                  <Users class="h-4 w-4 group-hover:text-primary" />
                  <span>My Profile</span>
                </router-link>
                
                <router-link :to="`${currentPrefix}/settings`" class="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors group" @click="userDropdownOpen = false">
                  <Settings class="h-4 w-4 group-hover:text-primary" />
                  <span>Settings</span>
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
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-auto bg-muted/20">
        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
