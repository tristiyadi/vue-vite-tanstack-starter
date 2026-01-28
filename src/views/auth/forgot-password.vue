<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ArrowLeft, Send } from 'lucide-vue-next';
import { useForgotPassword } from '../../composables/auth/useAuth';
import { ForgotPasswordSchema } from '@/types/schemas';
import Button from '@/components/ui/Button.vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardContent from '@/components/ui/CardContent.vue';

// Tipe untuk error validasi
interface ValidationErrors {
    [key: string]: string[];
}

// Form state
const email = ref<string>('');
const isSuccess = ref(false);
const message = ref('');

// Error state
const errors = reactive<ValidationErrors>({});

// Composable forgot password
const { mutate, isPending } = useForgotPassword();

const handleForgotPassword = (e: Event) => {
    e.preventDefault();
    isSuccess.value = false;
    message.value = '';

    // Reset errors
    Object.keys(errors).forEach((key) => delete errors[key]);

    // Validate using Zod
    const validation = ForgotPasswordSchema.safeParse({
        email: email.value,
    });

    if (!validation.success) {
        validation.error.issues.forEach((issue) => {
            const path = issue.path[0] as string;
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
        });
        return;
    }

    mutate(
        validation.data,
        {
            onSuccess: (data: any) => {
                isSuccess.value = true;
                message.value = data.message || 'Password reset link has been sent to your email.';
                email.value = '';
            },
            onError: (error: any) => {
                const response = error.response?.data;
                const status = error.response?.status;

                if (status === 422 && response?.data) {
                    Object.assign(errors, response.data);
                    return;
                }

                message.value = response?.message || 'Something went wrong. Please try again.';
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
          Forgot password?
        </h2>
        <p class="mt-2 text-center text-sm text-muted-foreground">
          No worries, we'll send you reset instructions.
        </p>
      </div>

      <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <Card class="p-0 border-border/50">
          <CardHeader class="pb-0" />
          <CardContent class="p-8">
            <div v-if="isSuccess" class="bg-success/10 border border-success/20 text-success text-sm p-4 rounded-lg mb-6">
              {{ message }}
            </div>
            
            <div v-else-if="message" class="bg-destructive/10 border border-destructive/20 text-destructive text-sm p-4 rounded-lg mb-6">
              {{ message }}
            </div>

            <form class="space-y-6" @submit="handleForgotPassword">
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
                <Button
                  type="submit"
                  class="w-full"
                  :disabled="isPending"
                >
                  <Send v-if="!isPending" class="mr-2 h-4 w-4" />
                  <svg v-else class="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isPending ? 'Sending...' : 'Reset password' }}
                </Button>
              </div>
            </form>

            <p class="mt-8 text-center text-sm text-muted-foreground">
              <router-link to="/login" class="flex items-center justify-center gap-2 font-semibold leading-6 text-primary hover:opacity-80 transition-opacity">
                <ArrowLeft class="h-4 w-4" />
                Back to login
              </router-link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
