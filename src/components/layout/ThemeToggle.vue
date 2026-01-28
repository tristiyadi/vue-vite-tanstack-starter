<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { Sun, Moon, Laptop } from "lucide-vue-next";
import { useTheme, type Theme } from "../../composables/useTheme";
import Button from "../ui/Button.vue";

const { theme, setTheme } = useTheme();
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectTheme = (newTheme: Theme) => {
  setTheme(newTheme);
  isOpen.value = false;
};

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="relative" ref="dropdownRef">
    <Button
      variant="ghost"
      size="icon"
      class="h-9 w-9 relative"
      @click="toggleDropdown"
    >
      <Sun
        class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      <Moon
        class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
      <span class="sr-only">Toggle theme</span>
    </Button>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 mt-2 w-36 origin-top-right rounded-md border border-border bg-popover p-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
      >
        <button
          @click="selectTheme('light')"
          :class="[
            'flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
            theme === 'light' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
          ]"
        >
          <Sun class="mr-2 h-4 w-4" />
          <span>Light</span>
        </button>
        <button
          @click="selectTheme('dark')"
          :class="[
            'flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
            theme === 'dark' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
          ]"
        >
          <Moon class="mr-2 h-4 w-4" />
          <span>Dark</span>
        </button>
        <button
          @click="selectTheme('system')"
          :class="[
            'flex w-full items-center rounded-sm px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground',
            theme === 'system' ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
          ]"
        >
          <Laptop class="mr-2 h-4 w-4" />
          <span>System</span>
        </button>
      </div>
    </transition>
  </div>
</template>
