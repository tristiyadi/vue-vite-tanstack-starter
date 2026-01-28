<script setup lang="ts">
import { ref, watch } from 'vue';
import Card from '@/components/ui/Card.vue';
import CardHeader from '@/components/ui/CardHeader.vue';
import CardTitle from '@/components/ui/CardTitle.vue';
import CardContent from '@/components/ui/CardContent.vue';
import Button from '@/components/ui/Button.vue';
import { 
  Globe, 
  ShieldCheck, 
  Webhook, 
  Mail, 
  Save,
  QrCode,
  Key,
  Smartphone,
  CheckCircle2,
  Loader2
} from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import { useSettings, useUpdateSettings } from '@/composables/admin/useSettings';
import type { SiteSettings } from '@/types/types';
import Switch from '@/components/ui/Switch.vue';

const activeTab = ref('general');

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'security', label: 'Security & 2FA', icon: ShieldCheck },
  { id: 'integrations', label: 'Integrations', icon: Webhook },
  { id: 'email', label: 'Email (SMTP)', icon: Mail },
];

const { data: settings, isLoading, error } = useSettings();
const updateMutation = useUpdateSettings();

const form = ref<Partial<SiteSettings>>({});

watch(settings, (newVal) => {
  if (newVal) {
    form.value = { ...newVal };
  }
}, { immediate: true });

const show2FASetup = ref(false);

const saveSettings = async () => {
  try {
    await updateMutation.mutateAsync(form.value);
    toast.success('Settings saved successfully!');
  } catch (e) {
    toast.error('Failed to save settings');
  }
};
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-24 space-y-4">
      <Loader2 class="h-10 w-10 animate-spin text-primary" />
      <p class="text-muted-foreground">Loading settings...</p>
    </div>

    <div v-else-if="error" class="p-8 text-center text-destructive">
      Failed to load settings.
    </div>

    <template v-else>
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold tracking-tight">Settings</h1>
          <p class="text-muted-foreground mt-1">Manage your website configuration and security preferences.</p>
        </div>
        <Button @click="saveSettings" :disabled="updateMutation.isPending.value" class="gap-2">
          <Loader2 v-if="updateMutation.isPending.value" class="h-4 w-4 animate-spin" />
          <Save v-else class="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div class="flex flex-col md:flex-row gap-8">
        <!-- Settings Sidebar -->
        <aside class="w-full md:w-64 space-y-1">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200',
              activeTab === tab.id 
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            ]"
          >
            <component :is="tab.icon" class="h-5 w-5" />
            {{ tab.label }}
          </button>
        </aside>

        <!-- Settings Content -->
        <div class="flex-1 min-w-0">
          <transition
            mode="out-in"
            enter-active-class="transition duration-200 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <div :key="activeTab">
              <!-- General Settings -->
              <Card v-if="activeTab === 'general'">
                <CardHeader>
                  <CardTitle>General Configuration</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                      <label class="text-sm font-medium">Site Name</label>
                      <input v-model="form.siteName" type="text" class="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                    </div>
                    <div class="space-y-2">
                      <label class="text-sm font-medium">Site URL</label>
                      <input v-model="form.siteUrl" type="url" class="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                    </div>
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium">Meta Description</label>
                    <textarea v-model="form.description" rows="3" class="w-full px-3 py-2 bg-muted/50 border border-border rounded-md focus:ring-2 focus:ring-primary/20 outline-none transition-all"></textarea>
                  </div>
                  <div class="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
                    <div class="space-y-0.5">
                      <div class="text-sm font-medium">Maintenance Mode</div>
                      <div class="text-xs text-muted-foreground">Force-redirect all public traffic to a placeholder page.</div>
                    </div>
                    <Switch v-model="form.maintenanceMode" :disabled="updateMutation.isPending.value" />
                  </div>
                </CardContent>
              </Card>

              <!-- Security Settings -->
              <div v-else-if="activeTab === 'security'" class="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                  </CardHeader>
                  <CardContent class="space-y-6">
                    <div class="flex items-start gap-4 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                      <Smartphone class="h-6 w-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 class="text-sm font-semibold">Secure your account</h4>
                        <p class="text-xs text-muted-foreground mt-1 leading-relaxed">Two-factor authentication adds an extra layer of security to your account by requiring more than just a password to log in.</p>
                        <Button v-if="!form.twoFactorEnabled" @click="show2FASetup = true" variant="outline" class="mt-4 gap-2" size="sm">
                          <Key class="h-4 w-4" />
                          Enable 2FA
                        </Button>
                        <Button v-else @click="form.twoFactorEnabled = false" variant="outline" class="mt-4 text-destructive border-destructive" size="sm">Disable 2FA</Button>
                      </div>
                    </div>

                    <!-- 2FA Preview/Setup Simulator -->
                    <div v-if="show2FASetup" class="border border-border rounded-lg p-6 bg-muted/30 space-y-4 animate-in fade-in slide-in-from-top-4">
                      <div class="text-center space-y-2">
                        <QrCode class="h-32 w-32 mx-auto text-foreground" />
                        <p class="text-xs text-muted-foreground">Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enter verification code</label>
                        <div class="flex gap-2">
                          <input maxlength="6" placeholder="000000" class="flex-1 text-center font-mono text-xl tracking-[0.5em] h-12 bg-muted/50 border border-border rounded-lg" />
                          <Button @click="form.twoFactorEnabled = true; show2FASetup = false">Verify</Button>
                        </div>
                      </div>
                    </div>

                    <div v-if="form.twoFactorEnabled" class="flex items-center gap-2 text-green-500 font-medium">
                      <CheckCircle2 class="h-5 w-5" />
                      2FA is Currently Enabled
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Session Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div class="space-y-2">
                      <label class="text-sm font-medium">Idle Timeout (Minutes)</label>
                      <select v-model="form.sessionTimeout" class="w-full px-3 py-2 bg-muted/50 border border-border rounded-md outline-none">
                        <option value="15">15 Minutes</option>
                        <option value="30">30 Minutes</option>
                        <option value="60">1 Hour</option>
                        <option value="240">4 Hours</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <!-- Integrations Settings -->
              <Card v-else-if="activeTab === 'integrations'">
                <CardHeader>
                  <CardTitle>Third-Party Services</CardTitle>
                </CardHeader>
                <CardContent class="space-y-6">
                  <!-- reCAPTCHA -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h4 class="font-medium flex items-center gap-2">
                        <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" class="h-5 w-5" alt="reCAPTCHA" />
                        Google reCAPTCHA v2
                      </h4>
                      <Switch v-model="form.recaptchaEnabled" :disabled="updateMutation.isPending.value" />
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4" v-if="form.recaptchaEnabled">
                      <div class="space-y-2">
                        <label class="text-xs font-semibold text-muted-foreground">Site Key</label>
                        <input v-model="form.recaptchaSiteKey" type="text" class="w-full px-3 py-2 bg-muted/50 border border-border rounded-md" />
                      </div>
                      <div class="space-y-2">
                        <label class="text-xs font-semibold text-muted-foreground">Secret Key</label>
                        <input v-model="form.recaptchaSecretKey" type="password" class="w-full px-3 py-2 bg-muted/50 border border-border rounded-md" />
                      </div>
                    </div>
                  </div>

                  <div class="border-t border-border pt-6">
                    <div class="space-y-2">
                      <label class="text-sm font-medium">Google Analytics Measurement ID</label>
                      <input v-model="form.analyticsId" placeholder="G-XXXXXXXXXX" type="text" class="w-full px-3 py-2 bg-muted/50 border border-border rounded-md" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Email Settings -->
              <Card v-else-if="activeTab === 'email'">
                <CardHeader>
                  <CardTitle>SMTP Configuration</CardTitle>
                </CardHeader>
                <CardContent class="space-y-4 text-center py-12">
                  <Mail class="h-12 w-12 mx-auto text-muted-foreground/30" />
                  <p class="text-muted-foreground">Email settings are currently managed via environment variables.</p>
                  <Button variant="outline" size="sm">Connect SMTP Provider</Button>
                </CardContent>
              </Card>
            </div>
          </transition>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Custom checkbox/toggle styles if needed beyond Tailwind */
input[type="checkbox"]:checked::after {
  transform: translateX(1.25rem);
}
</style>
