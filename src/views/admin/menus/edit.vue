<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Button from '@/components/ui/Button.vue';
import { ChevronLeft, Save, Loader2 } from 'lucide-vue-next';
import { useMenu, useUpdateMenu } from '@/composables/admin/useMenus';
import { MenuSchema } from '@/types/schemas';
import { toast } from 'vue-sonner';
import type { MenuItem } from '@/types/types';

//interface untuk error
interface ValidationErrors {
  [key: string]: string[];
}

const router = useRouter();
const route = useRoute();
const id = route.params.id as string;

const { data: menu, isLoading, error } = useMenu(id);
const updateMutation = useUpdateMenu();

// Validation errors
const errors = reactive<ValidationErrors>({});

const form = ref<Partial<MenuItem>>({
  label: '',
  path: '',
  icon: '',
  order: 0
});

watch(menu, (newVal) => {
  if (newVal) {
    form.value = { ...newVal };
  }
}, { immediate: true });

const handleSubmit = async () => {
  try {
    // Reset errors
    Object.keys(errors).forEach((key) => delete errors[key]);
    
    // Validate using Zod
    const validation = MenuSchema.safeParse(form.value);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      return;
    }

    await updateMutation.mutateAsync({ id: Number(id), ...validation.data });
    toast.success('Menu updated successfully');
    router.push({ name: 'admin.menus.index' });
  } catch (e: any) {
    const response = e.response?.data;
    const status = e.response?.status;
    
    if (status === 422 && response?.data) {
      Object.assign(errors, response.data);
    }
  }
};
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <div class="flex items-center gap-4">
      <Button variant="ghost" size="sm" @click="router.back()">
        <ChevronLeft class="h-4 w-4 mr-1" />
        Back
      </Button>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Edit Menu Item</h1>
        <p class="text-muted-foreground mt-1">Update navigation details and display order.</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex flex-col items-center justify-center py-20">
      <Loader2 class="h-10 w-10 animate-spin text-primary" />
    </div>

    <div v-else-if="error" class="p-8 text-center text-destructive">
      Failed to load menu item details.
    </div>

    <form v-else @submit.prevent="handleSubmit">
      <Card>
        <CardHeader>
          <CardTitle>Menu Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Label</label>
               <input 
                v-model="form.label" 
                type="text" 
                required
                :class="[
                  'w-full px-3 py-2 bg-muted/50 border rounded-md outline-none transition-all focus:ring-2 focus:ring-primary/20',
                  errors.label ? 'border-destructive ring-destructive' : 'border-border'
                ]" 
              />
              <p v-if="errors.label" class="text-xs font-medium text-destructive mt-1">
                {{ errors.label[0] }}
              </p>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Display Order</label>
               <input 
                v-model.number="form.order" 
                type="number" 
                required
                :class="[
                  'w-full px-3 py-2 bg-muted/50 border rounded-md outline-none transition-all focus:ring-2 focus:ring-primary/20',
                  errors.order ? 'border-destructive ring-destructive' : 'border-border'
                ]" 
              />
              <p v-if="errors.order" class="text-xs font-medium text-destructive mt-1">
                {{ errors.order[0] }}
              </p>
            </div>
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-medium">Path</label>
            <input 
              v-model="form.path" 
              type="text" 
              required
              :class="[
                'w-full px-3 py-2 bg-muted/50 border rounded-md outline-none transition-all focus:ring-2 focus:ring-primary/20',
                errors.path ? 'border-destructive ring-destructive' : 'border-border'
              ]" 
            />
            <p v-if="errors.path" class="text-xs font-medium text-destructive mt-1">
              {{ errors.path[0] }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium">Icon Name</label>
            <input 
              v-model="form.icon" 
              type="text" 
              :class="[
                'w-full px-3 py-2 bg-muted/50 border rounded-md outline-none transition-all focus:ring-2 focus:ring-primary/20',
                errors.icon ? 'border-destructive ring-destructive' : 'border-border'
              ]" 
            />
            <p v-if="errors.icon" class="text-xs font-medium text-destructive mt-1">
              {{ errors.icon[0] }}
            </p>
          </div>
          
          <div class="pt-4 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="outline" @click="router.back()">Cancel</Button>
            <Button type="submit" :disabled="updateMutation.isPending.value" class="gap-2">
              <Loader2 v-if="updateMutation.isPending.value" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  </div>
</template>
