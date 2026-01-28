<script setup lang="ts">

import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

import { useLogin } from '../../composables/auth/useAuth';
import { LoginSchema } from '@/types/schemas';
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'

// Tipe untuk error validasi
interface ValidationErrors {
    [key: string]: string[];
}

// Router
const router = useRouter();

// Composable login
const { mutate, isPending } = useLogin();

// Form state
const email = ref<string>('');
const password = ref<string>('');

// Error state
const errors = reactive<ValidationErrors>({})

const handleLogin = (e: Event) => {
    e.preventDefault()

    // Clear previous errors
    Object.keys(errors).forEach((key) => delete errors[key]);

    // Validate using Zod
    const validation = LoginSchema.safeParse({
        email: email.value,
        password: password.value,
    });

    if (!validation.success) {
        validation.error.issues.forEach((issue) => {
            const path = issue.path[0] as string;
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
        });
        return;
    }

    //call mutasi login
    mutate(
        validation.data,
        {
            onSuccess: (data: any) => {
                Cookies.set('token', data.data.token, { expires: 7, secure: true, sameSite: 'strict' })
                Cookies.set(
                    'user',
                    JSON.stringify({
                        uid: data.data.user.uid,
                        name: data.data.user.name,
                        email: data.data.user.email,
                        role_id: data.data.user.role_id,
                    }),
                    { expires: 7, secure: true, sameSite: 'strict' }
                );
                if (Number(data.data.user.role_id) === 1) {
                    router.push('/admin/dashboard')
                } else {
                    router.push('/portal/dashboard')
                }
            },
            onError: (error: any) => {
                const response = error.response?.data;
                const status = error.response?.status;

                // VALIDATION ERROR (422)
                if (status === 422 && response?.data) {
                    Object.assign(errors, response.data);
                    return;
                }

                // LOGIN FAILED (401)
                if (status === 401) {
                    errors.email = [response.message];
                    return;
                }
            },
        }
    )
}
</script>

<template>
  <div class="animate-in">
    <div class="flex flex-col justify-center px-6 py-12 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 class="mt-10 text-center text-3xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-muted-foreground">
          Welcome back! Please enter your details.
        </p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <Card class="p-0 border-border/50">
          <CardHeader class="pb-0">
            <!-- logo or icon could go here -->
          </CardHeader>
          <CardContent class="p-8">
            <form class="space-y-6" @submit="handleLogin">
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
                    placeholder="user@example.com"
                  />
                </div>
                <p v-if="errors.email" class="mt-2 text-sm text-destructive">
                  {{ errors.email[0] }}
                </p>
              </div>

              <div>
                <div class="flex items-center justify-between">
                  <label for="password" class="block text-sm font-medium leading-6">
                    Password
                  </label>
                  <div class="text-sm">
                    <router-link to="/forgot-password" class="font-semibold text-primary hover:opacity-80 transition-opacity">
                      Forgot password?
                    </router-link>
                  </div>
                </div>
                <div class="mt-2">
                  <input
                    id="password"
                    v-model="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    :class="[
                      'block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                      errors.password ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                    ]"
                    placeholder="••••••••"
                  />
                </div>
                <p v-if="errors.password" class="mt-2 text-sm text-destructive">
                  {{ errors.password[0] }}
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
                  {{ isPending ? 'Signing in...' : 'Sign in' }}
                </Button>
              </div>
            </form>

            <p class="mt-8 text-center text-sm text-muted-foreground">
              Not a member?
              <router-link to="/register" class="font-semibold leading-6 text-primary hover:opacity-80 transition-opacity">
                Create an account
              </router-link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
