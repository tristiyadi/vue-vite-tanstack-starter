<script setup lang="ts">
import { ref, reactive, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useUserById, useUserUpdate } from '../../../composables/user/useUsers'
import { UserEditSchema } from '@/types/schemas'
import { toast } from 'vue-sonner'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

//interface untuk error
interface ValidationErrors {
    [key: string]: string[];
}

// inisialisasi route dan router
const route = useRoute()
const router = useRouter()

// Ambil ID dari route param
const uid = route.params.uid as string

// Form state
const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const password_confirmation = ref<string>('')

// Validation errors
const errors = reactive<ValidationErrors>({})

// Fetch user by ID
const { data: user } = useUserById(uid)

// Isi form dari data user
watchEffect(() => {
    if (user.value) {
        name.value = user.value.name;
        email.value = user.value.email;
    }
})

// Mutation
const { mutate, isPending } = useUserUpdate()

// Handle form submit
const updateUser = (e: Event) => {
    e.preventDefault()

    // Clear previous errors
    Object.keys(errors).forEach((key) => delete errors[key]);

    // Validate using Zod
    const validation = UserEditSchema.safeParse({
        name: name.value,
        email: email.value,
        password: password.value,
        password_confirmation: password_confirmation.value,
    });

    if (!validation.success) {
        validation.error.issues.forEach((issue) => {
            const path = issue.path[0] as string;
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
        });
        return;
    }

    // Call user update mutation
    mutate(
        {
            uid: uid,
            data: validation.data,
        },
        {
            onSuccess: () => {
                toast.success('User updated successfully')
                router.push('/admin/users')
            },
            onError: (error: any) => {
                const response = error.response?.data;
                const status = error.response?.status;
                if (status === 422 && response?.data) {
                    Object.assign(errors, response.data);
                    return;
                }
                if (status === 409) {
                    errors.email = [response.message];
                    return;
                }
            },
        }
    )
}
</script>

<template>
  <div class="space-y-6 animate-in">
    <Card class="border-border/50 shadow-sm overflow-hidden">
      <CardHeader class="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-4">
        <div>
          <CardTitle class="text-xl font-bold tracking-tight">Edit User: {{ user?.name || 'Loading...' }}</CardTitle>
          <p class="text-xs text-muted-foreground mt-1">Update account information and security settings.</p>
        </div>
        <Button variant="ghost" size="sm" as-child class="h-9">
          <router-link to="/admin/users" class="flex items-center gap-2">
            <ArrowLeft class="h-4 w-4" />
            Back to List
          </router-link>
        </Button>
      </CardHeader>
      <CardContent class="p-8">
        <form @submit="updateUser" class="max-w-xl space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Full Name
            </label>
            <input 
              type="text" 
              v-model="name" 
              :class="[
                'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                errors.name ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
              ]" 
              placeholder="Enter full name" 
            />
            <p v-if="errors.name" class="text-xs font-medium text-destructive mt-1">
              {{ errors.name[0] }}
            </p>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Email address
            </label>
            <input 
              type="email" 
              v-model="email" 
              :class="[
                'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                errors.email ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
              ]" 
              placeholder="Enter email address" 
            />
            <p v-if="errors.email" class="text-xs font-medium text-destructive mt-1">
              {{ errors.email[0] }}
            </p>
          </div>

          <div class="bg-muted/30 p-4 rounded-lg border border-border/50 space-y-4">
            <p class="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Security Settings</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">New Password</label>
                <input 
                  type="password" 
                  v-model="password" 
                  :class="[
                    'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono',
                    errors.password ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                  ]" 
                  placeholder="Leave blank to keep current" 
                />
                <p v-if="errors.password" class="text-xs font-medium text-destructive mt-1">
                  {{ errors.password[0] }}
                </p>
              </div>

              <div class="space-y-2">
                <label class="text-sm font-medium leading-none">Confirm Password</label>
                <input 
                  type="password" 
                  v-model="password_confirmation" 
                  :class="[
                    'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono',
                    errors.password_confirmation ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                  ]" 
                  placeholder="Confirm new password" 
                />
                <p v-if="errors.password_confirmation" class="text-xs font-medium text-destructive mt-1">
                  {{ errors.password_confirmation[0] }}
                </p>
              </div>
            </div>
            <p class="text-[10px] text-muted-foreground italic">Only fill these if you wish to update the account password.</p>
          </div>

          <div class="flex items-center gap-4 pt-4 border-t border-border/50">
            <Button type="submit" :disabled="isPending" class="h-10 px-8 flex items-center gap-2">
              <Save class="h-4 w-4" />
              {{ isPending ? 'Updating...' : 'Update User Account' }}
            </Button>
            <Button variant="outline" as-child class="h-10 px-6">
              <router-link to="/admin/users">Discard Changes</router-link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
