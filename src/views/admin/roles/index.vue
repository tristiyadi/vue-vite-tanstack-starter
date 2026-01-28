<script setup lang="ts">
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Button from '@/components/ui/Button.vue';
import { Plus, ShieldCheck, Loader2, Pencil, Trash2 } from 'lucide-vue-next';
import { useRoles, useDeleteRole } from '@/composables/admin/useRoles';
import { toast } from 'vue-sonner';

const router = useRouter();
const { data: roles, isLoading, error } = useRoles();
const deleteMutation = useDeleteRole();

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this role?')) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Role deleted successfully');
    } catch (e) {
      toast.error('Failed to delete role');
    }
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Roles Management</h1>
        <p class="text-muted-foreground mt-1">Configure and manage user roles and permissions.</p>
      </div>
      <Button @click="router.push({ name: 'admin.roles.create' })" class="gap-2">
        <Plus class="h-4 w-4" />
        Create Role
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <ShieldCheck class="h-5 w-5 text-primary" />
          <CardTitle>Available Roles</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
          <p class="text-sm text-muted-foreground">Loading roles...</p>
        </div>

        <div v-else-if="error" class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
          Failed to load roles. Please try again.
        </div>

        <div v-else class="rounded-md border border-border overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-muted/50 border-b border-border text-left">
              <tr>
                <th class="px-4 py-3 font-medium text-muted-foreground">ID</th>
                <th class="px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th class="px-4 py-3 font-medium text-muted-foreground">Description</th>
                <th class="px-4 py-3 font-medium text-right text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="role in roles" :key="role.id" class="hover:bg-muted/20 transition-colors">
                <td class="px-4 py-3 text-muted-foreground">#{{ role.id }}</td>
                <td class="px-4 py-3 font-medium">{{ role.name }}</td>
                <td class="px-4 py-3 text-muted-foreground">{{ role.description }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      class="h-8 w-8 p-0"
                      @click="router.push({ name: 'admin.roles.edit', params: { id: role.id } })"
                    >
                      <Pencil class="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      class="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      @click="handleDelete(role.id)"
                      :disabled="deleteMutation.isPending.value"
                    >
                      <Trash2 class="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr v-if="roles?.length === 0">
                <td colspan="4" class="px-4 py-12 text-center text-muted-foreground">
                  No roles found. Create one to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
