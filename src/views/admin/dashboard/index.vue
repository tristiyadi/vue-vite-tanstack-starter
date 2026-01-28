<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Cookies from 'js-cookie'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardTitle from '@/components/ui/CardTitle.vue'
import CardContent from '@/components/ui/CardContent.vue'

const user = ref<{ name: string } | null>(null)

onMounted(() => {
  const userData = Cookies.get('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
})
</script>

<template>
  <div class="space-y-6 animate-in">
    <Card class="border-border/50">
      <CardHeader class="border-b border-border/50 bg-muted/20">
        <CardTitle class="text-xl">Dashboard Overview</CardTitle>
      </CardHeader>
      <CardContent class="p-8">
        <div class="space-y-4">
          <h3 class="text-2xl font-bold tracking-tight text-foreground">
            Welcome back, {{ user?.name || 'User' }}!
          </h3>
          <p class="text-muted-foreground max-w-2xl leading-relaxed">
            You are currently in the administrative dashboard. From here, you can manage users, view reports, and configure system settings through a modern, intuitive interface.
          </p>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <Card class="bg-primary/5 border-primary/10 shadow-sm hover:shadow-md transition-shadow">
              <CardContent class="p-6">
                <p class="text-xs font-bold tracking-wider text-primary uppercase">Active Sessions</p>
                <p class="text-3xl font-bold mt-2">12</p>
              </CardContent>
            </Card>
            <Card class="bg-green-500/5 border-green-500/10 shadow-sm hover:shadow-md transition-shadow">
              <CardContent class="p-6">
                <p class="text-xs font-bold tracking-wider text-green-600 dark:text-green-400 uppercase">Total Users</p>
                <p class="text-3xl font-bold mt-2">1,284</p>
              </CardContent>
            </Card>
            <Card class="bg-amber-500/5 border-amber-500/10 shadow-sm hover:shadow-md transition-shadow">
              <CardContent class="p-6">
                <p class="text-xs font-bold tracking-wider text-amber-600 dark:text-amber-400 uppercase">System Status</p>
                <p class="text-3xl font-bold mt-2">Healthy</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
