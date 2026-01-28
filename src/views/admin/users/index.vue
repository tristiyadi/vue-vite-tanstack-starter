<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { Plus, Edit, Trash2 } from 'lucide-vue-next'
import { useUsers, useUserDelete } from '../../../composables/user/useUsers'
import { toast } from 'vue-sonner'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

import { ref } from 'vue'

// initialize query client
const queryClient = useQueryClient()

// Pagination state
const currentPage = ref(1)

// Get users
const { data: response, isLoading, isError, error } = useUsers(currentPage)

// User delete composable
const { mutate, isPending } = useUserDelete()
const handleDelete = (uid: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
        mutate(String(uid), {
            onSuccess: () => {
                toast.success('User deleted successfully')
                queryClient.invalidateQueries({ queryKey: ['users'] })
            },
        })
    }
}
</script>

<template>
  <div class="space-y-6 animate-in">
    <Card class="border-border/50 shadow-sm overflow-hidden">
      <CardHeader class="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-4">
        <div>
          <CardTitle class="text-xl font-bold tracking-tight">User Management</CardTitle>
          <p class="text-xs text-muted-foreground mt-1">Manage system accounts and permissions.</p>
        </div>
        <Button size="sm" as-child class="h-9 px-4">
          <router-link to="/admin/users/create" class="flex items-center gap-2">
            <Plus class="h-4 w-4" />
            Add New User
          </router-link>
        </Button>
      </CardHeader>
      <CardContent class="p-0">
        <div v-if="isLoading" class="p-12 text-center text-muted-foreground">
          <div class="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p class="text-sm font-medium">Fetching secure data...</p>
        </div>

        <div v-else-if="isError" class="p-12 text-center">
          <div class="bg-destructive/10 text-destructive rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-4">
            <Trash2 class="h-6 w-6" />
          </div>
          <p class="font-bold text-destructive">Error loading users</p>
          <p class="text-sm text-muted-foreground mt-1">{{ error?.message }}</p>
          <Button variant="outline" size="sm" class="mt-4" @click="queryClient.invalidateQueries({ queryKey: ['users'] })">
            Try Again
          </Button>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-sm text-left">
            <thead class="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider border-b border-border/50">
              <tr>
                <th class="px-6 py-4">Full Name</th>
                <th class="px-6 py-4">Email Address</th>
                <th class="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/50">
              <tr v-for="user in response?.data" :key="user?.id" class="hover:bg-accent/30 transition-colors group">
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                      {{ user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) }}
                    </div>
                    <span class="font-medium text-foreground">{{ user.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-muted-foreground">{{ user.email }}</td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="icon" as-child class="h-8 w-8">
                      <router-link :to="`/admin/users/edit/${user?.uid}`">
                        <Edit class="h-3.5 w-3.5" />
                      </router-link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      @click="handleDelete(String(user?.uid))" 
                      :disabled="isPending"
                      class="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 class="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
              <tr v-if="response?.data?.length === 0">
                <td colspan="3" class="px-6 py-12 text-center text-muted-foreground italic">
                  <p class="text-base">No users found.</p>
                  <p class="text-xs mt-1">Start by adding a new user to the system.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination Controls -->
        <div v-if="response && response.meta" class="px-6 py-4 border-t border-border/50 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p class="text-xs text-muted-foreground font-medium">
            Showing <span class="text-foreground">{{ response.meta.from || 0 }}</span> to <span class="text-foreground">{{ response.meta.to || 0 }}</span> of <span class="text-foreground">{{ response.meta.total }}</span> entries
          </p>
          
          <div class="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              :disabled="currentPage === 1 || isLoading"
              @click="currentPage--"
              class="h-8 px-3 text-xs font-semibold"
            >
              Previous
            </Button>
            
            <div class="flex items-center gap-1 mx-1">
              <template v-for="link in response.meta.links" :key="link.label">
                <Button 
                  v-if="!isNaN(Number(link.label))"
                  variant="outline" 
                  size="icon"
                  :class="[
                    'h-8 w-8 text-xs font-bold transition-all',
                    link.active ? 'bg-primary text-primary-foreground shadow-sm hover:bg-primary/90' : 'text-muted-foreground hover:bg-muted'
                  ]"
                  @click="currentPage = Number(link.label)"
                  :disabled="isLoading"
                >
                  {{ link.label }}
                </Button>
              </template>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              :disabled="currentPage === response.meta.last_page || isLoading"
              @click="currentPage++"
              class="h-8 px-3 text-xs font-semibold"
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
