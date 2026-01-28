<script setup lang="ts">
defineProps<{
  modelValue: boolean | undefined;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();
</script>

<template>
  <label 
    class="relative inline-flex items-center cursor-pointer group"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <input 
      type="checkbox" 
      class="sr-only peer" 
      :checked="modelValue"
      :disabled="disabled"
      @change="emit('update:modelValue', ($event.target as HTMLInputElement).checked)"
    />
    <div 
      class="w-11 h-6 rounded-full peer transition-colors duration-300
        peer-focus:ring-4 peer-focus:ring-primary/20 
        after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all after:duration-300
        peer-checked:after:translate-x-full peer-checked:after:border-white
        group-hover:after:scale-110 active:after:scale-95"
      :class="modelValue ? 'bg-primary' : 'bg-muted-foreground/20'"
    >
    </div>
  </label>
</template>

<style scoped>
.after\:transition-all::after {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
