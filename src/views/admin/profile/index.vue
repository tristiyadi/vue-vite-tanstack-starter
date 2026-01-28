<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Save, User, Mail, ShieldCheck } from 'lucide-vue-next'
import { useUpdateProfile } from '@/composables/auth/useAuth'
import { UserEditSchema } from '@/types/schemas'
import { toast } from 'vue-sonner'
import Cookies from 'js-cookie'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'
import Button from '@/components/ui/Button.vue'

// Validation errors interface
interface ValidationErrors {
    [key: string]: string[];
}

const errors = reactive<ValidationErrors>({})

// Form state
const name = ref('')
const email = ref('')
const password = ref('')
const password_confirmation = ref('')

// Load current user data
onMounted(() => {
    const userRaw = Cookies.get('user')
    if (userRaw) {
        const user = JSON.parse(userRaw)
        name.value = user.name || ''
        email.value = user.email || ''
    }
})

// Mutation
const { mutate, isPending } = useUpdateProfile()

// Handle form submit
const handleUpdateProfile = (e: Event) => {
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

    // Call update profile mutation
    mutate(validation.data, {
        onSuccess: () => {
            toast.success('Profile updated successfully')
            password.value = ''
            password_confirmation.value = ''
        },
        onError: (error: any) => {
            const response = error.response?.data;
            const status = error.response?.status;
            if (status === 422 && response?.data) {
                Object.assign(errors, response.data);
                return;
            }
            toast.error(response?.message || 'Failed to update profile')
        },
    })
}
</script>

<template>
  <div class="space-y-6 animate-in">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold tracking-tight">My Profile</h1>
            <p class="text-muted-foreground mt-1">Manage your personal information and security settings.</p>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Sidebar Info -->
        <div class="md:col-span-1 space-y-6">
            <Card class="border-border/50 shadow-sm overflow-hidden bg-muted/20">
                <CardContent class="p-6 text-center space-y-4">
                    <div class="h-24 w-24 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center mx-auto shadow-xl">
                        <span class="text-3xl font-bold text-primary uppercase">
                            {{ name.split(' ').map(n => n[0]).join('').slice(0, 2) }}
                        </span>
                    </div>
                    <div class="space-y-1">
                        <h3 class="font-bold text-lg truncate">{{ name }}</h3>
                        <p class="text-xs text-muted-foreground truncate">{{ email }}</p>
                    </div>
                    <div class="pt-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 uppercase tracking-wider">
                            Administrator
                        </span>
                    </div>
                </CardContent>
            </Card>

            <div class="space-y-2">
                <div class="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest px-1">
                    <ShieldCheck class="h-3 w-3" />
                    Account Security
                </div>
                <p class="text-[11px] text-muted-foreground leading-relaxed px-1">
                    Keep your account secure by using a strong password and changing it regularly.
                </p>
            </div>
        </div>

        <!-- Edit Form -->
        <div class="md:col-span-2 space-y-6">
            <Card class="border-border/50 shadow-sm overflow-hidden">
                <CardHeader class="border-b border-border/50 bg-card px-6 py-4">
                    <CardTitle class="text-lg font-semibold flex items-center gap-2">
                        <User class="h-5 w-5 text-primary" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent class="p-6">
                    <form @submit="handleUpdateProfile" class="space-y-6">
                        <div class="grid grid-cols-1 gap-6">
                            <div class="space-y-2">
                                <label class="text-sm font-medium leading-none flex items-center gap-2">
                                    <User class="h-3.5 w-3.5 text-muted-foreground" />
                                    Full Name
                                </label>
                                <input 
                                    type="text" 
                                    v-model="name"
                                    :class="[
                                        'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                        errors.name ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                                    ]"
                                    placeholder="Your full name"
                                />
                                <p v-if="errors.name" class="text-xs font-medium text-destructive mt-1">{{ errors.name[0] }}</p>
                            </div>

                            <div class="space-y-2">
                                <label class="text-sm font-medium leading-none flex items-center gap-2">
                                    <Mail class="h-3.5 w-3.5 text-muted-foreground" />
                                    Email Address
                                </label>
                                <input 
                                    type="email" 
                                    v-model="email"
                                    :class="[
                                        'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                        errors.email ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                                    ]"
                                    placeholder="your@email.com"
                                />
                                <p v-if="errors.email" class="text-xs font-medium text-destructive mt-1">{{ errors.email[0] }}</p>
                            </div>
                        </div>

                        <div class="pt-6 border-t border-border/50">
                            <h4 class="text-sm font-bold flex items-center gap-2 mb-4">
                                <ShieldCheck class="h-4 w-4 text-primary" />
                                Change Password
                            </h4>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="space-y-2">
                                    <label class="text-xs font-medium text-muted-foreground">New Password</label>
                                    <input 
                                        type="password" 
                                        v-model="password"
                                        :class="[
                                            'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                            errors.password ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                                        ]"
                                        placeholder="Leave blank to keep current"
                                    />
                                    <p v-if="errors.password" class="text-xs font-medium text-destructive mt-1">{{ errors.password[0] }}</p>
                                </div>

                                <div class="space-y-2">
                                    <label class="text-xs font-medium text-muted-foreground">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        v-model="password_confirmation"
                                        :class="[
                                            'flex h-10 w-full rounded-md border bg-background/50 px-3 py-2 text-sm shadow-sm transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
                                            errors.password_confirmation ? 'border-destructive ring-destructive' : 'border-input focus-visible:ring-ring'
                                        ]"
                                        placeholder="Confirm new password"
                                    />
                                    <p v-if="errors.password_confirmation" class="text-xs font-medium text-destructive mt-1">{{ errors.password_confirmation[0] }}</p>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
                            <Button type="submit" :disabled="isPending" class="h-10 px-8 flex items-center gap-2">
                                <Save class="h-4 w-4" />
                                {{ isPending ? 'Saving...' : 'Save Changes' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  </div>
</template>
