<script setup lang="ts">

import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { Eye, EyeOff } from 'lucide-vue-next';
import { useRegister } from "../../composables/auth/useAuth";
import { UserCreateSchema } from "@/types/schemas";
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'

//interface untuk error
interface ValidationErrors {
    [key: string]: string[];
}

//inisialisasi router
const router = useRouter();

// form state
const name = ref<string>('');
const email = ref<string>('');
const password = ref<string>('');
const password_confirmation = ref<string>('');

// visibility state
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// error state
const errors = reactive<ValidationErrors>({});

// custom composable
const { mutate, isPending } = useRegister();

const handleRegister = (e: Event) => {
    e.preventDefault();

    // Reset errors
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

    //call mutate function from useRegister
    mutate(
        {
            name: name.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value,
        },
        {
            onSuccess: () => {
                router.push("/login");
            },
            onError: (error: any) => {
                const response = error.response?.data;
                const status = error.response?.status;
                // reset errors dulu
                Object.keys(errors).forEach((key) => delete errors[key]);

                // VALIDATION ERROR (422)
                if (status === 422 && response?.data) {
                    Object.assign(errors, response.data);
                    return;
                }

                // EMAIL DUPLICATE (409)
                if (status === 409) {
                    errors.email = [response.message];
                    return;
                }
            },
        }
    );
};
</script>

<template>
  <div class="animate-in">
    <div class="flex flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-3xl font-bold leading-9 tracking-tight">
          Create a new account
        </h2>
        <p class="mt-2 text-center text-sm text-muted-foreground">
          Join thousands of modern businesses today.
        </p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <Card class="p-0 border-border/50">
          <CardHeader class="pb-0">
            <!-- logo or icon could go here -->
          </CardHeader>
          <CardContent class="p-8">
            <form class="space-y-6" @submit.prevent="handleRegister">
              <div>
                <label for="name" class="block text-sm font-medium leading-6">
                  Full Name
                </label>
                <div class="mt-2">
                  <input
                    id="name"
                    v-model="name"
                    type="text"
                    required
                    :class="[
                      'block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      errors.name ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                    ]"
                    placeholder="John Doe"
                  />
                </div>
                <p v-if="errors.name" class="mt-2 text-sm text-destructive">
                  {{ errors.name[0] }}
                </p>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium leading-6">
                  Email address
                </label>
                <div class="mt-2">
                  <input
                    id="email"
                    v-model="email"
                    type="email"
                    autocomplete="email"
                    required
                    :class="[
                      'block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      errors.email ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                    ]"
                    placeholder="you@example.com"
                  />
                </div>
                <p v-if="errors.email" class="mt-2 text-sm text-destructive">
                  {{ errors.email[0] }}
                </p>
              </div>

              <div>
                <label for="password" class="block text-sm font-medium leading-6">
                  Password
                </label>
                <div class="mt-2 relative">
                  <input
                    id="password"
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    required
                    :class="[
                      'block w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      errors.password ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                    ]"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Eye v-if="!showPassword" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
                <p v-if="errors.password" class="mt-2 text-sm text-destructive">
                  {{ errors.password[0] }}
                </p>
              </div>

              
              <div>
                <label for="password_confirmation" class="block text-sm font-medium leading-6">
                  Password Confirmation
                </label>
                <div class="mt-2 relative">
                  <input
                    id="password_confirmation"
                    v-model="password_confirmation"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    autocomplete="new-password"
                    required
                    :class="[
                      'block w-full rounded-md border bg-background px-3 py-2 pr-10 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      errors.password_confirmation ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                    ]"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Eye v-if="!showConfirmPassword" class="h-4 w-4" />
                    <EyeOff v-else class="h-4 w-4" />
                  </button>
                </div>
                <p v-if="errors.password_confirmation" class="mt-2 text-sm text-destructive">
                  {{ errors.password_confirmation[0] }}
                </p>
              </div>

              <div>
                <Button
                  type="submit"
                  class="w-full"
                  :disabled="isPending"
                >
                  <svg v-if="isPending" class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isPending ? 'Creating account...' : 'Create account' }}
                </Button>
              </div>
            </form>

            <p class="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?
              <router-link to="/login" class="font-semibold leading-6 text-primary hover:opacity-80 transition-opacity">
                Sign in
              </router-link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
