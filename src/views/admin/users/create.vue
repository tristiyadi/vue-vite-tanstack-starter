<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save } from 'lucide-vue-next'
import { useUserCreate } from '../../../composables/user/useUsers'
import { UserCreateSchema } from '@/types/schemas'
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

// Router instance
const router = useRouter()

// Form state
const name = ref<string>('')
const email = ref<string>('')
const password = ref<string>('')
const password_confirmation = ref<string>('')

// Validation errors
const errors = reactive<ValidationErrors>({})

// Mutation
const { mutate, isPending } = useUserCreate()

// Handle form submit
const storeUser = (e: Event) => {
    e.preventDefault()
    
    // Clear previous errors
    Object.keys(errors).forEach((key) => delete errors[key]);

    // Validate using Zod
    const validation = UserCreateSchema.safeParse({
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

    // Call user create mutation
    mutate(
        validation.data,
        {
            onSuccess: () => {
                toast.success('User created successfully')
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
    <Card class="border-border/50">
      <CardHeader class="flex flex-row items-center justify-between border-b border-border/50 bg-muted/20 px-6 py-4">
        <div>
          <CardTitle class="text-xl font-bold tracking-tight">Add New User</CardTitle>
          <p class="text-xs text-muted-foreground mt-1">Fill in the details below to create a new user account.</p>
        </div>
        <Button variant="ghost" size="sm" as-child class="h-9">
          <router-link to="/admin/users" class="flex items-center gap-2">
            <ArrowLeft class="h-4 w-4" />
            Back to List
          </router-link>
        </Button>
      </CardHeader>
      <CardContent class="p-8">
        <form @submit="storeUser" class="max-w-xl space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Full Name
            </label>
            <input 
              type="text" 
              v-model="name" 
              :class="[
                'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1',
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
                'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1',
                errors.email ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
              ]" 
              placeholder="Enter email address" 
            />
            <p v-if="errors.email" class="text-xs font-medium text-destructive mt-1">
              {{ errors.email[0] }}
            </p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="space-y-2">
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password
              </label>
              <input 
                type="password" 
                v-model="password" 
                :class="[
                  'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1',
                  errors.password ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                ]" 
                placeholder="Enter password" 
              />
              <p v-if="errors.password" class="text-xs font-medium text-destructive mt-1">
                {{ errors.password[0] }}
              </p>
            </div>

            <div class="space-y-2">
              <label class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Password Confirmation
              </label>
              <input 
                type="password" 
                v-model="password_confirmation" 
                :class="[
                  'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1',
                  errors.password_confirmation ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                ]" 
                placeholder="Confirm password" 
              />
              <p v-if="errors.password_confirmation" class="text-xs font-medium text-destructive mt-1">
                {{ errors.password_confirmation[0] }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-4 pt-6">
            <Button type="submit" :disabled="isPending" class="h-10 px-8 flex items-center gap-2">
              <Save class="h-4 w-4" />
              {{ isPending ? 'Saving...' : 'Save User' }}
            </Button>
            <Button variant="outline" as-child class="h-10 px-6">
              <router-link to="/admin/users">Cancel</router-link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
