<script setup lang="ts">
import { useRouter } from 'vue-router';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Button from '@/components/ui/Button.vue';
import { Plus, List, Loader2, Edit, Trash2, Link2 } from 'lucide-vue-next';
import { useMenus, useDeleteMenu } from '@/composables/admin/useMenus';
import { toast } from 'vue-sonner';

const router = useRouter();
const { data: menus, isLoading, error } = useMenus();
const deleteMutation = useDeleteMenu();

const handleDelete = async (id: number) => {
  if (confirm('Are you sure you want to delete this menu item?')) {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success('Menu item deleted successfully');
    } catch (e) {
      toast.error('Failed to delete menu item');
    }
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Menus Management</h1>
        <p class="text-muted-foreground mt-1">Manage the navigation structure and page links.</p>
      </div>
      <Button @click="router.push({ name: 'admin.menus.create' })" class="gap-2">
        <Plus class="h-4 w-4" />
        Add Menu Item
      </Button>
    </div>

    <Card>
      <CardHeader>
        <div class="flex items-center gap-2">
          <List class="h-5 w-5 text-primary" />
          <CardTitle>Current Menu Structure</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div v-if="isLoading" class="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 class="h-8 w-8 animate-spin text-primary" />
          <p class="text-sm text-muted-foreground">Loading menus...</p>
        </div>

        <div v-else-if="error" class="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm text-center">
          Failed to load menus. Please try again.
        </div>

        <div v-else class="rounded-md border border-border overflow-hidden">
          <table class="w-full text-sm">
            <thead class="bg-muted/50 border-b border-border text-left">
              <tr>
                <th class="px-4 py-3 font-medium text-muted-foreground">Label</th>
                <th class="px-4 py-3 font-medium text-muted-foreground">Path</th>
                <th class="px-4 py-3 font-medium text-muted-foreground">Order</th>
                <th class="px-4 py-3 font-medium text-right text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border">
              <tr v-for="item in menus" :key="item.id" class="hover:bg-muted/20 transition-colors">
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <Link2 class="h-4 w-4 text-muted-foreground" />
                    <span class="font-medium">{{ item.label }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-muted-foreground font-mono text-xs">{{ item.path }}</td>
                <td class="px-4 py-3">{{ item.order }}</td>
                <td class="px-4 py-3 text-right">
                  <div class="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      class="h-8 w-8"
                      @click="router.push({ name: 'admin.menus.edit', params: { id: item.id } })"
                    >
                      <Edit class="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      class="h-8 w-8 text-destructive hover:text-destructive"
                      @click="handleDelete(item.id)"
                      :disabled="deleteMutation.isPending.value"
                    >
                      <Trash2 class="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr v-if="menus?.length === 0">
                <td colspan="4" class="px-4 py-12 text-center text-muted-foreground">
                  No menu items found. Add one to get started.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
