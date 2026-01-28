<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Button from '@/components/ui/Button.vue';
import { ChevronLeft, Save, Loader2 } from 'lucide-vue-next';
import { useCreateRole } from '@/composables/admin/useRoles';
import { RoleSchema } from '@/types/schemas';
import { toast } from 'vue-sonner';

//interface untuk error
interface ValidationErrors {
  [key: string]: string[];
}

const router = useRouter();
const createMutation = useCreateRole();

// Validation errors
const errors = reactive<ValidationErrors>({});

const form = ref({
  name: '',
  description: '',
  permissions: [] as string[]
});

const handleSubmit = async () => {
  try {
    // Reset errors
    Object.keys(errors).forEach((key) => delete errors[key]);
    
    // Validate using Zod
    const validation = RoleSchema.safeParse(form.value);

    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (!errors[path]) errors[path] = [];
        errors[path].push(issue.message);
      });
      return;
    }

    await createMutation.mutateAsync(validation.data);
    toast.success('Role created successfully');
    router.push({ name: 'admin.roles.index' });
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
        <h1 class="text-3xl font-bold tracking-tight">Create Role</h1>
        <p class="text-muted-foreground mt-1">Define a new role and its permissions.</p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      <Card>
        <CardHeader>
          <CardTitle>Role Details</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">Role Name</label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="e.g. Content Manager"
              required
              :class="[
                'w-full px-3 py-2 bg-muted/50 border rounded-md outline-none transition-all focus:ring-2 focus:ring-primary/20',
                errors.name ? 'border-destructive ring-destructive' : 'border-border'
              ]" 
            />
            <p v-if="errors.name" class="text-xs font-medium text-destructive mt-1">
              {{ errors.name[0] }}
            </p>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">Description</label>
            <textarea 
              v-model="form.description" 
              rows="3" 
              placeholder="Describe the responsibilities of this role..."
              :class="[
                'w-full px-3 py-2 bg-muted/50 border rounded-md outline-none transition-all focus:ring-2 focus:ring-primary/20',
                errors.description ? 'border-destructive ring-destructive' : 'border-border'
              ]"
            ></textarea>
            <p v-if="errors.description" class="text-xs font-medium text-destructive mt-1">
              {{ errors.description[0] }}
            </p>
          </div>
          
          <div class="pt-4 border-t border-border flex justify-end gap-3">
            <Button type="button" variant="outline" @click="router.back()">Cancel</Button>
            <Button type="submit" :disabled="createMutation.isPending.value" class="gap-2">
              <Loader2 v-if="createMutation.isPending.value" class="h-4 w-4 animate-spin" />
              <Save v-else class="h-4 w-4" />
              Create Role
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  </div>
</template>
